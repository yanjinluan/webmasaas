<template>
    <div class="jurisdiction-box">
        <div class="jurisdiction-head">
            <h2>角色权限操作列表</h2>
            <div class="off" @click="offJurisdiction">
                <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role-box">
            <p class="role">当前角色:{{role.name}}</p>
        </div>
        <jurisdiction-list :offJurisdiction="offJurisdiction"></jurisdiction-list>
    </div>
</template>

<script>
import Vue from 'vue';
import Bus from '@/modules/bus';
import JurisdictionList from './JurisdictionList';
import { mapState } from 'vuex';

export default {
    name:'Jurisdiction',
    methods:{
        offJurisdiction () {//关闭当前窗口
            Bus.$emit('offUserWindow','jurisdiction');
        }
    },
    data () {
        return{
            role:{}
        }
    },
    components:{
        JurisdictionList
    },
    computed:{
        ...mapState({
            roleId:(state) => {//拿到要修改的角色数据
                return state.getId.id;
            },
            appId:(state) => {
                return state.getId.appId;
            }
        })
    },
    created () {
        //获取当前角色信息
        this.$http.get(`/api/tenant/roles/${this.roleId}/`, {
            params:{
                appId: this.appId
            },
            headers:{
                'Operate-Application-Id': this.appId
            }
        }).then( res => {
            this.role = res.data.resp;
        })
    }
}
</script>

<style lang="scss" scoped>
    .jurisdiction-box{
        position: fixed;
        width: 620px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;
        -moz-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;

        .jurisdiction-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .role-box{
            height: 30px;
            line-height: 30px;
            background: #f7f7f7;
            color: #555;
            display: flex;
            
            .role{
                margin-left: 10px;
            }
        }
    }
</style>

