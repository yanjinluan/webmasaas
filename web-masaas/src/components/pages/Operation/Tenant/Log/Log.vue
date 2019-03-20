<template>
    <div class="log-box">
        <div class="fuzzy-box1">
            <span>选择应用:</span>
            <el-select 
                v-model="applicationId"
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
            &nbsp;&nbsp;&nbsp;
            <span>选择操作:</span>
            <el-select v-model="operation" style="width:120px" clearable>
                <el-option
                    v-for="item in operationList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp;
            <span>选择资源:</span>
            <el-select v-model="resourceId" style="width:120px" clearable>
                <el-option
                    v-for="item in resourceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp;
            <span>用户名字:</span>
            <el-input style="width:120px" v-model="userName"></el-input>
        </div>
        <div class="fuzzy-box2">
            <span>选择时间:</span>
            <el-date-picker
                v-model="time"
                value-format="timestamp"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="educe">导出</el-button>
        </div>
        <div class = "table">
            <el-table
                :data="logList"
                style="width: 100%"
                border
                v-loading="loading"
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
            :lists="logList"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
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
    name:'Log',
    data () {
        return{
            loading:false,
            logList:[],
            operation:'',
            fuzzyOperation:'',
            operationList:[
                {id:1, label:'查看', value:'GET'},
                {id:2, label:'新增', value:'POST'},
                {id:3, label:'删除', value:'DELETE'},
                {id:4, label:'修改', value:'PUT'}
            ],
            appLists:[],
            applicationId:'',
            fuzzyApplication:'',
            resourceId:'',
            fuzzyResourceId:'',
            userName:'',
            fuzzyUserName:'',
            resourceList:[],
            time:[],
            fuzzyTime:'',
            isFuzzy:false,//判断是否点击过查询
            pageNumber:1,
            pageSize:10
        }
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    created () {
        this.getApp();
    },
    watch:{
        applicationId (val) {
            this.resourceId = '';
            this.fuzzyResourceId = '';
            if(val) {
                this.$http.get('/api/application/resources/',{
                    params:{
                        applicationId:val
                    },
                    headers:{
                        'Operate-Application-Id': val
                    }
                }).then( res => {
                    this.resourceList = res.data.resp;
                }) 
            }else {
               this. resourceList = [];
            }
        }
    },
    components:{
        Paging
    },
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        fuzzyLists () {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize, fuzzyOperation, fuzzyResourceId, fuzzyUserName, fuzzyTime, fuzzyApplication } = this;
            this.$http.get('/api/tenant/logs/',{
                params:{
                    time:new Date().getTime(),
                    pageSize,
                    pageNumber,
                    startTime: fuzzyTime[0],
                    stopTime: fuzzyTime[1],
                    userName: fuzzyUserName,
                    resourceId: fuzzyResourceId,
                    operation: fuzzyOperation,
                    appId: fuzzyApplication
                },
                headers:{
                    'Operate-Application-Id': fuzzyApplication
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if (this.pageNumber === 1) {
                        this.logList = res.data.resp;
                    }else if (this.pageNumber > 1){
                        this.pageNumber--;
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                    }
                }else{//获取数据不为空时候
                    this.logList = res.data.resp;
                }
            });
        },
        fuzzyClick () {//点击查询按钮时
            let { pageNumber, pageSize, operation, userName, resourceId, time, applicationId } = this;
            if(!applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
            this.pageNumber = 1;
            this.fuzzyOperation = operation;
            this.fuzzyResourceId = resourceId;
            this.fuzzyUserName = userName;
            this.fuzzyTime = time?time:[];
            this.fuzzyApplication = applicationId;
            this.isFuzzy = true;
            this.$http.get('/api/tenant/logs/',{
                params:{
                    time:new Date().getTime(),
                    pageSize,
                    pageNumber,
                    startTime: this.fuzzyTime[0],
                    stopTime: this.fuzzyTime[1],
                    userName: this.fuzzyUserName,
                    resourceId: this.fuzzyResourceId,
                    operation: this.fuzzyOperation,
                    appId: this.fuzzyApplication
                },
                headers:{
                    'Operate-Application-Id': this.fuzzyApplication
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.logList = res.data.resp;
                }else{//获取数据不为空时候
                    this.logList = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });;
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        newTime (row, column, cellValue) { 
            let year = new Date(cellValue).getFullYear();
            let mounth = new Date(cellValue).getMonth() + 1;
            let newMounth = mounth >= 10 ? mounth : '0' + mounth;
            let day = new Date(cellValue).getDate();
            let hours = new Date(cellValue).getHours();
            let newHours = hours >= 10 ? hours : '0' + hours;
            let minute = new Date(cellValue).getMinutes();
            let newMinute = minute >= 10 ? minute : '0' + minute;
            let second = new Date(cellValue).getSeconds();
            let newSecond = second >= 10 ? second : '0' + second;
            return year + '-' + newMounth + '-' + day + ' ' + newHours + ':' + newMinute + ':' + newSecond
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        educe () {
            this.$http.get('/api/tenant/logs/',{
                params:{
                    appId: this.fuzzyApplication,
                    startTime: this.fuzzyTime[0],
                    stopTime: this.fuzzyTime[1],
                    userName: this.fuzzyUserName,
                    resourceId: this.fuzzyResourceId,
                    operation: this.fuzzyOperation
                },
                headers:{
                    'Operate-Application-Id': this.fuzzyApplication,
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
        
        .fuzzy-box1, .fuzzy-box2{
            clear: both;
            width: 80%;
            min-width: 800px;
            margin: 14px auto 0;
            height: 50px;
        }

        .fuzzy-box1{
            margin-top:10px;
        }

        .table{
            width: 80%;
            min-width: 800px;
            margin: 20px auto 0;
            border-collapse:collapse;
        }
    }
</style>

