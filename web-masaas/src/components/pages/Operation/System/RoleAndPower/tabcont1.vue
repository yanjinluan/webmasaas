
<template>  
  <div slot='tabcont1' class="tabcontent">
  	  <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm" 
            class="demo-ruleForm">
            <el-form-item
							prop="appId"
							label="选择应用"
							>
							<el-select 
								    placeholder="请选择"
                    v-model="ruleForm.appId"  
                    disabled>
                    <!--<el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>-->
			       </el-select> 
				</el-form-item>
							
				<el-form-item 
		        prop="id"
		        label="角色编号">
		        <el-input  
		            placeholder="请输入中文"
		            v-model="ruleForm.id"
		            :disabled="true"
		            style=""></el-input>
		    </el-form-item>			
							
		    <el-form-item 
		        prop="roleName"
		        label="角色名称">
		        <el-input  
		        	
		            placeholder="请输入中文"
		            v-model="ruleForm.roleName"
		            :disabled="true"
		            style=""></el-input>
		    </el-form-item>
		    <el-form-item 
		        prop="roleDescribe"
		        label="角色说明">
		        <el-input  
		        	
		        	  placeholder="请输入中文"
		            v-model="ruleForm.roleDescribe"
		            :disabled="true"
		            style=""></el-input>
		    </el-form-item>
		
		    <el-form-item 
		        prop="isAvailable"
		        label="是否有效">
		    	    <el-radio v-model="ruleForm.isAvailable" label="0" disabled>是</el-radio>
				      <el-radio v-model="ruleForm.isAvailable" label="1" disabled>否</el-radio>
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
            ruleForm: {
                appId:'',
                id:'',
                roleName:'',
                roleDescribe:'',
                updateUserId:'',
                isAvailable: ''
            },
            
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ]
            }
        }
    },
    created () {
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

        this.id=this.$route.params.roleId;
  			console.log(this.$route.params.roleId)
        this.$http.get('/api/sysRole',{
        	params:{pageNumber:1,pageSize:5,query:{'id':this.id}}
        
        	,headers:{                   
                 'token' :this.token
            }
        
        	
        }).then( res => {
        	console.log(res.data);
            this.ruleForm = res.data.resp.records[0];
        })
        
    },
    computed:{
        ...mapState({
            token:(state) => {//拿到要修改的角色数据
                return state.token.token;
            },
            applicationId (state) {
				return state.getId.appId;
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
	}
</style>
