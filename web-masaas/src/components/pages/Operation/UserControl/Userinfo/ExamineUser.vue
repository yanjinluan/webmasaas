<template>
    <div class="examine-user-box">
        <div class="examine-user-head">
            <h2>{{user.realName}}用户角色信息</h2>
            <div class="off" @click="offExamineUser">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <!--<div class="table-box">
            <div class="app-box">
                <div class="app">
                    <span>选择应用:</span>
                    <el-select 
                        v-model="app" 
                        clearable
                        placeholder="请选择" 
                        style="width:120px">
                        <el-option
                            v-for="item in appLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="time">
                    <span>选择时间:</span>
                    <el-date-picker
                        v-model="time"
                        value-format="timestamp"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>-->
            <!--<div class="app-box">
                <div class="app">
                    <span>选择操作:</span>
                    <el-select 
                        v-model="operation" 
                        clearable
                        placeholder="请选择" 
                        style="width:120px">
                        <el-option
                            v-for="item in operationLists"
                            :key="item.value"
                            :label="item.label"
                            :value="item.type">
                            <span>{{ item.label }}</span>
                        </el-option>
                    </el-select>
                </div><div class="time">
                    <span>选择资源:</span>
                    <el-select 
                        v-model="resource" 
                        placeholder="请选择" 
                        clearable
                        style="width:200px">
                        <el-option
                            v-for="item in resourceLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="fuzzyClick">查询</el-button>
                    <el-button type="primary" @click="educe">导出</el-button>
                </div>
            </div>-->
            <el-table
                :data="logs"
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
                    align="center"
                    label="应用"
                    show-overflow-tooltip
                    prop="appName">
                </el-table-column>
                <el-table-column
                    prop="tenantName"
                    show-overflow-tooltip
                    label="租户名称"
                    :formatter="newTenantName"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    show-overflow-tooltip
                    label="用户名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="realName"
                    show-overflow-tooltip
                    label="姓名"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="资源"
                    show-overflow-tooltip
                    prop="resourceName">
                </el-table-column>
                <el-table-column
                    prop="requestTime"
                    show-overflow-tooltip
                    label="时间"
                    :formatter="newTime"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="email"
                    show-overflow-tooltip
                    label="邮箱"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    :formatter="newOperation"
                    show-overflow-tooltip
                    prop="operation">
                </el-table-column>
            </el-table>
            <paging
                :lists="logs"
                :pageNumber="pageNumber"
                :pageNumberAdd="pageNumberAdd"
                :pageNumberJian="pageNumberJian"
                :initLists="initLists"
                :fuzzyLists="fuzzyLists"
                :isFuzzy="isFuzzy"
            ></paging>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import Bus from '@/modules/bus';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'ExamineUser',
    data () {
        return {
            pageNumber:1,
            pageSize:10,
            appLists: [],
            app: '',
            fuzzyApp:'',
            resourceLists:[],
            resource:'',
            fuzzResource:'',
            operationLists:[
                {label:'查看', type:'GET'},
                {label:'新增', type:'POST'},
                {label:'删除', type:'DELETE'},
                {label:'修改', type:'PUT'}
            ],
            operation:'',
            fuzzyOperation:'',
            time:[],
            fuzzyTime:'',
            logs:[],
            user:{},
            isFuzzy:false
        }
    },
    computed:{
        ...mapState({
            userId:(state) => {
                return state.getId.id;
            },
            applicationId (state) {
				return state.appId.applicationId;
            },
            emailId (state) {
                return state.other.userInfo.id
            }
        })
    },
    created () {
        this.getUser();
        this.getAppLists();
        this.initLists();
    },
    watch:{
        app (val) {
            if (!val) {
                this.resource = '';
                this.resourceLists=[];
                return;
            }
            this.resource = '';
            this.getResourceLists(val)
        }
    },
    components:{
        Paging
    },
    methods:{
        offExamineUser () {
            Bus.$emit('offUserWindow','examineuser');
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        initLists () {
            let { pageNumber, pageSize } = this;
            //获取操作列表
            this.$http.get(`/api/users/${this.userId}/logs/`,{
                params:{
                    pageNumber,
                    pageSize,
                }
            }).then( res => {
                if(res.data.resp.length === 0){//当查到数据是0条的时候
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    if(this.pageNumber>1){//还原到上页数据
                        this.pageNumber--;
                    }
                }else{
                    this.logs = res.data.resp;
                }
            })
        },
        getUser () {
            this.$http.get(`/api/users/${this.userId}/`).then( res => {
                this.user = res.data.resp;
            })
        },
        fuzzyClick () {//点击查询按钮
            this.pageNumber = 1;
            let { time, resource, app, operation} = this;
            this.isFuzzy = true;
            this.fuzzyTime = time?time:[];
            this.fuzzResource = resource;
            this.fuzzyApp = app;
            this.fuzzyOperation = operation;
            let { fuzzyTime, fuzzResource, fuzzyApp, fuzzyOperation } = this;
            this.$http.get(`/api/users/${this.userId}/logs/`,{
                params:{
                    applicationId:fuzzyApp,
                    resourceId:fuzzResource,
                    operation:fuzzyOperation,
                    startTime:fuzzyTime[0],
                    stopTime:fuzzyTime[1]
                }
            }).then( res => {
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.logs = res.data.resp;
                }else{
                    this.logs = res.data.resp;
                }
            })
        },
        fuzzyLists () {//获取条件查询数据
            let { pageNumber, pageSize } = this;
            this.$http.get(`/api/users/${this.userId}/logs/`,{
                params:{
                    pageNumber,
                    pageSize,
                    applicationId: this.fuzzyApp,
                    resourceId: this.fuzzResource,
                    operation: this.fuzzyOperation,
                    startTime: this.fuzzyTime[0],
                    stopTime: this.fuzzyTime[1]
                }
            }).then( res => {
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    if(this.pageNumber>1){//还原到上页数据
                        this.pageNumber--;
                    }
                }else{
                    this.logs = res.data.resp;
                }
            })
        },
        getAppLists () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        getResourceLists (appId) {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/${appId}/resources/`, {
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.resourceLists = res.data.resp;
            })
        },
        educe () {
            let { fuzzyTime, fuzzResource, fuzzyApp, fuzzyOperation } = this;
            //点击查询时候
            this.$http.get(`/api/users/${this.userId}/logs/`,{
                params:{
                    applicationId:fuzzyApp,
                    resourceId:fuzzResource,
                    operation:fuzzyOperation,
                    startTime:fuzzyTime[0],
                    stopTime:fuzzyTime[1]
                },
                headers:{
                    'User-Id': this.emailId,
                    'Accept':'application/vnd.ms-excel'
                }
            }).then( res => {
                if(res.data){
                    Message({
                        message:'已发送到您的邮箱',
                        duration:1500,
                        type:'success'
                    });
                }else{
                    Message({
                        message:'导出失败',
                        duration:1500,
                        type:'success'
                    });
                }
            })
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        newOperation (row, column, cellValue) {
            switch (cellValue) {
                case 'GET': 
                    return '查看'; break;
                case 'POST': 
                    return '新增'; break;
                case 'PUT': 
                    return '修改'; break;
                case 'DELETE': 
                    return '删除'; break;
                default: break;
            }
        },
        newTime (row, column, cellValue) {
            let arr = cellValue.split('T');
            return arr[0] + ' ' + arr[1];
        },
        newTenantName (row, column, cellValue) {
            if (cellValue) {
                return cellValue
            } else {
                return '-'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .examine-user-box{
        position: absolute;
        width: 780px;
        height: 580px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .examine-user-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
    }
    .table-box{
        height: 530px;
        overflow: auto;
        .app-box{
            padding-left: 20px;
            width: 760px;
            margin: 0 auto;
            height:80px;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: flex;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
            align-items: center;

            .app{
                height: 40px;
            }

            .time{
                margin-left: 20px;
                height: 40px;
            }

            .btn{
                margin-left: 20px;
                
            }
        }
    }
</style>

