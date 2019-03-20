
<template>  
  <div class="content">
        
    <el-form  label-width="80px" :model="ruleForm" size="medium" class="demo-ruleForm"   ref="ruleForm">
				  <el-form-item label="企业类型">
				    <el-input v-model="ruleForm.companyNature" style='width: 45%;' disabled></el-input>
				  </el-form-item>
				  <el-form-item label="申办单位" >
				    <el-input v-model="ruleForm.applicantUnit" style='width: 45%;' disabled></el-input>
				  </el-form-item>
				  <el-form-item label="联系人">
				    <el-input v-model="ruleForm.contacts" style='width: 45%;' disabled></el-input>
				  </el-form-item>
				  <el-form-item label="联系方式">
				    <el-input v-model="ruleForm.contactPhone"  style='width: 45%;' disabled></el-input>
				  </el-form-item>		  
				  <el-form-item label="活动名称">
				    <el-input v-model="ruleForm.activityName"  style='width: 45%;' disabled></el-input>
				  </el-form-item>
				  <el-form-item label="活动类型">
				    <!--<el-input v-model="ruleForm.activityType" style='width: 45%;' disabled></el-input>-->
			    	<el-select placeholder="请选择"  v-model="ruleForm.activityType" disabled  style="width:45%">
		            <el-option
		                v-for="item in activityLists"
		                :key="item.id"
		                :label="item.name"
		                :value="item.id">
		            </el-option>
		        </el-select>
				  </el-form-item>
				  <el-form-item label="开始时间">
				    <el-input v-model="ruleForm.startTime" style='width: 45%;' disabled></el-input>
				  </el-form-item>		  
				  <el-form-item label="结束时间">
				    <el-input v-model="ruleForm.endTime" style='width: 45%;' disabled></el-input>
				  </el-form-item>
				  
				   <el-form-item label="经营内容">
				    <!--<el-input v-model="ruleForm.scopeOfOperation" style='width: 45%;' disabled></el-input>-->
				    <el-select placeholder="请选择"  v-model="ruleForm.scopeOfOperation" disabled  style="width:45%">
			            <el-option
			                v-for="item in scopeLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			      </el-select>	
				  </el-form-item>
				  <el-form-item label="活动区域">
				    <!--<el-input v-model="ruleForm.zoneOfAction" style='width: 45%;' disabled></el-input>-->
				    <el-select placeholder="请选择"  v-model="ruleForm.zoneOfAction" disabled  style="width:45%">
			            <el-option
			                v-for="item in placeLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			       </el-select>
				  </el-form-item>
			
				  <el-form-item label="审核状态">
				    <el-input  v-model="ruleForm.passState" style='width: 45%;' disabled></el-input>
				  </el-form-item>	
				  <el-form-item label="未通过原因" v-show="flag">
				    <el-input  v-model="ruleForm.refuseReason" style='width: 45%;' disabled></el-input>
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
    name:'',
    data () {
    
        return{
        	id:'',
        	flag:false,
        	activityLists:[
		        {name:'大型活动', id:'0'},
		        {name:'小型活动', id:'1'}
	        ],
	        placeLists:[],
        	scopeLists:[],
        	ruleForm: {
	           companyNature:'',
	           applicantUnit:'',
	           contacts:'',
	           contactPhone:'',
	           activityName:'',
	           activityType:'',
	           startTime:'',
	           endTime:'',
	           scopeOfOperation:'',
	           zoneOfAction:'',
	           passState:'',
	           refuseReason:''           
		    	}
        }
    },
    created () {
    	this.getApp();
    	//获取活动区域内容 
    	this.$http.get('api/sysDict/sysDictList',{
	    		params:{
	    		   dictTypeId:'11'
	    	  }
       	
	    	}).then(res => {
	    		console.log(res.data);
	            this.placeLists = res.data.resp;           
	    });
	   
	    //经营内容
	    this.$http.get('api/sysDict/sysDictList',{
	    		params:{
	    		   dictTypeId:'10'
	    	  }
       	
	    	}).then(res => {
	    		console.log(res.data);
	            this.scopeLists = res.data.resp;           
	    });    	    

        
    },
    computed:{
        ...mapState({
            token:(state) => {//拿到要修改的角色数据
                return state.token.token;
            }
        })
    },
    methods:{
    	  getApp(){
    	  	//活动id
    	    this.id=this.$route.params.bidId;
    	    let params={
            	pageSize:10,
	            pageNumber:this.pageNumber,
	            id:this.id
	           
            }

			      //申办详情
            this.$http.get('/api/activityApply/activityApplyList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.ruleForm=res.data.resp.records[0];
	            	if(this.ruleForm.passState=='0'){
	            		 this.flag=true;
	            		 this.ruleForm.passState='未通过'
	            	}
	            	if(this.ruleForm.passState=='1'){
	            		 this.flag=false;
	            		 this.ruleForm.passState='通过'
	            	}
	            	if(this.ruleForm.passState=='2'){
	            		 this.flag=false;
	            		 this.ruleForm.passState='未审核'
	            	}
	            	if(this.ruleForm.passState=='3'){
	            		 this.flag=false;
	            		 this.ruleForm.passState='已取消'
	            	}
            
	        })
    	  },
        //返回
        goBack(){	
	       this.$router.push({
		        name: 'bidList'
	
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
