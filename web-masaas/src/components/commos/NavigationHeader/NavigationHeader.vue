<template>
    <header class="toolbar-header">
        <p class="title">
            居民采暖热计量平台
        </p>
        <div class="userinfo-box">
            <div class="change-app-box" @mouseover="haveApp" @mouseout="noApp">
                <span class="change-app">切换应用</span>
                <app-list v-if="isShow"></app-list>
            </div>
            <div class="head-img">
               <i class="fa fa-user-o"></i>
            </div>
            <p class="company-name">ID:{{ userInfo.realName }}</p>
            <el-button size='mini' type="warning" @click="exit">注销</el-button>
        </div>
    </header>
</template>

<script>
import { mapState } from 'vuex';
import AppList from './AppList';

export default {
    name:'ToolbarHeader',
    data () {
        return{
            title:'MASAAS',
            isShow:false
        }
    },
    computed:mapState({
        userInfo:(state) => {
            return state.other.userInfo
        }
    }),
    components:{
        AppList
    },
    methods:{
        haveApp () {
            this.isShow = true;
        },
        noApp () {
            this.isShow = false;
        },
        exit () {
            this.$clearSess();
            this.$router.push({name:'home'});
        }
    }
}
</script>

<style lang="scss" scoped>
    .toolbar-header {
        width: 100%;
        min-width: 1100px;
        height: 80px;
        line-height: 80px;
        background: #409EFF;
        color: #fff;
        font-size: 20px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: relative;
        z-index: 5;

        .title {
            height: 100%;
            float: left;
            text-indent: 140px;
            background: url(../../../../static/images/heat-logo.png) no-repeat 20px center;
            background-size: 110px;
        }
        .userinfo-box {
            float: right;
            margin-right: 10px;
            height: 80px;
            min-width:200px;
            display: -webkit-flex; 
            display: -moz-flex; 
            display: -ms-flex;
            display: flex;
            -webkit-jjustify-content:space-around;
            -moz-justify-content:space-around;
            -ms-justify-content:space-around;
            justify-content:space-around;
            -webkit-align-items:center;
            -moz-align-items:center;
            -ms-align-items:center;
            align-items:center;

            .change-app-box{
                font-size: 14px;
                padding-right: 10px;
                position: relative;
            }
            .company-name {
                padding: 0 10px;
                font-size: 14px;
                color: #fff;
            }
            .head-img {
                width:20px;
                height:40px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                font-size: 18px;
            }
        }
    }
</style>

