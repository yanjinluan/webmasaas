import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import Home from '@/components/pages/Home/Home'; //主页面登录
import Register from '@/components/pages/Register/Register'; //注册\n
// import ForgetPassword from '@/components/pages/ForgetPassword/ForgetPassword';//忘记密码
import Toolbar from '@/components/pages/Toolbar/Toolbar';//功能页面
import Operation from '@/components/pages/Operation/Operation';//操作页面
import Information from '@/components/pages/Operation/Uss/Information/Information';//用户自服务基本信息操作页面
import Log from '@/components/pages/Operation/Uss/Log/Log';//用户自服务-查询日志页面

import Usermanage from '@/components/pages/Operation/System/Usermanage/Usermanage';//系统管理-用户管理
import Rolemanage from '@/components/pages/Operation/System/Rolemanage/Rolemanage';//系统管理-角色管理
import RoleAndPower from '@/components/pages/Operation/System/RoleAndPower/RoleAndPower';//系统管理-角色管理-角色权限
import UserAndRole from '@/components/pages/Operation/System/UserAndRole/UserAndRole';//系统管理-用户管理-用户权限

import bidList from '@/components/pages/Operation/Activity/bidList/bidList';//活动管理-申办列表
import bidDetail from '@/components/pages/Operation/Activity/bidList/bidDetail';//活动管理-申办列表--申办详情
import approval from '@/components/pages/Operation/Activity/bidList/approval';//活动管理-申办列表--审核页面

import activeList from '@/components/pages/Operation/Activity/activeList/activeList';//活动管理-活动列表
import publish from '@/components/pages/Operation/Activity/activeList/publish';//活动管理-发布活动
import activeDetail from '@/components/pages/Operation/Activity/activeList/activeDetail';//活动管理-活动详情
import editorActive from '@/components/pages/Operation/Activity/activeList/editorActive';//活动管理-编辑活动





import orderList from '@/components/pages/Operation/Activity/orderList/orderList';//活动管理-订单列表
import orderDetail from '@/components/pages/Operation/Activity/orderList/orderDetail';//活动管理-订单详情

import billList from '@/components/pages/Operation/Activity/billList/billList';//活动管理-票据列表
import billDetail from '@/components/pages/Operation/Activity/billList/billDetail';//活动管理-票据详情

import activeCalendar from '@/components/pages/Operation/Activity/activeCalendar/activeCalendar';//活动管理-活动日历

import Userinfo from '@/components/pages/Operation/UserControl/Userinfo/Userinfo';//用户管理-用户信息
import Userlog from '@/components/pages/Operation/UserControl/Userlog/Userlog';//用户管理-审计日志
import Useradmin from '@/components/pages/Operation/UserControl/Useradmin/Useradmin';//用户管理-用户管理员配置
import AmendPassword from '@/components/pages/Operation/Uss/AmendPassword/AmendPassword';//修改密码页面
import Role from '@/components/pages/Operation/Tenant/Role/Role';//租户管理-角色管理操作页面
import User from '@/components/pages/Operation/Tenant/User/User';//租户管理-用户管理操作页面
import Organization from '@/components/pages/Operation/Tenant/Organization/Organization';//租户管理-机构管理操作页面
import Bill from '@/components/pages/Operation/Tenant/Bill/Bill';//租户管理-账单
import TenantStatus from '@/components/pages/Operation/Tenant/TenantStatus/TenantStatus';//租户管理-运营状态
import TenantAdmin from '@/components/pages/Operation/Tenant/TenantAdmin/TenantAdmin';//租户管理-租户管理员
import TenantLog from '@/components/pages/Operation/Tenant/Log/Log';//租户管理-审计日志
import JoinApp from '@/components/pages/Operation/Terrace/JoinApp/JoinApp';//应用管理-应用接入
import TerraceInfo from '@/components/pages/Operation/Terrace/TerraceInfo/TerraceInfo';//应用管理-平台信息
import TerraceAdmin from '@/components/pages/Operation/Terrace/TerraceAdmin/TerraceAdmin';//应用管理-管理员配置
import LackPage from '@/components/pages/Operation/LackPage/LackPage';//操作缺省页面
import AppAdmin from '@/components/pages/Operation/AppManage/AppAdmin/AppAdmin';//应用模块-应用管理员
import AppState from '@/components/pages/Operation/AppManage/AppState/AppState';//应用模块-运行状态
import AppResource from '@/components/pages/Operation/AppManage/AppResource/AppResource';//应用模块-资源定义
import AppModule from '@/components/pages/Operation/AppManage/AppModule/AppModule';//应用模块-模块定义
import AppTenementJion from '@/components/pages/Operation/AppManage/AppTenementJion/AppTenementJion';//应用模块-租户接入
import AppTenementState from '@/components/pages/Operation/AppManage/AppTenementState/AppTenementState';//应用模块-租户状态
import AppFluidRule from '@/components/pages/Operation/AppManage/AppFluidRule/AppFluidRule';//应用模块-流控规则
import AppBilling from '@/components/pages/Operation/AppManage/AppBilling/AppBilling';//应用模块-计费规则
import AppBill from '@/components/pages/Operation/AppManage/AppBill/AppBill';//应用模块-计费账单

