<template>
    <div class="table-box">
        <!-- <div class="fuzzy">
             <el-button type="primary"  @click="onAddWindow('addorganization')">新增机构</el-button>
        </div> -->
        <div class="container">
            <main v-if="isShow">
                <div class="name" :title="orgObj.name">
                    当前机构名称：{{ orgObj.name }}
                </div>
                <div class="btn-box">
                    <!-- <el-button type="danger" plain @click="openDelete(orgObj.id, orgObj.appId)">删除</el-button>
                    <el-button type="primary" plain @click="openOrgWindow('amendorg', orgObj.id, orgObj.appId)">修改</el-button> -->
                    <el-button type="info" plain @click="openOrgWindow('userallot', orgObj.id, orgObj.appId)">分配用户</el-button>
                </div>
            </main>
            <span v-if="!isShow">暂未选择机构</span>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';

export default {
    name:'OrganizationTable',
    props:['orgObj'],
    data () {
        return{
            isShow:true, //控制是否有数据提示。
        }
    },
    watch:{
        orgObj:{//控制是否有数据提示。
            immediate:true,
            handler (val) {
                if(!val.name){
                    this.isShow = false;
                }else{
                    this.isShow = true;
                }
            }
        }
    },
    created () {
        Bus.$on('deleteOrg', this.deleteOrg);
    },
    beforeDestroy () {
        Bus.$off('deleteOrg');
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        onAddWindow (type) {
            Bus.$emit('onUserWindow',type);
        },
        openOrgWindow (type, id, appId) {
            Bus.$emit('onUserWindow',type);
            if(id){
                this.CHANGE_ID(id);
            };
            if(appId){
                this.CHANGE_APPID(appId);
            };
        },
        openDelete ( orgId, appId ) {//打开删除窗口
            MessageBox.confirm('是删除当前机构, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteOrg(orgId, appId);
            }).catch( () => {});
        },
        deleteOrg (orgId, appId) {//删除当前机构
            this.$http.delete(`/api/tenant/organizations/${orgId}/`,{
                params:{
                    appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                if(res.data){
                    Bus.$emit('offUserWindow','deleteorg');
                    Bus.$emit('busGetOrgLists', appId);
                    this.isShow = false;
                    Message({
                        message:'删除机构成功',
                        duration:1500,
                        type:'success'
                    });
                }else{
                    Message({
                        message:'删除机构失败',
                        duration:1500,
                        type:'error'
                    });
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .table-box{
        width: 100%;
        height:100%;
        padding: 0 0 0 300px;

        .fuzzy{
            width: 100%;
            min-width: 400px;
            height: 50px;
            display: flex;
            align-items: center;
            padding-left: 20px;
        }

        .container{
            width: 100%;
            height: 100%;
            min-width: 520px;
            line-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            main{
                width: 500px;
                height: 180px;
                box-shadow: 0 0 10px #ccc;

                .name{
                    padding: 0 20px;
                    height: 80px;
                    line-height: 80px;
                    font-size: 18px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    border-bottom: 1px solid #ccc;
                    background:#409EFF;
                    color: #fff;
                }
                .btn-box{
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                }
            }
        }
    }
</style>
