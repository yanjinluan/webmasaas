<template>
    <div class="role-box">
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
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span>租户名称:</span>
            <el-input style="width:120px" v-model="tenantName"></el-input>
            &nbsp;&nbsp;
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                :data="tenantBillLists"
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
                    prop="tenantName"
                    label="隶属租户"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="totalBalance"
                    label="余额"
                    show-overflow-tooltip
                    :formatter="newBillFee"
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="totalConsume"
                    label="累计消费金额"
                    show-overflow-tooltip
                    :formatter="newBillFee"
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="lastChargeTime"
                    label="最后充值时间"
                    show-overflow-tooltip
                    :formatter="newTime"
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="lastConsumeTime"
                    label="最后消费时间"
                    show-overflow-tooltip
                    :formatter="newTime"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
					width="160"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size='mini' type="success" plain @click="onWindow(scope.row.id, 'pay',scope.row.appId)">充值</el-button>
                        <el-button size='mini' type="warning" plain @click="onWindow(scope.row.tenantId, 'detailtenantstate', scope.row.appId)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="tenantBillLists"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :fuzzyLists="fuzzyLists"
            :isFuzzy="isFuzzy"
        ></paging>    
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState, mapMutations } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'AppResource',
    data() {
        return {
            tenantBillLists:[],
            appLists:[],
            applicationId:'',
            fuzzyApplicationId:'',
            pageNumber:1,
            pageSize:10,
            tenantName:'',
            fuzzyTenantName:'',
            isFuzzy:false,//判断是否点击过模糊查询
            loading:false
        }
    },
    created () {
        this.getApp();//获取初始数据
        Bus.$on('busGetTenantBillLists', this.getTenantBillLists);
    },
    beforeDestroy () {
        Bus.$off('busGetTenantBillLists');
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
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        onWindow (id, type, appId) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){ //如果需要用到用户数据
               this.CHANGE_ID(id);
            };
            if(appId){ //如果需要用到用户数据
               this.CHANGE_APPID(appId);
            }
        },
        getTenantBillLists (type) {
            this.fuzzyLists(type);
        },
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        fuzzyLists (type) {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize, tenantName, applicationId } = this;
            this.$http.get('/api/application/accounts/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
                    pageNumber,
                    applicationId: this.fuzzyApplicationId,
                    tenantName:this.fuzzyTenantName
                },
                headers:{
                    'Operate-Application-Id': this.fuzzyApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/application/accounts/',{
                                params:{
                                    time: new Date().getTime(),
                                    pageSize,
                                    pageNumber:this.pageNumber,
                                    tenantName:this.fuzzyTenantName,
                                    applicationId:this.fuzzyApplicationId
                                },
                                headers:{
                                    'Operate-Application-Id': this.fuzzyApplicationId
                                }
                            }).then( res => {
                                this.tenantBillLists = res.data.resp;
                            })
                        }else{
                            this.tenantBillLists = res.data.resp;
                        }
                    }else if(type == 'next'){
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber--;
                        }
                    }
                }else{
                    this.tenantBillLists = res.data.resp;
                }
            });
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        fuzzyClick () {//点击查询按钮时
            this.pageNumber = 1;
            let { pageNumber, pageSize, tenantName, applicationId } = this;
            if(!applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
            this.fuzzyTenantName = tenantName;
            this.fuzzyApplicationId = applicationId;
            this.isFuzzy = true;
            this.$http.get('/api/application/accounts/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
                    pageNumber,
                    applicationId,
                    tenantName
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
                    this.tenantBillLists = res.data.resp;
                }else{
                    this.tenantBillLists = res.data.resp;
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
        newBillFee (row, column, cellValue) { 
            return (Number(cellValue)).toFixed(2) + '元'
        },
        newTime (row, column, cellValue) {
            if(cellValue){
                let date = new Date(cellValue);
                let year = date.getFullYear();
                let mounth = date.getMonth() + 1;
                let newMounth = mounth >= 10 ? mounth : '0' + mounth;
                let day = date.getDate();
                let houre = date.getHours();
                let minute= date.getMinutes();
                return year + '-' +  newMounth + '-' + day +' '+ houre + ':' + minute
            }else{
                return '-'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-box{
        width: 100%;
        height: 100%;

        .option-box{
            width: 80%;
            min-width: 800px;
            margin:20px auto 0;
            height: 40px;
        }

        .table{
            width: 80%;
            min-width: 800px;
            margin:20px auto 0;
        }
    }
</style>

