<template>
    <div class="operation-box">
        <transition name="el-fade-in-linear">
            <shade-box v-if="isShadeShow"></shade-box>
        </transition>
        <navigation-header></navigation-header>
        <operation-nav
            :changeIsMenuShow="changeIsMenuShow"
            :isMenuShow="isMenuShow"
        ></operation-nav>
		<div class="operation-container">
			<operation-list
				:isMenuShow="isMenuShow"
				:changeOperationWindow="changeOperationWindow"
			></operation-list>
			<operation-window
				v-if="operationWindowShow"
				:isMenuShow="isMenuShow"
			></operation-window>
		</div>
        <add-user v-if="isAddUserShow"></add-user>
        <amend-user v-if="isAmendUserShow"></amend-user>
        <examine-user v-if="isExamineUserShow"></examine-user>
        
        <add-roles v-if="isAddRolesShow"></add-roles>
        <amend-roles v-if="isAmendRolesShow"></amend-roles>
        <add-reason v-if="isAddReasonShow"></add-reason>
        
        
        <add-role v-if="isAddRoleShow"></add-role>
        <amend-role v-if="isAmendRoleShow"></amend-role>
        <jurisdiction v-if="isJurisdictionShow"></jurisdiction>
        <role-allot v-if="isRoleAllotShow"></role-allot>
        <add-app v-if="isAddAppShow"></add-app>
        <edit-app v-if="isEditAppShow"></edit-app>
        <pause-terrace v-if="isPauseTerraceShow"></pause-terrace>
        <add-module v-if="isAddModuleShow"></add-module>
        <add-resource v-if="isAddResourceShow"></add-resource>
        <edit-resource v-if="isEditResourceShow"></edit-resource>
        <add-tenant v-if="isAddTenantShow"></add-tenant>
        <edit-tenant v-if="isEditTenantShow"></edit-tenant>
        <tenant-allot v-if="isTenantAllotShow"></tenant-allot>
        <add-flowrule v-if="isAddFlowruleShow"></add-flowrule>
        <edit-flowrule v-if="isEditFlowruleShow"></edit-flowrule>
        <add-billrule v-if="isAddBillruleShow"></add-billrule>
        <edit-billrule v-if="isEditBillruleShow"></edit-billrule>
        <detail-bill v-if="isDetailBillShow"></detail-bill>
        <detail-tenantstate v-if="isDetailTenantstateShow"></detail-tenantstate>
        <add-organization v-if="isAddOrganizationShow"></add-organization>
        <amend-org v-if="isAmendOrgShow"></amend-org>
        <to-org v-if="isToOrgShow"></to-org>
        <to-role v-if="isToRoleShow"></to-role>
        <user-allot v-if="isUserAllotShow"></user-allot>
		<bill-detail v-if="isBillDetailShow"></bill-detail>
		<bill-detail-list v-if="isBillDetailListShow"></bill-detail-list>
		<add-tenant-admin v-if="isAddTenantAdminShow"></add-tenant-admin>
		<add-terrace-admin v-if="isAddTerraceAdminShow"></add-terrace-admin>
		<upload v-if="isUploadShow"></upload>
		<app-allot v-if="isAppAllotShow"></app-allot>
		<amend-module v-if="isAmendModuleShow"></amend-module>
		<module-allot v-if="isModuleAllotShow"></module-allot>
		<resource-allot v-if="isResourceAllotShow"></resource-allot>
		<add-app-admin v-if="isAddAppAdminShow"></add-app-admin>
		<pay v-if="isPayShow"></pay>
		<add-user-admin v-if="isAddUserAdminShow"></add-user-admin>
		<app-bill-detail v-if="isAppBillDetailShow"></app-bill-detail>
		<examine-billing v-if="isExamineBillingShow"></examine-billing>
    </div>
</template>

<script>
import NavigationHeader from '../../commos/NavigationHeader/NavigationHeader';
import OperationList from './OperationList';
import OperationNav from './OperationNav';
import OperationWindow from './OperationWindow';
import { mapState, mapMutations } from 'vuex';
import { CHANGE_APPLICATION } from '@/store/appId/const';
import ShadeBox from '@/components/commos/ShadeBox/ShadeBox';//遮罩

import AddRoles from './System/Rolemanage/AddRoles.vue';//新增角色窗口
import AmendRoles from './System/Rolemanage/AmendRoles.vue';//修改角色窗口
import AddReason from './Activity/bidList/AddReason.vue';//审核不通过原因


