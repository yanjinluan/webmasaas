<template>
    <div class="admend-user-box">
        <div class="admend-user-head">
            <h2>修改用户</h2>
            <div class="off" @click="offAmendUser">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div  class="register-input-box">
            <el-form :model="user" status-icon :rules="rules" ref="user" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="realName">
                    <el-input v-model="user.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="user.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email" @input="changeEmail"></el-input>
                </el-form-item>
            </el-form>
            <!-- <el-form v-if="isShowCode" :model="code" status-icon :rules="num" ref="code" label-width="100px" class="demo-ruleForm">
                <el-form-item label="验证码" prop="number">
                    <el-input v-model="code.number" style="width:100px;float:left"></el-input>
                    <el-button @click="getNumber" style="float:right" v-if="!isShow">获取邮箱验证码</el-button>
                    <div class="time-box" v-if="isShow">{{ time }}s</div>
                </el-form-item>
            </el-form> -->
        </div>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="amendUser('user')">保存</el-button>
            <el-button @click="offAmendUser">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import Bus from '@/modules/bus';

export default {
    name:'AmendUser',
    data () {
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
            } else {
                if (value != this.preEmail){//修改时和原来不一样
                    //发送请求给后台 验证邮箱是否重复
                    this.$http.get('/api/users/', {
                        params:{ email:value }
                    }).then( res => {
                        if (res.data.resp.length === 0){
                            callback();
                        }else{
                            callback(new Error('此邮箱已注册'));
                        }
                    })
                }else{
                    callback();
                }
            }
        };
        var validatorPhone = (rule, value, callback) => {
            if ( !/^1[0-9]{10}$/.test(value) ) {
                callback(new Error('手机格式有误，请正确输入'));
            } else {
                if (value != this.prePhone){//修改时和原来一样
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
                }else{
                    callback()
                }
            }
        };
        // var validatorNumber = (rule, value, callback) => {
        //     if(this.isRequest && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.user.email) && value.length == 6) {
        //         //邮箱验证
        //         this.$http.get('/api/users/verify/',{
        //             params:{email:this.user.email,code:this.code.number}
        //         }).then( (res) => {
        //             if(res.data){
        //                 callback();
        //             }else{
        //                 callback(new Error('验证码不正确'));
        //             }
        //         })
        //     }else {
        //         callback(new Error('验证码不正确'));
        //         return false
        //     }
        // };
        return {
            isRequest:false,
            isDisabled:false,
            code:{
                number:'8888'
            },
            isShowCode:false,
            preEmail:'',
            prePhone:'',
            time:120,
            isShow:false,
            rules:{
                realName:[
                    { validator: validatorRealName, trigger: 'blur' }
                ],
                email:[
                    { validator: validatorEmail, trigger: 'blur' }
                ],
                phone:[
                    { validator: validatorPhone, trigger: 'blur' }
                ]
            },
            // num:{
            //     number:[
            //         { validator: validatorNumber, trigger: ['blur'] }
            //     ]
            // },
            user:{}
        }
    },
    computed:{
        ...mapState({
            userId:(state) => {//拿到要修改的用户id
                return state.getId.id;
            }
        })
    },
    created () {
        this.$http.get(`/api/users/${this.userId}/`).then( res => {
            this.user = res.data.resp;
        })
    },
    watch:{
        user () {
            //获取未改变之前的值
            this.preEmail = this.user.email;
            this.prePhone = this.user.phone;
        }
    },
    methods:{
        amendUser (formName) {
            let {userName, phone, email, realName} = this.user;
            let params = {//上送参数
                userName, phone, email, realName
            };  
            this.$refs[formName].validate( valid => {
                if (valid) {
                    this.$http.put('/api/users/' + this.user.id + '/', params).then( res => {
                        Bus.$emit('offUserWindow','amenduser');//关闭页面
                        Bus.$emit('busGetUserLists');//重新渲染数据列表页面
                        Message({
                            message:'修改成功',
                            duration:1500,
                            type:'success'
                        });
                    })     
                }
            })
            // if(!this.isShowCode){//没有修改邮箱
            //     let {userName, phone, email, realName} = this.user;
            //     let params = {//上送参数
            //         userName, phone, email, realName
            //     };  
            //     this.$refs[formName].validate( valid => {
            //         if (valid) {
            //             this.$http.put('/api/users/' + this.user.id + '/', params, {
            //                 headers: {
            //                     'Content-Type': 'application/json; charset=UTF-8'
            //                 }
            //             }).then( res => {
            //                 Bus.$emit('offUserWindow','amenduser');//关闭页面
            //                 Bus.$emit('busGetUserLists');//重新渲染数据列表页面
            //                 Message({
            //                     message:'修改成功',
            //                     duration:1500,
            //                     type:'success'
            //                 });
            //             })     
            //         }
            //     })
            // }else{//修改邮箱
            //     this.$refs.code.validate( valid => {
            //         if (valid) {//验证码正确时
            //             let {userName, phone, email, realName} = this.user;
            //             let params = {//上送参数
            //                 userName, phone, email, realName
            //             };  
            //             this.$refs[formName].validate( valid => {
            //                 if (valid) {//验证成功逻辑
            //                     this.$http.put('/api/users/' + this.user.id + '/', params, {
            //                         headers: {
            //                             'Content-Type': 'application/json; charset=UTF-8'
            //                         }
            //                     }).then( res => {
            //                         Bus.$emit('offUserWindow','amenduser');//关闭页面
            //                         Bus.$emit('busGetUserLists');//重新渲染数据列表页面
            //                         Message({
            //                             message:'修改成功',
            //                             duration:1500,
            //                             type:'success'
            //                         });
            //                     })     
            //                 }
            //             })
            //         }
            //     });
            // }
        },
        offAmendUser () {
            Bus.$emit('offUserWindow','amenduser');
        },
        getNumber () {
            this.$refs.user.validate( valid => {//发邮箱格式对时候发送验证码获取请求
                if(valid){
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
                    this.$http.get('/api/users/email/update/',{
                        params:{email:this.user.email}
                    })
                }
            });
        },
        changeEmail () {
            if(this.preEmail != this.user.email) {
                this.isShowCode = true;
            }else {
                this.isShowCode = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .admend-user-box{
        position: absolute;
        width: 420px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .admend-user-head{
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
            padding: 20px 70px 0 0;

            .time-box{
                float: right;
                width: 136px;
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
        
        .btn-box{
            text-align: center;
            padding-bottom: 20px;
        }
    }
</style>

