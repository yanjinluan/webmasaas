<template>
    <div class="user-box">
        <div class="app-box">			  
			  <el-checkbox-group 
			    v-model="checkVal">
			    <el-checkbox v-for="check in checkList" :label="check" :key="check">{{check}}</el-checkbox>
			  </el-checkbox-group>
	
			<div>
                <span>用户名：</span>
                <el-input style="width:134px" v-model="userName"></el-input>
            </div>
            
            <div>
                <span>订单状态：</span>
                <el-input style="width:134px" v-model="state"></el-input>
            </div>
		  
			  <el-button type="primary"  @click="">搜索</el-button>  
        </div>

        <div class="table"> 
            <el-table
                v-loading="loading"
                :data="orderLists"
                style="width: 100%"
                border>

                <el-table-column
                    prop="orderNumber"
                    show-overflow-tooltip
                    label="订单号"
                    align="center"
                    >
                </el-table-column>
                <!--<el-table-column
                    prop="activityId"
                    show-overflow-tooltip
                    label="活动ID"
                    align="center"
                    >
                </el-table-column>-->
                
                <el-table-column
                    prop="orderAmount"
                    show-overflow-tooltip
                    label="订单金额"
                    align="center"
                    >
                </el-table-column>
         
                <el-table-column
                    prop="paymentAmount"
                    show-overflow-tooltip
                    label="支付金额"
                    align="center"
                   >
                </el-table-column>
                
                <el-table-column
                    prop="payTime"
                    show-overflow-tooltip
                    label="支付时间"
                    align="center"
                   >
                </el-table-column>
                
                
                <el-table-column
                    prop="orderStatus"
                    show-overflow-tooltip
                    label="订单状态"
                    align="center"
                    width="120">
                </el-table-column>
               
		        <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click="examine(scope.row.orderNumber)">查看</el-button>                      
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button size='mini' type="warning" plain @click="examine(1)">查看</el-button>                    
        
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
import { Message, MessageBox ,Pagination } from 'element-ui';
import Vue from 'vue'
//import Paging from '@/components/commos/Paging/Paging';
//import pagination from '@/components/commos/Paging/pagination';

export default {
    name:'orderList',
    data() {
        return {
        	checkVal: [''],
        	checkList: ['热门活动', '周周活动', '免费活动', '付费活动'],           
            orderLists:[],
            pageNumber:'1', 
            pageSize:10,
            
            userName:'',
            state:'',
            
            total:null,//页数
            pages:'',
            show:false,
       
//          loading:true
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
    
    created () { //获取列表
        this.getApp();//获取初始数据
//      Bus.$on('busGetUserLists', this.getUserLists);//刷新页面
    },
    beforeDestroy () {
//      Bus.$off('busGetUserLists')
    },
    methods:{
    	//获取订单列表
    	getApp(){
    		let params={
            	pageSize:10,
	            pageNumber:this.pageNumber
	           
            }

			//获取活动列表
            this.$http.get('/api/activityPayOrder/activityPayOrderList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.orderLists=res.data.resp.record;
	                this.total=res.data.resp.total;
	                this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
	                              
	        })
    	},
        //查看订单详情        
        examine(id){	
	       this.$router.push({
		        name: 'orderDetail',
		        params: {
		           ordId:id 
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
       }


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

