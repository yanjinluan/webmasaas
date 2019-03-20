<template>
    <div class="role-box">
        <div class="new-add-box">
            <el-button type="primary" @click="onAdminWindow('', 'addappadmin')">分配管理员</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
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
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="getLists('next')">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                :data="adminList"
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
                    label="用户名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="账号"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="电话"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id)">取消管理员</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div> 
        <admin-paging
            :lists="adminList"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :getLists="getLists"
        ></admin-paging>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState, mapActions } from 'vuex';
import { Message, MessageBox } from 'element-ui';
import AdminPaging from '@/components/commos/Paging/AdminPaging';

export default {
    name:'AppAdmin',
    data () {
        return {
            adminList:[],
            appLists:[],
            pageSize:10,
            pageNumber:1,
            applicationId:'',
            loading:false
        }
    },
    components:{
        AdminPaging
    },
    computed:{
        ...mapState({
            userId (state) {
                return state.other.userInfo.id
            }
        })
    },
    created () {
        this.getApp();
        Bus.$on('busGetAppAdmin', this.getLists);
    },
    beforeDestroy () {
        Bus.$off('busGetAppAdmin');
	},
    methods:{
        onAdminWindow (id, type) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){ //如果需要用到用户数据

            }
        },
        getLists (type) { //获取角色列表数据
            let { pageNumber, pageSize, applicationId } = this;
            if (!applicationId) {
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                }); 
                return false;
            }
            this.loading = true;
            this.$http.get(`/api/application/administrators/?applicationId=${applicationId}`,{
                params:{
                    time: new Date().getTime(),
                    pageSize,
					pageNumber
                },
                headers:{
                    'Operate-Application-Id': applicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get(`/api/application/administrators/?applicationId=${applicationId}`,{
                                params:{
                                    time: new Date().getTime(),
                                    pageSize,
                                    pageNumber:this.pageNumber
                                }
                            }).then( (res) => {
                                this.adminList = res.data.resp;
                            })
                        }else{
                            this.adminList = res.data.resp;
                        }
                    }else if(type == 'next'){
                        Message({
                            message:'没有更多了',
                            duration:1500,
                            type:'warning'
                        });
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber--;
                        }
                    }
                }else{
                    this.adminList = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });;
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
		},
		indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        openDelete ( adminId ) {//打开删除窗口
            MessageBox.confirm('是否取消当前应用管理员, 是否继续?', '取消管理员', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteAdmin(adminId);
            }).catch( () => {});
        },
        deleteAdmin ( adminId ) {
            this.$http.delete(`/api/application/administrators/${adminId}/`,{
                params:{
                    applicationId:this.applicationId
                },
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then(res=>{
                if(res.data){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getLists('delete');//刷新数据
                }else{//删除失败
                    Message({
                        message:'删除失败',
                        duration:1500,
                        type:'error'
                    });
                }
            });
        },
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-box{
        width: 100%;
        height: 100%;

        .new-add-box{
            width: 80%;
            min-width: 800px;
            height: 80px;
            line-height: 80px;
            margin: 0 auto;

            .add{
                float: left;
                margin-top: 30px;
            }
        }

        .table{
            width: 80%;
            min-width: 800px;
            border-collapse:collapse;
            margin: 0 auto;
        }
    }
</style>

