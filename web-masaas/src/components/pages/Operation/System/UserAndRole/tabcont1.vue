
<template>  
  <div slot='tabcont1' class="tabcontent">
  	  <el-form           
            class="demo-ruleForm"
            :label-position="labelPosition"
            label-width="80px">
            							
				<el-form-item 
		        prop="userId"
		        label="用户ID">
		        <el-input  
		            placeholder="请输入中文"
		            v-model="userId"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>			
							
		    <el-form-item 
		        prop="account"
		        label="账户名"
		        >
		        <el-input  		        	
		            placeholder="请输入中文"
		            v-model="account"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>
		    <el-form-item 
		        prop="userName"
		        label="用户名">
		        <el-input  	        	
		        	  placeholder="请输入中文"
		            v-model="userName"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>
		    
		    <el-form-item 
		        prop="email"
		        label="邮箱">
		        <el-input  		        	
		        	  placeholder="请输入中文"
		            v-model="email"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>
		    
		    <el-form-item 
		        prop="mobile"
		        label="手机">
		        <el-input  		        	
		        	  placeholder="请输入中文"
		            v-model="mobile"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>
		    
		    <el-form-item 
		        prop="createTime"
		        label="创建时间" >
		        <el-input  		        	
		        	  placeholder="请输入中文"
		            v-model="createTime"
		            :disabled="true"
		            style="width: 50%;"></el-input>
		    </el-form-item>
		
        </el-form>
  	
  	
  </div>  
</template>  
  
<script>  

import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'',
    data () {
         var validateName = (rule, value, callback) => {
            if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色名称'));
            }
        };
        return{
        	  labelPosition:'left',
//          ruleForm: {
//				          userId:'',
//				          account:'',
//				          userName:'',
//				          email:'',
//				          mobile:'',
//				          createTime:'',
//          },
            
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ]
            }
        }
    },
    created () {    	
    this.userId=this.$route.params.userId;
	  this.account=this.$route.params.account;
	  this.userName=this.$route.params.userName;
	  this.email=this.$route.params.email;
	  this.mobile=this.$route.params.mobile;
	  this.createTime=this.$route.params.createTime;

//获取当前角色信息
//      this.$http.get(`/api/tenant/roles/${this.roleId}/`, {
//          headers:{
//              'Operate-Application-Id': this.applicationId
//          }
//      }).then( res => {
//          this.ruleForm = res.data.resp;
//      })
        
//      let params={        	
//          pageNumber:1,
//          pageSize:5,
//          query:{'id':'1'}
//      }

//      this.userId=this.$route.params.userId;
//			console.log(this.$route.params.userId)
//      this.$http.get('/api/tblMsUser/tblMsUserList',{
//      	params:{pageNumber:1,pageSize:5,query:{'id':this.userId}}
//      	,headers:{                   
//               'token' :'D6ABB3EA4EC8729FC297B4F6BD66448C'
//          }
//      
//      	
//      }).then( res => {
//      	console.log(res.data);
//          this.ruleForm = res.data.resp.records[0];
//      })
        
    },
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }
 
        })
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
	.tabcontent{
		width: 96%;
		margin: 0 auto;
		height: 100%;
		margin-top: 15px;
		
		.el-form-item__label{
			width: 100px!important;
		}
	}
	
</style>
