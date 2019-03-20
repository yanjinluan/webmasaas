<template>
    <div class="have-user-role">
        <header>
            <h2>{{ appObj.name }}应用下的管理员列表</h2>
            <div class="off" @click="changeIsShow(false)">
               <i class="fa fa-close"></i>
            </div>
        </header>
        <div class="user-box">
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
                        show-overflow-tooltip
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

export default {
    name:'HaveAppAdmin',
    props:['changeIsShow', 'appObj'],
    data () {
        return{
            userLists:[]
        }
    },
    created () {
        //获取角色的用户列表
        this.getUsers();
    },
    methods:{
        getUsers () {
            //获取角色的用户列表
            this.$http.get(`/api/platform/applications/${this.appObj.id}/administrators/`,{
                params:{
                    time:new Date().getTime()
                }
            }).then( (res) => {
                this.userLists = res.data.resp;
            })
        },
        openDelete ( userId ) {//打开删除窗口
            MessageBox.confirm('是否删当前管理员, 是否继续?', '删除管理员提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteAdmin(userId);
            }).catch( () => {});
        },
        deleteAdmin (userId) {
            //删除角色下的用户
            this.$http.delete(`/api/platform/applications/${this.appObj.id}/administrators/${userId}/`).then( (res) => {
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
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .have-user-role{
        width: 700px;
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
            overflow: auto;

            .no-user{
                text-align: center;
                height: 510px;
                line-height: 510px;
            }

            .table{
                width: 90%;
                border-collapse:collapse;
                margin: 10px auto;
                min-width: 500px;
                .user-list:hover{
                    background: #d5d5d5;
                }

                tr{
                    height: 36px;

                    .number{
                        width: 10%;
                    }

                    .name{
                        width: 25%;
                    }

                    .phone{
                        width: 25%;
                    }

                    .email{
                        width: 28%;
                    }

                    .operation{
                        width: 12%;
                    }

                    th,td{
                        border: 1px solid #ccc;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
