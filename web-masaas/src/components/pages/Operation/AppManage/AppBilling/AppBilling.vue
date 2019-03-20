<template>
    <div class="role-box">
        <div class="add-app">
            <el-button type="primary" @click="onWindow('','addbillrule')">新增计费规则</el-button>
        </div>
        <div class="add-app">
            <span>选择应用:</span>
            <el-select 
                v-model="applicationId"
                placeholder="请选择" 
                style="width:110px">
                <el-option
                    v-for="item in appLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;
			<span>管控状态:</span>
            <el-select v-model="controlStatus" style="width:110px" clearable>
                <el-option
                    v-for="item in controlStatusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.type">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;
			<span>资源名称:</span>
            <el-input style="width:110px" v-model="resourceName"></el-input>
			&nbsp;&nbsp;&nbsp;
            <span>租户名称:</span>
            <el-input style="width:110px" v-model="tenantName"></el-input>
			&nbsp;&nbsp;&nbsp;
			<el-button type="primary" @click="fuzzyClick">
				查询
			</el-button>
		</div>
        <div class="table"> 
            <el-table
                :data="ruleLists"
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
                    label="规则名称"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="计费类型"
                    :formatter="newType"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                 <el-table-column
                    prop="price"
                    label="计费价格"
                    :formatter="newBillFee"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="controlStatus"
                    show-overflow-tooltip
                    label="管控状态"
                    :formatter="newStatus"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="tenantName"
                    label="隶属租户"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width=300
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain  @click="onWindow(scope.row.id,'editbillrule', scope.row.applicationId)">修改</el-button>
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id, scope.row.applicationId)">删除</el-button>
                        <el-button size='mini' type="info" plain v-if="scope.row.controlStatus" @click="changeStatus(scope.row.id, 'false', scope.row.applicationId)">关闭</el-button>
                        <el-button size='mini' type="success" plain v-if="!scope.row.controlStatus" @click="changeStatus(scope.row.id, 'true', scope.row.applicationId)">启动</el-button>
                        <el-button size='mini' type="warning" plain @click="onWindow(scope.row.id,'examinebilling', scope.row.applicationId)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="ruleLists"
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
import {  mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox } from 'element-ui';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'AppBilling',
    data() {
        return {
            loading:false,
            params:{
                controlStatus:'',
				tenantName:'',
				resourceName:'',
                applicationId:''
            },
			controlStatusList:[
				{type:'true', name:'正常'},
				{type:'false', name:'临时禁用'}
			],
			controlStatus:'',
			tenantName:'',
			resourceName:'',
            ruleLists:[],
            appLists:[],
            applicationId:'',
            pageNumber:1,
            pageSize:10,
            isFuzzy:false,//判断是否点击过模糊查询
        }
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
        Bus.$on('busGetBillRule', this.getRuleLists);
    },
    beforeDestroy () {
        Bus.$off('busGetBillRule');
    },
    components:{
        Paging
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        onWindow (id, type, applicationId) {
            Bus.$emit('onUserWindow',type);
            if(id){ 
               this.CHANGE_ID(id);
            };
            if(applicationId){ 
               this.CHANGE_APPID(applicationId);
            };
        },
        getRuleLists (type) {
            this.fuzzyLists(type);
        },
        fuzzyLists (type) {//模糊查询数据
            this.loading = true;
            let { pageNumber, pageSize } = this;
            let newparams = {
                time: new Date().getTime(),
                pageSize,
                pageNumber,
			};
			//参数为空时 不可以上送字段
			for( var item in this.params ){
				if (this.params[item] !== ''){
					newparams[item] = this.params[item];
				}
			};
            this.$http.get('/api/application/feerules/',{
                params:newparams,
                headers:{
                    'Operate-Application-Id': this.params.applicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            newparams.pageNumber = this.pageNumber;
                            this.$http.get('/api/application/feerules/',{
                                params:newparams,
                                headers:{
                                    'Operate-Application-Id': this.params.applicationId
                                }
                            }).then( res => {
                                this.ruleLists = res.data.resp;
                            })
                        }else{
                            this.ruleLists = res.data.resp;
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
                    this.ruleLists = res.data.resp;
                }
            });
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        fuzzyClick () {//点击查询按钮时
            this.pageNumber = 1;
            let { pageNumber, pageSize, applicationId, tenantName, resourceName, controlStatus } = this;
            if(!applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
			this.params.resourceName = resourceName;
			this.params.controlStatus = controlStatus;
			this.params.tenantName = tenantName;
            this.params.applicationId = applicationId;
            this.isFuzzy = true;
            let newparams = {
                time: new Date().getTime(),
                pageSize,
                pageNumber,
			};
			//参数为空时 不可以上送字段
			for( var item in this.params ){
				if (this.params[item] !== ''){
					newparams[item] = this.params[item];
				}
			};
            this.$http.get('/api/application/feerules/',{
                params:newparams,
                headers:{
                    'Operate-Application-Id': applicationId
                }
            }).then( res => {
                this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有更多了',
                        duration:1500,
                        type:'warning'
                    });
                    this.ruleLists = res.data.resp;
                }else{
                    this.ruleLists = res.data.resp;
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
        openDelete ( id, appId ) {//打开删除窗口
            MessageBox.confirm('是否删除当前租户, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRule(id, appId);
            }).catch( () => {});
        },
        deleteRule ( id, appId ) {
            this.$http.delete(`/api/application/feerules/${id}/`,{
                params:{ applicationId: appId },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res =>{
                if(res.data){
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getRuleLists('delete');//刷新数据
                }else{//删除失败
                    Message({
                        message:'删除失败',
                        duration:1500,
                        type:'error'
                    });
                }
            })
        },
        changeStatus ( id, val, applicationId ) {
            MessageBox.confirm(`是否${val=='true'?'启动':'关闭'}当前规则, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.editRule(id, val, applicationId);
            }).catch( () => {});
        },
        editRule ( id, val, applicationId ) {
            this.$http.put(`/api/application/feerules/${id}/?applicationId=${applicationId}`,{
                controlStatus: val,
                appId: applicationId,
                id
            }, {
                headers:{
                    'Operate-Application-Id': applicationId
                }
            }).then( res =>{
                if(res.data){
                    Message({
                        message:'成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getRuleLists('delete');//刷新数据
                }else{
                    Message({
                        message:'失败',
                        duration:1500,
                        type:'error'
                    });
                }
            })
        },
        newBillFee (row, column, cellValue) { 
            return (Number(cellValue)).toFixed(2) + '元'
        },
        newStatus (row, column, cellValue) {
            if (cellValue) {
                return '正常'
            }else{
                return '关闭'
            }
        },
        newType (row, column, cellValue) {
            if (cellValue == 0) {
                return '资源'
            }else if (cellValue == 1) {
                return '模块'
            }else if (cellValue == 2) {
                return '应用'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-box{
        width: 100%;
        height: 100%;

        .add-app{
			width: 80%;
			min-width: 850px;
			margin: 20px auto;
		}

        .table{
            width: 80%;
            min-width: 850px;
            border-collapse:collapse;
            margin: 0 auto;
        }
    }
</style>

