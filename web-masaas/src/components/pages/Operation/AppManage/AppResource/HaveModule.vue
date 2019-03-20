<template>
    <div class="have-user-role">
        <header>
            <h2>{{ resourceObj.name }}资源下的模块列表</h2>
            <div class="off" @click="changeIsShow(false)">
               <i class="fa fa-close"></i>
            </div>
        </header>
        <div class="user-box" v-loading="loading">
            <div class='table'>
                <el-table
                    :data="moduleLists"
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
                        prop="module.name"
                        label="模块名称"
                        show-overflow-tooltip
                        align="center">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button size='mini' type="danger" plain @click="openDelete(scope.row.moduleResourceMapId)">删除</el-button>
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
    name:'HaveResource',
    props:['changeIsShow', 'resourceObj'],
    data () {
        return{
            moduleLists:[],
            loading:true
        }
    },
    created () {
        //获取角色的用户列表
        this.getModule();
    },
    methods:{
        getModule () {
            //获取模块列表
            this.$http.get(`/api/application/mrmap/`,{
                params:{
                    time:new Date().getTime(),
                    applicationId:this.resourceObj.appId,
                    resourceId:this.resourceObj.id
                },
                headers:{
                    'Operate-Application-Id': this.resourceObj.appId
                }
            }).then( res => {
                this.loading = false;
                this.moduleLists = res.data.resp;
            })
        },
        openDelete ( Id ) {//打开删除窗口
            MessageBox.confirm('是否删当前资源, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteModule(Id);
            }).catch( () => {});
        },
        deleteModule (Id) {
            //删除角色下的用户
            this.$http.delete(`/api/application/mrmap/${Id}/`, {
                params:{
                    applicationId:this.resourceObj.appId
                },
                headers:{
                    'Operate-Application-Id': this.resourceObj.appId
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
                    this. getModule();
                    return false;
                }
            })
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
                border-collapse:collapse;
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
