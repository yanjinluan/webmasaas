<template>
    <div class="have-user-role">
        <header>
            <h2>{{ role.name }}角色下的用户列表</h2>
            <div class="off" @click="changeIsShow(false)">
               <i class="fa fa-close"></i>
            </div>
        </header>
        <div class="user-box">
            <div class="app-box">
                &nbsp;&nbsp;
                <span>账号：</span>
                <el-input style="width:100px" v-model="userName"></el-input>
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
                    v-loading="loading"
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
                        show-overflow-tooltip
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
import { Message, MessageBox } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'HaveUserRole',
    props:['changeIsShow', 'role'],
    data () {
        return{
            loading:true,
            userLists:[],
            isDeleteShow: false,
            userId:'',
            realName:'',
            userName:''
        }
    },
    created () {
        //获取角色的用户列表
        this.getUsers();
    },
    methods:{
        getUsers () {
            //获取角色的用户列表
            this.$http.get(`/api/tenant/roles/${this.role.id}/users/`, {
                params:{
                    time:new Date().getTime(),
                    appId: this.role.appId
                },
                headers:{
                    'Operate-Application-Id': this.role.appId
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
            MessageBox.confirm('是否删除此用户当前角色, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRoleUser(userId);
            }).catch( () => {});
        },
        deleteRoleUser (userId) {
            //删除角色下的用户
            this.$http.delete(`/api/tenant/roles/${this.role.id}/users/${userId}/`, {
                params:{
                    appId: this.role.appId
                },
                headers:{
                    'Operate-Application-Id': this.role.appId
                }
            }).then( res => {
                if(res.data.success){
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
            });
        },
        fuzzyUser () {
            this.userLists = [];
            this.loading = true;
            //模糊查询方法
            let { realName, userName } = this;
            this.$http.get(`/api/tenant/roles/${this.role.id}/users/`,{
                params:{
                    realName, userName,
                    appId: this.role.appId
                },
                headers:{
                    'Operate-Application-Id': this.role.appId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0) {
                    Message({
                        message:'没有更多数据了',
                        duration:1500,
                        type:'warning'
                    });
                }
                this.userLists = res.data.resp;
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
            overflow-x: hidden;

            .app-box{
                width: 760px;
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
            }

            .table{
                width: 760px;
                border-collapse:collapse;
                margin: 0 auto;
            }
        }
    }
</style>
