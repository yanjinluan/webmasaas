<template>
	<div class="add-tenant-box">
		<div class="add-tenant-head">
			<p>新增租户</p>
			<div class="off" @click="offAddTenant">
				<i class="fa fa-close"></i>
			</div>
		</div>
		<el-form
			:model="ruleForm"
            :rules="rules"
            ref="ruleForm" 
            class="demo-ruleForm">
            <el-form-item
                prop="name">
                <el-input 
					v-model="ruleForm.name"
                    placeholder="租户名称" 
                    class="role-name">
                </el-input>
            </el-form-item>
			<el-form-item
				prop="appId"
				label="选择应用">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.appId"  
                    style="width:268px">
                    <el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
            <el-form-item 
				prop="feeType"
                label="计费类型:">
                <el-select
                    placeholder="请选择"
					v-model="ruleForm.feeType"
					style="width:268px">
                    <el-option
						v-for="item in feeTypeList"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="btn-box">
                <el-button id="btn" type="primary" @click="setTenant" :disabled='isDisabled'>提交</el-button>
                <el-button @click="offAddTenant">取消</el-button>
            </div>
        </el-form>
	</div>
</template>
<script>
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'AddTenant',
    data () {
		var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入租户名称'));
            } else {
                callback()
            }
        };
		var validateFeeType = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择计费类型'));
            } else {
                callback()
            }
		};
		var validateAppId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择应用'));
            } else {
                callback()
            }
        };
		return {
			isDisabled:false,
			feeTypeList:[
				{type:0, name:'免费'},
				{type:1, name:'预付费'},
				{type:2, name:'后付费'}
			],
			appLists:[],
			ruleForm: {
                name:'',
				feeType:'',
				appId:''
            },
			rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
				],
				appId:[
					{ validator: validateAppId, trigger: 'change' }
				],
                feeType: [
                    { validator: validateFeeType, trigger: 'change' }
                ]
            }			
		}
	},
	computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		})
	},
	created () {
		this.getApp();
	},
    methods: {
		getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
		offAddTenant(){
			Bus.$emit('offUserWindow','addtenant')
		},
		setTenant () {
			this.isDisabled = true;
			this.$refs.ruleForm.validate( valid => {
				if(valid) {
					this.$http.post(`/api/application/tenants/?applicationId=${this.ruleForm.appId}`,{
						feeType:this.ruleForm.feeType,
						name:this.ruleForm.name,
						appId:this.ruleForm.appId
					}, {
						headers:{
							'Operate-Application-Id': this.ruleForm.appId
						}
					}).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','addtenant');
							Message({
								message:'添加成功',
								duration:'1200',
								type:'success'
							});
						}else{
							Message({
								message:'添加失败',
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
			})
		}
    }
}
</script>

<style lang="scss" scoped>
	.add-tenant-box{
		position: absolute;
		width: 400px;
		background: #fff;
		top:50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 10;
		.add-tenant-head{
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
			padding: 0 30px 20px; 

            .btn-box{
                text-align: center;
            }
        }
		
	}
</style>
