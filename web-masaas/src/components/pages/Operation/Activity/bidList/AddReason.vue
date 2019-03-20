<template>
    <div class="add-role-box">
        <div class="add-role-head">
            <h2>审核不通过</h2>
            <div class="off" @click="offAddReason">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="reasonCont">
        	<el-input type="textarea" v-model="reasonCont"></el-input>       	
        </div>

        <div class="btn">
            <el-button id="btn" @click="addReason" type="primary" :disabled="isDisabled">提交</el-button>
            <el-button @click="offAddReason">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AddReason',
    data () {
 
        return{
            reasonCont:'',
            isDisabled:false,

        }
    },
    created () {
//		this.getApp();
	},
    computed:{
		...mapState({

            token (state) {
                return state.token.token
            }
		})
	},
    methods:{
        offAddReason () {
            Bus.$emit('offUserWindow','addreason');
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
        
        .reasonCont{
            padding: 20px 10px 20px 10px; 	
        }
    }
</style>

