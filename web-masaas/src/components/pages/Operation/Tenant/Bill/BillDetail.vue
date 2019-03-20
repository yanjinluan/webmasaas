<template>
    <div class="bill-detail-box">
        <div class="bill-detail-head">
            <h2>计费账单详细信息</h2>
            <div class="off" @click="offBillDetail">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="detail">
            <div>
                <span>账期:</span>
                {{ billDetail.billPeriod }}
            </div>
            <div>
                <span>期初累计消费金额:</span>
                {{ billDetail.beginConsume | money }}元
            </div>
            <div>
                <span>期期初账户余额:</span>
                {{ billDetail.beginBalance | money }}元
            </div>
            <div>
                <span>期末累计消费金额:</span>
                {{ billDetail.endConsume | money }}元
            </div>
            <div>
                <span>期末账户余额:</span>
                {{ billDetail.endBalance | money }}元
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'BillDetail',
    data () {
        return {
            billDetail:''
        }
    },
    computed:{
        ...mapState({
            billId:(state) => {
                return state.getId.id
            },
            appId:(state) => {
                return state.getId.appId
            }
        })
    },
    created () {
        this. getBillDetail();
    },
    methods:{
        getBillDetail () {//获取详细对账单
            this.$http.get(`/api/tenant/bills/${this.billId}/`,{
                params:{
                    appId: this.appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.billDetail = res.data.resp;
            })
        },
        offBillDetail () {//关闭窗口
            Bus.$emit('offUserWindow','billdetail');
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

        .detail{
            padding: 8px 20px;
            div{
                height: 36px;
                line-height: 36px;
            }
        }
        
    }
</style>
