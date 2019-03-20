<template>
    <div class="add-user-box">
        <div class="add-user-head">
            <h2>添加用户</h2>
            <div class="off" @click="offAddUser">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div  class="register-input-box">
            <el-form :model="formList" status-icon :rules="rules" ref="formList" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号名" prop="userName">
                    <el-input v-model="formList.userName" spellcheck="false"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="formList.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="formList.checkPass"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="realName">
                    <el-input v-model="formList.realName"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formList.email" spellcheck="false"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="formList.phone"></el-input>
                </el-form-item>
           
               
                <!-- <el-form-item label="验证码" prop="number">
                    <el-input v-model="formList.number" style="width:180px;float:left"></el-input>
                    <el-button @click="getNumber" style="float:right" v-if="!isShow" width="180px">点击获取邮箱验证码</el-button>
                    <div class="time-box" v-if="isShow">{{ time }}s</div>
                </el-form-item> -->
                <el-form-item>
                    <el-button id="btn" :disabled='isDisabled' type="primary" @click="putInServer('formList')">提交</el-button>
                    <el-button @click="offAddUser">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
import Bus from '@/modules/bus';

export default {
    name:'AddUser',
    data () {
        var validatorUserName = (rule, value, callback) => {
            if ( !/^[A-Za-z][A-Za-z0-9]{5,15}$/.test(value) ) {
                callback(new Error('用户名格式不正确,6-16位字母和数字，以字母开头'));
            } else {
                //发送请求给后台 验证用户名是否重复
                this.$http.get('/api/users/registeruser/', {
                    params:{ userName:value }
                }).then((res)=>{
                    if (res.data.resp.length === 0){
                        callback()
                    }else{
                        callback(new Error('此账号已注册'));
                    }
                })
            }
        };
        var validatorPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formList.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var validatorRealName = (rule, value, callback) => {
            if ( !/^[\u0391-\uFFE5]{2,}$/.test(value) ) {
                callback(new Error('姓名格式有误，请正确输入'));
            } else {
                callback();
            }
        };
        var validatorEmail = (rule, value, callback) => {
            if ( !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) ) {
                callback(new Error('邮箱格式有误，请正确输入'));
                this.isEmail = false;
            } else {
                //发送请求给后台 验证邮箱是否重复
                this.$http.get('/api/users/', {
                    params:{ email:value }
                }).then((res)=>{
                    if (res.data.resp.length === 0){
                        callback()
                        this.isEmail = true;
                    }else{
                        callback(new Error('此邮箱已注册'));
                        this.isEmail = false;
                    }
                })
            }
        };
        var validatorPhone = (rule, value, callback) => {
            if ( !/^1[0-9]{10}$/.test(value) ) {
                callback(new Error('手机格式有误，请正确输入'));
            } else {
                //发送请求给后台 验证邮箱是否重复
                this.$http.get('/api/users/', {
                    params:{ phone:value }
                }).then((res)=>{
                    if (res.data.resp.length === 0){
                        callback()
                    }else{
                        callback(new Error('此手机号已注册'));
                    }
                })
            }
        };
        // var validatorNumber = (rule, value, callback) => {
        //     if(this.isRequest && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.formList.email) && value.length == 6) {
        //         //验证码验证
        //         this.$http.get('/api/users/verify/',{
        //             params:{email:this.formList.email,code:this.formList.number}
        //         }).then( res => {
        //             if(res.data){
        //                 callback();
        //             }else{
        //                 callback(new Error('验证码不正确'));
        //             }
        //         })
        //     }else {
        //         callback(new Error('验证码错误'));
        //         return false
        //     }
        // };
        return {
            isRequest:false,
            time:120,
            isShow:false,
            isEmail:false,
            isDisabled:false,
            formList: {
                userName:'',
                password: '',
                checkPass: '',
                email: '',
                realName:'',
                phone:'',
                number:'8888'
            },
            rules:{
                userName:[
                    { validator: validatorUserName, trigger: 'blur' }
                ],
                password: [
                    { validator: validatorPass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                realName:[
                    { validator: validatorRealName, trigger: 'blur' }
                ],
                email:[
                    { validator: validatorEmail, trigger: 'blur' }
                ],
                phone:[
                    { validator: validatorPhone, trigger: 'blur' }
                ]
                // number:[
                //     { validator: validatorNumber, trigger: ['blur'] }
                // ]
            }
        }
    },
    beforeDestroy () {
         Bus.$off('putNewPass');
    },
    methods:{
        offAddUser () {
            Bus.$emit('offUserWindow','adduser');
        },
        putInServer (formName) {
            this.isDisabled = true;//防止重复点击
            setTimeout( () => {
                this.isDisabled = false;
            }, 2000);
            let { userName, password, email, realName, phone } = this.formList;
            let params = { userName, password:this.$md(password), email, realName, phone };
            this.$refs[formName].validate( valid => {
                //注册
                if (valid) {
                    //注册交互开始
                    let loadingInstance = Loading.service({
                        text:'正在注册...',
                        customClass:'el-loading',
                        target:'.loading-container'
                    });
                    this.$http.post('/api/users/', params, {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    }).then( res => {
                        if( res.data.success ){//注册成功
                            Message({
                                message:'注册成功',
                                duration:1500,
                                type:'success'
                            });
                            loadingInstance.close();//结束注册交互
                            this.offAddUser();//关闭注册页面
                            Bus.$emit('busGetUserLists');//刷新页面
                        }
                    }).catch( () => {
                        loadingInstance.close();
                        this.isDisabled = false;
                    })
                }
            });
        },
        getNumber () {
            if(this.isEmail){    
                //发送验证码获取请求
                this.isRequest = true;//获取过验证码后 监听验证码发请求
                this.isShow = true;//显示读秒
                let time = setInterval( () => {
                    this.time--;
                    if(this.time === 0){
                        clearInterval(time);//清除计时器
                        this.time = 120;//还原读秒
                        this.isShow = false;//隐藏读秒
                    }
                }, 1000);
                this.$http.get('/api/users/email/register/',{//发送获取验证码请求
                    params:{email:this.formList.email}
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-user-box{
        position: absolute;
        width: 500px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .add-user-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .register-input-box{
            width: 100%;
            padding: 30px 30px 0 0;

            .time-box{
                float: right;
                width: 168px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                color: #606266;
                border: 1px solid #dcdfe6;
                -webkit-border-radius: 4px;
                -ms-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
        }
    }
</style>

