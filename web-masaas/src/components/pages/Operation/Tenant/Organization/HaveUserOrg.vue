<template>
    <div class="have-user-role">
        <header>
            <h2>{{ orgObj.name }}下的用户列表</h2>
            <div class="off" @click="changeIsShow(false)">
               <i class="fa fa-close"></i>
            </div>
        </header>
        <div class="user-box" v-loading="loading">
            <div class="app-box">
                <span>账号：</span>
                <el-input style="width:100px" v-model="userName"></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>邮箱：</span>
                <el-input style="width:100px" v-model="email"></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>手机：</span>
                <el-input style="width:100px" v-model="phone"></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>姓名：</span>
                <el-input style="width:100px" v-model="realName"></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="primary" @click="fuzzyUser">查询</el-button>
            </div>
            <div class='table'>
                <el-table
                    :data="userLists"
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="realName"
                        label="用户名"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        show-overflow-tooltip
                        label="账号"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱"
                        show-overflow-tooltip
                        align="center">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import {  MessageBox } from 'element-ui';

export default {
    name:'HaveUserRole',
    props:['changeIsShow','orgObj'],
    data () {
        return{
            userLists:[],
            userId:'',
            realName:'',
            userName:'',
            email:'',
            phone:'',
            loading:true
        }
    },
    created () {
        //获取角色的用户列表
        this.getUsers();
    },
    methods:{
        getUsers () {
            //获取角色的用户列表
            this.$http.get(`/api/tenant/organizations/${this.orgObj.id}/users/`, {
                params:{
                    time:new Date().getTime(),
                    appId: this.orgObj.appId
                },
                headers:{
                    'Operate-Application-Id': this.orgObj.appId
                }
            }).then( res => {
                this.loading = false;
                this.userLists = res.data.resp;
            })
        },
        offDelete () {//关闭删除窗口
            this.isDeleteShow = false;
        },
        openDelete ( userId ) {//打开删除窗口
            this.userId = userId;
            MessageBox.confirm('是否在当前机构下删除此用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRoleUser();
            }).catch( () => {});
        },
        deleteRoleUser () {
            //删除机构下的用户
            this.$http.delete(`/api/tenant/organizations/${this.orgObj.id}/users/${this.userId}/`, {
                params:{
                    appId: this.orgObj.appId
                },
                headers:{
                    'Operate-Application-Id': this.orgObj.appId
                }
            }).then( res => {
                if(res.data){
                    //删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    //刷新列表
                    this.getUsers();
                    return false;
                }
                //删除失败
                Message({
                    message:'删除失败',
                    duration:1500,
                    type:'error'
                });
            })
        },
        fuzzyUser () {
            //模糊查询方法
            let { realName, userName, phone, email } = this;
            this.$http.get(`/api/tenant/organizations/${this.orgObj.id}/users/`,{
                params:{
                    realName:realName?realName:null,
                    userName:userName?userName:null, 
                    phone:phone?phone:null,
                    email:email?email:null,
                    appId: this.orgObj.appId
                },
                headers:{
                    'Operate-Application-Id': this.orgObj.appId
                }
            }).then( res => {
                this.userLists = res.data.resp;
                if(this.userLists.length === 0) {
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .have-user-role{
        width: 760px;
        height: 560px;
        background: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 7;
        header{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .user-box{
            height: 510px;
            overflow-y: auto;
            .app-box{
                margin: 16px auto;
                height:56px;
                display: -webkit-flex;
                display: -moz-flex;
                display: -ms-flex;
                display: flex;
                -webkit-align-items: center;
                -moz-align-items: center;
                -ms-align-items: center;
                align-items: center;
                justify-content: space-around;
            }

            .table{
                border-collapse:collapse;
            }
        }
    }
</style>
