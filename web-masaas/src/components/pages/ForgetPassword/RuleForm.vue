<template>
    <div class="rule-from-box">
        <el-form  :model="formList" status-icon label-width="100px" :rules="rules" ref="formList" class="demo-ruleForm">
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="formList.userName"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="number">
                <el-input style="width:140px"  v-model="formList.number"></el-input>
                <el-button class="get-number" @click="getNumber" v-if="!isShow">点击获取邮箱验证码</el-button>
                <div class="time-box" v-if="isShow">{{ time }}s</div>
            </el-form-item>
            <el-form-item class="btn-box">
                <el-button type="primary" 
                    id="btn"
                    @click="putInServer('formList')">
                    提交
                </el-button>
                <el-button @click="exit">退出</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '../../../modules/bus';

export default {
    name:'RuleForm',
    props:['changeIsShow'],
    data () {
        var validatorUserName = (rule, value, callback) => {
            if ( !/^[A-Za-z][A-Za-z0-9]{5,15}$/.test(value) ) {
                callback(new Error('用户名格式不正确,6-16位字母和数字，以字母开头'));
                this.isUser = false;
            } else {
                //发送请求给后台 验证用户名是否重复
                 this.$http.get('/api/users/', {
                    params:{ userName:value }
                }).then(res=>{
                    if (res.data.resp.length === 0){
                        callback(new Error('无此账号'));
                        this.isUser = false;
                    }else{
                        callback();
                        this.isUser = true;
                    }
                })
            }
        };
        var validatorNumber = (rule, value, callback) => {
            if( this.isRequest && /^[A-Za-z][A-Za-z0-9]{5,15}$/.test(this.formList.userName) && value.length == 6) {
                this.$http.get('/api/users/verify/',{
                    params:{username:this.formList.userName,code:this.formList.number}
                }).then( res => {
                    if(res.data){
                        callback();
                    }else{
                        callback(new Error('验证码错误'));
                    }
                })
            }else {
                callback(new Error('验证码错误'));
                return false
            }
        };
        return{
            isShow:false,
            isRequest:false,
            isUser:false,
            time:120,
            formList: {
                userName:'',
                number:''
            },
            rules:{
                userName:[
                    { validator: validatorUserName, trigger: 'blur' }
                ],
                number:[
                    { validator: validatorNumber, trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        Bus.$on('putNewPass',this.putNewPass);
    },
    beforeDestroy () {
        Bus.$off('putNewPass');
    },
    methods:{
        exit () {
            this.$router.push({name:'home'});
        },
        putInServer (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {//验证成功逻辑
                    this.changeIsShow();//验证成功跳转改密码
                }
            });
        },
        getNumber () {
            if (this.isUser) {
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
                //发送验证码获取请求
                this.$http.get('/api/users/email/forget/',{
                    params:{username:this.formList.userName}
                }).then( res => {
                    return  false;
                })
            }
        },
        putNewPass (password) {//重置密码
            this.$http.put('/api/user/password/',{
                username:this.formList.userName,
                password:this.$md(password),
                validCode:this.formList.number
            }).then( res => {
               if ( res.data ) {
                    Message({
                        message:'修改密码成功',
                        duration:'1500',
                        type:'success'
                    })
                    setTimeout( () => {
                        this.$router.replace({name:'home'});
                    },800)
               }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .rule-from-box{
        .demo-ruleForm{
            padding-right: 60px;

            .get-number{
                float: right;
                width: 168px;
                height: 40px;
            }

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
                text-align: center;
            }
        }   
    }
</style>

