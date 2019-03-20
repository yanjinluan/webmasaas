<template>
    <div class="role-lists-box">
        <have-user-role 
            v-if="isShow" 
            :changeIsShow="changeIsShow"
            :role="role"
        ></have-user-role>
        <div class="role-lists-head">
            <h2>角色分配</h2>
            <div class="off" @click="offRoleAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role">
            <span>当前角色:</span>
            {{role.name}}
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
            <el-button id="btn" type="primary" size="mini" @click="setRole">保存</el-button>
            <el-button size="mini" @click="offRoleAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';
import HaveUserRole from './HaveUserRole';

export default {
    name:'RoleAllot',
    data(){
        return{
            userLists:[],
            userId:'',
            isShow:false,
            isUserShow:true,//无数据显示
            realName:'',
            userName:'',
            email:'',
            phone:'',
            role:{}
        }
    },
    computed:{
        ...mapState({
            roleId:(state) => {//拿到要修改的角色数据
                return state.getId.id;
            },
            appId:(state) => {
                return state.getId.appId;
            }
        })
    },
    created () {
        //获取当前角色信息
        this.$http.get(`/api/tenant/roles/${this.roleId}/`,{
            params: {
                appId: this.appId
            },
            headers:{
                'Operate-Application-Id': this.appId
            }
        }).then( res => {
            this.role = res.data.resp;
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
        offRoleAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','roleallot');
        },
        setRole () {
            //当选择了用户时才可以上送
            if (this.userId){
               //给角色分配用户
               this.$http.post(`/api/tenant/roles/${this.role.id}/users/${this.userId}/`,{
                   appId:this.role.appId,
                   userId:this.userId,
                   tenantId:this.role.tenantId,
                   roleId:this.role.id
               }, {
                    headers:{
                        'Operate-Application-Id': this.role.appId
                    }
               }).then( res => {
                   if(res.data == 'alreadyExists'){
                        Message({
                            message:'该用户已分配',
                            duration:1500,
                            type:'warning'
                        }); 
                    }else{
                        Message({
                            message:'分配成功',
                            duration:1500,
                            type:'success'
                        });
                    }
                })
            }else{
                Message({
                    message:'请选择用户',
                    duration:1500,
                    type:'warning'
                });
            }
        },
        changeIsShow ( status ) {//控制已分配窗口显示隐藏
            this.isShow = status;
        },
        getUser () {
            //模糊查询方法
            let { realName, userName, phone, email, appId } = this;
            //不能不使用模糊查询
            if ( realName || userName || phone || email ){
                this.$http.get('/api/users/',{params:{
                    realName, userName, phone, email, appId
                }}).then( res => {
                    this.userLists = res.data.resp;
                })
            }else {
                Message({
                    message:'请输入查询用户信息',
                    duration:1500,
                    type:'warning'
                });
            }
        }
    },
    components:{
        HaveUserRole
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
