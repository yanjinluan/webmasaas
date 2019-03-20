<template>
    <div class="role-lists-box">
        <div class="role-lists-head">
            <h2>平台管理员分配</h2>
            <div class="off" @click="offAdminWindow">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="vague-box">
            <div class="vague-box-left">
                <div class="left-top">
                    <span>手机:</span>
                    <el-input type="text" v-model="phone" style="width:150px"></el-input>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>邮箱:</span>
                    <el-input type="text" v-model="email" style="width:150px"></el-input>
                </div>
                <div class="left-bottom">
                    <span>姓名:</span>
                    <el-input type="text" v-model="realName" style="width:150px"></el-input>
                    &nbsp;&nbsp;&nbsp;&nbsp;    
                    <span>账号:</span>
                    <el-input type="text" v-model="userName" style="width:150px"></el-input>
                </div>
            </div>
            <div class="vague-box-right">
                <el-button type="primary" @click="getUser">查询</el-button>
            </div>
        </div>
        <el-radio-group v-model="userId" class="user">
            <div v-for="item in userLists" :key="item.id" class="user-box">
                <el-radio :label="item.id">
                    <div class="user-realname">
                        姓名:{{item.realName}}
                    </div>
                    <div class="user-name">
                        账号:{{item.userName}}
                    </div>
                </el-radio>
            </div>
        </el-radio-group>
        <div class="no-user" v-if="isUserShow">暂无数据</div>
        <div class="btn-box">
            <el-button type="primary" @click="setAdmin" id="btn" :disabled='isDisabled'>提交</el-button>
            <el-button @click="offAdminWindow">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { Message, MessageBox } from 'element-ui';

export default {
    name:'TerraceAdmin',
    data () {
        return {
            isDisabled:false,
            phone:'',
            userName:'',
            realName:'',
            email:'',
            userId:'',
            userLists:[],
            isUserShow:true
        }
    },
    watch:{
        'userLists' ( val ) {
            if ( val.length > 0 ) {
                //有数据时隐藏无数据字符串
                this.isUserShow = false;
            }else {
                //无数据提示
                Message({
                    message:'查无此数据',
                    duration:1500,
                    type:'warning'
                });
                this.isUserShow = true;
            }
        }
    },
    methods:{
        offAdminWindow () { //打开新增窗口
            Bus.$emit('offUserWindow','addterraceadmin');
        },
        setAdmin () {
            this.isDisabled = true;//防止重复点击
            if(this.userId){
                this.$http.put(`/api/platform/administrators/${this.userId}/`).then( res => {
                    if (res.data == 'alreadyExists') {
                        Message({
                            message:'该用户已分配',
                            duration:1500,
                            type:'warning'
                        }); 
                        this.isDisabled = false;
                    } else {
                        Bus.$emit('offUserWindow','addterraceadmin');
                        Bus.$emit('busGetTerraceAdmin');
                        Message({
                            message:'添加成功',
                            duration:1500,
                            type:'success'
                        }); 
                    }
                }).catch( () => {
                    this.isDisabled = false;
                })
            }else{
                Message({
                    message:'请选择用户',
                    duration:1500,
                    type:'warning'
                });
                this.isDisabled = false;
            }
        },
        getUser () {
            //模糊查询方法
            let { realName, userName, phone, email } = this;
            //不能不使用模糊查询
            if ( realName || userName || phone || email ){
                this.$http.get('/api/users/',{params:{
                    realName,userName, phone, email
                }}).then( (res) => {
                    this.userLists = res.data.resp;
                })
            }else {
                //分配失败
                Message({
                    message:'请输入查询用户信息',
                    duration:1500,
                    type:'warning'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-lists-box{
        position: fixed;
        width: 560px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;
        color: #555;

        .role-lists-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
        .vague-box{
            padding-top: 20px;
            width: 540px;
            margin: 0 auto;
            height: 100px;
            line-height: 32px;
            box-sizing: border-box;
            
            .vague-box-left {
                width: 420px;
                height: 100px;
                float: left;

                .left-top, .left-bottom{
                    text-indent: 10px;
                    height: 50px;
                    line-height: 50px;
                }
            }

            .vague-box-right {
                width: 100px;
                height: 100px;
                line-height: 100px;
                text-align: center;
                float: left;
                
            }
        }
        .user {
            clear: both;
            line-height: 36px;
            padding: 16px 20px 0;
            width: 540px;
            max-height: 100px;
            overflow-y: auto;

            .user-box{
                .user-realname{
                    display: inline-block;
                    width: 160px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap
                }
                .user-name{
                    margin-left: 20px;
                    display: inline-block;
                    width: 230px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap
                }
            }
        }
        .no-user{
            text-align: center;
            margin: 20px 0;
        }
        .btn-box{
            clear: both;
            text-align: center;
            padding: 10px 0 30px 0;
        }
    }
</style>
