<template>
    <div class="examine-user-box">
        <div class="examine-user-head">
            <h2>{{list.name}}详情</h2>
            <div class="off" @click="off">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <ul>
            <li>规则名称：{{list.name}}</li>
            <li>隶属租户：{{list.tenantName}}</li>
            <li>管控状态：{{controlStatus}}</li>
            <li>计费类型：{{type}}</li>
            <li v-if="list.type == 1">
                模块：{{list.moduleName}}
            </li>
            <li v-if="list.type == 0">
                资源：{{list.resourceName}}
            </li>
            <li>开始管控时间：{{list.validTime}}</li>
            <li>结束管控时间：{{list.expireTime}}</li>
            <li>价格：{{list.price}}</li>
        </ul>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import Bus from '@/modules/bus';

export default {
    name:'ExamineBilling',
    data() {
       return {
           list:{}
       }
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			ruleId (state) {
				return state.getId.id;
            }
        }),
        type () {
            if (this.list.type == 0 ) {
                return '资源'
            } else if (this.list.type == 1) {
                return '模块'
            } else if (this.list.type == 2) {
                return '应用'
            }
        },
        controlStatus () {
            if (this.list.controlStatus) {
                return '正常'
            } else {
                return '关闭'
            }
        }
	},
    created () {
         //获取租户数据
        this.$http.get(`/api/application/feerules/${this.ruleId}/?applicationId=${this.applicationId}`,{
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            res.data.resp.price = res.data.resp.price.toFixed(2) + '元'
            this.list = res.data.resp;
        })
    },
    methods:{
        off () {
            Bus.$emit('offUserWindow','examinebilling');
        }
    }
}
</script>

<style lang="scss" scoped>
    .examine-user-box{
        position: absolute;
        width: 400px;
        padding-bottom: 20px;
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

        ul{
            margin-top: 20px;

            li{
                height: 40px;
                line-height: 40px;
                text-indent: 30px;
            }
        }
    }
</style>

