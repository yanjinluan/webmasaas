<template>
    <div class="forget-password-box">
        <app-header></app-header>
        <div class="from-box">
            <h3 class="title">
                <i class="fa fa-lock"></i>
                找回密码
            </h3>
            <rule-form v-show="isShow" :changeIsShow="changeIsShow"></rule-form>
            <new-password  v-show="!isShow"></new-password>
        </div>
    </div>
</template>

<script>
import AppHeader from '../../commos/AppHeader/AppHeader';
import NewPassword from './NewPassword';
import RuleForm from './RuleForm';

export default {
    name:'ForgetPassword',
    data () {
        return {
            isShow:true
        }
    },
    components:{
        AppHeader, RuleForm, NewPassword
    },
    methods:{
        changeIsShow () {
            this.isShow = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .forget-password-box{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../../../../static/images/login-bg.jpg') no-repeat center;
        background-size: 100% 100%;

        .from-box{
            width:480px;
            height: 280px;
            background: #fff;
            position: fixed;
            top: 60%;
            left: 50%;
            -webkit-transform: translate(-50%,-50%);
            -moz-transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            -ms-border-radius: 10px;
            border-radius: 10px;
            overflow: hidden;

            .title{
                height: 50px;
                line-height: 50px;
                text-indent: 20px;
                border: 1px solid #ccc;
                color: #555;
                margin-bottom: 30px;
            }
        }
    }
</style>

