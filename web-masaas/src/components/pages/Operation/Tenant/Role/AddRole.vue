<template>
    <div class="add-role-box">
        <div class="add-role-head">
            <h2>新增角色</h2>
            <div class="off" @click="offAddRole">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm" 
            class="demo-ruleForm">
            <el-form-item
				prop="appId"
				label="选择应用">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.appId"  
                    style="width:264px">
                    <el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
            <el-form-item 
                prop="name"
                label="角色名称">
                <el-input 
                    placeholder="请输入中文"
                    v-model="ruleForm.name"
                    style="width:264px"></el-input>
            </el-form-item>
            <el-form-item 
                prop="tag"
                label="角色标识">
                <el-input 
                    v-model="ruleForm.tag"
                    style="width:264px"></el-input>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button id="btn" @click="addRole" type="primary" :disabled="isDisabled">提交</el-button>
            <el-button @click="offAddRole">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AddRole',
    data () {
        var validateName = (rule, value, callback) => {
            if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色名称'));
            }
        };
        var validateTag = (rule, value, callback) => {
			if (!/[A-Za-z0-9]{1,8}$/.test(value)) {
				callback(new Error('请输入1-8位，英文或数字的组合'));
			}else{
				callback();
			}
        };
        var validateAppId = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择应用'));
            } else {
                callback();
            }
        };
        return{
            isDisabled:false,
            ruleForm: {
                name:'',
                appId:'',
                tag:''
            },
            appLists:[],
            rules: {
                name: [
                    { validator: validateName, trigger: 'change' }
                ],
                appId:[
					{ validator: validateAppId, trigger: 'change' }
                ],
                tag:[
					{ validator: validateTag, trigger: 'change' }
				]
            }
        }
    },
    created () {
		this.getApp();
	},
    computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		})
	},
    methods:{
        offAddRole () {
            Bus.$emit('offUserWindow','addrole');
        },
        addRole () {
            this.isDisabled = true;
            this.$refs.ruleForm.validate( valid => {
                if(valid){
                    let params = {
                        name:this.ruleForm.name,
                        appId:this.ruleForm.appId,
                        tag:this.ruleForm.tag
                    }
                    this.$http.post('/api/tenant/roles/', params, {
                        headers:{
                            'Operate-Application-Id': this.ruleForm.appId
                        }
                    }).then( res => {
                        if(res.data.success){//成功逻辑
                            Message({
                                message:'角色新增成功',
                                duration:1500,
                                type:'success'
                            });
                            Bus.$emit('busAddRefreshRole', this.ruleForm.appId);
                            Bus.$emit('offUserWindow','addrole');
                        }else{
                            Message({
                                message:'失败',
                                duration:1500,
                                type:'error'
                            });
                            this.isDisabled = false;
                        }
                    }).catch( () => {
                        this.isDisabled = false;
                    });
                } else {
                    this.isDisabled = false;
                }
            }) 
        },
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-role-box{
        position: absolute;
        width: 360px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .add-role-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
        .demo-ruleForm{
            padding: 20px 0 0 10px; 
        }
        .btn{
            text-align: center;
            padding-bottom: 20px;
        }
    }
</style>

