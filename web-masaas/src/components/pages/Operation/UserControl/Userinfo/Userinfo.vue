<template>
    <div class="user-box">
        <div class="app-box">
            <el-button type="primary" class="add" @click="onUserWindow('','adduser')">新增</el-button>
        </div>
        <div class="app-box">
            <div>
                <span>账号：</span>
                <el-input style="width:134px" v-model="userName"></el-input>
            </div>
            <div>
                <span>邮箱：</span>
                <el-input style="width:134px" v-model="email"></el-input>
            </div>
            <div>
                <span>手机：</span>
                <el-input style="width:134px" v-model="phone"></el-input>
            </div>
            <div>
                <span>姓名：</span>
                <el-input style="width:134px" v-model="realName"></el-input>
            </div>
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                v-loading="loading"
                :data="userLists"
                style="width: 100%"
                border
            >
                <el-table-column
                    label="序号"
                    type="index"
                    :index="indexMethod"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="realName"
                    show-overflow-tooltip
                    label="姓名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    show-overflow-tooltip
                    label="账号"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="email"
                    show-overflow-tooltip
                    label="邮箱"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    show-overflow-tooltip
                    label="手机"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="260"
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain @click="onUserWindow(scope.row.id, 'amenduser')">修改</el-button>
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id)">删除</el-button>
                        <el-button size='mini' type="warning" plain @click="onUserWindow(scope.row.id, 'examineuser')">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="userLists"
            :initLists="initLists"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :fuzzyLists="fuzzyLists"
            :isFuzzy="isFuzzy"
        ></paging>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapMutations } from 'vuex';
import { CHANGE_ID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';
import Vue from 'vue'
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'User',
    data() {
        return {
            userLists:[],
            pageNumber:1, 
            pageSize:10,
            realName:null,
            userName:null,
            email:null,
            phone:null,
            isFuzzy:false,
            paramsRealName:null,
            paramsUserName:null,
            paramsEmail:null,
            paramsPhone:null,
            loading:true
        }
    },
    components:{
        Paging
    },
    created () { //获取列表
        this.initLists();//获取初始数据
        Bus.$on('busGetUserLists', this.getUserLists);//刷新页面
    },
    beforeDestroy () {
        Bus.$off('busGetUserLists')
    },
    methods:{
        ...mapMutations([CHANGE_ID]),
        initLists (type) {
            this.loading = true;
            //获取用户列表
            this.$http.get('/api/users/?time=' + new Date().getTime(),{params:{
                pageSize:10,
                pageNumber:this.pageNumber
            }}).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/users/',{
                                params:{
                                    time: new Date().getTime(),
                    				pageSize:10,
                    				pageNumber:this.pageNumber
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
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        getUserLists (type) {
            if(!this.isFuzzy){
                this.initLists(type);
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
            this.$http.get('/api/users/',{params:{
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
                            this.$http.get('/api/users/?time=' + new Date().getTime(),{params:{
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
            this.$http.get('/api/users/',{params:{
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
            this.$http.get('/api/users/',{
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
                            this.$http.get('/api/users/',{
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
        },
        deleteUser (userId) {
            this.$http.delete('/api/users/'+userId+'/').then((res)=>{
                if(res.data.success){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                   this.getUserLists('delete');//重新渲染数据列表页面
                }else{//删除失败
                    Message({
                        message:'删除失败',
                        duration:1500,
                        type:'error'
                    });
                }
            });          
        }
    }
}
</script>

<style lang="scss" scoped>
    .user-box{
        width: 100%;
        height: 100%;
        .app-box{
            width: 80%;
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
            width: 80%;
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
    }
</style>

