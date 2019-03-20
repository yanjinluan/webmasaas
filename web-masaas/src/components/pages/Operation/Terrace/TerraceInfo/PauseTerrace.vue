<template>
	<div class="detail-app-box">
		<div class="detail-app-head">
			<p>暂停平台</p>
			<div class="off" @click="offPauseTerrace">
				<i class="fa fa-close"></i>
			</div>
		</div>
		<div class="app-container">
			<p>请输入暂停平台公告</p>
			<div class="reason">
				<el-input 
					type="textarea"
					:rows="5"
					style="width:200"
					v-model="content">
				</el-input>
				<p class="max">最多輸入120字</p>
			</div>
		</div>
		<div class="keep">
			<el-button type="primary" @click="stopPlatform">确定</el-button>
			<el-button @click="offPauseTerrace">取消</el-button>
		</div>
	</div>
</template>
<script>
  import Bus from '@/modules/bus'
  import {Message} from 'element-ui'
  import { mapState } from 'vuex';

  export default {
    name:'PauseTerrace',
    data(){
		return{
			content:''
		}
    },
	computed:{
		...mapState({
			ptId (state) {
				return state.getId.id;
			}
		})
	},
    methods:{
		offPauseTerrace () {
			Bus.$emit("offUserWindow","pauseterrace");
		},
		stopPlatform () {//暂停平台
			if (this.content.length > 120) {
				Message({
					message:'最多输入120个字',
					duration:1500,
					type:'warning'
				})
				return;
			};
			if (this.content) {
				this.$http.put('/api/platform/',{
					id:this.ptId,
					status: 0,
					announce: this.content
				}).then( res => {
					if (res.data.success) {
						Bus.$emit('busGetPlatform');
						Bus.$emit("offUserWindow","pauseterrace");
						Message({
							message:'平台已暂停',
							duration:1500,
							type:'success'
						})
					}else{
						Message({
							message:'平台已暂停失败',
							duration:1500,
							type:'error'
						})
					}
				})
			}else{
				Message({
                    message:'请输入暂停公告',
                    duration:1500,
                    type:'warning'
                })
			}
		}
    }

  }
</script>

<style lang="scss" scoped>
	.detail-app-box{
		position: absolute;
		width: 400px;
		background: #fff;
		top:50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 10;
		.detail-app-head{
			height:50px;
			padding:0 20px;
			margin-bottom:20px;
			background:#409EFF;
			p{
				float:left;
				line-height:50px;
				font-size:20px;
				font-weight:500;
				color:#fff;
			}
		}
		.app-container{
			text-align:center;
			padding-bottom:20px;
			p{
				font-size:16px;
			}
			.reason{
				width:300px;
				margin: 10px auto 0;

				.max{
					color: #ccc;
					text-align: left;
					font-size: 14px;
				}
			}
		}
		.keep{
			text-align: center;
			padding: 10px 0;
		}
	}
</style>
