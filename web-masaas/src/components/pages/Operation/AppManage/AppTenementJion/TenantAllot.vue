<template>
    <div class="role-lists-box">
        <have-admin
            v-if="isShow" 
            :changeIsShow="changeIsShow"
            :tenantObj="tenantObj"
        ></have-admin>
        <div class="role-lists-head">
            <h2>租户管理员分配</h2>
            <div class="off" @click="offAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role">
            <span>当前租户:</span>
            {{ tenantObj.name }}
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
            <el-button id="btn" type="primary" size="mini" @click="setAdmin">保存</el-button>
            <el-button size="mini" @click="offAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';
 import HaveAdmin from './HaveAdmin';

export default {
    name:'AppAllot',
    data(){
        return{
            tenantObj:{},
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
    created () {
        //初始数据
        this.$http.get(`/api/application/tenants/${this.tenantId}/?applicationId=${this.applicationId}`, {
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.tenantObj = res.data.resp;
        });
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			tenantId (state) {
				return state.getId.id;
			}
		})
	},
    components:{
        HaveAdmin
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
        offAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','tenantallot');
        },
        getUser () {
            //模糊查询方法
            let { realName, userName, phone, email } = this;
            //不能不使用模糊查询
            if ( realName || userName || phone || email ){
                this.$http.get('/api/users/',{
                    params:{
                        realName,userName, phone, email
                    }
                }).then( (res) => {
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
        },
        setAdmin () {
            //设置管理员
            if(this.userId){
                this.$http.put(`/api/application/tenants/${this.tenantObj.id}/administrators/${this.userId}/?applicationId=${this.applicationId}`, {}, {
                    headers:{
                        'Operate-Application-Id': this.applicationId
                    }
                }).then( res => {
                    if (res.data == 'alreadyExists') {
                        Message({
                            message:'该用户已分配',
                            duration:1500,
                            type:'warning'
                        }); 
                    } else if(res.data == 2010) {
                        Message({
                            message:'已为该用户分配过当前应用下，某租户管理员',
                            duration:1500,
                            type:'warning'
                        });
                    } else  {
                        this.offAllot();
                        Message({
                            message:'添加成功',
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
