<template>
    <div class="org-box">
        <div class="org-head">
            <h3>当前用户角色</h3>
            <div class="off" @click="offRole">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="org-table">
            <el-table
                ref="multipleTable"
                :data="roleLists"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    label="角色名称">
                </el-table-column>
            </el-table>
        </div>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="setRoles">保存</el-button>
            <el-button @click="offRole">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message, MessageBox } from 'element-ui';

export default {
    name:'ToRole',
    data () {
        return{
            roleLists:[],
            multipleSelection: [],
            haveRole:[],
            allNo:false
        }
    },
    computed:{
        ...mapState({
            userId:(state) => {//拿到用户ID
                return state.getId.id;
            },
            appId: (state) => {
                return state.getId.appId;
            }
        })
    },
    created () {
        this.$http.get(`/api/tenant/users/${this.userId}/roles/`, {
            params:{
                appId: this.appId
            },
            headers:{
                'Operate-Application-Id': this.appId
            }
        }).then( res => {
            this.roleLists = res.data.resp;
            this.roleLists.forEach( item => {//获取已有角色
                if(item.granted){
                    this.haveRole.push(item);
                }
            });
            setTimeout( () => {//渲染已有角色
                this.toggleSelection(this.haveRole);
            }, 0)
        })
    },
    methods:{
        offRole () {
            Bus.$emit('offUserWindow','torole');
        },
        deleteAllRoles() {//是否全部删除弹框
            MessageBox.confirm('此操作将会删除该用户所有角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.setRolesHandler();
            }).catch( () => {});
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        setRoles () {
            if(this.multipleSelection.length===0){//全不选时候
                this.allNo = true;//开启全不选择
                this.roleLists.forEach( item => {
                    item.granted = "false";
                });
                this.multipleSelection = this.roleLists;
                this.deleteAllRoles()
            }else{//部分选择时候
                this.roleLists.forEach( role => {
                    role.granted = "false";
                });
                this.multipleSelection.forEach( item => {
                    this.roleLists.forEach( role => {
                        if(role.id == item.id) {
                            role.granted = "true";
                        }
                    });
                });
                this.multipleSelection = this.roleLists;
                this.setRolesHandler();
            }
        },
        setRolesHandler () {
            this.$http.put(`/api/tenant/users/${this.userId}/roles/`,this.multipleSelection, {
                headers:{
                    'Operate-Application-Id': this.appId
                }
             }).then( res => {
                if (res.data) {//保存成功
                    if (this.allNo) {//取消全部角色时候
                        Bus.$emit('busChangeUserLists');
                    };
                    Bus.$emit('offUserWindow','torole');
                    Message({
                        message:'保存成功',
                        duration:1500,
                        type:'success'
                    })
                }else{//保存失败
                    Message({
                        message:'保存失败',
                        duration:1500,
                        type:'error'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .org-box{
        position: absolute;
        width: 420px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
         -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .org-head{
            h3{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }
        .org-table{
            width: 400px;
            margin: 20px auto;
            height: 400px;
            overflow: auto;
        }
        .btn-box{
            padding: 10px 0;
            text-align: center;
        }
    }
</style>

