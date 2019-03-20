<template>
    <div class="table-box">
        <div class="fuzzy">
             <el-button type="primary"  @click="onModuleWindow('','addmodule')">新增模块</el-button>
        </div>
        <div class="container">
            <main v-if="isShow">
                <div class="name">
                    当前模块名称：{{mObj.name}}
                </div>
                <div class="btn-box">
                    <el-button type="danger" plain @click="openDelete(moduleObj.id, moduleObj.appId)">删除</el-button>
                    <el-button type="primary" plain @click="onModuleWindow(moduleObj.id, 'amendmodule', moduleObj.appId)">修改</el-button>
                    <el-button type="info" plain @click="onModuleWindow(moduleObj.id, 'moduleallot' ,moduleObj.appId)">分配</el-button>
                </div>
            </main>
            <span v-if="!isShow">暂未选择模块</span>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState, mapMutations } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';

export default {
    name:'ModuleObj',
    props:['moduleObj'],
    data () {
        return{
            mObj:{},
            isShow:true //控制是否有数据提示。
        }
    },
    created () {
        Bus.$on('busGetModuleObj', this.getModuleObj);
    },
    beforeDestroy () {
        Bus.$off('busGetModuleObj');
    },
    watch:{
        moduleObj:{//控制是否有数据提示。
            immediate:true,
            handler (val) {
                if(!val.name){
                    this.isShow = false;
                }else{
                    this.isShow = true;
                    this.getModuleObj();
                }
            }
        }
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        onModuleWindow (id, type, appId) { 
            Bus.$emit('onUserWindow',type);
            if(id){ 
               this.CHANGE_ID(id);
            };
            if(appId){ 
               this.CHANGE_APPID(appId);
            };
        },
        getModuleObj () {
            this.$http.get(`/api/application/modules/${this.moduleObj.id}/?applicationId=${this.moduleObj.appId}`, {
                headers:{
                    'Operate-Application-Id': this.moduleObj.appId
                }
            }).then( res => {
                this.mObj = res.data.resp;
            });
        },
        openDelete (moduleId, appId) {
            MessageBox.confirm('是否删除当前模块, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteModule(moduleId, appId);
            }).catch( () => {});
        },
        deleteModule (moduleId, appId) {
            this.$http.delete(`/api/application/modules/${moduleId}/?applicationId=${appId}`, {
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then(res =>{
                if(res.data.success){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    Bus.$emit('busGetmoduleLists', this.moduleObj.appId);
                    this.isShow = false;
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
