<template>
    <div class="user-box">
        <div class="app-box">        	
        
			  <!--<el-select v-model="value" placeholder="活动状态">
			    <el-option
			      v-for="item in orderOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>-->
			  
			  <el-select v-model="value1" placeholder="收费状态">
			    <el-option
			      v-for="item in orderOptions1"
			      :key="item.value1"
			      :label="item.label"
			      :value="item.value1">
			    </el-option>
			  </el-select>
			  
			  <el-select v-model="value2" placeholder="订单状态">
			    <el-option
			      v-for="item in orderOptions2"
			      :key="item.value2"
			      :label="item.label"
			      :value="item.value2">
			    </el-option>
			  </el-select>
			  

			  <!--<el-checkbox-group v-model="checkVal">
			    	<el-checkbox v-for="check in checkList" :label="check" :key="check">{{check}}</el-checkbox>
			  </el-checkbox-group>-->
	
			<!--<div>
                <span>用户名：</span>
                <el-input style="width:134px" v-model="userName"></el-input>
            </div>
            
            <div>
                <span>订单状态：</span>
                <el-input style="width:134px" v-model="state"></el-input>
            </div>-->		  
			<el-button type="primary"  @click="queryClick">搜索</el-button>  
        </div>

        <div class="table"> 
            <el-table
                v-loading="loading"
                :data="orderLists"
                style="width: 100%"
                border>
                
                <el-table-column
                    prop="id"
                    show-overflow-tooltip
                    label="序号"
                    align="center"
                    >
                </el-table-column>

                <el-table-column
                    prop="orderNumber"
                    show-overflow-tooltip
                    label="订单号"
                    align="center"
                    >
                </el-table-column>
                
                <el-table-column
                    prop="activityId"
                    show-overflow-tooltip
                    label="活动ID"
                    align="center"
                    >
                </el-table-column>
                
                <el-table-column
                    prop="orderAmount"
                    show-overflow-tooltip
                    label="订单金额"
                    align="center"
                    >
                </el-table-column>
         
                <!--<el-table-column
                    prop="paymentAmount"
                    show-overflow-tooltip
                    label="支付金额"
                    align="center"
                   >
                </el-table-column>
                
                <el-table-column
                    prop="paymentMethod"
                    show-overflow-tooltip
                    label="支付方式"
                    align="center"
                   >
                </el-table-column>
               
                <el-table-column
                    prop="payTime"
                    show-overflow-tooltip
                    label="支付时间"
                    align="center"
                   >
                </el-table-column>-->
                              
                <el-table-column
                    prop="orderStatus"
                    show-overflow-tooltip
                    label="订单状态"
                    align="center"
                    :formatter='formatOrderStatus'
                    width="120">
                </el-table-column>
                
                <el-table-column
                    prop="collectFees"
                    show-overflow-tooltip
                    label="收费状态"
                    :formatter='formatCollectFees'
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
//      	checkVal: [''],
//      	checkList: ['热门活动', '周周活动', '免费活动', '付费活动'],
            orderOptions:[
                {
		          value: '1',
		          label: '热门活动'
		        },
		        {
		          value: '0',
		          label: '周周活动'
		        }
            ],
            value:'',
            
            orderOptions1:[
                {
		          value1: '1',
		          label: '免费活动'
		        },
		        {
		          value1: '0',
		          label: '付费活动'
		        }
            ],
            value1:'',
            
            orderOptions2:[
                {
		          value2: '1',
		          label: '已支付'
		        },
		        {
		          value2: '2',
		          label: '待支付'
		        },
		            {
		          value2: '3',
		          label: '已超时'
		        },
		            {
		          value2: '4',
		          label: '已取消'
		        }
            ],
            value2:'',
            
            
            
            orderLists:[],
            pageNumber:'1', 
            pageSize:10,
            
//          userName:'',
//          state:'',
            
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

			//获取订单列表
            this.$http.get('/api/activityPayOrder/activityPayOrderList',{params,		        
	            	headers:{                   
//	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	            	this.orderLists=[];
//	            	this.orderLists=res.data.resp.record;
	            	res.data.resp.record.forEach((currentValue)=>{	            		
	            		if(currentValue.activityPayOrder){
	            			this.orderLists.push(currentValue.activityPayOrder);	            		
	            		}
	            		
	            	})
	            	console.log(this.orderLists)
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
       },
       
        
    	formatOrderStatus(row, column) {
    		let status = row.orderStatus; 
    	 	switch(status){	
			     case '1':
			       return   '已支付'
			     break;
			     case '2':
			       return   '待支付'
			     break;
			     case '3':
			       return   '已超时'
			     break;
			     case '4':
			       return   '已取消'
			     break;

			     default:
	             break;
		   	}

    	},
    	formatCollectFees(row,column){
    		let collect =row.collectFees;
    		switch(collect){	
			     case '0':
			       return   '免费'
			     break;
			     case '1':
			       return   '收费'
			     break;
			     default:
	             break;
		   	}
    	},
    	
    	queryClick() {//点击查询按钮时	        	
            console.log(this.value);
            let params={
                    collectFees:this.value1,
                    orderStatus:this.value2,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                 
            }
            console.log(params);
            this.$http.get('/api/activityPayOrder/activityPayOrderList',{params,
            	headers:{
                     'token' :this.token
                }

            }).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data.resp.record.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
	                this.orderLists=[];
                    res.data.resp.record.forEach((currentValue)=>{	            		
	            		if(currentValue.activityPayOrder){	            			
	            			this.orderLists.push(currentValue.activityPayOrder);	            		
	            		}
	            		
	            	})
                    
                   
                }else{
                	this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
	                this.orderLists=[];
                    res.data.resp.record.forEach((currentValue)=>{	            		
	            		if(currentValue.activityPayOrder){
	            			
	            			this.orderLists.push(currentValue.activityPayOrder);	            		
	            		}
	            		
	            	})
                    
                }
            }).catch( () => {
                this.loading = false;
            });
            
        },


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

