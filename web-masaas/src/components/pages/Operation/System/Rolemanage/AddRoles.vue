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
                prop="roleName"
                label="角色名称">
                <el-input 
                    placeholder="请输入中文"
                    v-model="ruleForm.roleName"
                    style="width:264px"></el-input>
            </el-form-item>
            <el-form-item 
                prop="roleDescribe"
                label="角色说明">
                <el-input 
                	placeholder="请输入中文"
                    v-model="ruleForm.roleDescribe"
                    style="width:264px"></el-input>
            </el-form-item>
                       
            <!--<el-form-item 
                prop="createUserId"
                label="创建人">
                <el-input 
                	placeholder="请输入中文"
                    v-model="ruleForm.createUserId"
                    style="width:264px;margin-left: 12px;"></el-input>
            </el-form-item>-->
            
            <el-form-item 
                prop="isAvailable"
                label="是否有效">
            	<el-radio v-model="ruleForm.isAvailable" label="0">是</el-radio>
				<el-radio v-model="ruleForm.isAvailable" label="1">否</el-radio>
            </el-form-item>
            
            
        </el-form>
        <div class="btn">
            <el-button id="btn" @click="addRole" type="primary" :disabled="isDisabled">添加</el-button>
            <el-button @click="offAddRole">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AddRoles',
    data () {
 
        var validateName = (rule, value, callback) => {
            if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色名称'));
            }
        };
        var valiDescribe = (rule, value, callback) => {
        	 if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色描述'));
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
//              name:'',
//              appId:'',
//              tag:''
                
                appId:'',
                roleName:'',
                roleDescribe:'',
//              createUserId:'',
                isAvailable: '0'
            },         
            appLists:[
                {name:'应用1', id:'1'},
                {name:'应用2', id:'2'},
                {name:'应用3', id:'3'},
                {name:'应用4', id:'4'}
            ],
            rules: {
                roleName: [
//                  { validator: validateName, trigger: 'change' }
                ],
                roleDescribe:[
//					{ validator: valiDescribe, trigger: 'change' }
                ]
            }
        }
    },
    created () {
		this.getApp();
	},
    computed:{
		...mapState({
//			userId (state) {
//              return state.other.userInfo.id
//          }
            token (state) {
                return state.token.token
            }
		})
	},
    methods:{
        offAddRole () {
            Bus.$emit('offUserWindow','addroles');
        },
        addRole () {
            this.isDisabled = true;
            this.$refs.ruleForm.validate( valid => {
                if(valid){
                    let params = {                       
                        appId:this.ruleForm.appId,
                        roleName:this.ruleForm.roleName,
                        roleDescribe:this.ruleForm.roleDescribe,
                        isAvailable:this.ruleForm.isAvailable                  
                    }

                    this.$http.post('/api/sysRole', params,{
                    	  headers:{                   
					        'token' :this.token
					      }			                    	
                    }).then( res => {
                    	debugger;
                        if(res.data){//成功逻辑
                        	debugger;
                            Message({
                                message:'角色新增成功',
                                duration:1500,
                                type:'success'
                            });
                            Bus.$emit('busAddRefreshRole', this.ruleForm.appId);
                            Bus.$emit('offUserWindow','addroles');
                        }else{
                        	debugger;
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
//          this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
//              this.appLists = res.data.resp;
//          });
            
            this.$http.get('/api/sysRole/sysRoleList',{           	
            	 headers:{                   
		             'token' :this.token
		        }
            }).then( res => {
//          	console.log(res.data);
                this.roles = res.data;
            })
            
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