export default new Router({
    routes: [
		{ path:'',redirect:'/home'},
        { path:'/home', name:'home', component: Home },
		{ path:'',redirect:'/home' },
        { path:'/register', name:'register', component:Register },
        { path:'/toolbar', name:'toolbar', component:Toolbar },
        // { path:'/forgetpassword', name:'forgetpassword', component:ForgetPassword },
        { path:'/operation/:appId', name:'operation', component:Operation, props:true, children:[
            { path:'tenantSelfRoleManage', name:'tenantSelfRoleManage', component:Role },
            { path:'tenantSelfUserManage', name:'tenantSelfUserManage', component:User },
            { path:'tenantSelfOrganizationManage', name:'tenantSelfOrganizationManage', component:Organization },
            { path:'userSelfInfo', name:'userSelfInfo', component:Information },
            { path:'userSelfOperLog', name:'userSelfOperLog', component:Log },
            { path:'userSelfPassword', name:'userSelfPassword', component:AmendPassword },
            
            { path:'Usermanage', name:'Usermanage', component:Usermanage},
            { path:'Rolemanage', name:'Rolemanage', component:Rolemanage},
            { path:'RoleAndPower', name:'RoleAndPower', component:RoleAndPower},
            { path:'UserAndRole', name:'UserAndRole', component:UserAndRole},
            
            
            { path:'bidList', name:'bidList', component:bidList},
            { path:'bidDetail', name:'bidDetail', component:bidDetail},
            { path:'approval', name:'approval', component:approval},            
            { path:'activeList', name:'activeList', component:activeList},
            { path:'activeDetail', name:'activeDetail', component:activeDetail},           
            { path:'publish', name:'publish', component:publish}, 
            { path:'editorActive', name:'editorActive', component:editorActive}, 
                      
            { path:'orderList', name:'orderList', component:orderList},
            { path:'orderDetail', name:'orderDetail', component:orderDetail},             
            { path:'billList', name:'billList', component:billList},
            { path:'billDetail', name:'billDetail', component:billDetail},
          
            { path:'activeCalendar', name:'activeCalendar', component:activeCalendar},
            
            
            { path:'userInfo', name:'userInfo', component:Userinfo },
            { path:'userOperLog', name:'userOperLog', component:Userlog },
//          { path:'userManager', name:'userManager', component:Useradmin },
            { path:'tenantSelfBill', name:'tenantSelfBill', component:Bill },
            { path:'tenantSelfStatus', name:'tenantSelfStatus', component:TenantStatus },
            { path:'tenantManager', name:'tenantManager', component:TenantAdmin },
            { path:'tenantSelfOperLog', name:'tenantSelfOperLog', component:TenantLog },
            { path:'applicationAdapt', name:'applicationAdapt', component:JoinApp },
            { path:'platformInfo', name:'platformInfo', component:TerraceInfo },
            { path:'platformManager', name:'platformManager', component:TerraceAdmin },
            {path:'lackpage', name:'lackpage', component:LackPage},
            {path:'applicationManager', name:'applicationManager', component:AppAdmin},
            {path:'applicationStatus', name:'applicationStatus', component:AppState},
            {path:'resourceManage', name:'resourceManage', component:AppResource},
            {path:'moduleManage', name:'moduleManage', component:AppModule},
            {path:'tenantAdapt', name:'tenantAdapt', component:AppTenementJion},
            {path:'tenantStatus', name:'tenantStatus', component:AppTenementState},
            {path:'flowControlRule', name:'flowControlRule', component:AppFluidRule},
            {path:'feeRule', name:'feeRule', component:AppBilling},
            {path:'bill', name:'bill', component:AppBill}
        ] },
        {path:'/*', redirect:'/home'}
    ]
})
