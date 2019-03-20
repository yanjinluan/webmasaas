<template>
    <nav>
        <div class="operation-menu" @click="changeIsMenuShow">
            <i class="el-icon-menu"></i>
            更多操作
            <i :class="[isMenuShow?'el-icon-arrow-down':'el-icon-arrow-right']" style="margin-left:40px"></i>
        </div>
        <div class="operation-head-window">
            <div class="window-head-left">当前位置:{{ title }}</div>
        </div>
    </nav>
</template>

<script>
import Vue from 'vue';
export default {
    name:'OperationNav',
    props:['changeIsMenuShow','isMenuShow'],
    data () {
        return {
            title:'管理平台'
        }
    },
    created () {
        this.changeTile();
        this.$router.beforeEach((to, from, next) => {//配置当前显示位子  
            let title = '管理平台'
            switch ( to.name ) {
                case 'userSelfInfo': title = '用户自服务 --> 基本信息'; break;
                case 'userSelfPassword': title = '用户自服务 --> 密码修改'; break;
                case 'userSelfOperLog': title = '用户自服务 --> 操作日志'; break;
                
                case 'Usermanage': title = '系统管理 --> 用户管理'; break;
                case 'Rolemanage': title = '系统管理 --> 角色管理'; break;
                case 'RoleAndPower': title = '系统管理 --> 角色管理 --> 角色与权限信息'; break;
                case 'UserAndRole': title = '系统管理 --> 用户管理 --> 用户与角色信息'; break;
                
                case 'bidList': title = '活动管理 --> 申办列表'; break;
                case 'bidDetail': title = '活动管理 --> 申办列表-->申办详情'; break;
                case 'activeList': title = '活动管理 --> 活动列表'; break;
                case 'publish': title = '活动管理 --> 发布活动'; break;
                case 'activeDetail': title = '活动管理 --> 活动详情'; break;
                case 'editorActive': title = '活动管理 --> 编辑活动'; break;

                
                case 'orderList': title = '活动管理 --> 订单列表'; break;
                case 'orderDetail': title = '活动管理 --> 订单列表-->订单详情'; break;
                case 'billList': title = '活动管理 --> 票据列表'; break;
                case 'billDetail': title = '活动管理 --> 票据列表-->票据详情'; break;
                  
                case 'activeCalendar': title = '活动管理 --> 活动日历'; break;
                
                
                case 'userInfo': title = '用户管理 --> 用户信息'; break;
                case 'userOperLog': title = '用户管理 --> 审计日志'; break;
                case 'userManager': title = '用户管理 --> 用户管理员配置'; break;
                case 'platformInfo': title = '平台管理 --> 平台信息'; break;
                case 'applicationAdapt': title = '平台管理 --> 应用接入'; break;
                case 'platformManager': title = '平台管理 --> 平台管理员配置'; break;
                case 'applicationStatus': title = '应用管理 --> 运行状态'; break;
                case 'moduleManage': title = '应用管理 --> 模块管理'; break;
                case 'resourceManage': title = '应用管理 --> 资源管理'; break;
                case 'applicationManager': title = '应用管理 --> 应用管理员配置'; break;
                case 'tenantAdapt': title = '应用管理 --> 租户接入'; break;
                case 'tenantStatus': title = '应用管理 --> 租户运营状况'; break;
                case 'flowControlRule': title = '应用管理 --> 流控规则管理'; break;
                case 'feeRule': title = '应用管理 --> 计费规则管理'; break;
                case 'bill': title = '应用管理 --> 计费账单'; break;
                case 'tenantSelfUserManage': title = '租户自服务 --> 用户管理'; break;
                case 'tenantSelfRoleManage': title = '租户自服务 --> 角色管理'; break;
                case 'tenantSelfOrganizationManage': title = '租户自服务 --> 机构管理'; break;
                case 'tenantSelfBill': title = '租户自服务 --> 计费账单'; break;
                case 'tenantSelfOperLog': title = '租户自服务 --> 审计日志'; break;
                case 'tenantSelfStatus': title = '租户自服务 --> 运营状况'; break;
                case 'tenantManager': title = '租户自服务 --> 租户管理员配置'; break;
                default: break;
            }  
            this.title = title;
            next();
        })
    },
    methods:{
        changeTile () {
            let title = '管理平台';
            switch ( this.$route.name ) {
                case 'userSelfInfo': title = '用户自服务 --> 基本信息'; break;
                case 'userSelfPassword': title = '用户自服务 --> 密码修改'; break;
                case 'userSelfOperLog': title = '用户自服务 --> 操作日志'; break;
                
                case 'Usermanage': title = '系统管理 --> 用户管理'; break;
                case 'Rolemanage': title = '系统管理 --> 角色管理'; break;
                case 'RoleAndPower': title = '系统管理 --> 角色管理 --> 角色与权限信息'; break;
                case 'UserAndRole': title = '系统管理 --> 用户管理 --> 用户与角色信息'; break;
                
                case 'bidList': title = '活动管理 --> 申办列表'; break;
                case 'bidDetail': title = '活动管理 --> 申办列表-->申办详情'; break;
                case 'activeList': title = '活动管理 --> 活动列表'; break;
                case 'publish': title = '活动管理 --> 发布活动'; break;
                case 'activeDetail': title = '活动管理 --> 活动详情'; break;
                case 'editorActive': title = '活动管理 --> 编辑活动'; break;
                
                case 'orderList': title = '活动管理 --> 订单列表'; break;
                case 'orderDetail': title = '活动管理 --> 订单列表-->订单详情'; break;
                               
                case 'billList': title = '活动管理 --> 票据列表'; break;
                case 'billDetail': title = '活动管理 --> 票据列表-->票据详情'; break;
                case 'activeCalendar': title = '活动管理 --> 活动日历'; break;
                
                case 'userInfo': title = '用户管理 --> 用户信息'; break;
                case 'userOperLog': title = '用户管理 --> 审计日志'; break;
                case 'userManager': title = '用户管理 --> 用户管理员配置'; break;
                case 'platformInfo': title = '平台管理 --> 平台信息'; break;
                case 'applicationAdapt': title = '平台管理 --> 应用接入'; break;
                case 'platformManager': title = '平台管理 --> 平台管理员配置'; break;
                case 'applicationStatus': title = '应用管理 --> 运行状态'; break;
                case 'moduleManage': title = '应用管理 --> 模块管理'; break;
                case 'resourceManage': title = '应用管理 --> 资源管理'; break;
                case 'applicationManager': title = '应用管理 --> 应用管理员配置'; break;
                case 'tenantAdapt': title = '应用管理 --> 租户接入'; break;
                case 'tenantStatus': title = '应用管理 --> 租户运营状况'; break;
                case 'flowControlRule': title = '应用管理 --> 流控规则管理'; break;
                case 'feeRule': title = '应用管理 --> 计费规则管理'; break;
                case 'bill': title = '应用管理 --> 计费账单'; break;
                case 'tenantSelfUserManage': title = '租户自服务 --> 用户管理'; break;
                case 'tenantSelfRoleManage': title = '租户自服务 --> 角色管理'; break;
                case 'tenantSelfOrganizationManage': title = '租户自服务 --> 机构管理'; break;
                case 'tenantSelfBill': title = '租户自服务 --> 计费账单'; break;
                case 'tenantSelfOperLog': title = '租户自服务 --> 审计日志'; break;
                case 'tenantSelfStatus': title = '租户自服务 --> 运营状况'; break;
                case 'tenantManager': title = '租户自服务 --> 租户管理员配置'; break;
                default: break;
            }  
            this.title = title;
        }
    }
}
</script>

<style lang="scss" scoped>
    nav{
        width: 100%;
        min-width: 1100px;
        height: 50px;
        background: #f7f7f7;
        border-bottom:1px solid #ccc;
        position: relative;
        z-index: 4;

        .operation-menu{
            width: 244px;
            height: 50px;
            line-height: 50px;
            text-indent: 26px;
            border-right:1px solid #ccc;
            position: relative;
            z-index: 2;
        }

        .operation-head-window{
            position: absolute;
            top: 0;
            padding-left: 244px;
            width: 100%;
            height: 50px;
    
            .window-head-left{
                float: left;
                padding-left: 10px;
                height: 50px;
                line-height: 50px;
            }
        }
    }
</style>

