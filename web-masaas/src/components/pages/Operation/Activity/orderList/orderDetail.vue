
<template>  
  <div class="content">        
    <el-form  label-width="80px" :model="ruleForm" size="medium" class="demo-ruleForm"   ref="ruleForm">
			  <el-form-item label="活动名称">
			    <el-input v-model="ruleForm.activityName" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  <el-form-item label="开始时间">
			  	<el-input v-model="ruleForm.startTime" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  
			  <el-form-item label="结束时间">
			  	<el-input v-model="ruleForm.endTime" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  
			  <el-form-item label="活动区域">
			  	 <el-select placeholder="请选择"  v-model="form.placeOfActivity"  disabled style="width:45%">
			            <el-option
			                v-for="item in placeLists"
			                :key="item.id"
			                :label="item.dictName"
			                :value="item.id">
			            </el-option>
			        </el-select>
			  	
			  <!--<el-input v-model="ruleForm.zoneOfAction" style='width: 45%;' disabled></el-input>-->
			  </el-form-item>
  		  
		</el-form>
		
		<el-form  label-width="80px" :model="form" size="medium" class="demo-ruleForm"   ref="form">
		    <el-form-item label="订单金额">
			    <el-input v-model="form.orderAmount"  style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  <el-form-item label="代金券">
			    <el-input v-model="form.couponId" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  <el-form-item label="支付金额">
			    <el-input v-model="form.paymentAmount" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  <el-form-item label="支付方式">
			    <el-input v-model="form.paymentMethod" style='width: 45%;' disabled></el-input>
			  </el-form-item>
			  <el-form-item label="订单号码">
			    <el-input v-model="form.orderNumber" style='width: 45%;' disabled></el-input>
			  </el-form-item>	
			  <el-form-item label="创建时间">
			  	<el-input  v-model="form.createTime" style='width: 45%;' disabled></el-input>
			  </el-form-item>	
			  <el-form-item label="支付时间">
			    <el-input  v-model="form.payTime" style='width: 45%;' disabled></el-input>
			  </el-form-item>	
			  <el-form-item label="订单状态">
			    <el-input  v-model="form.orderStatus" style='width: 45%;' disabled></el-input>
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
    name:'orderDetail',
    data () {
    
        return{
        	id:'',
        	placeLists:[],
        	ruleForm: {
	         
		    	},
		    	form:{
		    		
		    	}
        }
    },
    created () {
        this.initplaceList();
        this.id=this.$route.params.ordId;
        
        
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
    	  
	    	getApp(){
	    		
	    			let params={
	    				id:this.id	           
            }

						//获取订单列表
            this.$http.get('/api/activityPayOrder/activityPayOrderList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	              }
	        	}).then( res => {
	            	console.log(res.data);
                this.ruleForm=res.data.resp.records[0].activityDetail;
                this.form=res.data.resp.records[0].activityPayOrder;
                
//	            	res.data.resp.record.forEach((currentValue)=>{	            		
//	            		if(currentValue.activityPayOrder){
//	            			this.orderLists.push(currentValue.activityPayOrder);	            		
//	            		}
//	            		
//	            	})
	  
	        })
	    	 	
	    	},   	
    	  initplaceList(){
        		//获取活动区域内容
			    	let params={
			    		dictTypeId:'11'
			    	}
			    	this.$http.get('api/sysDict/sysDictList',{params
			       	
			    	}).then(res => {
			    		console.log(res.data);
			            this.placeLists = res.data.resp;           
			      });
        },
        //返回
        goBack(){	
	       this.$router.push({
		        name: 'orderList'
	
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
