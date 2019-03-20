<template>
    <div class="role-box">
        <div class="option-box">
            <el-button type="primary" class="add" @click="onRoleWindow('','','addrole')">新增</el-button>
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
			<span>角色名称:</span>
            <el-input style="width:120px" v-model="roleName"></el-input>
            &nbsp;&nbsp;
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                :data="roleLists"
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
                    prop="name"
                    label="角色"
                    align="center"
                    width="170">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    min-width=370
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain  @click="onRoleWindow(scope.row.id, scope.row.appId,'amendrole')">修改</el-button>
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id, scope.row.appId)">删除</el-button>
                        <el-button size='mini' type="warning" plain @click="onRoleWindow(scope.row.id, scope.row.appId, 'jurisdiction')">权限</el-button>
                        <el-button size='mini' type="info" plain @click="onRoleWindow(scope.row.id, scope.row.appId,'roleallot')">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="roleLists"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :fuzzyLists="fuzzyLists"
            :isFuzzy="isFuzzy"
        ></paging>    
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'Role',
    data() {
        return {
            roleLists:[],
            appLists:[],
            applicationId:'',
            fuzzyApplicationId:'',
            pageNumber:1,
            pageSize:10,
            roleName:'',
            fuzzyRoleName:'',
            isFuzzy:false,//判断是否点击过模糊查询
            loading:false
        }
    },
    created () {
        this.getApp ();
        Bus.$on('busGetRoleLists', this.getRoleLists);
        Bus.$on('busAddRefreshRole', this.addRefresh);
    },
    computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		})
	},
    beforeDestroy () {
        Bus.$off('busGetRoleLists');
        Bus.$off('busAddRefreshRole');
    },
    components:{
        Paging
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        onRoleWindow (id, appId, type) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){
               this.CHANGE_ID(id);
            };
            if(appId){
               this.CHANGE_APPID(appId);
            }
        },
        getRoleLists (type) {
            this.fuzzyLists(type);
        },
        fuzzyLists (type) {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize } = this;
            this.$http.get('/api/tenant/roles/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
                    pageNumber,
                    name: this.fuzzyRoleName,
                    appId: this.fuzzyApplicationId 
                },
                headers:{
                    'Operate-Application-Id': this.fuzzyApplicationId
                }
            }).then( res => {
                 this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/tenant/roles/',{
                                params:{
                                    appId: this.fuzzyApplicationId,
                                    time: new Date().getTime(),
                                    pageSize,
                                    pageNumber:this.pageNumber,
                                    name:this.fuzzyRoleName
                                },
                                headers:{
                                    'Operate-Application-Id': this.fuzzyApplicationId
                                }
                            }).then( res => {
                                this.roleLists = res.data.resp;
                            })
                        }else{
                            this.roleLists = res.data.resp;
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
                    this.roleLists = res.data.resp;
                }
            });
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        fuzzyClick () {//点击查询按钮时
            let { pageNumber, pageSize, roleName, applicationId } = this;
            if(!applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
            this.pageNumber = 1;
            this.fuzzyRoleName = roleName;
            this.fuzzyApplicationId = applicationId;
            this.isFuzzy = true;
            this.$http.get('/api/tenant/roles/',{
                params:{
                    time:new Date().getTime(),
                    pageSize,
                    pageNumber,
                    name: this.fuzzyRoleName,
                    appId: this.fuzzyApplicationId
                },
                headers:{
                    'Operate-Application-Id': this.fuzzyApplicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.roleLists = res.data.resp;
                }else{
                    this.roleLists = res.data.resp;
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
        openDelete ( roleId, appId ) {//打开删除窗口
            MessageBox.confirm('是否删除当前角色, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRole(roleId, appId);
            }).catch( () => {});
        },
        deleteRole ( roleId, appId ) {
            this.loading = true;
            this.$http.delete('/api/tenant/roles/'+roleId+'/', {
                params:{
                    appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.success){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getRoleLists('delete');//刷新数据
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
        },
        addRefresh (appId) {
            this.applicationId = appId;
            this.fuzzyApplicationId = appId;
            this.loading = true;
            this.isFuzzy = true;
            let { pageNumber, pageSize } = this;
            this.$http.get('/api/tenant/roles/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
                    pageNumber,
                    name: this.fuzzyRoleName,
                    appId: appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.loading = false;
                this.roleLists = res.data.resp;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-box{
        width: 100%;
        height: 100%;

        .option-box{
            width: 80%;
            min-width: 800px;
            margin:20px auto 0;
            height: 40px;
        }

        .table{
            width: 80%;
            min-width: 800px;
            margin:20px auto 0;
        }
    }
</style>

