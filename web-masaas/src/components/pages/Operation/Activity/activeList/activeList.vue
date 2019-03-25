<template>
    <div class="active-box">       
        <div class="app-box_btn">  	
        	 <el-button type="primary"  @click="addActive">新建活动</el-button>       	
        </div>        
        <div class="app-box">
                
			  	<el-radio-group v-model="popularState">
			  		 <el-radio :label="1">热门活动</el-radio>
			    	 <el-radio :label="0">周周活动</el-radio>
			  	</el-radio-group>
			  	<el-radio-group v-model="collectFees">
			  		 <el-radio :label="0">免费活动</el-radio>
			    	 <el-radio :label="1">付费活动</el-radio>
			  	</el-radio-group>
			  	<el-radio-group v-model="shelfState">
			  		 <el-radio :label="1">待发布</el-radio>
			    	 <el-radio :label="2">已发布</el-radio>
			    	 <el-radio :label="3">已关闭</el-radio>			    
			  	</el-radio-group>
			  	
			   <div class="block">
				    <el-date-picker
				      v-model="startDatetime"
				      type="datetime"
				      placeholder="选择开始日期和时间">
				    </el-date-picker>
			   </div>			 		  
			  <el-button type="primary"  @click="queryClick">搜索</el-button>  
        </div>
        
	        
        <div class="table">         
                <el-table
                v-loading="loading"	
			    ref="singleTable"
			    :data="activeLists"
			    highlight-current-row			   
			    border>
                
                <el-table-column
                    align="center"
                    label="序号"
                    show-overflow-tooltip
                    prop="id"
                    width="80">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="活动名称"
                    show-overflow-tooltip
                    prop="activityName">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="活动价格"
                    show-overflow-tooltip
                    prop="activityAmount">
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="活动开始时间"
                    show-overflow-tooltip
                    prop="startTime">
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="活动结束时间"
                    show-overflow-tooltip
                    prop="endTime">
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="浏览人数"
                    show-overflow-tooltip
                    prop="viewTimes">
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="活动状态"
                    show-overflow-tooltip                  
                    prop="shelfState"
                    :formatter='formatstate'>
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="操作" 
                    width='300'>
                    <template slot-scope="scope">                     
                        <el-button size='mini' type="warning" plain @click="examine(scope.row.id)">查看</el-button> 
                        <el-button size='mini' type="warning" plain @click="openPublish(scope.row,scope.row.id)" v-if='scope.row.shelfState==="1"'>发布</el-button>  
                        <el-button size='mini' type="warning" plain @click="editor(scope.row.id)" v-if='scope.row.shelfState==="1"'>编辑</el-button>
                        <el-button size='mini' type="warning" plain @click="openDelete(scope.row.id)" v-if='scope.row.shelfState==="1"|scope.row.shelfState==="2"'>关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox ,Pagination} from 'element-ui';

