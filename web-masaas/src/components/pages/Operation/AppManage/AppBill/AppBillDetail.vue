<template>
    <div class="bill-detail-box">
        <div class="bill-detail-head">
            <h2>计费账单详细列表</h2>
            <div class="off" @click="offBillDetailList">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-table
            :data="billDetailList"
            style="width: 100%"
            height="500"
            border
        >
            <el-table-column
                label="序号"
                type="index"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="resourceName"
                show-overflow-tooltip
                label="资源"
                align="center">
            </el-table-column>
            <el-table-column
                prop="price"
                label="金额"
                :formatter="newBillFee"
                align="center">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AppBillDetail',
    data () {
        return {
            billDetailList:[]
        }
    },
    created () {
        this.getBillDetail ();
    },
    computed:{
        ...mapState({
            billId:(state) => {
                return state.getId.id
            },
            applicationId (state) {
				return state.getId.appId;
			}
        })
    },
    methods:{
        getBillDetail () {//获取详细对账单
            this.$http.get(`/api/application/bills/${this.billId}/details/`,{
                params:{ applicationId:this.applicationId },
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( (res) => {
                this.billDetailList = res.data.resp;
            })
        },
        offBillDetailList () {//关闭窗口
            Bus.$emit('offUserWindow','appbilldetail');
        },
        newBillFee (row, column, cellValue) { 
            return (Number(cellValue)).toFixed(2) + '元'
        }
    }
}
</script>

<style lang="scss" scoped>
    .bill-detail-box{
        position: absolute;
        width: 420px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .bill-detail-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }     
    }
</style>
