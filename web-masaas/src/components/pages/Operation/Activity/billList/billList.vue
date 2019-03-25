<template>
    <div class="user-box">
        <div class="app-box">			  	
			<div>
                <span>用户名：</span>
                <el-input style="width:134px" v-model="userName"></el-input>
            </div>
            
            <div>
                <span>联系方式：</span>
                <el-input style="width:134px" v-model="state"></el-input>
            </div>
		  
			  <el-button type="primary"  @click="">搜索</el-button>  
        </div>
        <div class="table"> 
            <el-table
                v-loading="loading"
                :data="billList"
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
                    prop="activityId"
                    show-overflow-tooltip
                    label="活动ID"
                    align="center"
                    >
                </el-table-column>
                <el-table-column
                    prop="voucherIdentifier"
                    show-overflow-tooltip
                    label="票据编号"
                    align="center"
                    >
                </el-table-column>
         
                <el-table-column
                    prop="voucherState"
                    show-overflow-tooltip
                    label="票据状态"
                    :formatter='formatstate'
                    align="center"
                   >
                </el-table-column>
                <!--<el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="订单状态"
                    align="center"
                    width="120">
                </el-table-column>-->
               
		        <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click="examine(scope.row.id)">查看</el-button>                      
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <!--<el-button size='mini' type="warning" plain @click="examine(1)">查看</el-button>-->   
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


export default {
    name:'billList',
    data() {
        return {
            billList:[],
            pageNumber:'1', 
            pageSize:10,
            account:null,
            userName:null,
            state:null,
            email:null,
            mobile:null,
            
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
    
    created () {//获取列表
    	this.getApp();
    },
    beforeDestroy () {
        Bus.$off('busGetUserLists')
    },
    methods:{
    	//活动类型转换
    	formatstate(row, column) {
    		let type = row.voucherState; 
    		return type=='0'?'未使用':'已使用'

    	},
  
    	//查看票据详情        
        examine(id){	
	       this.$router.push({
		        name: 'billDetail',
		        params: {
		           bidId:id 
			    }
		    })
	    }, 
                
        getApp () { //获取票据列表      	
//          this.loading = true;
            let params={
        	  	pageSize:10,
	          	pageNumber:this.pageNumber
	        };
            this.$http.get('/api/activityVoucher/activityVoucherList',{params,
            	headers:{
                     'token' :this.token
                }
           		
            	}).then( res => {
//              	this.loading = false;
                	console.log(res.data);
                    this.billList = res.data.resp.records;
                    this.total=res.data.resp.total;
                    this.pages=res.data.resp.pages;  
                	this.pages>1?this.show=true:this.show=false;                
                                 
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

