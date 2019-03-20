<template>
    <div class="org-box">
        <div class="org-head">
            <h3>当前用户隶属机构</h3>
            <div class="off" @click="offOrg">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="org-table">
            <el-table
                :data="orgLists"
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
                    prop="name"
                    label="机构名称"
                    show-overflow-tooltip
                    align="center"
                    width="270">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id)">解除关系</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';
import {  MessageBox } from 'element-ui';

export default {
    name:'ToOrg',
    data () {
        return{
            orgLists:[]
        }
    },
    computed:{
        ...mapState({
            userId:(state) => {//拿到所需的用户ID
                return state.getId.id;
            },
            appId: (state) => {
                return state.getId.appId;
            }
        })
    },
    created () {
        //获取隶属机构列表
        this.getOrg();
    },
    methods:{
        offOrg () {
            Bus.$emit('offUserWindow','toorg');
        },
        getOrg () {
            //获取隶属机构列表
            this.$http.get(`/api/tenant/users/${this.userId}/organizations/`, {
                params:{
                    time: new Date().getTime(),
                    appId: this.appId
                },
                headers:{
                    'Operate-Application-Id': this.appId
                }
            }).then( res => {
                this.orgLists = res.data.resp;
            })
        },
        openDelete ( orgObj ) {//打开删除窗口
            MessageBox.confirm('是否解除当前用户与此机构的关系, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteOrg (orgObj)
            }).catch( () => {});
        },
        deleteOrg (orgObj) {
            //删除机构下的用户
            this.$http.delete(`/api/tenant/organizations/${orgObj}/users/${this.userId}/`,{
                params:{
                    appId: this.appId
                },
                headers:{
                    'Operate-Application-Id': this.appId
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
                    this.getOrg();
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
    .org-box{
        position: absolute;
        width: 560px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
         -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .org-head{
            h3{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
        .org-table{
            width: 520px;
            margin: 20px auto;
            height: 400px;
            overflow: auto;
        }
    }
</style>

