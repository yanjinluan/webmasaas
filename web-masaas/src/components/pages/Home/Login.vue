<template>
    <div class="login" ref="test">
        <a class="loading-container"></a>
        <div class="login-box">
            <div class="login-inner">
                <header>
                    <h2>用户登录</h2>
                </header>
                <el-form class="form-box">
                    <el-form-item>
                        <el-input type="text" placeholder="账号" v-model="username" ref="inpUser" spellcheck="false"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="password" placeholder="密码" v-model="password"></el-input>
                    </el-form-item>
                    <div class="memory-box">
                        <input type="checkbox" id="memory" ref="inp" @click="isMemory" :checked="memory">
                        <label for="memory">
                            记住我的用户登录名
                        </label>
                    </div>
                    <el-form-item>
                        <el-button id="btn" type="primary" style="width:100%" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
                <footer>
                    <span @click="register">立即注册</span>
                    <!-- <span>|</span>
                    <span @click="forgetpassword">忘记密码</span> -->
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Cookie from '@/modules/cookie';
import { Message, Loading } from 'element-ui';
import router from '@/router';
import Vue from 'vue';

export default {
    name:'Login',
    data () {
        return {
            username:'',
            password:'',
            memory:false, //默认没有选中
            isDisabled:false
        }
    },
    created () {
        //如果cookie里面有存入的数据说明上次登录选择了记住登录名
        if (Cookie.getCookie('username')) {
            this.username = Cookie.getCookie('username');
            this.memory = true;
        }
        Vue.nextTick( () => {
            //兼容火狐先失去焦点在聚焦
            this.$refs.inpUser.blur();
            this.$refs.inpUser.focus();
        })
    },
    methods:{
        login () { //登录逻辑
//          this.isDisabled = true;//防止重复点击
//          //登录交互开始
//          let loadingInstance = Loading.service({
//              text:'正在登录...',
//              customClass:'el-loading',
//              target:'.loading-container'
//			});
//          let { username, password } = this;
//          let params = {
//              username, 
//              password:this.$md(password), 
//              callback:(data, message) => {
//              if(data === 1) {
//                  //成功结束登陆交互
//                  loadingInstance.close(); 
//                  this.isDisabled = false;
//                  //登陆成功后跳转
//                  this.$router.replace({name:'toolbar'});
//                 
//              }else {
//                  //结束登陆交互
//                  loadingInstance.close(); 
//                  this.isDisabled = false;
//                  Message({
//                      message,
//                      duration:1500,
//                      type:'error'
//                  });
//              }
//     
//          }};
//          //调用vuexActions里的方法
//          this.$store.dispatch('login',params);
//          //如果点击了,记住用户名,存入cookie保留7天
//          if( this.memory ){
//              Cookie.createCookie("username", this.username, 7)
//          }else{
//              //没点击清除cookie
//              if(Cookie.getCookie('username')){ //如果存在删除
//                  Cookie.removeCookie('username');
//              }else{
//                  return false;
//              }
//          }
                    
//          this.$router.push({name: 'operation', params: {appId:'tenantSelfUserManage'}})
//           loadingInstance.close(); 
//           this.isDisabled = false;
             this.$router.replace({name:'toolbar'});
             
        },
        forgetpassword () {
            this.$router.push({name:'forgetpassword'});
        },
        register () {
            this.$router.push({name:'register'});
        },
        isMemory () {
            //是否记录username
            this.memory = this.$refs.inp.checked;
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-box {
       width: 320px;
       height: 350px;
       box-shadow: 0 0 10px #ccc;
       background: #fff;
       position: fixed;
       top: 50%;
       right: 150px;
       -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
       transform: translateY(-50%);

       header {
           color: #409EFF;
           height: 70px;
           line-height: 70px;
           border-bottom: 2px solid #409EFF;
           text-indent: 30px;
       }

       .form-box{
           padding: 20px 30px 0; 
       }

       .memory-box{
           margin-bottom: 20px;
       }

       footer{
            padding: 0 30px;
            span:hover{
               color: #409EFF;
               cursor:default;
            }
        }
    }

    
</style>

