<template>
    <div class="have-user-role">
        <header>
            <h2>充值</h2>
            <div class="off">
               <i class="fa fa-close" @click="offWindow"></i>
            </div>
        </header>
       <div class="inp">
            <label>充值金额:</label>
            <el-input style="width:100px" v-model="payValue"></el-input>
            <span>元</span>
       </div>
        <div class="btn">
			<el-button id="btn" type="primary" @click="setPay">确定</el-button>
			<el-button @click="offWindow">取消</el-button>
		</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { Message } from 'element-ui';
import Bus from '@/modules/bus';

export default {
    name:'DetailTenantstate',
    data () {
        return{
            payValue:''
        }
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			accountId (state) {
				return state.getId.id;
			}
		})
	},
    methods:{
		offWindow (id,type) { 
            Bus.$emit('offUserWindow','pay');
        },
        setPay () {
            //正数俩位小数正则
            if(this.payValue > 0) {
                this.$http.post(`/api/application/pay/?applicationId=${this.applicationId}`, {
                    accountId:this.accountId,
                    appId:this.applicationId,
                    payValue: this.payValue
                }, {
                    headers:{
                        'Operate-Application-Id': this.applicationId
                    }
                }).then ( res => {
                    if (res.data.success) {
                        Bus.$emit('offUserWindow','pay');
                        Bus.$emit('busGetTenantBillLists');
                        Message({
                            message:'充值成功',
                            duration:1500,
                            type:'success'
                        });
                    }else{
                        Message({
                            message:'充值失败',
                            duration:1500,
                            type:'error'
                        });
                    }
                })
            }else{
                Message({
                    message:'请正确输入金额',
                    duration:1500,
                    type:'warning'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .have-user-role{
        width: 340px;
        height: 160px;
        background: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 7;

        header{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
        .inp{
            width: 200px;
            margin: 10px auto;
        }
        .btn{
            text-align: center;
        }
    }
</style>
