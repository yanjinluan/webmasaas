<template>
    <div class="user-box">
        
        <div class="app-box">
        	<template>
			  <el-select v-model="value" placeholder="请选择">
			    <el-option
			      v-for="item in bidlOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			</template>    
			<el-button type="primary" @click="queryClick">查询</el-button>
        </div>
    	
        <div class="table"> 
            <el-table
                v-loading="loading"
                highlight-current-row
                :data="bidLists"
                style="width: 100%"
                border
                >   
                <el-table-column
                    prop="id"
                    show-overflow-tooltip
                    label="序号"
                    align="center"
                    >
                </el-table-column>
                
                <el-table-column
                    prop="activityName"
                    show-overflow-tooltip
                    label="活动名称"
                    align="center"
                    >
                </el-table-column>
                <el-table-column
                    prop="applicantUnit"
                    show-overflow-tooltip
                    label="申办单位"
                    align="center"
                    >
                </el-table-column>
                <el-table-column
                    prop="activityType"
                    show-overflow-tooltip
                    label="活动类型"
                    align="center"
                    :formatter='formattype'>
                </el-table-column>
                <el-table-column
                    prop="zoneOfAction"
                    show-overflow-tooltip
                    label="活动区域"
                    align="center"
                    >
                </el-table-column>
         
                <el-table-column
                    prop="companyNature"
                    show-overflow-tooltip
                    label="企业类型"
                    align="center"
                   >
                </el-table-column>
                <el-table-column
                    prop="passState"
                    show-overflow-tooltip
                    label="申请状态"
                    align="center"
                    :formatter='formatstate'>
                </el-table-column>
                
                <el-table-column
                    align="center"
                    label="操作"             
                    >
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click='examine(scope.row.id)'>查看</el-button>
                        <!--<el-button size='mini' type="warning" plain @click='auditing(scope.row.id)'>审核</el-button>-->
                        <el-button size='mini' type="warning" plain @click='auditing(scope.row.id)' v-if="scope.row.passState=='2'" >审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<el-button size='mini' type="warning" plain @click='examine(1)'>查看</el-button>
            <el-button size='mini' type="warning" plain @click='auditing(1)'>审核</el-button>-->
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
import {mapState} from 'vuex';
import { Message, MessageBox ,Select,Pagination } from 'element-ui';
import Vue from 'vue'


export default {
    name:'bidList',
    data() {
        return {
            bidLists:[],
            pageNumber:'1', 
            pageSize:10,           
            total:null,//页数
            pages:'',
            show:false,
            
	        bidlOptions: [{
	          value: '2',
	          label: '未审核'
	        }, {
	          value: '1',
	          label: '已通过'
	        }, {
	          value: '0',
	          label: '未通过'
	        }, {
	          value: '3',
	          label: '已取消'
	        }],
	        value: '',

            loading:false
        }
    },
    components:{
//      Paging
    },
    
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }

        })
    },
    
    created () {//获取列表
        this.getApp();//获取初始数据
//      Bus.$on('busGetUserLists', this.getUserLists);//刷新页面
    },
    beforeDestroy () {
        Bus.$off('busGetUserLists')
    },
    methods:{
        //获取申办列表
        getApp () {        	
            this.loading = true;
            let params={
        	  	pageSize:10,
	          	pageNumber:this.pageNumber
	        };
            this.$http.get('/api/activityApply/activityApplyList',{params,
            	headers:{
                     'token' :this.token
                }
           		
            	}).then( res => {
                	this.loading = false;
                	console.log(res.data);
                    this.bidLists = res.data.resp.records;
                    this.total=res.data.resp.total;
                    this.pages=res.data.resp.pages;  
                	this.pages>1?this.show=true:this.show=false;                
                                 
            });
         
        },
        
        //活动类型转换
    	formattype(row, column) {
    		let type = row.activityType; 
    		return type=='0'?'大型活动':'小型活动'

    	},
    	//审核状态
    	formatstate(row, column) {
    		let state = row.passState; 
    	 	switch(state){	
			     case '0':
			       return   '未通过'
			     break;
			     case '1':
			       return   '通过'
			     break;
			     case '2':
			       return   '未审核'
			     break;
			     case '3':
			       return   '已取消'
			     break;
			     default:
	             break;
		   	}    	 	 

    	},
        

		
		queryClick() { //点击查询按钮时	        	
            console.log(this.value);
            let params={
                    passState:this.value,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                 
            }
            console.log(params);
            this.$http.get('/api/activityApply/activityApplyList',{params,
            	headers:{
                     'token' :this.token
                }

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
                    this.bidLists = res.data.resp.records;
                }else{
                	this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
                    this.bidLists = res.data.resp.records;
                }
            }).catch( () => {
                this.loading = false;
            });
            
        },
        
        //查看申办详情      
        examine(id){	
	       this.$router.push({
		        name: 'bidDetail',
		        params: {
		           bidId:id 
			    }
		    })
	    },  	
          
        //审核
        auditing(id){
        	 this.$router.push({
		        name: 'approval',
		        params: {
		           bidId:id 
			    }
		    })
        	
        },
        
        //上一页
        prevclick(){
        		this.pageNumber--;
        		console.log(this.pageNumber);
        		this.initLists();
 	
        },
        //下一页
        nextclick(){
        		this.pageNumber++;
        		console.log(this.pageNumber);
        		this.initLists();
               	
        },

       // 当前改变----当前页码改变之后，触发这个函数
       handleCurrentChange(val){
           console.log("当前改变："+val)
           this.pageNumber=val;
           this.initLists();
       },
//      indexMethod(index) {
//          let newIndex = (this.pageNumber-1)*10+index+1;
//          return newIndex
//      },


    }
}
</script>

<style lang="scss" scoped>
    .user-box{
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
        .table{
            width: 96%;
            border-collapse:collapse;
            margin: 10px auto 0;
            min-width: 800px;
        }

        .pageination-box{
            margin-top: 40px;
            width: 100%;
            min-width: 450px;
            padding: 0 30%;

            .top-page{
                float: left;
            }
            .next-page{
                float: right;
            }
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


