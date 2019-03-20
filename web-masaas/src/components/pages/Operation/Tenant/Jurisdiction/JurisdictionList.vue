<template>
     <div class="jurisdiction-list-box"
     v-loading="loading">
        <fuzzy-search
            :appId="appId"
            :changeList="changeList"
        ></fuzzy-search>
        <div class="main">
            <div class="checkAll">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </div>
            <div class="no-list" v-if="list.length==0">
                暂无数据
            </div>
            <div class="operation-box" 
                v-for="item in list"
                :key="item.resourceId"
            >
                <h4>{{item.resourceName}}：</h4>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="item.operations" @change="handleCheckedChange">
                    <el-checkbox v-for="opt in operations" :label="opt" :key="opt">{{checkBox[opt]}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <footer>
            <el-button id="btn" type="primary" @click="setOperation">保存</el-button>
            <el-button  @click="offJurisdiction">取消</el-button>
        </footer>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import FuzzySearch from './FuzzySearch';
const operationBox = ['GET', 'POST', 'PUT', 'DELETE'];

export default {
    name:'JurisdictionList',
    data () {
        return {
            loading:true,
            list:[],
            checkAll: false,
            titles:[],
            operations: operationBox,//控制显示选项
            checkBox:{GET:'查看', PUT:'修改', DELETE:'删除', POST:'新增'}
        }
    },
    props:['offJurisdiction'],
    computed:{
        ...mapState({
            appId:(state) => {
                return state.getId.appId;
            },
            roleId:(state) => {//拿到要修改的角色数据
                return state.getId.id;
            }
        })
    },
    components:{
        FuzzySearch
    },
    created () {
        this.getlists();
    },
    methods:{
        setOperation () {//上送修改后的数据
            let {list} = this;
            let params = {};
            for (let i=0; i < list.length; i++) {
                params[list[i].resourceId + '|' + list[i].resourceName] = list[i].operations
            }
            this.$http.put(`/api/tenant/roles/${this.roleId}/permissions/`, {
                permissions:params,
                appId: this.appId
            }, {
                headers:{
                    'Operate-Application-Id': this.appId
                }
            }).then( res => {
                if( res.data.success ){
                    //保存成功
                    Message({
                        message:'保存成功',
                        duration:1500,
                        type:'success'
                    });
                    //关闭窗口
                    this.offJurisdiction();
                }else{
                    //保存失败
                    Message({
                        message:'保存失败',
                        duration:1500,
                        type:'error'
                    });
                    this.offJurisdiction();
                }
            })
        },
        getlists () {
            //获取权限列表
            this.$http.get(`/api/tenant/roles/${this.roleId}/permissions/`,{
                params:{
                    time: new Date().getTime(),
                    appId: this.appId,
                    sift: 'all',
                    tag:'',
                    jurisdictionId:this.appId  
                },
                headers:{
                    'Operate-Application-Id': this.appId
                }
            }).then( res => {
                this.loading = false;
                this.list = res.data.resp;
                for ( let i = 0; i <this.list.length; i++){
                    if (this.list[i].operations.length !==4 ){
                        this.checkAll = false;
                        break;
                    }else{
                        this.checkAll = true;
                    }
                };
            }).catch( () => {
                this.loading = false;
            });
        },
        handleCheckAllChange(val) {
            let {list} = this;
            for ( let i = 0; i <list.length; i++){
                list[i].operations = val ? operationBox : [];
            }
        },
        handleCheckedChange(value) {
            let {list} = this;
            let checkedCount = value.length;
            if (checkedCount == 4) {
                for ( let i = 0; i <list.length; i++){
                    if (list[i].operations.length !==4 ){
                        this.checkAll = false;
                        break;
                    }else{
                        this.checkAll = true;
                    }
                }
            } else {
                this.checkAll = false;
            };
        },
        changeList (params) {
            this.loading = true;
            this.$http.get(`/api/tenant/roles/${this.roleId}/permissions/`, {
                params,
                headers:{
                    'Operate-Application-Id':this.appId
                }
            }).then( res => {
                this.loading = false;
                this.list = res.data.resp;
                for ( let i = 0; i <this.list.length; i++){
                    if (this.list[i].operations.length !==4 ){
                        this.checkAll = false;
                        break;
                    }else{
                        this.checkAll = true;
                    }
                };
                if(this.list.length === 0){
                    this.checkAll = false;
                };
            }).catch( () => {
                this.loading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .jurisdiction-list-box{
        height: 520px;

        .vague-box{
            width: 290px;
            height: 30px;
            margin: 30px auto 0;

            input{
                float: left;
                width: 240px;
                height: 30px;
                border: 1px solid #ccc;
                padding-left: 6px;
            }
            button{
                width: 50px;
                height: 30px;
                line-height: 30px;
                float: right;
                color: #fff;
                background: #f56c6c;
            }
        }

        .main{
            overflow: auto;
            height: 340px;
            border-bottom: 1px solid #ccc;
            .no-list{
                text-align: center;
                line-height: 300px;
            }
            .checkAll{
                padding: 8px 0 0 5px;
            }
            .operation-box{
                padding: 20px 30px;
                border-bottom: 1px solid #ccc;
            }
            .operation-box:last-child{
                border-bottom: none;
            }

            h4{
                color:#409EFF;
            }
        }

        footer{
            width: 200px;
            margin: 15px auto 0;
            display: flex;
            justify-content: space-between;
        }
    }
</style>

