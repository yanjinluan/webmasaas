
<template>  
  <div slot='tabcont2' class="tabcontent">

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
                    label="#"
                    show-overflow-tooltip
                    prop="id"
                    width="80"
                    v-if='show'>
                </el-table-column>
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
                    label="操作" >
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click="deleteRole(scope.row.id)">删除</el-button>

                    </template>
                </el-table-column>
                
                <el-table-column
							      type="selection"								      
							      width="55">
							  </el-table-column>

            </el-table>
            
              <div style="margin-top: 20px;text-align: center;">
						    <el-button @click='batchdelete' style='width: 30%;' type="primary" plain>批量删除</el-button>
						    <el-button @click="toggleSelection()" style='width: 30%;' type="primary" plain>取消选择</el-button>
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
import { Message, MessageBox,Pagination } from 'element-ui';
export default {
    name:'Rolemanage',
    data() {
        return {
            roleLists:[],
            pageNumber:'1', 
            pageSize:10,
            total:null,//页数
            pages:'',
            current:'',//请求数据拿到的当前页
            show:false,
            
            appLists:[],
            roleName:'',
            loading:false,
            userId:'',
            show:false


        }
    },
   
    created () {
    	  this.userId=this.$route.params.userId;   	  
        this.getApp ();
//      Bus.$on('busAddRefreshRole', this.addRefresh);
    },

    beforeDestroy () {   	
//  	  Bus.$off('busAddRefreshRole');
    },
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }
 
        })
    },
    methods:{
//      deleteRole ( roleId, appId ) {
//          this.loading = true;
//          this.$http.delete('/api/tenant/roles/'+roleId+'/', {
//              params:{
//                  appId
//              },
//              headers:{
//                  'Operate-Application-Id': appId
//              }
//          }).then( res => {
//              this.loading = false;
//              if(res.data.success){//删除成功
//                  Message({
//                      message:'删除成功',
//                      duration:1500,
//                      type:'success'
//                  });
//                  this.getRoleLists('delete');//刷新数据
//              }else{//删除失败
//                  Message({
//                      message:'删除失败',
//                      duration:1500,
//                      type:'error'
//                  });
//              }
//          });
//      },
        getApp () {
        	  this.loading = true;
            debugger;
          	console.log(this.userId);
//          let rarams={userId:this.userId};
            this.$http.get('/api/findUserRoles',            	
            	{
		                params:{
		                    "userId":this.userId,
		                     pageSize:10,
	                			 pageNumber:this.pageNumber
//					                    'token': this.token
		                },
			              headers:{
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
        
        deleteRole(id){
        	 this.loading = true;
//	    	    let params={	       	  	 
//	              'id':id
//	              
//	       	 }
            if(this.current==this.pages&&this.pages>1&&this.roleLists.length==1){
            	this.pageNumber-=1;
            }
	    	    console.log(this.token);
	    	    
	    	    let params={
	       	  	  'sysUserRoleId':id, 
	               pageSize:10, 
	               'token': this.token,
	               pageNumber:this.pageNumber
	       	  }
//	          this.$http.delete('/api/sysUserRole',{
//	          	 params:{'sysUserRoleId':id, pageSize:10, pageNumber:this.pageNumber,'token': this.token}
//	          }
//
//	          ,{
//			              headers:{
//			              	  "Content-Type": "application/json"
////			                'token': this.token
//			
//			              }
//							  }
//	        	).then( res => {
//              console.log(res);
//              if(res.data){//删除成功
//                  Message({
//                      message:'删除成功',
//                      duration:1500,
//                      type:'success'
//                  });
//                  this.getApp ();
//              }else{//删除失败
//                  Message({
//                      message:'删除失败',
//                      duration:1500,
//                      type:'error'
//                  });
//              }
//
//	              
//	          })

              this.getCurrentCheck(params);
        },
         toggleSelection() {
         	    this.$refs.singleTable.clearSelection();
         }
         , handleSelectionChange(val) {
		        this.multipleSelection = val;
		        console.log(val);
		      }
         ,batchdelete(){
 						if(this.current==this.pages&&this.pages>1&&this.roleLists.length==this.multipleSelection.length){
            	this.pageNumber-=1;
            }
         	  this.multipleSelection.forEach((currentValue)=>{
		  	            this.loading = true;
				            console.log(currentValue);
				            let params={
					       	  	  'sysUserRoleId':currentValue.id,  
					       	  	   'token': this.token,
								         pageSize:10, 
				                 pageNumber:this.pageNumber
					       	  }
					    	    if(currentValue.id){
//					    	    	   setTimeout(() => {
//																this.$http.delete('/api/sysUserRole',{params:{'sysUserRoleId':currentValue.id,pageSize:10, pageNumber:this.pageNumber,'token': this.token}}
//											
//												          ,{
//														              headers:{
//														              	  "Content-Type": "application/json"
////														                  'token': this.token
//														
//														              }
//																		  }
//												        	).then( res => {
//											                console.log(res);
//											                if(res.data){//删除成功
//											                    Message({
//											                        message:'删除成功',
//											                        duration:1500,
//											                        type:'success'
//											                    });
//											                 
//											                }else{//删除失败
//											                    Message({
//											                        message:'删除失败',
//											                        duration:1500,
//											                        type:'error'
//											                    });
//											                }
//																			this.getApp ();			              
//												          })
//					    	    	   										             
//									        },500);
									        
									          setTimeout(() => {
									              this.getCurrentCheck(params);
									        },500);
					    	    	
					    	    }
                          	  	 
        	  })
         },
         
          getCurrentCheck(params){
        	  debugger;
        	  console.log(params);
          	this.$http.delete('/api/sysUserRole',{params:params},{		               
			              headers:{
//			                  'token': this.token,
			                  'Content-Type': 'application/json; charset=UTF-8'
			
			              }
						}).then( res => {
//	        		   this.loading = false;
	                 console.log(res.data);
	       	         if( res.data.success ){
                        Message({
                            message:'删除成功',
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


