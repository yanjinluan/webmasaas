
<template>  
  <div class="content">        
    <el-form  label-width="100px" :model="ruleForm" size="medium" class="demo-ruleForm"   ref="ruleForm">
		  <el-form-item label="序号">
		    <el-input v-model="ruleForm.id" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		  <el-form-item label="活动ID" >
		    <el-input v-model="ruleForm.activityId" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		  <el-form-item label="票据编号">
		    <el-input v-model="ruleForm.voucherIdentifier" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		   <el-form-item label="票据状态">
		    <el-input v-model="ruleForm.voucherState" style='width: 45%;' disabled></el-input>
		  </el-form-item>
		   <!--<el-form-item label="支付方式">
		    <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>
		  </el-form-item>	  
		  <el-form-item label="票据二维码">
		   <!-- <el-input v-model="ruleForm.type" style='width: 45%;' disabled></el-input>-->
		  <!--</el-form-item>-->
		  
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
        	id:'',
        	ruleForm: {
	     
		      }
        }
    },
    created () {
        this.id=this.$route.params.bidId;
	      let params={
	      	  id:this.id,
	    	  	pageSize:10,
	          pageNumber:this.pageNumber
	        };
	        this.$http.get('/api/activityVoucher/activityVoucherList',{params,
	        	headers:{
	                 'token' :this.token
	            }
	       		
	        	}).then( res => {
	            	this.loading = false;
	            	console.log(res.data);
	              this.ruleForm = res.data.resp.records[0];  
	              //票据状态
	              this.ruleForm.voucherState=='0'?this.ruleForm.voucherState='未使用':this.ruleForm.voucherState=''
	                             
	        });
        
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
