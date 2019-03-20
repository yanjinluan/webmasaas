
<template>  
  <div class="content">        
    <el-form  label-width="100px" :model="ruleForm" size="medium" class="demo-ruleForm"   ref="ruleForm">
		  <el-form-item label="用户名">
		    <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		  <el-form-item label="联系方式" >
		    <el-input v-model="ruleForm.name" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		  <el-form-item label="活动名称">
		    <el-input v-model="ruleForm.region" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		   <el-form-item label="支付金额">
		    <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		   <el-form-item label="支付方式">
		    <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		   <el-form-item label="票据编号">
		    <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>
		  </el-form-item>	
		  
		  <el-form-item label="票据二维码">
		   <!-- <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>-->
		  </el-form-item>	
		  
		</el-form>
		<el-button size='mini' type="warning" plain @click='goBack()'>返回</el-button>  	  	
  </div>  
</template>  
  
<script>  

import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'billDetail',
    data () {
    
        return{
        	
        	ruleForm: {
	          name: '',
	          region: '',
	          type: ''
		    }
        }
    },
    created () {


//      this.id=this.$route.params.roleId;
//			console.log(this.$route.params.roleId)
//      this.$http.get('/api/sysRole',{
//      	params:{pageNumber:1,pageSize:5,query:{'id':this.id}}
//      
//      	,headers:{                   
//               'token' :this.token
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
            token:(state) => {//拿到要修改的角色数据
                return state.token.token;
            },
            applicationId (state) {
				return state.getId.appId;
			}
        })
    },
    methods:{
        //返回
        goBack(){	
	       this.$router.push({
		        name: 'billList'
	
		    })
	    }	

    }
}
</script>

<style lang="scss" scoped>
	.content{
		width: 96%;
		margin: 0 auto;
		height: 100%;
		margin-top: 15px;
		
	}
</style>
