
<template> 
	<div class="content">
		<el-form ref="form" :model="form"   label-width="80px" size='medium'>		
			<el-form-item label="活动名称" prop='activityName'>
				    <el-input v-model="form.activityName" style='width: 45%;' disabled></el-input>
			</el-form-item>
			<el-form-item label="活动性质" prop='collectFees'>
		  		<!--<el-input v-model="form.collectFees" style='width: 45%;' disabled ></el-input>-->		  				
			  		<el-select placeholder="请选择"  v-model="form.collectFees" disabled  style="width:45%">
			            <el-option
			                v-for="item in collectFeesList"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			       </el-select>
	
		  	    
			</el-form-item>
            <el-form-item label="活动价格" prop='activityAmount'>
			        <el-input v-model="form.activityAmount" style="width:45%" disabled></el-input>
			</el-form-item>
			
			<el-form-item  label="活动类型" prop='activityType'>
				    <!--<el-input v-model="form.activityType" style='width: 45%;' disabled></el-input>-->
				    
			    	<el-select placeholder="请选择"  v-model="form.activityType" disabled  style="width:45%">
			            <el-option
			                v-for="item in activityTypeLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			        </el-select>
		    </el-form-item>
			
		 	<el-form-item label="开始时间" prop='startTime'>
		 		    <el-input v-model="form.startTime" style='width: 45%;' disabled></el-input>
		 	</el-form-item>
		 	
		 	<el-form-item label="结束时间" prop='endTime'>
		 		    <el-input v-model="form.endTime" style='width: 45%;' disabled></el-input>
		 	</el-form-item>
		 		
		 	
		 	<el-form-item label="活动区域" prop='placeOfActivity'>    
				    <el-select placeholder="请选择"  v-model="form.placeOfActivity"  disabled style="width:45%">
			            <el-option
			                v-for="item in placeLists"
			                :key="item.id"
			                :label="item.dictName"
			                :value="item.id">
			            </el-option>
			        </el-select>
			</el-form-item>
            
            <el-form-item label="人数限制" prop='limitOfNumber'>
				    <el-input v-model="form.limitOfNumber" style="width:45%" disabled></el-input>
			</el-form-item>
			
			<el-form-item label="报名截止"  prop='deadlineForRegistration'>
				    <el-input v-model="form.deadlineForRegistration" style="width:45%" disabled></el-input>
			</el-form-item>
						  
		    <el-form-item label="活动详情" prop='content'>		    	
		    	    <el-input type='textarea' v-model="form.content" style='width: 45%;' disabled></el-input>
		    </el-form-item>
			  
            <el-form-item label="活动标签" prop='popularState'>  
            	  <!--<el-input  v-model="form.popularState" style='width: 45%;' disabled></el-input>-->
            	  <el-select placeholder="请选择"  v-model="form.popularState"  disabled style="width:45%">
			            <el-option
			                v-for="item in popularStateLists"
			                :key="item.id"
			                :label="item.name"
			                :value="item.id">
			            </el-option>
			      </el-select>
			</el-form-item>
				 
			<el-form-item label="活动图片" prop='picture'>	
				<div style="width: 375px;height: 182px;">
					 <img :src='form.picture' style="width: 100%; height: 100%;" />
				</div>		    	  
		    </el-form-item>
		    
		    <el-form-item label="企业名称" prop='enterpriseName'>
		    	      <el-input v-model="form.enterpriseName" style="width:45%" disabled ></el-input>
		    </el-form-item>	
		    
		        
		    <el-form-item label="企业介绍" prop='enterpriseIntroduction'>
		    	      <el-input type='textarea' v-model="form.enterpriseIntroduction" style="width:45%" disabled></el-input>
		    </el-form-item>	
		    
		    <el-form-item label="企业logo" prop='enterpriseLogo'>		    	
		    	<div style="width: 375px;height: 182px;">
					 <img :src='form.enterpriseLogo' style="width: 100%;height: 100%;" />
				</div>		    	  
		    </el-form-item>
				

			<el-form-item>
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
    name:'activeDetail',
    data() {
   	
      return {
      	id:'',
      	pageSize:'',
      	pageNumber:'',
      	placeLists:[],
      	collectFeesList:[
          {name:'免费活动',id:'0'},
          {name:'付费活动',id:'1'}
        ],
        activityTypeLists:[
	        {name:'大型活动', id:'0'},
	        {name:'小型活动', id:'1'}
        ],
        popularStateLists:[
            {name:'热门活动',id:'1'},
            {name:'周周活动 ',id:'0'}
          
        ],
      	form:{
      		
      	}
              
      }
    },
 
    created(){
    	//获取活动区域内容
        this.initplaceList();	
    	//活动id
    	this.id=this.$route.params.actId;
    	    let params={
            	pageSize:10,
	            pageNumber:this.pageNumber,
	            id:this.id
	           
            }

			//获取活动列表
            this.$http.get('/api/activityDetails/activityDetailsList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.form=res.data.resp.records[0];
//	            	if(this.form.collectFees='0'){
//	            		this.form.collectFees='免费'
//	            	}
//                  if(this.form.collectFees='1'){
//	            		this.form.collectFees='付费'
//	            	}
//                  
//                  if(this.form.activityType='0'){
//	            		this.form.activityType='大型活动'
//	            	}
//                  if(this.form.activityType='1'){
//	            		this.form.activityType='小型活动'
//	            	}
//                  
//                  if(this.form.popularState='0'){
//	            		this.form.popularState='周周活动'
//	            	}
//                  if(this.form.popularState='1'){
//	            		this.form.popularState='热门活动'
//	            	}
           
	        })
    	
    },

    methods:{
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
		.collectFees{
			background-color: #f5f7fa;
		    border-color: #e4e7ed;
		    color: #c0c4cc;
		    cursor: not-allowed;
		    height: 36px;
    		line-height: 36px;
    		width: 45%;
    		background-image: none;
		    border-radius: 4px;
		    border: 1px solid #dcdfe6;
   
		}
	}
</style>