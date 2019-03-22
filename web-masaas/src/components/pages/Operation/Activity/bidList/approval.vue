
<template> 
	<div class="content">
		  <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="80px" size='medium'>
				  	<el-form-item label="企业类型">
					    <el-input v-model="ruleForm.companyNature" style='width: 45%;' disabled></el-input>
					  </el-form-item>
				  	<el-form-item label="申办单位">
					    <el-input v-model="ruleForm.applicantUnit" style="width:45%" disabled></el-input>
					  </el-form-item>
					  
					  <el-form-item label="联系人">
					    <el-input v-model="ruleForm.contacts" style="width:45%" disabled></el-input>
					  </el-form-item>
					  
					  <el-form-item label="联系方式">
					    <el-input v-model="ruleForm.contactPhone" style="width:45%" disabled></el-input>
					  </el-form-item>
					  
					  <el-form-item label="活动名称">
					    <el-input v-model="ruleForm.activityName"  style='width: 45%;' disabled></el-input>
					  </el-form-item>
					  
					  <el-form-item  prop="activityType" label="活动类型">
							<el-select placeholder="请选择"  v-model="ruleForm.activityType"   style="width:45%">
			            <el-option
			                v-for="item in activityLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			        </el-select>
						</el-form-item>
					  					 			  
					  <el-form-item label="开始时间"  >								    
								    <el-date-picker
									      v-model="ruleForm.startTime"
									      type="date"
									      placeholder="选择开始日期">
									  </el-date-picker>	
					  </el-form-item>
					  
					  <el-form-item label="结束时间"  >
								    
								    <el-date-picker
									      v-model="ruleForm.endTime"
									      type="date"
									      placeholder="选择结束日期">
									  </el-date-picker>			    
					  </el-form-item>
					  
					  <el-form-item label="经营内容">
					  	  <el-select placeholder="请选择"  v-model="ruleForm.scopeOfOperation"   style="width:45%">
			            <el-option
			                v-for="item in scopeLists"
			                :key="item.id"
			                :label="item.dictName"
			                :value="item.id">
			            </el-option>
			       		</el-select>		
						</el-form-item>
						
						<el-form-item label="活动区域">    
						  <el-select placeholder="请选择"  v-model="ruleForm.zoneOfAction"   style="width:45%">
			            <el-option
			                v-for="item in placeLists"
			                :key="item.id"
			                :label="item.dictName"
			                :value="item.id">
			            </el-option>
			        </el-select>
					  </el-form-item>
										
					  <el-form-item label="申请状态">
					      <el-input v-model="ruleForm.passState"  style="width:45%" ></el-input>
					  </el-form-item>
					  
					  <!--<el-form-item label="未通过原因">
					    <el-input type='textarea'  v-model="ruleForm.refuseReason" style='width: 45%;'></el-input>
					  </el-form-item>	-->
						 
					  <el-form-item>
					    <el-button type="primary" @click="submitPass" :disabled="isDisabled">通过</el-button>
					    <el-button type="primary" @click="submitNopass('addreason')">不通过</el-button>
					    <el-button @click='goBack'>返回</el-button>
					  </el-form-item>
			</el-form>
	</div>
			
</template>

<script>
import { Message} from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

  export default {
    name:'',
    data() {
    	//表单校验规则
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
    	
      return {
      	isDisabled:false,
      	flag:false,
      	id:'',
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
	           passState:''           
		    	},
       
        activityLists:[
	        {name:'大型活动', id:'0'},
	        {name:'小型活动', id:'1'}
        ],
        placeLists:[],
        scopeLists:[],
        
        //校验规则
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
    created(){
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
      this.getApp();
	        	
    },
    methods:{
    	  getApp(){ 
    	  	this.id=this.$route.params.bidId;
    	    let params={       
	            id:this.id
	           
            }
            this.$http.get('/api/activityApply',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.ruleForm=res.data.resp;
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
    	  //通过(提交表单内容)
    	  submitPass(){
    	  	  
    	  	  this.isDisabled = true;	
                //判断时间字符串还是对象
                if(typeof this.ruleForm.startTime=='object'){
//              	console.log('object')
                }else{
                	let sta = this.ruleForm.startTime.replace(/-/g,"/");
					this.ruleForm.startTime = new Date(sta );
					let end=  this.ruleForm.endTime.replace(/-/g,"/");
					this.ruleForm.endTime= new Date(end );
                }
                      
                let params = {
                	  id:this.id,
                      companyNature:this.ruleForm.companyNature,
			          applicantUnit:this.ruleForm.applicantUnit,
			          contacts:this.ruleForm.contacts,
			          contactPhone:this.ruleForm.contactPhone,
			          activityName:this.ruleForm.activityName,
			          activityType:this.ruleForm.activityType,
			          startTime:this.ruleForm.startTime,
			          endTime:this.ruleForm.endTime,
			          scopeOfOperation:this.ruleForm.scopeOfOperation,
			          zoneOfAction:this.ruleForm.zoneOfAction,
			          passState:'1'  //通过
//			          passState:'2'  //未审核
						                          
                }
                console.log(params);
                                       
                this.$http.put('/api/activityApply', params, 
		               {
		                    headers:{
		                         'Content-Type': 'application/json'
		                    }
		                }
	               	).then( res => {
                    if(res.data){//成功逻辑
                        Message({
                            message:'提交成功',
                            duration:1500,
                            type:'success'
                        });
                       
                        //提交成功进入申办列表
                        this.$router.push({
					        name: 'bidList'
				
					    });
                        
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
                	  	    	  	
    	  },
    	     	      	  
    	  //不通过弹窗
    	  submitNopass(type){
              Bus.$emit('onUserWindow',type);
//            Bus.$emit('id', this.id);//不通过的活动Id
              
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