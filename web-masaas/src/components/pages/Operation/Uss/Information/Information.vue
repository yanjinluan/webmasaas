<template>
    <div class="information-box">
        <div class="container"
            v-loading="loading"
        >
            <header>
                <i class="fa fa-user-o"></i>
                <b>基本信息</b>
            </header>
            <main>
                <el-form  status-icon label-width="100px" class="demo-ruleForm" :model="lists" :rules="rules" ref="lists">
                    <el-form-item label="账号" prop="userName" style="width:360px">
                        <el-input v-model="lists.userName"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="realName" style="width:360px">
                        <el-input v-model="lists.realName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone" style="width:360px">
                        <el-input v-model="lists.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" style="width:360px">
                        <el-input v-model="lists.email"></el-input>
                    </el-form-item>
                </el-form>
                
                <div class="content-box">
                    <p>
                        当前状态:
                        <span v-if="lists.status===0">未激活</span>
                        <span v-if="lists.status===1">正常</span>
                        <span v-if="lists.status===2">冻结</span>
                    </p>
                </div>
                <!-- <el-form :model="code" ref="code" status-icon :rules="num" label-width="100px" class="demo-ruleForm" v-show="isCode" style="width:360px">
                    <el-form-item label="验证码" prop="number">
                    <el-input v-model="code.number" style="width:100px;float:left"></el-input>
                        <el-button style="float:right" v-if="!isShow" @click="getNumber">获取邮箱验证码</el-button>
                        <div class="time-box" v-if="isShow">{{time}}</div>
                    </el-form-item>
                </el-form> -->
                <!-- <div class="img-box">
                    <img :src="lists.userImg" alt="">
                </div> -->
                <div class="btn">
                    <el-button type="primary" @click="amendUser('lists')">保存</el-button>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState, mapMutations } from 'vuex';
import { CHANGE_USER_INFO } from '@/store/other/const';

