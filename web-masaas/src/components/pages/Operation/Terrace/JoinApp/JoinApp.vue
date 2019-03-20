<template>
    <div class="app">
		<div class="add-app">
			<el-button type="primary" @click="addAppWindow('','addapp')">新增应用</el-button>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span>管控状态:</span>
            <el-select v-model="controlStatus" style="width:110px" clearable>
                <el-option
                    v-for="item in controlStatusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span>状态:</span>
            <el-select v-model="status" style="width:110px" clearable>
                <el-option
                    v-for="item in statusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
			&nbsp;&nbsp;&nbsp;&nbsp;
            <span>应用名称:</span>
            <el-input style="width:120px" v-model="name"></el-input>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<el-button type="primary" @click="fuzzyClick">
				查询
			</el-button>
		</div>
		<div class="table">
			<el-table
				v-loading="loading"
				:data="appList"
				style="width: 100%"
				border>
				<el-table-column
					label="序号"
					type="index"
					:index="indexMethod"
					align="center"
					width="80">
				</el-table-column>
				<el-table-column
					prop="name"
					label="应用名称"
					show-overflow-tooltip
					align="center">
				</el-table-column>
				<el-table-column
					prop="controlStatus"
					show-overflow-tooltip
					label="管控状态"
					:formatter="newControlStatus"
					align="center">
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					show-overflow-tooltip
					:formatter="newStatus"
					align="center">
				</el-table-column>
				<el-table-column
					prop="describe"
					label="描述"
					show-overflow-tooltip
					align="center">
				</el-table-column>
				<el-table-column
					align="center"
					width="390"
					show-overflow-tooltip
					label="操作">
					<template slot-scope="scope">
						<el-button size='mini' type="primary" plain @click="addAppWindow(scope.row.id,'editapp')">修改</el-button>
						<el-button size='mini' type="warning" plain @click="addAppWindow(scope.row.id,'upload')">上传</el-button>
						<el-button size='mini' type="danger" plain @click="openDelete(scope.row.id)">删除</el-button>
						<el-button size='mini' type="warning" plain @click="addAppWindow(scope.row.id, 'appallot')">分配</el-button>
						<el-button size='mini' type="primary" plain v-if="scope.row.status == 0" @click="openStatus(scope.row.id, 1)">待审核</el-button>
						<el-button size='mini' type="success" plain v-if="scope.row.status == 1" @click="openStatus(scope.row.id, 2)">接入</el-button>
						<el-button size='mini' type="info" plain v-if="scope.row.controlStatus == 1 && scope.row.status == 2" @click="openControlStatus(scope.row.id, 0)">暂停</el-button>
						<el-button size='mini' type="success" plain v-if="scope.row.controlStatus == 0  && scope.row.status == 2" @click="openControlStatus(scope.row.id, 1)">恢复</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<paging
			:lists="appList"
            :pageNumber="pageNumber"
            :pageNumberAdd="pageNumberAdd"
            :pageNumberJian="pageNumberJian"
            :initLists="initLists"
            :fuzzyLists="fuzzyLists"
            :isFuzzy="isFuzzy"
        ></paging> 
    </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import Bus from  '@/modules/bus';
import { mapMutations } from 'vuex';
import { CHANGE_ID } from '@/store/getId/const';
import Paging from '@/components/commos/Paging/Paging';

