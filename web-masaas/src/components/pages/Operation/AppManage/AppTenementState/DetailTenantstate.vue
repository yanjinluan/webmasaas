<template>
    <div class="have-user-role">
        <header>
            <h2>充值记录</h2>
            <div class="off">
               <i class="fa fa-close" @click="offWindow"></i>
            </div>
        </header>
        <div class="user-box">
            <div class='table'>
                <el-table
                    :data="logLists"
                    height="500"
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="payTime"
                        label="充值时间"
                        show-overflow-tooltip
                        :formatter="newTime"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="payValue"
                        label="充值金额"
                        show-overflow-tooltip
                        :formatter="newBillFee"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="success"
                        label="状态"
                        width=70
                        :formatter="newBillState"
                        show-overflow-tooltip
                        align="center">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Bus from '@/modules/bus';

export default {
    name:'DetailTenantstate',
    data () {
        return{
            logLists:[]
        }
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			tenantId (state) {
				return state.getId.id;
			}
		})
	},
    created () {
        this.getLog();
    },
    methods:{
		offWindow (id,type) { 
            Bus.$emit('offUserWindow','detailtenantstate');
		},
		getLog () {
			this.$http.get(`/api/application/paylogs/`, {
				params:{
					applicationId:this.applicationId,
					tenantId:this.tenantId
                },
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
			}).then( res => {
				this.logLists = res.data.resp;
			})
        },
        newBillFee (row, column, cellValue) { 
            return (Number(cellValue)).toFixed(2) + '元'
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
        newBillState(row, column, cellValue) {
            if(cellValue) {
                return '成功';
            } else {
                return '失败';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .have-user-role{
        width: 500px;
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
    }
</style>