import AddUser from './UserControl/Userinfo/AddUser';//用户管理-新增用户窗口
import AmendUser from './UserControl/Userinfo/AmendUser';//修改用户窗口
import ExamineUser from './UserControl/Userinfo/ExamineUser';//查看用户窗口
import RoleAllot from './Tenant/Role/RoleAllot';//角色分配权限窗口
import AddRole from './Tenant/Role/AddRole';//新增角色窗口
import AmendRole from './Tenant/Role/AmendRole';//修改角色窗口
import Jurisdiction from './Tenant/Jurisdiction/Jurisdiction';//权限操作窗口
import AddApp from './Terrace/JoinApp/AddApp'  //添加应用窗口
import EditApp from './Terrace/JoinApp/EditlApp'  //修改应用窗口
import PauseTerrace from './Terrace/TerraceInfo/PauseTerrace'  //暂停平台窗口
import AddModule from './AppManage/AppModule/AddModule' //应该管理-模块新增
import AddResource from './AppManage/AppResource/AddResource' //添加资源
import EditResource from './AppManage/AppResource/EditResource' //编辑资源
import AddTenant from './AppManage/AppTenementJion/AddTenant' //添加租户
import EditTenant from './AppManage/AppTenementJion/EditTenant' //修改租户
import TenantAllot from './AppManage/AppTenementJion/TenantAllot' //查看租户
import AddFlowrule from './AppManage/AppFluidRule/AddFlowrule' //新增流控规则
import EditFlowrule from './AppManage/AppFluidRule/EditFlowrule' //修改流控规则
import AddBillrule from './AppManage/AppBilling/AddBillrule' //新增计费规则
import EditBillrule from './AppManage/AppBilling/EditBillrule' //编辑计费规则
import ExamineBilling from './AppManage/AppBilling/ExamineBilling'//计费详情
import DetailBill from './AppManage/AppBill/DetailBill' //查看计费账单
import DetailTenantstate from './AppManage/AppTenementState/DetailTenantstate' //查看租户运营状况
import AddOrganization from './Tenant/Organization/AddOrganization' //租户管理-新增组织机构
import UserAllot from './Tenant/Organization/UserAllot' //租户管理-分配用户
import AmendOrg from './Tenant/Organization/AmendOrg';//机构管理-修改
import ToOrg from './Tenant/User/ToOrg';//用户管理-隶属机构
import ToRole from './Tenant/User/ToRole';//用户管理-隶属角色
import BillDetail from './Tenant/Bill/BillDetail';//计费账单详情
import BillDetailList from './Tenant/Bill/BillDetailList';//计费账单详情列表
import AddTenantAdmin from './Tenant/TenantAdmin/AddTenantAdmin';//租户管理员
import AddTerraceAdmin from './Terrace/TerraceAdmin/AddTerraceAdmin';//平台管理员
import Upload from './Terrace/JoinApp/Upload';//平台管理 上传页面
import AppAllot from './Terrace/JoinApp/AppAllot';//应用角色分配
import AmendModule from './AppManage/AppModule/AmendModule';//模块列表
import ModuleAllot from './AppManage/AppModule/ModuleAllot';//模块分配
import ResourceAllot from './AppManage/AppResource/ResourceAllot';//资源分配
import AddAppAdmin from './AppManage/AppAdmin/AddAppAdmin';//新增应用管理员
import Pay from './AppManage/AppTenementState/Pay';//付费
import AddUserAdmin from './UserControl/Useradmin/AddUserAdmin';
import AppBillDetail from './AppManage/AppBill/AppBillDetail';//计费账单详情列表

