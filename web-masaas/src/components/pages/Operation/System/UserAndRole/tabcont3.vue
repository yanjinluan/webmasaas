
<template>  
  <div slot='tabcont3' class="tabcontent">

        <div class="table">           
                <el-table
		                v-loading="loading"	
								    ref="singleTable"
								    :data="roleLists"
								    highlight-current-row
								    border
								    @selection-change="handleSelectionChange">
								     
                <el-table-column
                    align="center"
                    label="角色编号"
                    show-overflow-tooltip
                    prop="ROLE_ID"
                    width="80">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="角色名称"
                    show-overflow-tooltip
                    prop="roleName">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="角色说明"
                    show-overflow-tooltip
                    prop="roleDescribe">
                </el-table-column>
                   
                <el-table-column 
                	align="center"
                	label="是否有效"
                	show-overflow-tooltip
                	prop="isAvailable"
                	width='300'>
	                <template slot-scope="scope">
	                  <el-switch 
	                  	active-text="有效" 
	                  	inactive-text="无效"  
	                  	v-model="scope.row.isAvailable" 
	                  	active-value="0"
	                  	inactive-value="1"
	                  	disabled>
	                  </el-switch>
	                </template>
	            </el-table-column>

                
                <el-table-column
                    align="center"
                    label="操作" 
                    >
                    <template slot-scope="scope">
                        <!--<el-button size='mini' type="warning" plain @click="openDelete(scope.row.id, scope.row.appId)">添加</el-button>-->
                        <el-button size='mini' type="warning" plain @click="addRole(scope.row.ROLE_ID)">添加</el-button>
                    </template>
                </el-table-column>
                
                <el-table-column
							      type="selection"								      
							      width="55">
							  </el-table-column>

            </el-table>
            
            
             <div style="margin-top: 20px;text-align: center;">
						    <el-button  @click='batchadd'style='width: 30%;' type="primary" plain>批量添加</el-button>
						    <el-button @click="toggleSelection" style='width: 30%;' type="primary" plain>取消选择</el-button>
						  </div>
        </div>

        <div style="text-align: right; margin:2%;">
        	 <el-pagination 
						  background
						  :page-size='pageSize'
						  layout="prev, pager, next"
						  @prev-click='prevclick'
						  @next-click='nextclick'
			        @current-change="handleCurrentChange"
						  :total="total"
						  v-if='show'>
						</el-pagination>
        </div>
  
  	       
  	       
  </div>  
</template>  
  

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message, MessageBox,Pagination  } from 'element-ui';
export default {
    name:'',
    data() {
        return {
            roleLists:[],            
            pageNumber:'1', 
            pageSize:10,
            total:null,//页数
            pages:'',
            current:'',//请求数据拿到的当前页
            show:false,
            
            roleName:'',
            loading:false,
            isAvailable:'',
            userId:'',
            multipleSelection: [] //勾选的角色
          

        }
    },
   
    created () {
    	  this.userId=this.$route.params.userId;
    	  console.log(this.userId);
        this.getApp ();
    },
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }
 
        })
    },
    beforeDestroy () {
    },
    components:{

    },
    methods:{
        getApp () {
        	  this.loading = true;
          	console.log(this.userId);
            let rarams={userId:this.userId};           
            this.$http.get('/api/findUserNoRoles', {
				                params:{
				                    "userId":this.userId,
				                     pageSize:10,
	                			     pageNumber:this.pageNumber

				                }
					              ,headers:{
					                  'token': this.token
					
					              }
					  }
        	).then( res => {
        		    this.loading = false;
            	  console.log(res.data);
                this.roleLists = res.data.resp.records;
                this.total=res.data.resp.total;
                this.pages=res.data.resp.pages; 
                this.current=res.data.resp.current;
                this.pages>1?this.show=true:this.show=false;  
                
            })
                        
        },
        addRole(role_id){
        	  this.loading = true;
            if(this.current==this.pages&&this.pages>1&&this.roleLists.length==1){
            	this.pageNumber-=1;
            }
	    	    let params={
	       	  	  'userId':this.userId, 
	              'roleId':role_id,
	               pageSize:10, 
	               pageNumber:this.pageNumber
	       	  }
	    	    this.getCurrentCheck(params);
//	          this.$http.post('/api/sysUserRole',params,{		               
//			              headers:{
//			                  'token': this.token,
//			                  'Content-Type': 'application/json; charset=UTF-8'
//			
//			              }
//						}).then( res => {
////	        		   this.loading = false;
//	                 console.log(res.data);
//	       	         if( res.data.success ){
//                      Message({
//                          message:'添加成功',
//                          duration:1500,
//                          type:'success'
//                      });
//           
//                 }	       	          
//	       	   
//	                 this.getApp ();
//	          })
        },
        toggleSelection() {
         	    this.$refs.singleTable.clearSelection();
         },
	      handleSelectionChange(val) {
		        this.multipleSelection = val;
		        console.log(val);
		      }
   
        ,batchadd(){
        	  if(this.current==this.pages&&this.pages>1&&this.roleLists.length==this.multipleSelection.length){
            	this.pageNumber-=1;
            }
        	  this.multipleSelection.forEach((currentValue)=>{
		  	            this.loading = true;
					    	    let params={
					       	  	  'userId':this.userId,  
					              'roleId':currentValue.ROLE_ID,
								         pageSize:10, 
				                 pageNumber:this.pageNumber
					       	 }
					    	    console.log(params);
					    	    if(params.roleId){
					    	    	   setTimeout(() => {
									              this.getCurrentCheck(params);
									        },500);
					    	    	
					    	    }
                          	  	 
        	  })
        }

        ,getCurrentCheck(params){
        	  debugger;
        	  console.log(params);
          	this.$http.post('/api/sysUserRole',params,{		               
			              headers:{
			                  'token': this.token,
			                  'Content-Type': 'application/json; charset=UTF-8'
			
			              }
						}).then( res => {
//	        		   this.loading = false;
	                 console.log(res.data);
	       	         if( res.data.success ){
                        Message({
                            message:'添加成功',
                            duration:1500,
                            type:'success'
                        });
             
                   }	       	          
	       	   
	                 this.getApp ();
	          })
        },
         //上一页
        prevclick(){
        		this.pageNumber--;
        		console.log(this.pageNumber);
        		this.getApp();
 	
        },
        //下一页
        nextclick(){
        		this.pageNumber++;
        		console.log(this.pageNumber);
        		this.getApp();
               	
        },

       // 当前改变----当前页码改变之后，触发这个函数
       handleCurrentChange(val){
           console.log("当前改变："+val)
           this.pageNumber=val;
           this.getApp();
       }
        
        
    }

   
}
</script>
 
<style lang="scss" scoped>
	.tabcontent{
		width: 96%;
		margin: 0 auto;
		height: 100%;
		margin-top: 15px;
		
		 .table{
            width: 96%;
            min-width: 800px;
            margin:20px auto 0;
        }
	}
</style>


