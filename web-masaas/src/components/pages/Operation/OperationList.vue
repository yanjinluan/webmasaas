<template>
    <div class="operation-list-box">
        <div class="loading-container"></div>
        <transition name="el-zoom-in-top">
            <div class="operation-list" v-if="isMenuShow">
                <ul class="list-box"
                    v-for="(list, index) in lists"
                    :key="list.id"
                >
                    <li class="list" 
                        :class="[list.isShow?'list-bg':'']"
                        @click="changeFirstMenuId(index)"
                    >
                        {{list.name}}
                        <i :class="[!list.isShow?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
                    </li>
                    <el-collapse-transition>
                        <ul class="child-list-box" v-if="list.isShow">
                            <li class="child-list"
                                v-for="childList in list.children"
                                :key="childList.id"
                                @click="changeSecondMenuId(childList.id, childList.tag)"
                                :class="[childList.id===secondMenuId?'list-color':'']"
                            >{{childList.name}}</li>
                        </ul>
                    </el-collapse-transition>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import router from '@/router';
import { Loading } from 'element-ui';

export default {
    name:'OperationList',
    data () {
        return {
//          lists:[],
           lists:[
{
"appId": "0",
"children": [{
"appId": "0",
"id": "5c13271989dbbc20488bb9e2",
"index": 1,
"name": "用户管理",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "5c13271989dbbc20488bb9e1",
"tag": "Usermanage"
}, {
"appId": "0",
"id": "5c13271989dbbc20488bb9e3",
"index": 2,
"name": "角色管理",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "5c13271989dbbc20488bb9e1",
"tag": "Rolemanage"
}],
"id": "5c13271989dbbc20488bb9e1",
"index": 2,
"name": "系统管理",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "",
"tag": "userManage"
}
,{
"appId": "0",
"children": [{
"appId": "0",
"id": "1",
"index": 1,
"name": "申办列表",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "11111",
"tag": "bidList"
}, {
"appId": "0",
"id": "2",
"index": 2,
"name": "活动列表",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "11111",
"tag": "activeList"
},{
"appId": "0",
"id": "3",
"index": 2,
"name": "订单列表",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "11111",
"tag": "orderList"
},{
"appId": "0",
"id": "4",
"index": 2,
"name": "票据列表",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "11111",
"tag": "billList"
},{
"appId": "0",
"id": "5",
"index": 2,
"name": "活动日历",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "11111",
"tag": "activeCalendar"
}],
"id": "11111",
"index": 2,
"name": "活动管理",
"pageNumber": 0,
"pageSize": 0,
"pageStart": 0,
"parentId": "",
"tag": "activeManage"
}

//,{
//"appId": "0",
//"children": [{
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e2",
//"index": 1,
//"name": "用户信息",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e1",
//"tag": "userInfo"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e3",
//"index": 2,
//"name": "审计日志",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e1",
//"tag": "userOperLog"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e4",
//"index": 3,
//"name": "用户管理员配置",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e1",
//"tag": "userManager"
//}],
//"id": "5c13271989dbbc20488bb9e1",
//"index": 2,
//"name": "用户管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "",
//"tag": "userManage"
//}, 
//
//{
//"appId": "0",
//"children": [{
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e6",
//"index": 1,
//"name": "平台信息",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e5",
//"tag": "platformInfo"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e7",
//"index": 2,
//"name": "应用接入",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e5",
//"tag": "applicationAdapt"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9e8",
//"index": 3,
//"name": "平台管理员配置",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e5",
//"tag": "platformManager"
//}],
//"id": "5c13271989dbbc20488bb9e5",
//"index": 3,
//"name": "平台管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "",
//"tag": "platformManage"
//}, {
//"appId": "0",
//"children": [{
//"appId": "0",
//"id": "5c13271989dbbc20488bb9ea",
//"index": 1,
//"name": "运用状态",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "applicationStatus"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9eb",
//"index": 2,
//"name": "模块管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "moduleManage"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9ec",
//"index": 3,
//"name": "资源管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "resourceManage"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9ed",
//"index": 4,
//"name": "应用管理员配置",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "applicationManager"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9ee",
//"index": 5,
//"name": "租户接入",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "tenantAdapt"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9ef",
//"index": 6,
//"name": "租户运营状况",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "tenantStatus"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f0",
//"index": 7,
//"name": "流控规则管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "flowControlRule"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f1",
//"index": 8,
//"name": "计费规则管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "feeRule"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f2",
//"index": 9,
//"name": "计费账单",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9e9",
//"tag": "bill"
//}],
//"id": "5c13271989dbbc20488bb9e9",
//"index": 4,
//"name": "应用管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "",
//"tag": "applicationManage"
//}, {
//"appId": "0",
//"children": [{
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f4",
//"index": 1,
//"name": "用户管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantSelfUserManage"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f5",
//"index": 2,
//"name": "⻆色管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantSelfRoleManage"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f6",
//"index": 3,
//"name": "机构管理",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantSelfOrganizationManage"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f7",
//"index": 4,
//"name": "计费账单",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantSelfBill"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9f8",
//"index": 5,
//"name": "审计日志",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantSelfOperLog"
//}, {
//"appId": "0",
//"id": "5c13271989dbbc20488bb9fa",
//"index": 7,
//"name": "租户管理员配置",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "5c13271989dbbc20488bb9f3",
//"tag": "tenantManager"
//}],
//"id": "5c13271989dbbc20488bb9f3",
//"index": 5,
//"name": "租户自服务",
//"pageNumber": 0,
//"pageSize": 0,
//"pageStart": 0,
//"parentId": "",
//"tag": "tenantSelf"
//}
],
            secondMenuId:''
        }
    },
    props:['isMenuShow', 'changeOperationWindow'],
    computed: {
        ...mapState({
            userId:(state) => {
                return state.other.userInfo.id
            },
            applicationId (state) {
                return state.appId.applicationId;
            }
            ,token:(state) => {
                return state.token.token;
            }
        })
        
   
    },
    created () {
        this.$nextTick( () => {
            let loadingInstance = Loading.service({
                text:'正在加载...',
                customClass:'el-loading',
                target:'.loading-container'
            });
            setTimeout( () => {
                loadingInstance.close(); 
            }, 500)  
        }) 
        router.beforeEach((to, from, next) => {//当前显示位子
            this.lists.forEach( item => {
                item.children.forEach( obj => {
                    if (obj.tag == to.name){
                        this.secondMenuId = obj.id;
                        item.isShow = true;
                    }
                })
            })
            next();
        })
        //获取列表数据
//      this.$http.get(`/api/aa/tokens/users/${this.userId}/modules/`).then( res => {
//          let lists = res.data.resp;
//          lists.forEach( item => {
//              Vue.set(item,'isShow',false);
//              item.children.forEach( obj => {
//                  if (obj.tag == this.$route.name){
//                      this.secondMenuId = obj.id;
//                      item.isShow = true;
//                  }
//              })
//          })
//          this.lists = lists;
//      })
        
     	this.lists.forEach( item => {
     	  	Vue.set(item,'isShow',false);
     	  	item.children.forEach( obj => {
     	  		this.secondMenuId = obj.id;
     	  		item.isShow = true;
     	  	})
     	})
     	
//   	
//   	this.$http.get('/api/syscontr/index'+'?token='+this.token).then( res => { 
//   	   console.log(res.data);
//   	   let lists = res.data.menus;
//     	   lists.forEach( item => {
////     	   	    console.log(item);
//              Vue.set(item,'isShow',false);
//              item.children.forEach( obj => {
//                  if (obj.tag == this.$route.name){
//                      this.secondMenuId = obj.id;
//                      item.isShow = true;
//                  }
//              })
//          })
//          this.lists = lists;
//   	   
//   	})
      
    },
    methods:{
        changeFirstMenuId (index) { //二级菜单显示隐藏
            if(this.lists[index].isShow){
                this.lists[index].isShow = false
            }else{
                this.lists[index].isShow = true
            }
        },
        changeSecondMenuId (id, rotername) {//点击二级菜
            if(id == this.secondMenuId){
                this.changeOperationWindow();
            }else{
                this.secondMenuId = id;
                this.$router.push({name:rotername});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .operation-list-box{
        .operation-list {
            position: absolute;
            width: 244px;
            height: 100%;
            border-right:1px solid #ccc;
            background: #f7f7f7;
            z-index: 1;
            overflow: auto;

            .list-box{
                .list{
                    width: 100%;
                    min-height: 40px;
                    line-height: 40px;
                    text-indent: 56px;

                    &.list-bg{
                        background:#409EFF;
                        color: #fff;
                    }

                    i{
                        float: right;
                        margin-right: 30px;
                        line-height: 40px;
                    }
                }

                .list:hover{
                    background:#409EFF;
                    color: #fff;
                }

                .child-list-box{
                    border-bottom: 1px solid #ccc;
                    .child-list{
                        height: 30px;
                        line-height: 30px;
                        text-indent: 56px;
                        font-size: 12px;

                        &.list-color{
                            color: #d43d3d;
                        }
                    }
                    .child-list:hover{
                        background: #dedede;
                    }
                }
            }
        }
    }
</style>

