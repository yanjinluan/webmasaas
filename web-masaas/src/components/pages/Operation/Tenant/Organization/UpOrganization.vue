<template>
    <div class="up-box">
        <div class="add-head">
            <h2>机构选择</h2>
            <div class="off" @click="offUpOrg">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="main">
            <el-tree
                :props="props"
                :load="loadNode"
                :expand-on-click-node=false
                @node-click="handleNodeClick"
                lazy>
            </el-tree>
            <el-tree
                :data="empty" 
                :props="defaultProps" 
                :expand-on-click-node=false
                @node-click="handleNodeClick"
            >
            </el-tree>
        </div>
        <div class="register-btn-box">
            <el-button  type="primary" @click="setUpOrg">确定</el-button>
            <el-button  @click="offUpOrg">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name:'UpOrganization',
    props:['offUpOrg', 'changeIdAndUpOrg', 'appId'],
    data () {
        return{
            empty:[
                {id:'', name:'无上级机构'}
            ],
            defaultProps: {
                label: 'name'
            },
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            id:'',
            orgName:''
        }
    },
    methods:{
        handleNodeClick(data) {//点击时选中
            this.id = data.id,
            this.orgName = data.name
        },
        setUpOrg () {//确认选择
            this.changeIdAndUpOrg(this.id, this.orgName)
            this.offUpOrg()
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                this.$http.get(`/api/tenant/organizations/`, {
                    params:{
                        appId: this.appId
                    },
                    headers:{
                        'Operate-Application-Id': this.appId
                    }
                }).then( res => {
                    this.orgLists = res.data.resp;
                    resolve(this.orgLists);
                })
            }else{
                this.$http.get(`/api/tenant/organizations/`,{
                    params:{
                        appId: this.appId,
                        parentId: node.data.id
                    }
                }).then( res => {
                    this.orgLists = res.data.resp;
                    resolve(this.orgLists);
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .up-box{
        position: absolute;
        width: 400px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 8;

        .add-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .main{
            padding: 10px 20px 0 20px;
            height: 400px;
            background: #fff;
            overflow: auto;
        }

        .register-btn-box {
            text-align: center;
            padding: 20px 0;
        }
    }
</style>
