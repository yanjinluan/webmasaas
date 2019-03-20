<template>
	<div class="add-tenant-box">
		<div class="add-tenant-head">
			<p>租户信息修改</p>
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
                prop="name"
                label="租户名称:">
                <el-input 
                    v-model="ruleForm.name"
                    style="width:268px"></el-input>
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
                <el-button id="btn" type="primary" @click="changeTenant">提交</el-button>
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
    name:'EditTenant',
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
		return {
			feeTypeList:[
				{type:0, name:'免费'},
				{type:1, name:'预付费'},
				{type:2, name:'后付费'}
			],
			ruleForm: {
                name:'',
                feeType:''
            },
			rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                feeType: [
                    { validator: validateFeeType, trigger: 'blur' }
                ]
            }			
		}
	},
	created () {
		//初始数据
        this.$http.get(`/api/application/tenants/${this.tenantId}/?applicationId=${this.applicationId}`, {
			headers:{
				'Operate-Application-Id': this.applicationId
			}
		}).then( res => {
            this.ruleForm = res.data.resp;
        });
	},
	computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			tenantId (state) {
				return state.getId.id;
			}
		})
	},
    methods: {
		offAddTenant(){
			Bus.$emit('offUserWindow','edittenant')
		},
		changeTenant () {
			this.$refs.ruleForm.validate((valid) => {
				if(valid) {
					this.$http.put(`/api/application/tenants/${this.tenantId}/?applicationId=${this.applicationId}`,{
						feeType:this.ruleForm.feeType,
						name:this.ruleForm.name,
						id:this.tenantId
					}, {
						headers:{
							'Operate-Application-Id': this.applicationId
						}
					}).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','edittenant');
							Bus.$emit('busGetTenantLists');
							Message({
								message:'修改成功',
								duration:'1200',
								type:'success'
							})
						}else{
							Message({
								message:'修改失败',
								duration:'1200',
								type:'error'
							})
						}
					})
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
