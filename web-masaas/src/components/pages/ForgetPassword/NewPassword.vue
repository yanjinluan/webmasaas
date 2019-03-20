<template>
    <div class="newpassword-box">
        <el-form  :model="formList" status-icon label-width="100px" :rules="rules" ref="formList" class="demo-ruleForm">
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="formList.password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkpass">
                <el-input type="password" v-model="formList.checkpass"></el-input>
            </el-form-item>
            <el-form-item class="btn-box">
                <el-button type="primary"
                    @click="putInServer('formList')">提交</el-button>
                <el-button @click="exit">返回登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '../../../modules/bus';

export default {
    name:'NewPassword',
    data () {
        var validatorPassword = (rule, value, callback) => {
            if ( value === '' ) {
                callback(new Error('请输入密码'));
            } else {
                callback()
            }
        };
        var validatorCheckpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formList.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            formList: {
                password:'',
                checkpass:''
            },
            rules:{
                password:[
                    { validator: validatorPassword, trigger: 'blur' }
                ],
                checkpass:[
                    { validator: validatorCheckpass, trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        exit () {
            this.$router.push({name:'home'});
        },
        putInServer (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {//验证成功逻辑
                    Bus.$emit('putNewPass',this.formList.password);
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .newpassword-box{
        .demo-ruleForm{
            padding-right: 20px;

            .get-number{
                float: right;
            }

            .btn-box{
                padding-left: 70px;
            }
        }   
    }
</style>

