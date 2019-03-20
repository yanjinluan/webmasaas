<template>
    <div class="role-box">
        <div class="option-box">
            <el-button type="primary" class="add" @click="onResourceWindow('','addresource')">新增资源</el-button>
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
			<span>资源名称:</span>
            <el-input style="width:120px" v-model="resourceName"></el-input>
            &nbsp;&nbsp;
            <el-button type="primary" @click="fuzzyClick">查询</el-button>
        </div>
        <div class="table"> 
            <el-table
                :data="resourcesLists"
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
                    label="名称"
                    min-width="160"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
					width="300"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain @click="onResourceWindow(scope.row.id, 'editresource', scope.row.appId)">修改</el-button>
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id, scope.row.appId)">删除</el-button>
                         <el-button size='mini' type="info" plain @click="onResourceWindow(scope.row.id, 'resourceallot', scope.row.appId)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="resourcesLists"
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
import { mapState, mapMutations } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'AppResource',
    data() {
        return {
            loading:false,
            resourcesLists:[],
            appLists:[],
            applicationId:'',
            fuzzyApplicationId:'',
            pageNumber:1,
            pageSize:10,
            resourceName:'',
            fuzzyResourceName:'',
            isFuzzy:false,//判断是否点击过模糊查询
        }
    },
    created () {
        this.getApp();//获取初始数据
        Bus.$on('busGetResourcesLists', this.getResourcesLists);
    },
    beforeDestroy () {
        Bus.$off('busGetResourcesLists')
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
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        onResourceWindow (id, type, appId) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){ //如果需要用到用户数据
               this.CHANGE_ID(id);
            };
            if(appId){
                this.CHANGE_APPID(appId);
            };
        },
        getResourcesLists (type) {
            if(!this.isFuzzy){
                this.initLists(type);
            }else{
                this.fuzzyLists(type);
            }
        },
        fuzzyLists (type) {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize, resourceName, applicationId } = this;
            this.$http.get('/api/application/resources/',{
                params:{
                    time: new Date().getTime(),
                    pageSize,
                    pageNumber,
                    applicationId,
                    resourceName:this.fuzzyResourceName
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
                            this.$http.get('/api/application/resources/',{
                                params:{
                                    time: new Date().getTime(),
                                    pageSize,
                                    pageNumber:this.pageNumber,
                                    resourceName:this.fuzzyResourceName,
                                    applicationId
                                },
                                headers:{
                                    'Operate-Application-Id': applicationId
                                }
                            }).then( (res) => {
                                this.resourcesLists = res.data.resp;
                            })
                        }else{
                            this.resourcesLists = res.data.resp;
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
                    this.resourcesLists = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });;
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        fuzzyClick () {//点击查询按钮时
            if (!this.applicationId) {
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                }); 
                return false;
            };
            this.loading = true;
            this.pageNumber = 1;
            let { pageNumber, pageSize, resourceName, applicationId } = this;
            this.fuzzyResourceName = resourceName;
            this.fuzzyApplicationId = applicationId;
            this.isFuzzy = true;
            this.$http.get('/api/application/resources/',{
                params:{
                    time: new Date().getTime(),
                    applicationId:this.fuzzyApplicationId,
                    pageSize,
                    pageNumber,
                    resourceName:this.fuzzyResourceName
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
                    this.resourcesLists = res.data.resp;
                }else{
                    this.resourcesLists = res.data.resp;
                }
            });
        },
        pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
        openDelete (resourceId, appId) {//打开删除窗口
            MessageBox.confirm('是否删除当前资源, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRole(resourceId, appId);
            }).catch( () => {});
        },
        deleteRole (resourceId, appId) {
            this.$http.delete(`/api/application/resources/${resourceId}/?applicationId=${appId}`, {
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                if(res.data.success){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getResourcesLists('delete');//刷新数据
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

