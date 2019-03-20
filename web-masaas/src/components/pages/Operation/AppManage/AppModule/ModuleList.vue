<template>
    <div class="organzation-list-box">
        <div class="list">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-tree
                :props="props"
                :data="moduleLists"
                :expand-on-click-node=false
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                ref="tree">
            </el-tree>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'ModuleList',
    props:['getModuleObj', 'moduleLists'],
    data () {
        return{
            filterText: '',
            props: {
                label: 'name',
                children: 'children',
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
           this.getModuleObj(data.id, data.appId);
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
