<template>
    <div class="role-box">
        <div class="new-add-box">
            <el-button type="primary" @click="onAdminWindow('', 'adduseradmin')">分配管理员</el-button>
        </div>
        <div class="table"> 
            <el-table
                v-loading="loading"
                :data="adminList"
                style="width: 100%"
                border
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
            pageSize:10,
            pageNumber:1,
            loading:false
        }
    },
    components:{
        AdminPaging
    },
    created () {
        this.getLists();
        Bus.$on('busGetUserAdmin', this.getLists);
    },
    beforeDestroy () {
        Bus.$off('busGetUserAdmin');
	},
    methods:{
        onAdminWindow (id, type) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
        },
        getLists (type) { //获取角色列表数据
            this.loading = true;
            let { pageNumber, pageSize } = this;
            this.$http.get('/api/users/administrators/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
					pageNumber,
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/users/administrators/',{
                                params:{
                                    time: new Date().getTime(),
                                    pageSize,
                                    pageNumber:this.pageNumber
                                }
                            }).then( res => {
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
            });
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
            MessageBox.confirm('是否取消当前用户管理员, 是否继续?', '取消管理员', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteAdmin(adminId);
            }).catch( () => {});
        },
        deleteAdmin ( adminId ) {
            this.loading = true;
            this.$http.delete(`/api/users/administrators/${adminId}/`).then( res=>{
                this.loading = false;
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
        }

        .table{
            width: 80%;
            min-width: 800px;
            border-collapse:collapse;
            margin: 0 auto;
        }
    }
</style>

