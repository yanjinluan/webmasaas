<template>
    <div class="bill-box">
        <div class="option-box">
            <span>选择应用:</span>
            <el-select 
                v-model="applicationId"
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
            <span>选择账期：</span>            
            <el-date-picker
                v-model="billPeriod"
                type="month"
                placeholder="选择月"
                style="width:120px">
            </el-date-picker>
             &nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table">
            <el-table
                :data="billLists"
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
                    prop="billPeriod"
                    label="账单日期"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="endBalance"
                    label="余额"
                    :formatter="newBillFee"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="300"
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="warning" plain @click="onBillWindow(scope.row.id, scope.row.appId,  'billdetail')">查看</el-button>
                        <el-button size='mini' type="primary" plain @click="download(scope.row.id, scope.row.appId)">导出</el-button>
                        <el-button size='mini' type="info" plain @click="onBillWindow(scope.row.id, scope.row.appId, 'billdetaillist')">详情列表</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="billLists"
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
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';

export default {
    name:'Bill',
    data () {
        return{
            billPeriod:'',
            billLists:[],
            appLists:[],
            applicationId:'',
            fuzzyApplicationId:'',
            pageNumber:1,
            pageSize:10,
            fuzzyBillPeriod:'',
            isFuzzy:false,//判断是否点击过查询
            loading:false
        }
    },
    components:{
        Paging
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
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        fuzzyLists () {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize, fuzzyBillPeriod, fuzzyApplicationId } = this;
            let billPeriod = this.filterTime (fuzzyBillPeriod);
            this.$http.get('/api/tenant/bills/',{
                params:{
                    time:new Date().getTime(),
                    pageSize,
                    pageNumber,
                    billPeriod,
                    appId: fuzzyApplicationId
                },
                headers:{
                    'Operate-Application-Id': fuzzyApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if (this.pageNumber === 1) {
                        this.billLists = res.data.resp;
                    }else if (this.pageNumber > 1){
                        this.pageNumber--;
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                    }
                }else{//获取数据不为空时候
                    this.billLists = res.data.resp;
                }
            });
        },
        fuzzyClick () {//点击查询按钮时
            if(!this.applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
            this.pageNumber = 1;
            let { pageNumber, pageSize, billPeriod, applicationId } = this;
            this.fuzzyBillPeriod = billPeriod;
            this.fuzzyApplicationId = applicationId;
            this.isFuzzy = true;
            let newbillPeriod = this.filterTime (this.fuzzyBillPeriod);
            this.$http.get('/api/tenant/bills/',{
                params:{
                    time:new Date().getTime(),
                    pageSize,
                    pageNumber,
                    billPeriod: newbillPeriod,
                    appId: applicationId
                },
                headers:{
                    'Operate-Application-Id': applicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.billLists = res.data.resp;
                }else{//获取数据不为空时候
                    this.billLists = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        filterTime (val) {
            if(val){
                let year = new Date(val).getFullYear();
                let mounth = new Date(val).getMonth() + 1;
                let newMounth = mounth >= 10 ? mounth : '0' + mounth;
                return year + '-' +  newMounth
            }else{
                return ''
            }
        },
        newBillFee (row, column, cellValue) { 
            return (Number(cellValue)).toFixed(2) + '元'
        },
        onBillWindow (billId, appId, type) {
            Bus.$emit('onUserWindow',type);
            this.CHANGE_ID(billId)
            this.CHANGE_APPID(appId)
        },
        download (billId, appId) {//导出
            this.$http.get(`/api/tenant/bills/${billId}/statement/`,{
                params:{
                    appId
                },
                headers: {
                    'Operate-Application-Id': appId,
                    'Accept': 'application/vnd.ms-excel',
                    'User-Id': this.userId
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .bill-box{
        width: 100%;
        height: 100%;

        .option-box{
            width: 80%;
            min-width: 800px;
            margin: 20px auto 0;
            height: 40px;
        }
        .table{
            width: 80%;
            min-width: 800px;
            margin: 20px auto 0;
        }
    }
</style>
