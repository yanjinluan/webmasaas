<template>
    <div class="user-box">
        <div class="new-add-box">
            <span>选择应用:</span>
            <el-select 
                v-model="applicationId"
                placeholder="请选择" 
                style="width:120px">
                <el-option
                    v-for="item in appLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="app-box">
            <div>
                <span>账号：</span>
                <el-input style="width:134px" v-model="userName"></el-input>
            </div>
            <div>
                <span>邮箱：</span>
                <el-input style="width:134px" v-model="email"></el-input>
            </div>
            <div>
                <span>手机：</span>
                <el-input style="width:134px" v-model="phone"></el-input>
            </div>
            <div>
                <span>姓名：</span>
                <el-input style="width:134px" v-model="realName"></el-input>
            </div>
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                :data="userLists"
                style="width: 100%"
                border
                v-loading="loading"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    :index="indexMethod"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="realName"
                    label="姓名"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    show-overflow-tooltip
                    label="账号"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="email"
                    show-overflow-tooltip
                    label="邮箱"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    show-overflow-tooltip
                    label="手机"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="260"
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain
                            @click="onUserWindow(scope.row.id, 'toorg')"
                        >隶属机构</el-button>
                        <el-button size='mini' type="warning" plain
                            @click="onUserWindow(scope.row.id, 'torole')"
                        >分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="userLists"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :fuzzyLists="fuzzyLists"
            :isFuzzy="isFuzzy"
        ></paging> 
    </div>
</template>

<script>
import Paging from '@/components/commos/Paging/Paging';
import Bus from '@/modules/bus';
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message } from 'element-ui';

export default {
    name:'User',
    data() {
        return {
            loading:false,
            userLists:[],
            pageNumber:1,
            pageSize:10,
            realName:'',
            userName:'',
            email:'',
            phone:'',
            appLists:[],
            applicationId:'',
            isFuzzy:false,
            paramsRealName:null,
            paramsUserName:null,
            paramsEmail:null,
            paramsPhone:null,
            paramsApplicationId:null
        }
    },
    components:{
        Paging
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    created () { //获取列表
        this.getApp();
        Bus.$on('busChangeUserLists', this.getUserLists);//刷新页面
    },
    beforeDestroy () {
        Bus.$off('busChangeUserLists')
    },
    methods:{
        ...mapMutations([CHANGE_ID,CHANGE_APPID]),
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        fuzzyClick () {//点击查询按钮时
            this.CHANGE_APPID(this.applicationId)
            if(!this.applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
            this.pageNumber = 1;
            this.paramsRealName = this.realName;
            this.paramsUserName = this.userName;
            this.paramsEmail = this.email;
            this.paramsPhone = this.phone;
            this.paramsApplicationId = this.applicationId;
            this.isFuzzy = true;
            this.$http.get('/api/tenant/users/',{
                params:{
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber, 
                    realName: this.paramsRealName, 
                    userName: this.paramsUserName, 
                    phone: this.paramsPhone, 
                    email: this.paramsEmail,
                    appId: this.paramsApplicationId
                },
                headers:{
                    'Operate-Application-Id': this.paramsApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.userLists = res.data.resp;
                }else{//获取数据不为空时候
                    this.userLists = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });         
        },
        fuzzyLists () {//模糊查询数据
            this.loading = true;
            this.$http.get('/api/tenant/users/',{
                params:{
                    time:new Date().getTime(),
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber, 
                    realName: this.paramsRealName, 
                    userName: this.paramsUserName, 
                    phone: this.paramsPhone, 
                    email: this.paramsEmail,
                    appId: this.paramsApplicationId
                },
                headers:{
                    'Operate-Application-Id': this.paramsApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if (this.pageNumber === 1) {
                        this.userLists = res.data.resp;
                    }else if (this.pageNumber > 1){
                        this.pageNumber--;
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                    }
                }else{//获取数据不为空时候
                    this.userLists = res.data.resp;
                }
            });
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        getUserLists () {//刷新数据
            this.loading = true;
            this.$http.get('/api/tenant/users/',{
                params:{
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber, 
                    realName: this.paramsRealName, 
                    userName: this.paramsUserName, 
                    phone: this.paramsPhone, 
                    email: this.paramsEmail,
                    appId: this.paramsApplicationId
                },
                headers:{
                    'Operate-Application-Id': this.paramsApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(this.pageNumber>1) {
                        this.pageNumber--;
                        this.$http.get('/api/tenant/users/',{
                            params:{
                                pageSize: this.pageSize,
                                pageNumber: this.pageNumber, 
                                realName: this.paramsRealName, 
                                userName: this.paramsUserName, 
                                phone: this.paramsPhone, 
                                email: this.paramsEmail,
                                appId: this.paramsApplicationId
                            },
                            headers:{
                                'Operate-Application-Id': this.paramsApplicationId
                            }
                        }).then( res => {
                            this.userLists = res.data.resp;
                        });
                    }else{
                        this.userLists = res.data.resp;
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                    }
                }else {
                    this.userLists = res.data.resp;
                };
            })
        },
        onUserWindow (id, type) {
            Bus.$emit('onUserWindow',type);
            if(id){
               this.CHANGE_ID(id);
            }
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        }
    }
}
</script>

<style lang="scss" scoped>
    .user-box{
        width: 100%;
        height: 100%;

       .app-box{
            width: 80%;
            margin: 0 auto;
            min-width: 800px;
            height:56px;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: flex;
            -webkit-justify-content: space-between;
            -moz-justify-content: space-between;
            -ms-sjustify-content: space-between;
            justify-content: space-between;
            -webkit-align-items: center;
            -moz-align-items: center;
            -ms-align-items: center;
            align-items: center;
        }
        .new-add-box{
            width: 80%;
            min-width: 800px;
            height: 50px;
            line-height: 50px;
            margin: 0 auto;
        }
        .table{
            width: 80%;
            border-collapse:collapse;
            margin: 10px auto 0;
            min-width: 800px;
        }
    }
</style>

