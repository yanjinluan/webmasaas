<template>
    <div class="add-box">
        <div class="add-head">
            <h2>修改模块信息</h2>
            <div class="off" @click="offAmendWindow">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form 
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm">
            <el-form-item 
                prop="name"
                label="模块名称:">
                <el-input 
                    v-model="ruleForm.name"
                    style="width:264px"></el-input>
            </el-form-item>
            <el-form-item 
                label="上级模块:">
                <el-select v-model="ruleForm.parentId"
                    placeholder="请选择" 
                    class="select">
                    <el-option
                        v-for="item in moduleLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                prop="index"
                label="模块在本级模块中的排序顺序:">
                <el-input 
                    style="width:138px"
                    v-model="ruleForm.index"
                    class="org-index"></el-input>
            </el-form-item>
            <div class="btn-box">
                <el-button  type="primary" id="btn" @click="changeModule">提交</el-button>
                <el-button @click="offAmendWindow">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'AmendModule',
    data () {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入组织名称'));
            } else {
                callback()
            }
        };
        var validateIndex = (rule, value, callback) => {
            if(/^\d+$/.test(value)) {
                callback()
            }else{
                 callback(new Error('请输入数字'));
            }
        };
        return {
            appLists:[],
            moduleLists:[],
            ruleForm: {
                name:'',
                index:'',
                parentId:''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                index:[
                    { validator: validateIndex, trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
            },
            moduleId (state) {
                return state.getId.id
            }
		})
	},
    created () {
        //初始数据
        this.$http.get(`/api/application/modules/${this.moduleId}/?applicationId=${this.applicationId}`,{
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.ruleForm = res.data.resp;
        });
        //获取模块列表
        this.$http.get('/api/application/modules/',{
            params:{
                applicationId:this.applicationId
            },
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.moduleLists = res.data.resp;
            this.moduleLists.push({
                id:'', name:'无'
            })
        });
    },
    methods:{
        offAmendWindow () {
            Bus.$emit('offUserWindow','amendmodule');
        },
        changeModule () {
            let { name, parentId, index } = this.ruleForm;
			this.$refs.ruleForm.validate((valid) => {
				if(valid){
					this.$http.put(`/api/application/modules/${this.moduleId}/?applicationId=${this.applicationId}`,{
						name, 
                        parentId:parentId?parentId:'', 
                        index, 
                        id:this.moduleId
					}, {
                        headers:{
                            'Operate-Application-Id': this.applicationId
                        }
                    }).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','amendmodule');
							Bus.$emit('busGetmoduleLists', this.applicationId);
                            Bus.$emit('busGetModuleObj');
							Message({
								message:'修改成功',
								duration:'1200',
								type:'success'
							})
						}else{
							Message({
								message:'修改失败',
								duration:'1200',
								type:'error'
							})
						}
					})
				}
			});
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-box{
        position: absolute;
        width: 360px;
        border: 1px solid #ccc;
        background: #fff;
        top:50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 7;

        .add-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .demo-ruleForm{
            padding: 20px 10px 20px 10px;

            .select{
                width: 78%;
            }

            .btn-box{
                text-align: center;
            }
        }

        .rent-box{
            width:100%;
            height: 60px;
            line-height: 38px;
            font-size: 14px;
            color:#888;

            .rent-title{
                float: left;
                height: 38px;
                line-height: 38px;
                color: #606266;
            }

            .rent{
                width: 266px;
                float: right;
                margin-right: 2px;
                height: 38px;
                color:#373d41;

                .up-organization{
                    width: 100%;
                    height: 40px;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    padding: 0 15px;
                    color: #bba;
                    position: relative;

                    .fontcolor {
                        color:#606266;
                    }

                    .icon-down{
                        font-size: 14px;
                        position: absolute;
                        top:13px;
                        right: 8px;
                        color: #dcdcdc;
                    }
                }
            }
        }
    }
</style>