export default {
    name:'JoinApp',
    data(){
		return{
			appList:[],
			name:'',
			params:{
				name:'',
				controlStatus:'',
				status:''
			},
			pageNumber:1,
			pageSize:10,
			isFuzzy:false,
			controlStatus:'',
			controlStatusList:[
				{id:0, name:'暂停'},
                {id:1, name:'正常'}
			],
			status:'',
			statusList:[
				{id:0, name:'草稿'},
				{id:1, name:'待审核'},
				{id:2, name:'已接入'}
			],
			loading:true
		}
	},
	created(){
		this.initLists();
		Bus.$on('busGetAppList', this.getAppLists);
	},
	beforeDestroy () {
		Bus.$off('busGetAppList');
    },
	components:{
		Paging
	},
	methods:{
		...mapMutations([CHANGE_ID]),
		addAppWindow(id,type){
			if (id) {
				this.CHANGE_ID(id);
			};
			Bus.$emit("onUserWindow",type);
		},
		openDelete ( appId ) {//打开删除窗口
            MessageBox.confirm('是否删除当前应用, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteApp(appId);
            }).catch( () => {});
		},
		indexMethod(index) {
            let newIndex = (this.pageNumber-1)*10+index+1;
            return newIndex
        },
		deleteApp(appId){
			this.$http.delete(`/api/platform/applications/${appId}/`).then( res => {
				if(res.data){
					Message({
						message:'删除应用成功',
						duration:'800',
						type:'success'
					})
					this.getAppLists('delete');//更新数据
				}else{
					Message({
						message:'删除应用失败',
						duration:'800',
						type:'warning'
					})
				}
			})
		},
		getAppLists (type) {
            this.fuzzyLists(type);
        },
		initLists (type) { //app列表数据
            let { pageNumber, pageSize } = this;
            this.$http.get('/api/platform/applications/',{
                params:{
					time: new Date().getTime(),
                    pageSize,
                    pageNumber
                }
            }).then( res => {
				this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/platform/applications/',{
                                params:{
                                    time: new Date().getTime(),
                    				pageSize,
                    				pageNumber:this.pageNumber
                                }
                            }).then( (res) => {
                                this.appList = res.data.resp;
                            })
                        }else{
                            this.appList = res.data.resp;
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
                    this.appList = res.data.resp;
                }
            });
		},
		fuzzyClick () {//点击查询按钮时
			this.loading = true;
            this.pageNumber = 1;
            let { pageNumber, pageSize, name, controlStatus, status } = this;
			this.params.name = name;
			this.params.controlStatus = controlStatus;
			this.params.status = status;
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
            this.$http.get('/api/platform/applications/',{
                params:newparams
            }).then( res => {
				this.loading = false;
                if(res.data.resp.length === 0){
                    Message({
                        message:'没有数据',
                        duration:1500,
                        type:'warning'
                    });
                    this.appList = res.data.resp;
                }else{
                    this.appList = res.data.resp;
                }
            })
		},
		fuzzyLists (type) {//模糊查询数据
			this.loading = true;
			let { pageNumber, pageSize } = this;
			//参数为空时 不可以上送字段
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
            this.$http.get('/api/platform/applications/',{
                params: newparams
            }).then( res => {
				this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
							this.pageNumber -= 1;
							newparams.pageNumber = this.pageNumber;
                            this.$http.get('/api/platform/applications/',{
                                params: newparams
                            }).then( res => {
                                this.appList = res.data.resp;
                            })
                        }else{
                            this.appList = res.data.resp;
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
                    this.appList = res.data.resp;
                }
            });
		},
		pageNumberAdd () {
            this.pageNumber++
        },
        pageNumberJian () {
            this.pageNumber--
        },
		newControlStatus (row, column, cellValue) { 
			let val = ''
			switch (cellValue){
				case 0:
					val = '暂停'; break;
				case 1:
					val = '正常'; break;
				default: break;
			};
			return val;
		},
		newStatus (row, column, cellValue) { 
			let val = ''
			switch (cellValue){
				case 0:
					val = '草稿'; break;
				case 1:
					val = '待审核'; break;
				case 2:
					val = '已接入'; break;
				default: break;
			};
			return val;
		},
		openControlStatus ( appId, type ) {
            MessageBox.confirm(`是否${type===0?'暂停':'恢复'}运行当前应用, 是否继续?`, `${type===0?'暂停':'恢复'}提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.setControlStatus(appId, type);
            }).catch( () => {});
		},
		setControlStatus (appId, type) {
			this.$http.put(`/api/platform/applications/${appId}/`,{
				controlStatus:type,
				time: new Date()
			}).then( res => {
				if (res.data.success) {
					this.getAppLists('delete');
					Message({
						message:'操作成功',
						duration:'1500',
						type:'success'
					})
				}else{
					Message({
						message:'操作失败',
						duration:'1500',
						type:'error'
					})
				}
			})
		},
		openStatus ( appId, type ) {
            MessageBox.confirm(`是否${type===1?'待审核':'接入'}当前应用, 是否继续?`, `${type===1?'待审核':'接入'}提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.setStatus(appId, type);
            }).catch( () => {});
		},
		setStatus (appId, type) {
			this.$http.put(`/api/platform/applications/${appId}/`,{
				status:type
			}).then( res => {
				if (res.data.success) {
					this.getAppLists('delete');
					Message({
						message:'操作成功',
						duration:'1500',
						type:'success'
					})
				}else{
					Message({
						message:'操作失败',
						duration:'1500',
						type:'error'
					})
				}
			})
		}  
	}
}
</script>
<style lang="scss" scoped>
	.app{
		.add-app{
			width: 80%;
			min-width: 800px;
			height: 80px;
			line-height: 80px;
			margin: 0 auto
		}
		.table{
			width: 80%;
			min-width: 800px;
			margin: 0 auto;
		}
	}
</style>
