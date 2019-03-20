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
                :data="userLists"
                style="width: 100%"
                border>

                <el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="序号"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="用户名"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="活动名称"
                    align="center"
                    width="120">
                </el-table-column>
         
                <el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="支付金额"
                    align="center"
                   >
                </el-table-column>
                <el-table-column
                    prop=""
                    show-overflow-tooltip
                    label="订单状态"
                    align="center"
                    width="120">
                </el-table-column>
               
		        <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click="examine(scope.row.userId,scope.row.account,scope.row.userName,scope.row.email,scope.row.mobile,scope.row.createTime)">查看</el-button>                      
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
        	dateVal:'',
            userName:'',
            state:'',
            
            userLists:[],
            pageNumber:'1', 
            pageSize:10,
            account:null,
            userName:null,
            email:null,
            mobile:null,
            
            total:null,//页数
            pages:'',
            show:false,
//          userId:null,
//          createTime:null,
//          state:null,
            
            isFuzzy:false,
            paramsRealName:null,
            paramsUserName:null,
            paramsEmail:null,
            paramsPhone:null,
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
//      this.initLists();//获取初始数据
//      Bus.$on('busGetUserLists', this.getUserLists);//刷新页面
    },
    beforeDestroy () {
//      Bus.$off('busGetUserLists')
    },
    methods:{
        //查看订单详情        
        examine(id){	
	       this.$router.push({
		        name: 'orderDetail',
		        params: {
		           bidId:id 
			    }
		    })
	    }, 
        initLists () {
            this.loading = true;
            //获取用户列表
            
            this.$http.get('/api/tblMsUser',{
            	params:{
	                pageSize:10,
	                pageNumber:this.pageNumber
           		}
            	,headers:{                   
                     'token' :this.token
                }
           		
            	}).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data.resp.records.length === 0){


                }else{
                    this.userLists = res.data.resp.records;
                    this.total=res.data.resp.total;
                    this.pages=res.data.resp.pages;  
                	this.pages>1?this.show=true:this.show=false;                
                    
                }
            });
         
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
        getUserLists (type) {
            if(!this.isFuzzy){
                this.initLists();
            }else{
                this.fuzzyLists(type);
            }
        },
        onUserWindow (id,type) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){ //如果需要用到用户数据
               this.CHANGE_ID(id);
            }
        },
        nextUserList () {//下一页数据
            if(this.noMore){
                Message({
                    message:'没有更多数据了',
                    duration:1500,
                    type:'warning'
                });
                return false;
            }else{
                this.pageNumber += 1;
                this.getUserLists('next');
            }
        },
        topUserList () {//上一页数据
            if( this.pageNumber === 1 ){
                Message({
                    message:'已经是第一页了',
                    duration:1500,
                    type:'warning'
                })
                return false;
            }else{
                //没有更多开关
                this.noMore = false;
                this.pageNumber -= 1;
                this.getUserLists();
            }
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        vagueHandler (type) {
            //模糊查询方法
            let { paramsRealName, paramsUserName, paramsPhone, paramsEmail,  pageNumber } = this;
            this.$http.get('/api/tblMsUser/tblMsUserList',{params:{
                pageSize:10,
                pageNumber, 
                realName:paramsRealName, 
                userName:paramsUserName, 
                phone:paramsPhone, 
                email:paramsEmail
            }}).then( (res) => {
                if(res.data.resp.length === 0){
                    if(type === 'vague'){
                        Message({
                            message:'没有更多数据了',
                            duration:1500,
                            type:'warning'
                        });
                        this.userLists = res.data.resp;
                    }else if(type === 'next'){
                        Message({
                            message:'没有更多数据了',
                            duration:1500,
                            type:'warning'
                        });
                        //没有更多开关
                        this.noMore = true;
                        //还原上页
                        if(this.pageNumber > 1){
                            this.pageNumber -= 1;
                        };
                        return false; 
                    }else{
                        //删除更新数据逻辑
                        if(this.pageNumber >1){
                            this.pageNumber -= 1;
                            //返回显示上一页的数据
                            this.$http.get('/api/tblMsUser/tblMsUserList',{params:{
                                pageSize:10,
                                pageNumber:this.pageNumber, 
                                realName:paramsRealName, 
                                userName:paramsUserName, 
                                phone:paramsPhone, 
                                email:paramsEmail
                            }}).then( (res) => {
                                this.userLists = res.data.resp;
                            })
                        }else{
                            this.userLists = res.data.resp;
                        }
                    }  
               }else{
                   this.noMore = false;//还原开关
                   this.userLists = res.data.resp;
               }
            })
        },
        fuzzyClick () {//点击查询按钮时
            let {realName, userName, email, phone} = this;
            console.log(this.$md('{}'))
            this.paramsRealName = realName;
            this.paramsUserName = userName;
            this.paramsEmail = email;
            this.paramsPhone = phone;
            this.loading = true;
            this.pageNumber = 1
			this.isFuzzy = true;
            this.$http.get('/api/tblMsUser/tblMsUserList',{params:{
                pageSize: this.pageSize,
                pageNumber: this.pageNumber, 
                realName: this.paramsRealName, 
                userName: this.paramsUserName, 
                phone: this.paramsPhone, 
                email: this.paramsEmail
            }}).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有数据',
                        duration:1500,
                        type:'warning'
                    });
                    this.userLists = res.data.resp;
                }else{
                    this.userLists = res.data.resp;
                }
            })
		},
		fuzzyLists (type) {//模糊查询数据
            this.loading = true;
			let { pageNumber, pageSize } = this;
            this.$http.get('/api/tblMsUser/tblMsUserList',{
                params: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber, 
                    realName: this.paramsRealName, 
                    userName: this.paramsUserName, 
                    phone: this.paramsPhone, 
                    email: this.paramsEmail
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
							this.pageNumber -= 1;
                            this.$http.get('/api/tblMsUser/tblMsUserList',{
                                params: {
                                    pageSize: this.pageSize,
                                    pageNumber: this.pageNumber, 
                                    realName: this.paramsRealName, 
                                    userName: this.paramsUserName, 
                                    phone: this.paramsPhone, 
                                    email: this.paramsEmail
                                }
                            }).then( res => {
                                this.userLists = res.data.resp;
                            })
                        }else{
                            this.userLists = res.data.resp;
                        }
                    }else if(type == 'next'){
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber--;
                        }
                    }
                }else{
                    this.userLists = res.data.resp;
                }
            });
		},
        openDelete ( userId ) {//打开删除窗口
            MessageBox.confirm('是否删除当前用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteUser(userId);
            }).catch( () => {});
        }
//      deleteUser (userId) {
//          this.$http.delete('/api/users/'+userId+'/').then((res)=>{
//              if(res.data.success){//删除成功
//                  Message({
//                      message:'删除成功',
//                      duration:1500,
//                      type:'success'
//                  });
//                 this.getUserLists('delete');//重新渲染数据列表页面
//              }else{//删除失败
//                  Message({
//                      message:'删除失败',
//                      duration:1500,
//                      type:'error'
//                  });
//              }
//          });          
//      }
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