export default {
    name:'activeList',
    data() {
        return {

        	popularState:'',
        	collectFees:'',
        	shelfState:'',   //活动状态 1待发布 2发布 3关闭
            startDatetime:'', //活动开始时间
        	
            activeLists:[],
                       
            pageNumber:1,
            pageSize:10,
            total:null,//页数
            pages:'',
                     
            loading:false,
            isAvailable:'',
            show:false
            
          

        }
    },
   
    created () {
        this.getApp ();
//      Bus.$on('busGetRoleLists', this.addRefresh);
//      Bus.$on('busAddRefreshRole', this.addRefresh);
    },
    computed:{
		...mapState({
			token (state) {
                return state.token.token
            }
		})
	},
    beforeDestroy () {
//      Bus.$off('busGetRoleLists');
//      Bus.$off('busAddRefreshRole');
    },
    components:{
     
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        
  
               
        onRoleWindow (id, appId, type) {//打开新增窗口
        	this.$refs.singleTable.setCurrentRow(id);
            Bus.$emit('onUserWindow',type);
            Bus.$emit('pageNumber', this.pageNumber)
            if(id){
               this.CHANGE_ID(id);
            };
            if(appId){
               this.CHANGE_APPID(appId);
            }
        },
        
        
        //日期格式 yyyy-mm-dd hh:mm:ss
         
	     dateFormat(times) {
		    var dt=new Date(times);
			var y=dt.getFullYear()
			var m=(dt.getMonth()+1).toString().padStart(2,'0');
			var d=(dt.getDate()).toString().padStart(2,'0');
			var hh=dt.getHours();
        	var mm=dt.getMinutes();
        	var ss=dt.getSeconds();
        	times=`${y}-${m}-${d} ${hh}:${mm}:${ss}`
		  },
		 		 
        
        //发布新活动
        addActive(){        	  
        	  this.$router.push({
			        name: 'publish'
//			        ,
//			        params: {
//			           roleId:id 
//			        }
		      })
        	
        },  
                       
        getApp () {             
           let params={
            	pageSize:10,
	            pageNumber:this.pageNumber
	           
            }

			//获取活动列表
            this.$http.get('/api/activityDetails/activityDetailsList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.activeLists=res.data.resp.records;
	                this.total=res.data.resp.total;
	                this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
	                              
	        })
                        
        },
        queryClick() { //点击查询按钮时	        	
//      	this.loading = true;
//	    	var dt=new Date(this.startDatetime);
//			var y=dt.getFullYear()
//			var m=(dt.getMonth()+1).toString().padStart(2,'0');
//			var d=(dt.getDate()).toString().padStart(2,'0');
//			var hh=dt.getHours().toString().padStart(2,'0');
//	    	var mm=dt.getMinutes().toString().padStart(2,'0');
//	    	var ss=dt.getSeconds().toString().padStart(2,'0');
//          this.startDatetime=y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss

            let params={
//                  time:new Date().getTime(),
                    startTime:this.startDatetime,
                    popularState:this.popularState,
                    collectFees:this.collectFees,
                    shelfState:this.shelfState,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                 
                }
            console.log(params);
            this.$http.get('/api/activityDetails/activityDetailsList',{
            	params

            }).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data.resp.records.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
                    this.activeLists = res.data.resp.records;
                }else{
                	this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
                    this.activeLists = res.data.resp.records;
                }
            }).catch( () => {
                this.loading = false;
            });
            
        },
        
        //查看活动详情
        examine(id){
        	this.$router.push({
			        name: 'activeDetail'
			        ,
			        params: {
			           actId:id 
			        }
		      })
        	console.log(id);
        },
        
        //活动状态转换
    	formatstate(row, column) {
    		let state = row.shelfState; 
    	 	switch(state){	
			     case '1':
			       return   '待发布'
			     break;
			     case '2':
			       return   '发布'
			     break;
			     case '3':
			       return   '关闭'
			     break;
			     default:
	             break;
		   	}

    	},
        //编辑当前活动
        editor(id){
	    	 this.$router.push({
			        name: 'editorActive'
			        ,
			        params: {
			           actId:id 
			        }
		      })
        
        },
        


        openPublish(obj,id){//打开发布提示窗口,如果信息不完善先编辑再提交
        	console.log(obj); 
        	debugger;
            if(obj.activityName==''|obj.collectFees==''|obj.activityAmount==''|obj.activityType==''|obj.startTime==''|
               obj.endTime==''|obj.placeOfActivity==''|obj.limitOfNumber==''|obj.deadlineForRegistration==''|obj.picture==''
            ){  
                   Message({
                        message:'请编辑完必填信息后再发布',
                        duration:1500,
                        type:'warning'
                    });
		            	
            }else{
            	  
            	    MessageBox.confirm('是否发布当前活动, 是否继续?', '发布当前活动', {
		                confirmButtonText: '确定',
		                cancelButtonText: '取消',
		                type: 'warning'
		            }).then(() => {
		                this.publishActive(id);
		            }).catch( () => {});
            }
    
        	
        },
        publishActive(id){
        	 this.loading = true;           
            let params = { 
                id:id,
                shelfState:'2'	
            }
            this.$http.put('/api/activityDetails', params,{
                headers:{
                     'token' :this.token
                }
            }).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data){
                    Message({
                        message:'活动发布成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getApp ();//刷新数据
                }else{
                    Message({
                        message:'活动发布失败',
                        duration:1500,
                        type:'error'
                    });
                }
            });
        },
      
        openDelete ( id) {//打开关闭提示窗口
            MessageBox.confirm('是否关闭当前活动, 是否继续?', '闭当前活动提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteActive(id);
            }).catch( () => {});
        },
        
        
        deleteActive (id) {
            this.loading = true;           
            let params = { 
                id:id,
                shelfState:'3'	
            }
            this.$http.put('/api/activityDetails', params,{
                headers:{
                     'token' :this.token
                }
            }).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data){//删除成功
                    Message({
                        message:'活动关闭成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getApp ();//刷新数据
                }else{//删除失败
                    Message({
                        message:'活动关闭失败',
                        duration:1500,
                        type:'error'
                    });
                }
            });
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
    .active-box{
        width: 100%;
        height: 100%;
        .app-box{
        	width: 96%;
            margin: 0 auto;
            min-width: 800px;
            height:56px;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: flex;
            -webkit-justify-content: space-between;
            -moz-justify-content: space-between;
            -ms-sjustify-content: space-between;
            justify-content: space-between;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
            align-items: center;
        }

        .option-box{
            width: 96%;
            min-width: 800px;
            margin:20px auto 0;
            height: 40px;
        }

        .table{
            width: 96%;
            min-width: 800px;
            margin:20px auto 0;
        }
        .app-box_btn{
        	width: 10%;
        	padding-left: 2%;
            height:56px;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: flex;
            -webkit-justify-content: space-between;
            -moz-justify-content: space-between;
            -ms-sjustify-content: space-between;
            justify-content: space-between;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
            align-items: center;
        }
    }
</style>

