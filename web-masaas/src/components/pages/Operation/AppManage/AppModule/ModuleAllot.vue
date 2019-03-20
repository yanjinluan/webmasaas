<template>
    <div class="role-lists-box">
        <have-resource
            v-if="isShow" 
            :changeIsShow="changeIsShow"
            :moduleObj="moduleObj"
        ></have-resource>
        <div class="role-lists-head">
            <h2>模块分配资源</h2>
            <div class="off" @click="offAppAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="role">
            <span>当前模块:</span>
            {{ moduleObj.name }}
        </div>
        <div class="role">
            <span>已分配资源:</span>
            <el-button class="btn"  type="primary" @click="changeIsShow(true)">查看</el-button>
        </div>
        <div class="user-box">
            可分配资源查询:
        </div>
        <div class="vague-box">
            <div class="vague-box-left">
               <el-input placeholder="请入输入资源名称" v-model="resourceName"></el-input>
            </div>
            <div class="vague-box-right">
                <el-button  type="primary" @click="getResource">查询</el-button>
            </div>
        </div>
        <div class="no-user" v-if="isUserShow">暂无数据</div>
        <el-radio-group v-model="resourceId" v-if="!isUserShow" class="user">
            <div v-for="item in resourceLists" :key="item.id" class="user-box">
                <el-radio :label="item.id">
                    {{ item.name }}
                </el-radio>
            </div>
        </el-radio-group>
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
import HaveResource from './HaveResource';

export default {
    name:'ModuleAllot',
    data(){
        return{
            resourceLists:[],
            resourceId:'',
            resourceName:'',
            moduleObj:{},
            isShow:false,
            isUserShow:true//无数据显示
        }
    },
    created () {
        this.$http.get(`/api/application/modules/${this.moduleId}/?applicationId=${this.applicationId}`, {
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.moduleObj = res.data.resp;
        });
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId
            },
            moduleId (state) {
                return state.getId.id
            }
		})
	},
    components:{
        HaveResource
    },
    watch:{
        resourceLists ( val ) {
            if ( val.length > 0 ) {
                //有数据时隐藏无数据字符串
                this.isUserShow = false;
            }else {
                //无数据提示
                Message({
                    message:'查无此数据',
                    duration:1500,
                    type:'warning'
                });
                this.isUserShow = true;
            }
        }
    },
    methods:{
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','moduleallot');
        },
        getResource () {//获取资源
            this.$http.get('/api/application/resources/',{
                params:{
                    applicationId:this.applicationId,
                    resourceName:this.resourceName
                },
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( res => {
                this.resourceLists = res.data.resp;
            })  
        },
        setModuleRes () {
            let { moduleId, resourceId } = this;
            if ( resourceId ) {
                this.$http.post(`/api/application/mrmap/?applicationId=${this.applicationId}`,{
                    moduleId,
                    resourceId
                }, {
                    headers:{
                        'Operate-Application-Id': this.applicationId
                    }
                }).then( res => {
                    if (res.data == 'alreadyExists'){
                        Message({
                            message:'已经分配过该资源',
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
            }else{
                Message({
                    message:'请选择资源',
                    duration:1500,
                    type:'warning'
                });
            }
        },
        changeIsShow ( status ) {//控制已分配窗口显示隐藏
            this.isShow = status;
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-lists-box{
        position: fixed;
        width: 560px;
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

        .vague-box{
            width: 540px;
            margin: 0 auto;
            height: 40px;
            line-height: 32px;
            box-sizing: border-box;
            
            .vague-box-left {
                padding-left: 50px;
                width: 420px;
                height: 40px;
                line-height: 40px;
                float: left;
            }

            .vague-box-right {
                width: 100px;
                height: 40px;
                line-height: 40px;
                float: left;
                
            }
        }
        
        .no-user{
            text-align: center;
            margin: 20px 0;
        }

        .user{
            display: block;
            width: 540px;
            height: 140px;
            overflow: auto;
            margin: 20px auto;

            .user-box{
                height: 32px;
                line-height: 32px;
            }
        }

        .btn-box{
            clear: both;
            text-align: center;
            padding: 10px 0 30px 0;
        }
    }
</style>
