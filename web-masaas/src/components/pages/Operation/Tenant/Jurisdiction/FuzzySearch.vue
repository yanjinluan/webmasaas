<template>
    <div class="fuzzy-box">
        <div class="condition-box">
            <div>
                <span>权限筛选:</span>
                <el-select 
                    v-model="jurisdictionId"
                    placeholder="请选择" 
                    style="width:120px">
                    <el-option
                        v-for="item in jurisdictionList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
           <div>
                <span>一级模块:</span>
                <el-select 
                    clearable
                    show-overflow-tooltip
                    v-model="oneMoudleTag"
                    placeholder="请选择" 
                    style="width:120px">
                    <el-option
                        v-for="item in moudleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.tag">
                    </el-option>
                </el-select>
           </div>
           <div>
                <span>二级模块:</span>
                <el-select 
                    clearable
                    show-overflow-tooltip
                    v-model="twoMoudleTag"
                    placeholder="请选择" 
                    style="width:120px">
                    <el-option
                        v-for="item in twoMoudleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.tag">
                    </el-option>
                </el-select>
           </div>
        </div>
        <div class="fuzzy-list">
            <span>是否分配:</span>
            <el-select 
                v-model="sift"
                placeholder="请选择" 
                style="width:120px">
                <el-option
                    v-for="item in siftList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp; 
            <span>资源名称:</span>
            <el-input
                v-model="resourceName"
                placeholder="请输入" 
                style="width:120px">
            </el-input>
            &nbsp;&nbsp; 
            <el-button type="primary" @click="hanleClickFuzzy">查询</el-button> 
            <!-- <el-button type="primary" @click="hanleEduceJurisdiction">导出</el-button>  -->
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name:'FuzzySearch',
    props:['appId', 'changeList'],
    data () {
        return {
            jurisdictionId:'1',
            jurisdictionList:[
                {id:1, name:'公共权限', value:''},
                {id:2, name:'当前应用', value:'1'}
            ],
            sift:'all',
            siftList:[
                {id:1, name:'全部', value:'all'},
                {id:2, name:'已分配', value:'allocated'},
                {id:3, name:'未分配', value:'unallocated'}
            ],
            oneMoudleTag:'',
            moudleList:[],
            twoMoudleTag:'',
            twoMoudleList:[],
            resourceName:''
        }
    },
    watch:{
        oneMoudleTag (val) {
            this.twoMoudleTag = '';
            this.twoMoudleList = [];
            this.moudleList.forEach(item => {
                if(item.tag === val) {
                    this.twoMoudleList = item.children;
                }
            });
        },
        jurisdictionId (val) {
            this.oneMoudleTag = '';
            this.twoMoudleTag = '';
            this.moudleList = [];
            if (val) {//获取当前应用模块
                this.getModuleLists(this.appId);
            }else{//获取公共模块
                this.getModuleLists('');
            }
        }
    },
    computed: {
        ...mapState({
            userId:(state) => {
                return state.other.userInfo.id
            },
            roleId:(state) => {
                return state.getId.id;
            }
        })
    },
    created () {
       this.getModuleLists(this.appId);
    },
    methods:{
        getModuleLists (num) {//获取上级模块
            this.$http.get(`/api/tenant/roles/${this.roleId}/permissions/jurisdictionId/`,{
                params:{
                    jurisdictionId:num,
                    tag:''
                },
                headers:{
                    'Operate-Application-Id': this.appId
                }
            }).then ( res => {
                this.moudleList = res.data.resp;
            })
        },
        hanleClickFuzzy () {
            let {resourceName, oneMoudleTag, twoMoudleTag, sift, jurisdictionId} = this;
            let params = {
                resourceName,
                tag: twoMoudleTag ? twoMoudleTag : oneMoudleTag,
                sift,
                jurisdictionId: jurisdictionId ? this.appId : '',
                time:new Date().getTime()
            };
            this.changeList(params);
        }
        // hanleEduceJurisdiction () {
        //     let {resourceName, oneMoudleTag, twoMoudleTag, sift, jurisdictionId} = this;
        //     let params = {
        //         resourceName,
        //         tag: twoMoudleTag ? twoMoudleTag : oneMoudleTag,
        //         sift,
        //         jurisdictionId: jurisdictionId ? this.appId : '',
        //         time:new Date().getTime()
        //     };
        //     this.$http.get(`/api/tenant/roles/${this.roleId}/permissions/`, {
        //         params,
        //         headers:{
        //             'Accept':'application/vnd.ms-excel'
        //         }
        //     })
        // }
    }
}
</script>

<style lang="scss" scoped>
    .fuzzy-box{
        padding: 10px 12px 0;

        .condition-box{
            display: flex;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            justify-content: space-between;
            -webkit-justify-content: space-between;
            -ms-justify-content: space-between;
            -moz-justify-content: space-between;
        }

        .fuzzy-list{
            margin-top: 8px;
        }
    }
</style>

