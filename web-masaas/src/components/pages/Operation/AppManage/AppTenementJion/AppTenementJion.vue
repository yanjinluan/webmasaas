<template>
    <div class="role-box">
        <div class="add-app">
            <el-button type="primary" @click="onTenantWindow('','addtenant')">新增租户</el-button>
        </div>
        <div class="add-app">
            <span>选择应用:</span>
            <el-select 
                v-model="applicationId"
                placeholder="请选择" 
                style="width:108px">
                <el-option
                    v-for="item in appLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;
			<span>计费类型:</span>
            <el-select v-model="feeType" style="width:108px" clearable>
                <el-option
                    v-for="item in feeTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.type">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;
			<span>服务状态:</span>
            <el-select v-model="servStatus" style="width:108px" clearable>
                <el-option
                    v-for="item in servStatusList"
                    :key="item.status"
                    :label="item.name"
                    :value="item.status">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;
            <span>租户名称:</span>
            <el-input style="width:108px" v-model="tenantName"></el-input>
			&nbsp;&nbsp;&nbsp;
			<el-button type="primary" @click="fuzzyClick">
				查询
			</el-button>
		</div>
        <div class="table"> 
            <el-table
                :data="tenantLists"
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
                    label="租户名称"
                    show-overflow-tooltip
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="feeType"
                    label="计费类型"
					:formatter="newFeeType"
                    align="center">
                </el-table-column>
				<el-table-column
                    prop="servStatus"
                    label="服务状态"
					:formatter="newServStatus"
                    align="center">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width=300
                >
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" plain  @click="onTenantWindow(scope.row.id,'edittenant', scope.row.appId)">修改</el-button>
                        <el-button size='mini' type="danger" plain @click="openDelete(scope.row.id, scope.row.appId)">删除</el-button>
                        <el-button size='mini' type="warning" plain v-if="scope.row.servStatus != 1" @click="openStart(scope.row.id, scope.row.appId, 1)">启动</el-button>
                        <el-button size='mini' type="success" plain v-if="scope.row.servStatus == 1" @click="openStart(scope.row.id, scope.row.appId, 2)">冻结</el-button>
                        <el-button size='mini' type="info" plain @click="onTenantWindow(scope.row.id, 'tenantallot', scope.row.appId)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <paging
            :lists="tenantLists"
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
    name:'AppTenementJion',
    data() {
        return {
            loading:false,
            params:{
                name:'',
                tenantLists:'',
                servStatus:'',
                applicationId:'',
            },
			feeTypeList:[
				{type:0, name:'免费'},
				{type:1, name:'预付费'},
				{type:2, name:'后付费'}
			],
			feeType:'',
			servStatusList:[
				{status:0, name:'待接入'},
				{status:1, name:'服务中'},
				{status:2, name:'已冻结'}
			],
			servStatus:'',
            tenantLists:[],
            appLists:[],
            pageNumber:1,
            pageSize:10,
            tenantName:'',
            applicationId:'',
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
        Bus.$on('busGetTenantLists', this.getTenantLists);
    },
    beforeDestroy () {
        Bus.$off('busGetTenantLists')
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
        onTenantWindow (id,type, appId) { //打开新增窗口
            Bus.$emit('onUserWindow',type);
            if(id){ 
               this.CHANGE_ID(id);
            };
            if(appId){ 
               this.CHANGE_APPID(appId);
            };
        },
        getTenantLists (type) {
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
            this.$http.get(`/api/application/tenants/`,{
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
                            this.$http.get(`/api/application/tenants/`,{
                                params:newparams,
                                headers:{
                                    'Operate-Application-Id': this.params.applicationId
                                }
                            }).then( res => {
                                this.tenantLists = res.data.resp;
                            })
                        }else{
                            this.tenantLists = res.data.resp;
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
                    this.tenantLists = res.data.resp;
                }
            });
        },
        indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
        fuzzyClick () {//点击查询按钮时
            this.pageNumber = 1;
            let { pageNumber, pageSize, applicationId, tenantName, servStatus, feeType } = this;
            if(!applicationId){
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.loading = true;
			this.params.feeType = feeType;
			this.params.servStatus = servStatus;
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
            this.$http.get('/api/application/tenants/',{
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
                    this.tenantLists = res.data.resp;
                }else{
                    this.tenantLists = res.data.resp;
                }
            }).catch( () => {
                this.loading = false;
            });
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
                this.deleteTenant(id, appId);
            }).catch( () => {});
        },
        deleteTenant ( id, appId ) {
            this.$http.delete(`/api/application/tenants/${id}/`,{
                params:{ applicationId: appId },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res =>{
                if(res.data){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getTenantLists('delete');//刷新数据
                }else{//删除失败
                    Message({
                        message:'删除失败',
                        duration:1500,
                        type:'error'
                    });
                }
            })
        },
        openStart ( id, appId, status ) {
            MessageBox.confirm(`是否${status==1?'启动':'冻结'}当前租户, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.startOrCloseTenant(id, appId, status);
            }).catch( () => {});
        },
        startOrCloseTenant (id, appId, status) {
            this.$http.put(`/api/application/tenants/${id}/?applicationId=${appId}`,{
                servStatus:status,
                id
            },{
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                if (res.data.success) {
                    this.getTenantLists('delete');//刷新数据
                    Message({
                        message:`${status==1?'启动':'冻结'}成功`,
                        duration:'1500',
                        type:'success'
                    })
                }else{
                    Message({
                        message:res.data.message,
                        duration:'1500',
                        type:'error'
                    })
                }
            })
        },
		newFeeType (row, column, cellValue) {
			let feeType = '';
			switch (cellValue) {
				case 0:
					feeType = '免费'; break;
				case 1:
					feeType = '预付费'; break;
				case 2:
					feeType = '后付费'; break;
				default: break;
			}
			return feeType;
		},
		newServStatus (row, column, cellValue) {
			let servStatus = '';
			switch (cellValue) {
				case 0:
					servStatus = '待接入'; break;
				case 1:
					servStatus = '服务中'; break;
				case 2:
					servStatus = '冻结'; break;
				default: break;
			}
			return servStatus;
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

