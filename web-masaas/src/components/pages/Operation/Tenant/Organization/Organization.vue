<template>
    <div class="organization-box">
        <div class="container" ref="organizationBox">
            <div class="add-box">
                <header>
                   选择应用：
                    <el-select 
                        v-model="applicationId"
                        placeholder="请选择"
                        style="width:100px">
                        <el-option
                            v-for="item in appLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;
                    <el-button @click="getOrgLists(applicationId)">查询</el-button>
                </header>
                <organization-list
                    :orgLists="orgLists"
                    :getOrgObj="getOrgObj"
                ></organization-list>
            </div>
            <div class="operation-box">
                <organization-table
                    :orgObj="orgObj"
                ></organization-table>
            </div>
        </div>
    </div>
</template>

<script>
import OrganizationList from './OrganizationList';
import OrganizationTable from './OrganizationTable';
import { mapState } from 'vuex';
import Bus from '@/modules/bus';
import { Message } from 'element-ui';

export default {
    name:'Organization',
    data () {
        return{
            orgObj:{},
            orgLists:[],
            appLists:[],
            applicationId:''
        }
    },
    components:{
        OrganizationList, OrganizationTable
    },
    computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		})
	},
    created () {//控制机构列表显示隐藏 达到局部刷新效果
        this.getApp();
        Bus.$on('busGetOrgLists', this.getOrgLists);
        Bus.$on('busGetOrgObj', this.getOrgObj);
    },
    mounted () {
        let height = document.documentElement.clientHeight - 130 - 60;
        this.$refs.organizationBox.style.height = height + 'px'
    },
    beforeDestroy () {
        Bus.$off('busGetOrgLists');
        Bus.$off('busGetOrgObj');
    },
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        getOrgLists (appId) {
            if (!appId) {
                Message({
                    message:'请选择应用',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.orgObj = {};
            this.$http.get(`/api/tenant/organizations/`, {
                params:{
                    appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.orgLists = res.data.resp;
                if ( this.orgLists.length ===0 ) {
                    Message({
                        message:'没有机构',
                        duration:1500,
                        type:'warning'
                    });
                }
            })
        },
        getOrgObj (orgId, appId) {//点击列表获取当前点击机构信息
            this.$http.get(`/api/tenant/organizations/${orgId}/`, {
                params:{
                    appId
                },
                headers:{
                    'Operate-Application-Id': appId
                }
            }).then( res => {
                this.orgObj = res.data.resp;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .organization-box{
        width: 100%;
        padding: 60px 0 60px 0;
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-align-items: center;
        -ms-align-items: center;
        -moz-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        -ms-justify-content: center;
        -moz-justify-content: center;
        justify-content: center;

        .container{
            width: 900px;
            border: 1px solid #ccc;

            .add-box{
                float: left;
                width: 300px;
                height: 100%;
                border-right: 1px solid #ccc;
                background: #fff;
                position: relative;
                z-index: 2;
                header{
                    position: absolute;
                    width: 100%;
                    top: 0;
                    height: 50px;
                    padding-left: 20px;
                    background: #fff;
                    border-bottom: 1px solid #ccc;
                    display: -webkit-flex;
                    display: -moz-flex;
                    display: -ms-flex;
                    display: flex;
                    -webkit-align-items: center;
                    -ms-align-items: center;
                    -moz-align-items: center;
                    align-items: center;
                    background: #409EFF;
                    color: #fff;
                }
            }

            .operation-box{
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 1;
            }
        }
    }
</style>
