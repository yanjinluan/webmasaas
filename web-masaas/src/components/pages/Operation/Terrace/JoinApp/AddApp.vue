<template>
	<div class="add-app-box">
		<div class="add-app-head">
			<p>新增应用</p>
			<div class="off" @click="offAddApp">
				<i class="fa fa-close"></i>
			</div>
		</div>
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="应用名称" prop="name">
				<el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="应用标识" prop="tag">
				<el-input type="text" v-model="ruleForm.tag" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="应用描述" prop="describe">
				<el-input type="text" v-model="ruleForm.describe" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="应用地址" prop="url">
				<el-input  type="text" v-model="ruleForm.url" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div class="btn">
			<el-button type="primary" @click="setApp" id="btn" :disabled='isDisabled'>提交</el-button>
			<el-button @click="offAddApp">取消</el-button>
		</div>
	</div>
</template>
<script>
import Bus from '@/modules/bus'
import { Message } from 'element-ui'

export default {
    name:'AddApp',
    data() {
		var checkurl = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('请输入应用首页地址'));
			}else{
				callback();
			}
		};
		var validateName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入应用名称'));
			} else {
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
		var validateTag = (rule, value, callback) => {
			if (!/[a-z0-9]{1,8}$/.test(value)) {
				callback(new Error('请输入1-8位，英文或数字的组合'));
			}else{
				callback();
			}
		};
		return {
			isDisabled:false,
			ruleForm: {
				name: '',
				describe: '',
				url: '',
				tag:''
			},
			rules: {
				name: [
					{ validator: validateName, trigger: 'blur' }
				],
				describe: [
					{ validator: validateDescribe, trigger: 'blur' }
				],
				url: [
					{ validator: checkurl, trigger: 'blur' }
				],
				tag:[
					{ validator: validateTag, trigger: 'blur' }
				]
			}
		};
	},
	watch:{
        userLists ( val ) {
            if ( val.length > 0 ) {
                //有数据时隐藏无数据字符串
                this.isUserShow = false;
            }else {
                //无数据提示
                Message({
                    message:'查无此数据',
                    duration:1500,
                    type:'warning'
                });
                this.isUserShow = true;
            }
        }
    },
    methods: {
		setApp () {
			this.isDisabled = true;//防止重复点击
			let { name, describe, url, tag } = this.ruleForm;
			this.$refs.ruleForm.validate((valid) => {
				if(valid){//添加应用
					this.$http.post('/api/platform/applications/',{
						name, describe, url, tag
					}).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','addapp');
							Bus.$emit('busGetAppList');
							Message({
								message:'应用添加成功',
								duration:'1200',
								type:'success'
							});
						}else{
							Message({
								message:'应用添加失败',
								duration:'1200',
								type:'error'
							});
							this.isDisabled = false;
						}
					}).catch( () => {
						this.isDisabled = false;
					})
				} else {
                    this.isDisabled = false;
                }
			});
		},
		offAddApp (){
			Bus.$emit('offUserWindow','addapp');
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
			padding-right: 50px;
		}
		.btn{
			padding-bottom: 20px;
			text-align: center;
		}
	}
</style>
