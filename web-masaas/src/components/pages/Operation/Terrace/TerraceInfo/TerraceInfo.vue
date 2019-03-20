<template>
    <div class="terraceInfo">
		<div class="information-box">
			<div class="container"
				v-loading="loading"
			>
				<header>
					<i class="fa fa-edit"></i>
					<b>平台信息</b>
				</header>
				<main>
					<el-form  status-icon label-width="100px" class="demo-ruleForm">
						<el-form-item label="平台名称：" prop="userName" style="width:480px">
							<span>{{platformInfo.name}}平台</span>
						</el-form-item>
						<el-form-item label="平台描述：" prop="realName" style="width:480px">
							<span>{{platformInfo.describe}}</span>
						</el-form-item>
						<el-form-item label="平台状态：" prop="phone" style="width:480px">
							<span>{{ this.status(platformInfo.status) }}</span>
						</el-form-item>
						<el-form-item label="平台公告：" prop="email" style="width:480px">
							<span class="announce">
								{{ platformInfo.announce }}
							</span>
							<el-button
								size="mini" 
								type="primary"
								v-if="isShow"
								@click="changeShow"
							>编辑</el-button>
							<el-input
								v-if="!isShow"
								type="textarea"
								:rows="5"
								v-model="platformInfo.announce">
							</el-input>
							<el-button 
								size="mini" 
								type="primary" 
								v-if="!isShow"
								@click="setAnnounce">
								保存
							</el-button>
							<span class="max" v-if="!isShow">最多輸入120字</span>
						</el-form-item>
					</el-form>
					<div class="btn">
						<el-button type="primary" @click="changeTerrace('pauseterrace', platformInfo.id)">暂停平台</el-button>
						<el-button type="primary" @click="openRecover">恢复平台</el-button>
					</div>
				</main>
			</div>
		</div>
    </div>
</template>
<script>
import Bus from '@/modules/bus';
import { mapMutations } from 'vuex';
import { CHANGE_ID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';

export default {
	name:'TerraceInfo',
	data () {
		return {
			platformInfo:{},
			loading:true,
			isShow:true //控制輸入公告显示隐藏
		}
	},
	created () {
		this.getPlarformInfo();
		Bus.$on("busGetPlatform", this.getPlarformInfo);
	},
	beforeDestroy () {
        Bus.$off('busGetPlatform');
    },
	methods:{
		...mapMutations([CHANGE_ID]),
		getPlarformInfo () {
			//获取平台信息
			this.$http.get('/api/platform/', {
				params:{
					time: new Date().getTime()
				}
			}).then( res => {
				this.loading = false;
				this.platformInfo = res.data.resp;
			})
		},
		changeTerrace(type, id){
			if (id) {
				this.CHANGE_ID(id);
			};
			Bus.$emit("onUserWindow",type);
		},
		status (val) {
			if ( val == -1 ) {
				return '部署中'
			}else if( val == 1 ) {
				return '正常'
			}else if( val == 0 ) {
				return '暂停'
			}
		},
		openRecover () {//打开恢复窗口
            MessageBox.confirm('是否恢复平台, 是否继续?', '平台恢复提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.recoverPlatform();
            }).catch( () => {});
		},
		recoverPlatform () {//恢复平台
			this.$http.put('/api/platform/',{
				id:this.platformInfo.id,
				status:1
			}).then( res => {
				if(res.data.success){
					this.getPlarformInfo();
					Message({
						message:'平台已恢复',
						duration:1500,
						type:'success'
					})
				}else{
					Message({
						message:'平台恢复失败',
						duration:1500,
						type:'error'
					})
				}
			})
		},
		setAnnounce () {
			if (this.platformInfo.announce.length > 120) {
				Message({
					message:'最多输入120个字',
					duration:1500,
					type:'warning'
				})
			}else{
				this.isShow = true;
				this.$http.put('/api/platform/',{
					id:this.platformInfo.id,
					announce: this.platformInfo.announce
				}).then( res => {
					if(res.data.success){
						this.getPlarformInfo();
						Message({
							message:'公告修改完成',
							duration:1500,
							type:'success'
						})
					}else{
						Message({
							message:'公告修改失敗',
							duration:1500,
							type:'error'
						})
					}
				})
			}
		},
		changeShow () {
			this.isShow = false;
		}
	}
}
</script>
<style lang="scss" scoped>
	.terraceInfo{
		.information-box{
			width: 100%;
			height: 100%;
			color: #333;
			padding-top: 40px;
			.container{
				margin: 0 auto;
				width: 500px;
				box-shadow: 0 0 10px #ccc;
				background: #fff;

					header{
						height: 60px;
						line-height: 60px;
						text-indent: 20px;
						border-bottom: 1px solid #ccc;
						box-shadow: 0 0 4px #ccc;
						font-size: 20px;
						color: #409EFF;
						margin-bottom: 20px;
					}

					main{
						padding-bottom: 10px 0;
						.announce{
							word-break:break-all;
							word-wrap:break-word
						}
						.max{
							color: #ccc;
						}

						.btn{
							text-align: center;
							padding-bottom: 20px;
						}
					}
			}
		}
	}
</style>
