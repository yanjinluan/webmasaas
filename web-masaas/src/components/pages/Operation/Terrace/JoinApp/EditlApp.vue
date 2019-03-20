<template>
	<div class="add-app-box">
		<div class="add-app-head">
			<p>应用信息修改</p>
			<div class="off" @click="offEditlApp">
				<i class="fa fa-close"></i>
			</div>
		</div>
		<el-form :model="appObj" status-icon :rules="rules" ref="appObj" label-width="120px" class="demo-ruleForm">
			<el-form-item label="当前应用:">
				{{appObj.name}}
			</el-form-item>
			<el-form-item label="应用描述:" prop="describe">
				<el-input type="text" v-model="appObj.describe" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="应用地址:" prop="url">
				<el-input  type="text" v-model="appObj.url" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button id="btn" type="primary" @click="setApp">提交</el-button>
				<el-button @click="offEditlApp">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import Bus from '@/modules/bus'
import { Message } from 'element-ui'
import { mapState } from 'vuex';

export default {
	name:'EditlApp',
	computed:{
		...mapState({
			appId (state) {
				return state.getId.id;
			}
		})
	},
    data() {
		var checkurl = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('请输入应用首页地址'));
			}else{
				callback();
			}
		};
		var validateDescribe = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入应用描述'));
			}else{
				callback();
			}
		};
		return {
			appObj:{},
			rules: {
				describe: [
					{ validator: validateDescribe, trigger: 'blur' }
				],
				url: [
					{ validator: checkurl, trigger: 'blur' }
				]
			}
		};
	},
	created () {
		this.$http.get(`/api/platform/applications/${this.appId}/`).then( res=> {
			this.appObj = res.data.resp;
		})
	},
    methods: {
		setApp () {
			let { describe, url } = this.appObj;
			this.$refs.appObj.validate((valid) => {
				if(valid){//添加应用
					this.$http.put(`/api/platform/applications/${this.appId}/`,{
						describe, url
					}).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','editapp');
							Bus.$emit('busGetAppList');
							Message({
								message:'应用修改成功',
								duration:'1200',
								type:'success'
							})
						}else{
							Message({
								message:'应用修改失败',
								duration:'1200',
								type:'error'
							})
						}
					})
				}
			});
		},
		offEditlApp (){
			Bus.$emit('offUserWindow','editapp');
		}
    }
}
</script>

<style lang="scss" scoped>
  .add-app-box{
    position: absolute;
    width: 400px;
    background: #fff;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
    .add-app-head{
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
    .demo-ruleForm{
      padding-right:20px;
    }
  }
</style>
