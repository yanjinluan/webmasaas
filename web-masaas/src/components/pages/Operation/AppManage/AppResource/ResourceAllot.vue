<template>
    <div class="role-lists-box">
        <have-module
            v-if="isShow" 
            :changeIsShow="changeIsShow"
            :resourceObj="resourceObj"
        ></have-module>
        <div class="role-lists-head">
            <h2>资源分配模块</h2>
            <div class="off" @click="offAppAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role">
            <span>当前资源:</span>
            {{ resourceObj.name }}
        </div>
        <div class="role">
            <span>已分配模块:</span>
            <el-button class="btn"  type="primary" @click="changeIsShow(true)">查看</el-button>
        </div>
        <div class="user-box">
            可分配模块:
        </div>
        <div class="list">
            <el-tree
                :props="props"
                :data="moduleLists"
                :expand-on-click-node=false
                @node-click="setId"
                ref="tree">
            </el-tree>
        </div>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="setModuleRes">保存</el-button>
            <el-button  @click="offAppAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';
import HaveModule from './HaveModule';

export default {
    name:'ResourceAllot',
    data(){
        return{
            props: {
                label: 'name',
                children: 'children',
            },
            moduleLists:[],
            moduleId:'',
            resourceObj:{},
            isShow:false,
            isUserShow:true//无数据显示
        }
    },
    created () {
        this.$http.get(`/api/application/resources/${this.resourceId}/?applicationId=${this.applicationId}`, {
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.resourceObj = res.data.resp;
        });
        this.getModule();
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
            },
            resourceId (state) {
                return state.getId.id
            }
		})
	},
    components:{
        HaveModule
    },
    methods:{
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','resourceallot');
        },
        getModule () {//获取模块
            this.$http.get('/api/application/modules/',{
                params:{
                    applicationId:this.applicationId
                },
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( res => {
                this.moduleLists = res.data.resp;
            })  
        },
        setModuleRes () {
            let { moduleId, resourceId } = this;
            if(moduleId){
                this.$http.post(`/api/application/mrmap/?applicationId=${this.applicationId}`,{
                    moduleId,
                    resourceId
                }, {
                    headers:{
                        'Operate-Application-Id': this.applicationId
                    }
                }).then( res => {
                    Bus.$emit('offUserWindow','resourceallot');
                    if (res.data == 'alreadyExists'){
                        Message({
                            message:'已经分配过该模块',
                            duration:1500,
                            type:'warning'
                        });
                    }else{
                        Message({
                            message:'添加成功',
                            duration:1500,
                            type:'success'
                        });
                    }
                })
            }else {
                Message({
                    message:'请选择模块',
                    duration:'1500',
                    type:'warning'
                })
            }
        },
        changeIsShow ( status ) {//控制已分配窗口显示隐藏
            this.isShow = status;
        },
        setId (data) {
            this.moduleId = data.id;
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-lists-box{
        position: fixed;
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
        color: #555;

        .role-lists-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .role{
            padding-left: 30px;
            margin: 30px auto;

            .inp{
                width: 220px;
                height: 40px;
                padding-left: 10px;
            }

            .btn{
                margin-left: 10px;
            }
        }

        .user-box{
            padding-left: 30px;
            height: 40px;
            line-height: 40px;
            align-items: center; 
            color: #409EFF;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .list{
            padding-left: 30px;
            height: 30px;
            line-height: 20px;
            font-size: 16px;
            margin-bottom: 10px;
            height: 200px;
            overflow: auto;
        }

        .btn-box{
            clear: both;
            text-align: center;
            padding: 10px 0 30px 0;
        }
    }
</style>
