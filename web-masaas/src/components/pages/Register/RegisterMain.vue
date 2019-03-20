<template>
    <div class="register-main-box">
        <a class="loading-container"></a>
        <div class="register-container">
            <p class="have">已有账号&nbsp;
                <router-link 
                    tag="a" 
                    :to="{name:'home'}">
                    返回登录
                </router-link>
            </p>
            <div class="register-content">
                <div class="register-header">
                    <h1>欢迎注册居民采暖热计量平台</h1>
                </div>
                <form  class="register-input-box">
                    <el-form :model="formList" status-icon :rules="rules" ref="formList" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model="formList.userName" spellcheck="false"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="formList.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="formList.checkPass"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model="formList.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="realName">
                            <el-input v-model="formList.realName" spellcheck="false"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="formList.email" spellcheck="false"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="验证码" prop="number">
                            <el-input v-model="formList.number" style="width:200px;float:left"></el-input>
                            <el-button @click="getNumber" style="float:right" v-if="!isShow">点击获取邮箱验证码</el-button>
                            <div class="time-box" v-if="isShow">{{ time }}s</div>
                        </el-form-item> -->
                        <el-form-item class="btn-box">
                            <el-button id="btn" :disabled='isDisabled' type="primary" @click="putInServer('formList')">提交</el-button>
                            <el-button @click="resetForm('formList')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { Loading } from 'element-ui';

export default {
    name:'RegisterMain',
    data () {
        var validatorUserName = (rule, value, callback) => {
            if ( !/^[A-Za-z\-][A-Za-z0-9\-]{5,15}$/.test(value) ) {
                callback(new Error('用户名格式不正确,6-16位字母和数字，以字母开头'));
            } else {
                //发送请求给后台 验证用户名是否重复
                this.$http.get('/api/users/registeruser/', {
                    params:{ userName:value }
                }).then(res => {
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
                }).then(res=>{
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
                }).then(res=>{
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
        //         this.$http.get('/api/users/verify/',{
        //             params:{email:this.formList.email,code:this.formList.number}
        //         }).then( res => {
        //             if(res.data){
        //                 callback();
        //             }else{
        //                 callback(new Error('验证码错误'));
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
            isDisabled:false,
            isEmail:false,
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
    methods: {
        resetForm(formName) {//重置表单
            this.$refs[formName].resetFields();
        },
        putInServer (formName) {
            this.isDisabled = true;//防止重复点击
            setTimeout( () => {
                this.isDisabled = false;
            }, 2000);
            let { userName, password, email, realName, phone, number } = this.formList;
            let params = { 
                userName, 
                password:this.$md(password), 
                email, 
                realName, 
                phone, 
                code:number 
            };
            this.$refs[formName].validate( valid => {
                if ( valid ) {
                    //注册交互开始
                    let loadingInstance = Loading.service({
                        text:'正在注册...',
                        customClass:'el-loading',
                        target:'.loading-container'
                    });
                    this.$http.post('/api/users/', params).then( res => {
                        if(res.data.success){
                            loadingInstance.close();
                            Message({
                                message:'注册成功',
                                duration:1500,
                                type:'success'
                            });
                            setTimeout( () => {
                                this.$router.replace({name:'home'});
                            },800)
                        }
                        
                    }).catch(res => {
                        loadingInstance.close();
                        Message({
                            message:'网络异常服务器请求错误',
                            duration:'1200',
                            type:'error'
                        })
                    })
                }
            });
        }
        // getNumber () {
        //     if(this.isEmail){    
        //         //发送验证码获取请求
        //         this.isRequest = true;//获取过验证码后 监听验证码发请求
        //         this.isShow = true;//显示读秒
        //         let time = setInterval( () => {
        //             this.time--;
        //             if(this.time === 0){
        //                 clearInterval(time);//清除计时器
        //                 this.time = 120;//还原读秒
        //                 this.isShow = false;//隐藏读秒
        //             }
        //         }, 1000);
        //         this.$http.get('/api/users/email/register/',{//发送获取验证码请求
        //             params:{email:this.formList.email}
        //         })
        //     }
        // }
    }
}
</script> 

<style lang="scss" scoped>
    .register-main-box {
        position: fixed;
        width: 100%;
        height: 100%;
        background: url('../../../../static/images/home-bg.jpg') no-repeat;
        background-size: 100% 100%; 
          
        .register-container{
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            padding: 20px 0 20px 0;
            width: 600px;
            box-shadow: 0 0 10px #666;
            background: #fff;
            margin: 0 auto;

            .have{
                font-size: 12px;
                width: 100%;
                text-align: right;
                padding-right: 10px;
            }

            .register-content {
                width: 500px;
                margin: 0 auto;
                position: relative;

                .register-header {
                    width: 100%;
                    height: 80px;
                    text-align: center;
                    line-height: 80px;
                    color:#555;
                    margin-bottom: 20px;
                }

                .register-input-box{
                    width: 100%;
                   
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

                    .btn-box{
                        margin-left: 70px;
                    }
                }
            }
        }
    }
</style>

