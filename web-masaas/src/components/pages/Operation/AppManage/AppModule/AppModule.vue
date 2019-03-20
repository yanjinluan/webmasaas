<template>
    <div class="organization-box">
        <div class="container" ref="organizationBox">
            <div class="add-box">
                <header>
                    选择应用：
                    <el-select 
                        v-model="applicationId"
                        placeholder="请选择"
                        style="width:100px">
                        <el-option
                            v-for="item in appLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;
                    <el-button @click="fuzzyClick(applicationId)">查询</el-button>
                </header>
                <module-list
                    :moduleLists="moduleLists"
                    :getModuleObj="getModuleObj"
                ></module-list>
            </div>
            <div class="operation-box">
                <module-obj
                    :moduleObj="moduleObj"
                ></module-obj>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import ModuleList from './ModuleList';
import ModuleObj from './ModuleObj';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
    name:'AppModule',
    data () {
        return {
            applicationId:'',
            moduleLists:[],
            moduleObj:{},
            appLists:[]
        }
    },
    created () {
        this.getApp();
        Bus.$on('busGetmoduleLists', this.getModuleLists);
    },
    mounted () {
        let height = document.documentElement.clientHeight - 130 - 60;
        this.$refs.organizationBox.style.height = height + 'px'
    },
    beforeDestroy () {
        Bus.$off('busGetmoduleLists');
    },
    components:{
        ModuleList, ModuleObj
    },
    computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		})
	},
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        getModuleObj (Id, appId) {//点击列表获取当前点击模块信息
            this.$http.get(`/api/application/modules/${Id}/?applicationId=${appId}`, {
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.moduleObj = res.data.resp;
            });
        },
        fuzzyClick (appId) {
            this.moduleObj = {};
            this.getModuleLists(appId);
        },
        getModuleLists (appId) {//获取模块
            if (!appId) {
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.$http.get('/api/application/modules/',{
                params:{
                    applicationId: appId,
                    time: new Date().getTime()
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then ( res => {
                this.moduleLists = res.data.resp;
                if ( this.moduleLists.length ===0 ) {
                    Message({
                        message:'没有模块',
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
    .organization-box{
        width: 100%;
        padding-top: 60px;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-align-items: center;
        -ms-align-items: center;
        -moz-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        -ms-justify-content: center;
        -moz-justify-content: center;
        justify-content: center;

        .container{
            width: 900px;
            border: 1px solid #ccc;

            .add-box{
                float: left;
                width: 300px;
                height: 100%;
                border-right: 1px solid #ccc;
                background: #fff;
                position: relative;
                z-index: 2;
                header{
                    position: absolute;
                    width: 100%;
                    top: 0;
                    height: 50px;
                    padding-left: 20px;
                    background: #fff;
                    border-bottom: 1px solid #ccc;
                    display: -webkit-flex;
                    display: -moz-flex;
                    display: -ms-flex;
                    display: flex;
                    -webkit-align-items: center;
                    -ms-align-items: center;
                    -moz-align-items: center;
                    align-items: center;
                    background: #409EFF;
                    color: #fff;
                }
            }

            .operation-box{
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 1;
            }
        }
    }
</style>
