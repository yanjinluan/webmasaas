<template>
    <div class="log-box">
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
        </div>
        <div class="app-box">
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
            </div>
            <div class="time">
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
        </div>
        <div class="table">
            <el-table
                v-loading="loading"
                :data="logs"
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
        </div> 
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
</template>

<script>
import Paging from '@/components/commos/Paging/Paging';
import { Message } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'Userlog',
    data () {
        return{
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
            pageNumber:1,
            pageSize:10,
            isFuzzy:false,//判断是否点击过模糊查询
            loading:true
        }
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    watch:{
        app (val) {
            if (!val) {
                this.resourceLists = [];
                this.resource = '';
                return;
            }
            this.resource = '';
            //获取应用对应资源
            this.$http.get('/api/application/resources/',{
                params:{
                    applicationId:val
                },
                headers:{
                    'Operate-Application-Id': val
                }
            }).then( res => {
                this.resourceLists = res.data.resp;
            })
        }
    },
    created () {
        this.$http.get('/api/platform/applications/').then( res => {
            this.appLists = res.data.resp
        });
        this.getlog();
    },
    components:{
        Paging
    },
    methods:{
        getlog () {
            let { pageNumber, pageSize } = this;
            //获取操作列表
            this.$http.get('/api/users/logs/',{
                params:{
                    pageNumber,
                    pageSize,
                }
            }).then( res => {
                this.logs = res.data.resp;
                this.loading = false;
            })
        },
        initLists () {
            this.loading = true;
            let { pageNumber, pageSize } = this;
            //获取操作列表
            this.$http.get('/api/users/logs/',{
                params:{
                    pageNumber,
                    pageSize,
                }
            }).then( res => {
                this.loading = false;
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
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        fuzzyClick () {//点击查询按钮
            this.loading = true;
            this.pageNumber = 1;
            let { time, resource, app, operation} = this;
            this.isFuzzy = true;
            this.fuzzyTime = time?time:[];
            this.fuzzResource = resource;
            this.fuzzyApp = app;
            this.fuzzyOperation = operation;
            let { pageNumber, pageSize, fuzzyTime, fuzzResource, fuzzyApp, fuzzyOperation } = this;
            //点击查询时候
            this.$http.get('/api/users/logs/',{
                params:{
                    pageNumber,
                    pageSize,
                    applicationId:fuzzyApp,
                    resourceId:fuzzResource,
                    operation:fuzzyOperation,
                    startTime:fuzzyTime[0],
                    stopTime:fuzzyTime[1]
                }
            }).then( res => {
                this.loading = false;
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
            this.loading = true;
            let { pageNumber, pageSize, fuzzyTime, fuzzResource, fuzzyApp, fuzzyOperation } = this;
            this.$http.get('/api/users/logs/',{
                params:{
                    pageNumber,
                    pageSize,
                    applicationId:fuzzyApp,
                    resourceId:fuzzResource,
                    operation:fuzzyOperation,
                    startTime:fuzzyTime[0],
                    stopTime:fuzzyTime[1]
                }
            }).then( res => {
                this.loading = false;
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
        educe () {
            let { fuzzyTime, fuzzResource, fuzzyApp, fuzzyOperation } = this;
            //点击查询时候
            this.$http.get('/api/users/logs/',{
                params:{
                    applicationId:fuzzyApp,
                    resourceId:fuzzResource,
                    operation:fuzzyOperation,
                    startTime:fuzzyTime[0],
                    stopTime:fuzzyTime[1]
                },
                headers:{
                    'User-Id': this.userId,
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
    .log-box{
        width: 100%;
        height: 100%;

        .app-box{
            width: 80%;
            margin: 0 auto;
            min-width: 800px;
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
                margin-left: 30px;
                height: 40px;
            }

            .btn{
                margin-left: 30px;
                
            }
        }
        .table{
            width: 80%;
            margin: 0 auto;
            min-width: 800px;
        }
    }
</style>

