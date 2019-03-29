
<template> 
	<div class="content">
		<el-form ref="form" :model="form"  :rules="rules" label-width="80px" size='medium' >
			  	<el-form-item label="活动名称" prop='activityName'>
				    <el-input v-model="form.activityName" style='width: 45%;' ></el-input>
				</el-form-item>
			  	<el-form-item label="活动性质" prop='collectFees'>
			  		<el-select placeholder="请选择"  v-model="form.collectFees"   style="width:45%">
			            <el-option
			                v-for="item in collectFeesList"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			       </el-select>
				</el-form-item>
				  		  
				<el-form-item label="活动价格" prop='activityAmount'>
				       <el-input v-model="form.activityAmount" style="width:45%" ></el-input>
				</el-form-item>
				  
				<el-form-item  label="活动类型" prop='activityType'>
						<el-select placeholder="请选择"  v-model="form.activityType"   style="width:45%">
				            <el-option
				                v-for="item in activityTypeLists"
				                :key="item.id"
				                :label="item.name"
				                :value="item.id">
				            </el-option>
				        </el-select>
				</el-form-item>
				  				 			  
				<el-form-item label="开始时间" prop='startTime'>
				  	  <el-date-picker
					      v-model="form.startTime"
					      type="datetime"
					      placeholder="选择开始日期和时间">
					  </el-date-picker>
				</el-form-item>
				
				<el-form-item label="结束时间" prop='endTime'>				  
					  <el-date-picker
					      v-model="form.endTime"
					      type="datetime"
					      placeholder="选择结束日期和时间">
					  </el-date-picker>			    
				</el-form-item>

											  
				<el-form-item label="活动区域" prop='placeOfActivity'>    
					    <el-select placeholder="请选择"  v-model="form.placeOfActivity"   style="width:45%">
				            <el-option
				                v-for="item in placeLists"
				                :key="item.id"
				                :label="item.dictName"
				                :value="item.id">
				            </el-option>
				        </el-select>
				</el-form-item>
				  
				<el-form-item label="人数限制" prop='limitOfNumber'>
				    <el-input v-model="form.limitOfNumber" style="width:45%" ></el-input>
				</el-form-item>
				  
				<el-form-item label="报名截止"  prop='deadlineForRegistration'>
					<el-date-picker
					      v-model="form.deadlineForRegistration"
					      type="datetime"
					      placeholder="选择截止日期和时间">
					</el-date-picker>			    
	
				</el-form-item>
				  
			    <el-form-item label="活动详情" prop='content'>		    	
			    	    <el-input type='textarea' v-model="form.content" style='width: 45%;'  ></el-input>
			    </el-form-item>
				  
	         	<el-form-item label="活动标签">    
						  <el-select placeholder="请选择"  v-model="form.popularState"   style="width:45%">
			            <el-option
			                v-for="item in popularStateLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			        </el-select>
				</el-form-item>
				 
				<el-form-item label="活动图片" prop='picture'>			    	     	    
		    	     <!--<div class="upload-input">
		    	     	选取文件
		    	     	<input  type='file' class="uploadphoto" @change="uploadphoto($event)" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg">
		    	     </div>-->
		            <div class="upload-input"  v-if="!isShow">
			                      选取图片
			             <input type="file" class="uploadphoto" @change="uploadImg" ref="inputer" multiple accept="image/png,image/jpeg,image/jpg">			            
			        </div>
			        <div class="img-list-item common mb_10" v-if="isShow">
			            <img :src="form.picture" class="common">
			            <i class="del-img" @click="forkImage"></i>
			        </div>
                   
		    	</el-form-item>
		    
			    <el-form-item label="企业名称" prop='enterpriseName'>
			    	      <el-input v-model="form.enterpriseName" style="width:45%" ></el-input>
			    </el-form-item>	
			    
			        
			    <el-form-item label="企业介绍" prop='enterpriseIntroduction'> 
			    	      <el-input ype='textarea' v-model="form.enterpriseIntroduction" style="width:45%" ></el-input>
			    </el-form-item>	
			    
			    <el-form-item label="企业logo" prop='enterpriseLogo'>		    	
			    	<!--<el-button type="primary" @click="" >点击上传</el-button>-->
			    	<div class="upload-input"  v-if="!isShow1" >
			                      选取图片
			             <input type="file" class="uploadphoto" @change="uploadImg1" ref="inputer" multiple accept="image/png,image/jpeg,image/jpg">			            
			        </div>
			        <div class="img-list-item common1 mb_10" v-if="isShow1">
			            <img :src="form.enterpriseLogo" class="common1">
			            <i class="del-img" @click="forkImage1"></i>
			        </div>	
			       
			    </el-form-item>
				
			    <el-form-item>
				    <el-button type="primary" @click="preserve" :isDisabled='isDisabled'>保存</el-button>
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
    name:'editorActive',
    data() {
      
      //活动名称校验
      var validateActName = (rule,value,callback) => {
      	if (!value) {
           callback(new Error('活动名称不能为空'));
        }
      };
      var validatecollectFees=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请选择活动性质'));
        }
      };
      
      var validateActAmount=(rule,value,callback)=>{
      	 if(!value){
      	    callback(new Error('请输入活动价格'));
      	 }
//    	 else if (!Number.isInteger(value)) {
//          callback(new Error('活动价格请输入数字值'));
//        }
      };
      var validateActType=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请选择活动类型'));
        }
      };
      var validateStartTime=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请选择活动开始时间'));
        }
      };
      var validateEndTime=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请选择活动结束时间'));
        }
      };
      
      var validateActPlace=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请选择活动区域'));
        }
      };
      
      var validateLimitNum=(rule,value,callback)=>{
      	if (!value) {
           callback(new Error('请输入人数限制'));
        }

      };
   

      return {
//      src: '',
        isShow:false,
//      src1: '',
        isShow1:false,  
        id:'',
      	isDisabled:false,
        form: {
          activityName: '',
          collectFees:'',
          activityAmount:'',
          activityType:'',
          startTime:'',
          endTime:'',
          placeOfActivity:'',
          limitOfNumber:'',
          deadlineForRegistration:'',
          content:'',
          popularState:'',
          enterpriseName:'',
          enterpriseIntroduction:'',
          picture:'',
          enterpriseLogo:''
//        , uploadUrl:'',
//	        upLoadData:{
//	            img_base64:"",
//	            type:1
//	        },
//	        fileList:[],
//	        ac_content: ''
        },
//      dataUrl:'',
        collectFeesList:[
          {name:'免费活动',id:'0'},
          {name:'付费活动',id:'1'}
        ],
        placeLists:[
//        {name:'东区', id:'1'},
//        {name:'西区', id:'2'},
//        {name:'中区', id:'3'}
        
        ],
        activityTypeLists:[
	        {name:'大型活动', id:'0'},
	        {name:'小型活动', id:'1'}
        ],
        popularStateLists:[
            {name:'热门活动',id:'1'},
            {name:'周周活动 ',id:'0'}
          
        ],
        time:'',
        
        //校验规则
        rules: {
        	
        	activityName:[
        	   { required:true,validator: validateActName, trigger: 'change' }
        	],
        	
        	collectFees:[
        	   { required:true,validator: validatecollectFees, trigger: 'change' }
        	],

//      	activityAmount:[
//      	   { required:true,validator: validateActAmount, trigger: 'change' }
//      	],
        	activityType:[
        	   { required:true,validator: validateActType, trigger: 'change' }
        	],
        	startTime:[
        	   { required:true,validator: validateStartTime, trigger: 'change' }
        	],
        	endTime:[
        	   { required:true,validator: validateEndTime, trigger: 'change' }
        	],
        	placeOfActivity:[
        	   { required:true,validator: validateActPlace, trigger: 'change' }
        	]
//      	,
//          limitOfNumber:[
//      	   { required:true,validator: validateLimitNum, trigger: 'change' }
//      	]
        
            
       	}
        
      }
    },
    created(){
    	//获取活动区域内容
    	let params={
    		dictTypeId:'11'
    	}
    	this.$http.get('api/sysDict/sysDictList',{params
       	
    	}).then(res => {
    		console.log(res.data);
            this.placeLists = res.data.resp;           
        });
        
        this.getApp();
    	
    },
    methods:{
        getApp(){
        	//活动id
    	    this.id=this.$route.params.actId;
    	    let params={      
	            id:this.id
	           
            }

			//获取当前活动
            this.$http.get('/api/activityDetails',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.form=res.data.resp;
	                if(this.form.picture){
	                   this.isShow=true;
	                }
	                
	                if(this.form.enterpriseLogo){
	                   this.isShow1=true;
	                }
	                              
	        })
    	
        	
        	
        },
    	   	
        uploadImg (e) {
            let _this = this;
            let files = e.target.files[0];
            console.log(files);
            if (!e || !window.FileReader) return; // 看支持不支持FileReader
            let reader = new FileReader();
            reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
//              _this.src = this.result;
                _this.form.picture=this.result;
                console.log(this.result);
                _this.isShow = true;
            }
       },        
        forkImage () {
//          this.src = '';
			this.form.picture='';
            this.isShow = false;
        },
        uploadImg1 (e) {
            let _this = this;
            let files = e.target.files[0];
            console.log(files);
            if (!e || !window.FileReader) return; // 看支持不支持FileReader
            let reader = new FileReader();
            reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
//              _this.src1 = this.result;
                _this.form.enterpriseLogo=this.result;
                console.log(this.result);
                _this.isShow1 = true;
            }
       },        
        forkImage1 () {
//          this.src1 = '';
			this.form.enterpriseLogo='';
            this.isShow1 = false;
        },
	   	
    	  //保存(提交表单内容)
    	  preserve(){ 
    	  	    console.log(this.form.startTime);    	  	    
    	  	    let newDay = new Date();   	  	    
    	  	    let ts=newDay.getTime();
//              let ts=Date.parse(newDay)                
				console.log(ts);  
               
                
				
				//判断日期格式是不是日期对象
//				if(this.form.startTime&&this.form.startTime.indexOf('-')>-1){
//					var startTime=new Date(this.form.startTime);
//				}else{
//					var startTime=this.form.startTime;
//				}
//				
//				if(this.form.endTime&&this.form.endTime.indexOf('-')>-1){
//					var endTime=new Date(this.form.endTime);
//				}else{
//					var endTime=this.form.endTime;
//				}
//
//              
//				if(this.form.deadlineForRegistration&&this.form.deadlineForRegistration.indexOf('-')>-1){
//					var deadlineForRegistration=new Date(deadlineForRegistration);
//				}else{
//					var deadlineForRegistration=this.form.deadlineForRegistration;
//				}
//				
				
				
                let params = {
                	  id:this.id,
                      activityName:this.form.activityName,
			          collectFees:this.form.collectFees,
			          activityAmount:this.form.activityAmount,
			          activityType:this.form.activityType,
			          startTime:new Date(this.form.startTime),
			          endTime:new Date(this.form.endTime),
			          placeOfActivity:this.form.placeOfActivity,
			          limitOfNumber:this.form.limitOfNumber,
			          deadlineForRegistration:new Date(this.form.deadlineForRegistration),
			          content:this.form.content,
			          popularState:this.form.popularState,
			          enterpriseName:this.form.enterpriseName,
			          enterpriseIntroduction:this.form.enterpriseIntroduction,
			          picture:this.form.picture,
			          enterpriseLogo:this.form.enterpriseLogo,
			          shelfState:'1',//保存的状态
			          regionId:1 , //园区id
			          ts:ts
			         			                              
                }
                console.log(params);

//              this.$refs.form.validate( valid => {
//              	if(valid){	                		                  
		               
		               this.$http.put('api/activityDetails', params
		                , {
		                    headers:{
		                         'Content-Type': 'application/json'
		                    }
		                }
		                ).then( res => {
		                	console.log(res.data);
		                    if(res.data){//成功逻辑
		                        Message({
		                            message:'保存成功',
		                            duration:1500,
		                            type:'success'
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

//              	}
//              })

               

    	  },
    	      	  
   	  
        //返回
        goBack(){	
	       this.$router.push({
		        name: 'activeList'
	
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

		
		.upload-input {
        position: relative;
        display: inline-block;
        padding: 0px 15px;
        overflow: hidden;
        text-decoration: none;
        text-indent: 0;
        background:#409EFF;
        border-radius: 5px;
        color:#fff;
        
        .uploadphoto{
            position: absolute;
            width: 100%;
            height: 100%;
            color: transparent;
            right: 0;
            top: 0;
            opacity: 0;
        }


    }
	   .common {
	        /*width: 150px;*/
	        width: 375px;
	        height:182px;
	    }
	    .common1{
	    	width: 100px;
	    	height: 100px;
	    }

	    .img-list-item {
	        position: relative;
	        /*margin: auto;*/
	    }
	    .img-list-item img {
	        box-sizing: border-box;
	        vertical-align: middle;
	        border: 0;       
	    }
	    .img-list-item i.del-img {
	        width:40px;
	        height: 40px;
	        display: inline-block;
	        background: rgba(0,0,0,.6);
	        background-image: url('../../../../../../static/images/del.jpg');
	        background-size: 100%;
	        background-repeat: no-repeat;
	        background-position:100%;
	        position: absolute;
	        top: 0;
	        right:0;
	    }

	    input[type="file"] {
	        color: transparent;
	        opacity: 0;
	        width: 100%;
	        height: 100%;
	    }
	    #wrapper:after {
	        content: ".";
	        display: block;
	        height: 0;
	        clear: both;
	        visibility: hidden;
	    }
	    .mb_10 {
	        margin-bottom: 10px; 
	    }
	}
</style>