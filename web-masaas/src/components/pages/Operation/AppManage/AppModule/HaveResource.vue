<template>
    <div class="have-user-role">
        <header>
            <h2>{{ moduleObj.name }}模块下的资源列表</h2>
            <div class="off" @click="changeIsShow(false)">
               <i class="fa fa-close"></i>
            </div>
        </header>
        <div class="user-box" v-loading="loading">
            <div class='table'>
                <el-table
                    :data="resourceLists"
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
                        prop="resource.name"
                        label="资源名称"
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
    props:['changeIsShow', 'moduleObj'],
    data () {
        return{
            resourceLists:[],
            loading:true
        }
    },
    created () {
        this.getResource();
    },
    methods:{
        getResource () {
            this.$http.get(`/api/application/mrmap/`,{
                params:{
                    time:new Date().getTime(),
                    applicationId:this.moduleObj.appId,
                    moduleId:this.moduleObj.id
                },
                headers:{
                    'Operate-Application-Id': this.moduleObj.appId
                }
            }).then( res => {
                this.loading = false;
                this.resourceLists = res.data.resp;
            })
        },
        openDelete ( Id ) {
            MessageBox.confirm('是否删当前资源, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteResource(Id);
            }).catch( () => {});
        },
        deleteResource (Id) {
            this.$http.delete(`/api/application/mrmap/${Id}/`, {
                params:{
                    applicationId:this.moduleObj.appId
                },
                headers:{
                    'Operate-Application-Id': this.moduleObj.appId
                }
            }).then( (res) => {
                if(res.data){
                    //删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    //刷新列表
                    this. getResource();
                    return false;
                }else{
                    Message({
                        message:'删除失败',
                        duration:'1200',
                        type:'error'
                    })
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
