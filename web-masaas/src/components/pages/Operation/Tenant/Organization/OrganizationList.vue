<template>
    <div class="organzation-list-box">
        <div class="list">
            <!-- <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input> -->
            <el-tree
                :props="props"
                :load="loadNode"
                :data="orgLists"
                :expand-on-click-node=false
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                ref="tree"
                lazy>
            </el-tree>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';

export default {
    name:'OrganzationList',
    props:['getOrgObj', 'orgLists'],
    data () {
        return{
            filterText: '',
            props: {
                label: 'name'
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data) {//点击时选中
            this.getOrgObj(data.id, data.appId)
        },
        loadNode(node, resolve) {
            if (node.level > 0){
                this.$http.get(`/api/tenant/organizations/`, {
                    params:{
                        parentId: node.data.id,
                        appId: node.data.appId
                    },
                    headers:{
                        'Operate-Application-Id': node.data.appId
                    }
                }).then( res => {
                    let orgLists = res.data.resp;
                    resolve(orgLists);
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .organzation-list-box{
        padding-top: 51px;
        height: 100%;
        .list{
            padding: 4px 10px 4px;
            width: 100%;
            height: 100%;
            overflow: auto;
        }
    }
</style>
