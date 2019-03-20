<template>
    <div class="information-box">
        <div class="container">
            <header>
                <i class="fa fa-lock"></i>
                <b>修改密码</b>
            </header>
            <el-form :model="formList" status-icon label-width="100px" :rules="rules" ref='formList' class="demo-ruleForm">
                <el-form-item label="原密码" prop="oldpassword" >
                    <el-input type="password" auto-complete="off" v-model="formList.oldpassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="formList.password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkpass">
                    <el-input type="password" v-model="formList.checkpass" ></el-input>
                </el-form-item>
                <el-form-item class="btn-box">
                    <el-button id="btn" type="primary" @click="setPassword">提交</el-button>
                    <!-- <el-button @click="goForgetPassword">忘记密码</el-button> -->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState, mapMutations } from 'vuex';
import md from '@/modules/md5.js';

export default {
    name:'AmendPassword',
    data () {
        var validatorOldPassword = (rule, value, callback) => {
            if ( value === '' ) {
                callback(new Error('请输入原密码'));
            } else {
                callback()
            }
        };
        var validatorPassword = (rule, value, callback) => {
            if ( value === '' ) {
                callback(new Error('请输入新密码'));
            } else {
                callback()
            }
        };
        var validatorCheckpass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value === this.formList.password) {
                callback();
            } else {
                callback(new Error('两次输入新密码不一致!'));
            }
        };
        return {
            formList: {
                oldpassword:'',
                password:'',
                checkpass:''
            },
            rules:{
                oldpassword:[
                    { validator: validatorOldPassword, trigger: 'blur' }
                ],
                password:[
                    { validator: validatorPassword, trigger: 'blur' }
                ],
                checkpass:[
                    { validator: validatorCheckpass, trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    methods:{
        goForgetPassword () {
            this.$router.push({name:'forgetpassword'})
        },
        setPassword () {
            this.$refs.formList.validate( valid => {
                if(valid){
                    this.$http.put(`/api/user/password/?userId=${this.userId}`,{
                        id:this.userId,
                        password:this.$md(this.formList.password),
                        oldPassword:this.$md(this.formList.oldpassword)
                    }).then( res => {
                        if (res.data) {
                            Message({
                                message:'修改成功',
                                duration:1500,
                                type:'success'
                            });
                            this.exit();
                        }else {
                            Message({
                                message:'旧密码错误',
                                duration:1500,
                                type:'error'
                            });
                        }
                    })
                }
            })
        },
        exit () {
            this.$clearSess();
            this.$router.push({name:'home'});
        }
    }
}
</script>

<style lang="scss" scoped>
    .information-box{
        width: 100%;
        height: 100%;
        padding-top: 100px; 

        .container {
            margin: 0 auto 80px;
            width: 5rem;
            min-width: 500px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px #ccc;
            .demo-ruleForm{
                margin-top: 20px;
                padding-right: 50px;
            }

            header{
                height: 60px;
                line-height: 60px;
                text-indent: 20px;
                border-bottom: 1px solid #ccc;
                box-shadow: 0 0 4px #ccc;
                font-size: 20px;
                color: #409EFF;
            }
        }
    }

</style>