import Bus from '@/modules/bus'; //event bus
export default {
	name:'Operation',
	props:['appId'],//接收路由传参的appid
    data () {
		return {
			isMenuShow:true,
			isShadeShow:false,
			isAddUserShow:false,
			isAmendUserShow:false,
			isExamineUserShow:false,
			
			isAddRolesShow:false,
			isAmendRolesShow:false,
			isAddReasonShow:false,
			
			isAddRoleShow:false,
			isAmendRoleShow:false,
			isJurisdictionShow:false,
			isRoleAllotShow:false,
			isAddAppShow:false,
			isEditAppShow:false,
			isPauseTerraceShow:false,
			isAddModuleShow:false,
			isAddResourceShow:false,
			isEditResourceShow:false,
			isAddTenantShow:false,
			isEditTenantShow:false,
			isTenantAllotShow:false,
			isAddFlowruleShow:false,
			isEditFlowruleShow:false,
			isAddBillruleShow:false,
			isEditBillruleShow:false,
			isDetailBillShow:false,
			isDetailTenantstateShow:false,
			isAddOrganizationShow:false,
			isAmendOrgShow:false,
			isToOrgShow:false,
			isToRoleShow:false,
			isUserAllotShow:false,
			isBillDetailShow:false,
			isBillDetailListShow:false,
			isAddTenantAdminShow:false,
			isAddTerraceAdminShow:false,
			isUploadShow:false,
			isAppAllotShow:false,
			isAmendModuleShow:false,
			isModuleAllotShow:false,
			isResourceAllotShow:false,
			isAddAppAdminShow:false,
			isPayShow:false,
			isAddUserAdminShow:false,
			isAppBillDetailShow:false,
			isExamineBillingShow:false,
			operationWindowShow:true
	    }
	},
    components:{
        NavigationHeader,
        OperationList,
        OperationNav,
        OperationWindow,
        ShadeBox,
        AddUser,
        AmendUser,
        ExamineUser,
       
        AddRoles,
        AmendRoles,
        AddReason,
        
        AddRole,
        AmendRole,
        Jurisdiction,
        RoleAllot,
        AddApp,
        EditApp,
        PauseTerrace,
        AddModule,
        AddResource,
        EditResource,
        AddTenant,
        EditTenant,
        TenantAllot,
        AddFlowrule,
        EditFlowrule,
        AddBillrule,
        EditBillrule,
        DetailBill,
        DetailTenantstate,
        AddOrganization,
        AmendOrg,
        ToOrg,
        ToRole,
		UserAllot,
		BillDetail,
		BillDetailList,
		AddTenantAdmin,
		AddTerraceAdmin,
		Upload,
		AppAllot,
		AmendModule,
		ModuleAllot,
		ResourceAllot,
		AddAppAdmin,
		Pay,
		AddUserAdmin,
		AppBillDetail,
		ExamineBilling
    },
    computed: mapState({
        userInfo:(state) => {
            return state.other.userInfo;
        }
    }),
    methods:{
		...mapMutations([CHANGE_APPLICATION]),
        changeIsMenuShow () { //控制操作列表显示隐藏
            this.isMenuShow = !this.isMenuShow;
		},
		changeOperationWindow () {//重新点击二级菜单刷新
			this.operationWindowShow = false;
			setTimeout( () => {
				this.operationWindowShow = true;
			},100)
		},
        onUserWindow (type) { //打开用户窗口
            this.isShadeShow = true;
            switch (type) {
				case 'adduser':
					this.isAddUserShow = true; break;
				case 'amenduser':
					this.isAmendUserShow = true; break;
				case 'examineuser':
					this.isExamineUserShow = true; break;
				
				//角色管理-增加角色
				case 'addroles':
					this.isAddRolesShow = true; break;
					
				//活动管理-不通过原因
				case 'addreason':
				    this.isAddReasonShow = true; break;
					
				case 'amendroles':
					this.isAmendRolesShow = true; break;	
					
				case 'addrole':
					this.isAddRoleShow = true; break;
				case 'amendrole':
					this.isAmendRoleShow = true; break;
				case 'jurisdiction':
					this.isJurisdictionShow = true; break;
				case 'roleallot':
					this.isRoleAllotShow = true; break;
				case 'addapp':
					this.isAddAppShow = true; break;
				case 'editapp':
					this.isEditAppShow = true; break;
				case 'pauseterrace':
					this.isPauseTerraceShow = true; break;
				case 'addmodule':
					this.isAddModuleShow = true; break;
				case 'addresource':
					this.isAddResourceShow = true; break;
				case 'editresource':
					this.isEditResourceShow = true; break;
				case 'addtenant':
					this.isAddTenantShow = true; break;
				case 'edittenant':
					this.isEditTenantShow = true; break;
				case 'tenantallot':
					this.isTenantAllotShow = true; break;
				case 'addflowrule':
					this.isAddFlowruleShow = true; break;
				case 'editflowrule':
					this.isEditFlowruleShow = true; break;
				case 'addbillrule':
					this.isAddBillruleShow = true; break;
				case 'editbillrule':
					this.isEditBillruleShow = true; break;
				case 'detailbill':
					this.isDetailBillShow = true; break;
				case 'detailtenantstate':
					this.isDetailTenantstateShow = true; break;
				case 'addorganization':
					this.isAddOrganizationShow = true; break;
				case 'amendorg':
					this.isAmendOrgShow = true; break;
				case 'toorg':
					this.isToOrgShow = true; break;
				case 'torole':
					this.isToRoleShow = true; break;
				case 'userallot':
					this.isUserAllotShow = true; break;
				case 'billdetail':
					this.isBillDetailShow = true; break;
				case 'billdetaillist':
					this.isBillDetailListShow = true; break;
				case 'addtenantadmin':
					this.isAddTenantAdminShow = true; break;
				case 'addterraceadmin':
					this.isAddTerraceAdminShow = true; break;
				case 'upload':
					this.isUploadShow = true; break;
				case 'appallot':
					this.isAppAllotShow = true; break;
				case 'amendmodule':
					this.isAmendModuleShow = true; break;
				case 'moduleallot':
					this.isModuleAllotShow = true; break;
				case 'resourceallot':
					this.isResourceAllotShow = true; break;
				case 'addappadmin':
					this.isAddAppAdminShow = true; break;
				case 'pay':
					this.isPayShow = true; break;
				case 'adduseradmin':
					this.isAddUserAdminShow = true; break;
				case 'appbilldetail':
					this.isAppBillDetailShow = true; break;
				case 'examinebilling':
					this.isExamineBillingShow = true; break;
				default: break;
            }
        },
        offUserWindow (type) {//关闭用户窗口
            this.isShadeShow = false;
            switch (type) {
				case 'adduser':
					this.isAddUserShow = false; break;
				case 'amenduser':
					this.isAmendUserShow = false; break;
				case 'examineuser':
					this.isExamineUserShow = false; break;
				
				//角色管理-增加角色
				case 'addroles':
					this.isAddRolesShow = false; break;	
					
				case 'addreason':
				    this.isAddReasonShow = false; break;
						
					
				case 'amendroles':
					this.isAmendRolesShow = false; break;	
					
				case 'addrole':
					this.isAddRoleShow = false; break;
				case 'amendrole':
					this.isAmendRoleShow = false; break;
				case 'jurisdiction':
					this.isJurisdictionShow = false; break;
				case 'roleallot':
					this.isRoleAllotShow = false; break;
				case 'addapp':
					this.isAddAppShow = false; break;
				case 'editapp':
					this.isEditAppShow = false; break;
				case 'pauseterrace':
					this.isPauseTerraceShow = false; break;
				case 'addmodule':
					this.isAddModuleShow = false; break;
				case 'addresource':
					this.isAddResourceShow = false; break;
				case 'editresource':
					this.isEditResourceShow = false; break;
				case 'addtenant':
					this.isAddTenantShow = false; break;
				case 'edittenant':
					this.isEditTenantShow = false; break;
				case 'tenantallot':
					this.isTenantAllotShow = false; break;
				case 'addflowrule':
					this.isAddFlowruleShow = false; break;
				case 'editflowrule':
					this.isEditFlowruleShow = false; break;
				case 'addbillrule':
					this.isAddBillruleShow = false; break;
				case 'editbillrule':
					this.isEditBillruleShow = false; break;
				case 'detailbill':
					this.isDetailBillShow = false; break;
				case 'detailtenantstate':
					this.isDetailTenantstateShow = false; break;
				case 'addorganization':
					this.isAddOrganizationShow = false; break;
				case 'amendorg':
					this.isAmendOrgShow = false; break;
				case 'toorg':
					this.isToOrgShow = false; break;
				case 'torole':
					this.isToRoleShow = false; break;
				case 'userallot':
					this.isUserAllotShow = false; break;
				case 'billdetail':
					this.isBillDetailShow = false; break;
				case 'billdetaillist':
					this.isBillDetailListShow = false; break;
				case 'addtenantadmin':
					this.isAddTenantAdminShow = false; break;
				case 'addterraceadmin':
					this.isAddTerraceAdminShow = false; break;
				case 'upload':
					this.isUploadShow = false; break;
				case 'appallot':
					this.isAppAllotShow = false; break;
				case 'amendmodule':
					this.isAmendModuleShow = false; break;
				case 'moduleallot':
					this.isModuleAllotShow = false; break;
				case 'resourceallot':
					this.isResourceAllotShow = false; break;
				case 'addappadmin':
					this.isAddAppAdminShow = false; break;
				case 'pay':
					this.isPayShow = false; break;
				case 'adduseradmin':
					this.isAddUserAdminShow = false; break;
				case 'appbilldetail':
					this.isAppBillDetailShow = false; break;
				case 'examinebilling':
					this.isExamineBillingShow = false; break;
				default: break;
            }
        }
    },
    created () {
        Bus.$on('onUserWindow',this.onUserWindow);//打开窗口
		Bus.$on('offUserWindow',this.offUserWindow);//关闭窗口
		this.CHANGE_APPLICATION(this.appId);
    }
}
</script>

<style lang="scss" scoped>
	// footer{
	// 	min-width: 1100px;
	// 	height: 120px;
	// 	background: #555;
	// 	margin-top: 820px;
	// 	clear: both;
	// }
	.operation-box{
		display: -ms-flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: flex;
		-ms-flex-direction: column;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		flex-direction: column;
		position: fixed;
		width: 100%;
		height: 100%;
		.operation-container{
			height: 100%;
			flex: 1;
			-ms-flex-: 1;
			-webkit-flex:1;
			-moz-flex: 1;
			position: relative;
		}
	}
</style>
