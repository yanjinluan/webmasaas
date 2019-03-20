<template>
    <div class="role-lists-box">
        <have-user-org 
            v-if="isShow" 
            :changeIsShow="changeIsShow"
            :orgObj="orgObj"
        ></have-user-org>
        <div class="role-lists-head">
            <h2>当前机构分配用户</h2>
            <div class="off" @click="offUserAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role">
            <span>当前机构:</span>
            {{orgObj.name}}
        </div>
        <div class="role">
            <span>已分配用户:</span>
            <el-button class="btn" size="mini" type="primary" @click="changeIsShow(true)">查看</el-button>
        </div>
        <div class="user-box">
            可分配用户查询:
        </div>
        <div class="vague-box">
            <div class="vague-box-left">
                <div class="left-top">
                    <div class="vague-option">
                        <span>手机:</span>
                        <input type="text" v-model="phone">
                    </div>
                    <div class="vague-option">
                        <span>邮箱:</span>
                        <input type="text" v-model="email">
                    </div>
                </div>
                <div class="left-bottom">
                    <div class="vague-option">
                        <span>姓名:</span>
                        <input type="text" v-model="realName">
                    </div>
                    <div class="vague-option">
                        <span>账号:</span>
                        <input type="text" v-model="userName">
                    </div>
                </div>
            </div>
            <div class="vague-box-right">
                <el-button size="mini" type="primary" @click="getUser">查询</el-button>
            </div>
        </div>
        <div class="no-user" v-if="isUserShow">暂无数据</div>
        <el-radio-group v-model="userId" v-if="!isUserShow" class="user">
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
        <div class="btn-box">
            <el-button id="btn" type="primary" size="mini" @click="setUser">保存</el-button>
            <el-button size="mini" @click="offUserAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';
import HaveUserOrg from './HaveUserOrg';

export default {
    name:'UserAllot',
    data(){
        return{
            orgObj:{},
            userLists:'',
            userId:'',
            isShow:false,
            isUserShow:true,//无数据显示
            realName:'',
            userName:'',
            email:'',
            phone:''
        }
    },
    components:{
        HaveUserOrg
    },
    created () {
        //获取机构列表
        this.$http.get(`/api/tenant/organizations/${this.orgId}/`, {
            params:{
                appId: this.appId
            },
            headers:{
                'Operate-Application-Id': this.appId
            }
        }).then( res => {
           this.orgObj = res.data.resp;
        })
    },
    computed:{
        ...mapState({
            orgId:(state) => {//获取机构Id
                return state.getId.id;
            },
            appId:(state) => {
                return state.getId.appId;
            }
        })
    },
    watch:{
        userLists ( val ) {
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
        offUserAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','userallot');
        },
        changeIsShow ( status ) {//控制已分配窗口显示隐藏
            this.isShow = status;
        },
        setUser () {
           if (this.userId){
               //给机构配用户
               this.$http.post(`/api/tenant/organizations/${this.orgObj.id}/users/${this.userId}/`,{
                   appId:this.appId,
                   userId:this.userId,
                   organizationId:this.orgObj.id
               }, {
                   headers:{
                        'Operate-Application-Id': this.appId
                    }
               }).then( res => {
                    if (res.data == 'alreadyExists') {
                        Message({
                            message:'该用户已分配',
                            duration:1500,
                            type:'warning'
                        }); 
                    } else {
                        Message({
                            message:'添加成功',
                            duration:1500,
                            type:'success'
                        }); 
                    }
                })
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

        .role{
            padding-left: 30px;
            margin: 30px auto;

            .inp{
                width: 220px;
                height: 40px;
                padding-left: 10px;
            }

            .btn{
                margin-left: 10px;
            }
        }

        .user-box{
            padding-left: 30px;
            height: 40px;
            line-height: 40px;
            align-items: center; 
            color: #409EFF;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .vague-box{
            width: 540px;
            margin: 0 auto;
            height: 80px;
            line-height: 32px;
            box-sizing: border-box;
            
            .vague-box-left {
                width: 420px;
                height: 80px;
                float: left;

                .left-top, .left-bottom{
                    height: 40px;
                    display: flex;
                    align-items: center;

                    .vague-option{
                        margin-left: 20px;
                        float: left;
                        width: 200px;
                        height: 32px;

                        input{
                            width: 150px;
                            height: 100%;
                            padding-left: 6px;
                            border: 1px solid #ccc;
                        }
                    }
                }
            }

            .vague-box-right {
                width: 100px;
                height: 80px;
                line-height: 80px;
                text-align: center;
                float: left;
                
            }
        }
        
        .no-user{
            text-align: center;
            margin: 20px 0;
        }

        .user{
            display: block;
            width: 540px;
            max-height: 80px;
            overflow-y: auto;
            margin: 20px auto;

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

        .btn-box{
            clear: both;
            text-align: center;
            padding: 10px 0 30px 0;
        }
    }
</style>