export default {
    name:'Information',
    data () {
        var validatorRealName = (rule, value, callback) => {
            if ( !/^[\u0391-\uFFE5]{2,}$/.test(value) ) {
                callback(new Error('姓名格式有误，请正确输入'));
            } else {
                callback();
            };
            //判断是否显示验证码
            //this.ifShowCode()
        };
        var validatorEmail = (rule, value, callback) => {
            if ( !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) ) {
                callback(new Error('邮箱格式有误，请正确输入'));
                this.isHaveEamil = false;
            } else {
                if (value != this.preEmail){//修改时和原来一样
                    //发送请求给后台 验证邮箱是否重复
                    this.$http.get('/api/users/', {
                        params:{ email:value }
                    }).then((res)=>{
                        if (res.data.resp.length === 0){
                            callback()
                            this.isHaveEamil = true;
                        }else{
                            callback(new Error('此邮箱已注册'));
                             this.isHaveEamil = false;
                        }
                    })
                }else{
                    callback()
                }
            };
            // this.ifShowCode();
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
            //判断是否显示验证码
            //this.ifShowCode()
        };
        var validatorNumber = (rule, value, callback) => {
            if(this.isRequest && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.lists.email)) {
                //邮箱验证
                this.$http.get('/api/users/verify/',{
                    params:{email:this.lists.email, code:this.code.number}
                }).then( (res) => {
                    if(res.data){
                        callback();
                    }else{
                        callback(new Error('验证码不正确'));
                    }
                })
            }else {
                callback(new Error('验证码不正确'));
                return false
            }
        };
        return{
            lists:{},
            code:{
                number:'8888'
            },
            preEmail:'',
            prePhone:'',
            preRealName:'',
            time:120,
            isCode:false,
            isShow:false,
            isHaveEamil:false,
            isRequest:false,//是否发送邮件
            loading: true,
            // num:{
            //     number:[
            //         { validator: validatorNumber, trigger: ['blur'] }
            //     ]
            // },
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
        };
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    watch:{
        lists(){
            this.preEmail = this.lists.email;
            this.prePhone = this.lists.phone;
            this.preRealName = this.lists.realName;
        }
    },
    created () {
        //获取当前用户信息
        this.$http.get(`/api/user/`,{
            params:{
                userId: this.userId,
                time: new Date().getTime()
            }
        }).then( res => {
            this.lists = res.data.resp;
            this.loading = false;
        })
    },
    methods:{
        ...mapMutations([CHANGE_USER_INFO]),
        // getNumber () {
        //     if(this.isHaveEamil){  
        //         //发送验证码获取请求
        //         this.isRequest = true;//获取过验证码后 监听验证码发请求
        //         this.isShow = true;//显示读秒
        //         let time = setInterval( () => {
        //             this.time--;
        //             if(this.time === 0){
        //                 clearInterval(time);//清除计时器
        //                 this.time = 120;//还原读秒
        //                 this.isShow = false;//隐藏读秒
        //                 this.isRequest = false;
        //             }
        //         }, 1000);
        //         //
        //         this.$http.get('/api/users/email/update/',{//发送获取验证码请求
        //             params:{email:this.lists.email}
        //         })
        //     }
        // },
        // openScreen() {
        //     this.loading = this.$loading({
        //         text: '正在加载',
        //         spinner: 'el-icon-loading',
        //         background: '#fff',
        //         target:document.getElementsByClassName('operation-window')[0]
        //     });
        // },
        amendUser (formName) {
            let { phone, email, realName} = this.lists;
            let params = {//上送参数
                phone, 
                email, 
                realName, 
                id:this.lists.id, 
                code:this.code.number
            };  
            this.$refs[formName].validate( valid => {
                if (valid) {//验证成功逻辑
                    this.loading = true;
                    this.$http.put(`/api/user/?userId=${this.lists.id}`, params).then(res => {
                        this.loading = false;
                        //重新渲染数据列表页面
                        this.CHANGE_USER_INFO(res.data.resp);
                        this.preEmail = this.lists.email;
                        this.prePhone = this.lists.phone;
                        this.preRealName = this.lists.realName;
                        Message({
                            message:'修改成功',
                            duration:1500,
                            type:'success'
                        });
                    })     
                }
            })
            // if(this.preEmail === this.lists.email){//邮箱未改变
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {//验证成功逻辑
            //         let { phone, email, realName} = this.lists;
            //             let params = {//上送参数
            //                 phone, 
            //                 email, 
            //                 realName, 
            //                 id:this.lists.id, 
            //             };  
            //             this.$http.put(`/api/user/?userId=${this.lists.id}`, params).then(res => {
            //                 //重新渲染数据列表页面
            //                 this.CHANGE_USER_INFO(res.data.resp);
            //                 Message({
            //                     message:'修改成功',
            //                     duration:1500,
            //                     type:'success'
            //                 });
                        // this.preEmail = this.lists.email;
                        // this.prePhone = this.lists.phone;
                        // this.preRealName = this.lists.realName;
            //             })     
            //         }
            //     })
            // }else{
            //     this.$refs.code.validate((valid) => {
            //         if (valid) {//验证码正确时
            //             let { phone, email, realName} = this.lists;
            //             let params = {//上送参数
            //                 phone, 
            //                 email, 
            //                 realName, 
            //                 id:this.lists.id, 
            //                 code:this.code.number
            //             };  
            //             this.$refs[formName].validate((valid) => {
            //                 if (valid) {//验证成功逻辑
            //                     this.$http.put(`/api/user/?userId=${this.lists.id}`, params).then(res => {
            //                         //重新渲染数据列表页面
            //                         this.CHANGE_USER_INFO(res.data.resp)
                        // this.preEmail = this.lists.email;
                        // this.prePhone = this.lists.phone;
                        // this.preRealName = this.lists.realName;
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
        }
        // ifShowCode () {//判断是否显示验证码
        //     if(this.preEmail === this.lists.email){
        //         this.isCode = false
        //     }else{
        //         this.isCode = true
        //     }
        // }
    }
}
</script>

<style lang="scss" scoped>
    .information-box{
        width: 100%;
        height: 100%;
        color: #333;
        padding-top: 60px; 

       .container{
           margin: 0 auto 60px;
           width: 430px;
           box-shadow: 0 0 10px #ccc;
           background: #fff;

            header{
                height: 60px;
                line-height: 60px;
                text-indent: 20px;
                border-bottom: 1px solid #ccc;
                box-shadow: 0 0 4px #ccc;
                font-size: 20px;
                color: #409EFF;
                margin-bottom: 20px;
            }

            main{
                width: 370px;
                position: relative;

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

                .content-box{
                    padding: 10px 0;
                    color: #606266;
                    
                    p{
                        margin-left: 56px;
                        span {
                            margin-left: 6px;
                        }
                    }
                }

                // .img-box{
                //     width: 120px;
                //     height: 130px;
                //     position: absolute;
                //     top: 20px;
                //     left: 460px;
                //     right: 20px;

                //     img{
                //         width: 100%;
                //         height: 100%;
                //     }
                // }

                .btn{
                    width: 430px;
                    text-align: center;
                    padding-bottom: 20px;
                }
            }
       }
    }
</style>

