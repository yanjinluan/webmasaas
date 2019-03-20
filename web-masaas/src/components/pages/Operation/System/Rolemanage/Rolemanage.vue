<template>
    <div class="role-box">
        
        <div class="app-box_btn">  	
        	<el-button type="primary" class="add" @click="onRoleWindow('','','addroles')">添加</el-button>
        	
        </div>
        <div class="table"> 
         
                <el-table
                v-loading="loading"	
			    ref="singleTable"
			    :data="roleLists"
			    highlight-current-row			   
			    border>
                
                <el-table-column
                    align="center"
                    label="角色编号"
                    show-overflow-tooltip
                    prop="id"
                    width="80">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="角色名称"
                    show-overflow-tooltip
                    prop="roleName">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="角色说明"
                    show-overflow-tooltip
                    prop="roleDescribe">
                </el-table-column>

                
                <el-table-column 
                	align="center"
                	label="是否有效"
                	show-overflow-tooltip
                	prop="isAvailable"
                	width='200'>
	                <template slot-scope="scope">
	                  <el-switch 
	                  	active-text="有效" 
	                  	inactive-text="无效"  
	                  	v-model="scope.row.isAvailable" 
	                  	active-value="0"
	                  	inactive-value="1"
	                  	disabled>
	                  </el-switch>
	                </template>
	            </el-table-column>
                
                <el-table-column
                    align="center"
                    label="操作" 
                    width='350'>
                    <template slot-scope="scope">                     
                        <el-button size='mini' type="warning" plain @click="examine(scope.row.id)">查看</el-button>                      
                        <el-button size='mini' type="warning" plain @click="onRoleWindow(scope.row.id, '','amendroles')" >编辑</el-button>
                        <el-button size='mini' type="warning" plain @click="openDelete(scope.row.id)">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
            </el-table>
        </div>
        
        <div style="text-align: right; margin:2%;">
        	 <el-pagination 
			  background
			  :page-size='pageSize'
			  layout="prev, pager, next"
			  @prev-click='prevclick'
			  @next-click='nextclick'
              @current-change="handleCurrentChange"
			  :total="total"
			  v-if='show'>
			</el-pagination>
        </div>
       
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapMutations, mapState } from 'vuex';
import { CHANGE_ID, CHANGE_APPID } from '@/store/getId/const';
import { Message, MessageBox ,Pagination} from 'element-ui';

export default {
    name:'Rolemanage',
    data() {
        return {
            roleLists:[],
            applicationId:'',
            fuzzyApplicationId:'',
            pageNumber:1,
            pageSize:10,
            total:null,//页数
            pages:'',
            roleName:'',
            fuzzyRoleName:'',
            isFuzzy:false,//判断是否点击过模糊查询
            loading:false,
            isAvailable:'',
            show:false

        }
    },
   
    created () {
        this.getApp ();
        Bus.$on('busGetRoleLists', this.addRefresh);
        Bus.$on('busAddRefreshRole', this.addRefresh);
    },
    computed:{
		...mapState({
			token (state) {
                return state.token.token
            }
		})
	},
    beforeDestroy () {
        Bus.$off('busGetRoleLists');
        Bus.$off('busAddRefreshRole');
    },
    components:{
     
    },
    methods:{
        ...mapMutations([CHANGE_ID, CHANGE_APPID]),
               
        onRoleWindow (id, appId, type) {//打开新增窗口
        	this.$refs.singleTable.setCurrentRow(id);
            Bus.$emit('onUserWindow',type);
            Bus.$emit('pageNumber', this.pageNumber);
            if(id){
               this.CHANGE_ID(id);
            };
            if(appId){
               this.CHANGE_APPID(appId);
            }
        },
        
    //查看角色权限信息
    examine(id){

      this.$router.push({
	        name: 'RoleAndPower',
	        params: {
	           roleId:id 
	        }
      })
//     debugger;
//     console.log(roleid);
    },
        
        getRoleLists (type) {
            this.fuzzyLists(type);
        },
        fuzzyLists (type) {//模糊查询数据
            this.loading = true;
            this.$http.get('/api/sysRole/sysRoleList',{
                params:{
//                  time: new Date().getTime(),
                    pageSize,
                    pageNumber
//                  name: this.fuzzyRoleName,
//                  appId: this.fuzzyApplicationId 
                },
                headers:{                   
		             'token' :this.token
		        }
            }).then( res => {
                 this.loading = false;
                if(res.data.resp.length === 0){
                    if(type == 'delete'){
                        if(this.pageNumber>1){//还原到上页数据
                            this.pageNumber -= 1;
                            this.$http.get('/api/sysRole/sysRoleList',{
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
                                this.roleLists = res.data.resp.records
                            })
                        }else{
                            this.roleLists = res.data.resp.records
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
                    this.roleLists = res.data.resp.records
                }
            });
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
      
        openDelete ( id) {//打开删除窗口
            MessageBox.confirm('是否删除当前角色, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRole(id);
            }).catch( () => {});
        },
        
        
        deleteRole (id) {
            this.loading = true;           
            let params = { 
                id:id,
                deleted:'1'	
            }
            this.$http.put('/api/sysRole', params,{
                headers:{
                     'token' :this.token
                }
            }).then( res => {
                this.loading = false;
                console.log(res.data);
                if(res.data){//删除成功
                    Message({
                        message:'删除成功',
                        duration:1500,
                        type:'success'
                    });
                    this.getApp ();//刷新数据
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
            let params={
            	pageSize:10,
	            pageNumber:this.pageNumber,
	            deleted:"0"
	           
            }

			//获取角色列表
            this.$http.get('/api/sysRole',{params,		        
	            	headers:{                   
	                     'token' :this.token
	                }
	        	}).then( res => {
	            	console.log(res.data);
	                this.roleLists = res.data.resp.records;
	                this.total=res.data.resp.total;
	                this.pages=res.data.resp.pages;  
	                this.pages>1?this.show=true:this.show=false;
	                              
	            })
                        
        },
        addRefresh (appId) {

            let params={
            	pageSize:10,
	            pageNumber:this.pageNumber,
	            deleted:"0"
	           
            }
            this.$http.get('/api/sysRole',{params,
                headers:{
                    'token' :this.token
                }
            }).then( res => {
                this.loading = false;
                this.roleLists = res.data.resp.records;
            })
        }
        ,//上一页
        prevclick(){
        		this.pageNumber--;
        		console.log(this.pageNumber);
        		this.getApp();
 	
        },
        //下一页
        nextclick(){
        		this.pageNumber++;
        		console.log(this.pageNumber);
        		this.getApp();
               	
        },

       // 当前改变----当前页码改变之后，触发这个函数
       handleCurrentChange(val){
           console.log("当前改变："+val)
           this.pageNumber=val;
           this.getApp();
       }
    }

   
}
</script>

<style lang="scss" scoped>
    .role-box{
        width: 100%;
        height: 100%;

        .option-box{
            width: 96%;
            min-width: 800px;
            margin:20px auto 0;
            height: 40px;
        }

        .table{
            width: 96%;
            min-width: 800px;
            margin:20px auto 0;
        }
        .app-box_btn{
        	width: 10%;
        	padding-left: 2%;
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
    }
</style>

