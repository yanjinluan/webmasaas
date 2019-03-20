<template>
    <div class="add-box">
        <div class="add-head">
            <h2>新增模块</h2>
            <div class="off" @click="offAddWindow">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form 
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm">
            <el-form-item
				prop="appId"
				label="选择应用">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.appId"  
                    style="width:268px">
                    <el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
             <el-form-item 
                v-if="ruleForm.appId?true:false"
                label="上级模块">
                <el-select v-model="ruleForm.parentId"
                    clearable
                    placeholder="请选择（可不填）" 
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
                label="模块名称"
                prop="name">
                <el-input 
                    style="width:268px"
                    v-model="ruleForm.name"
                    placeholder="模块名称" 
                    class="role-name">
                </el-input>
            </el-form-item>
            <el-form-item 
                prop="tag"
                label="模块标识">
                <el-input 
                    v-model="ruleForm.tag"
                    style="width:264px"></el-input>
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
                <el-button  id="btn" type="primary" @click="setModule" :disabled='isDisabled'>提交</el-button>
                <el-button @click="offAddWindow">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'AddModule',
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
        var validateTag = (rule, value, callback) => {
			if (!/[a-z0-9]{1,8}$/.test(value)) {
				callback(new Error('请输入1-8位，英文或数字的组合'));
			}else{
				callback();
			}
		};
        var validateAppId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择应用'));
            } else {
                callback()
            }
        };
        return {
            isDisabled:false,
            moduleLists:[],
            appLists:[],
            ruleForm: {
                name:'',
                index:'',
                tag:'',
                parentId:'',
                appId:''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                index:[
                    { validator: validateIndex, trigger: 'blur' }
                ],
                tag:[
					{ validator: validateTag, trigger: 'blur' }
				],
                appId:[
					{ validator: validateAppId, trigger: 'change' }
				]
            }
        }
    },
    computed:{
		...mapState({
			userId (state) {
                return state.other.userInfo.id
            }
		}),
        applicationId () {
            return this.ruleForm.appId
        }
	},
    watch:{
        applicationId (val) {
            this.ruleForm.parentId = '';
            if(val) {
               this.getModuleLists(val);
            }
        }
    },
    created () {
        this.getApp();
    },
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        getModuleLists (appId) {//获取上级模块
            this.$http.get('/api/application/modules/',{
                params:{
                    applicationId: appId
                }
            }).then ( res => {
                this.moduleLists = res.data.resp;
            })
        }, 
        offAddWindow () {
            Bus.$emit('offUserWindow','addmodule');
        },
        setModule () {
            this.isDisabled = true;
            let { name, parentId, index , tag, appId } = this.ruleForm;
			this.$refs.ruleForm.validate( valid => {
				if (valid) {//添加应用
					this.$http.post(`/api/application/modules/?applicationId=${appId}`,{
                        name, 
                        parentId: parentId?parentId:'', 
                        appId,
                        index, 
                        tag
					},{
                        headers:{
                            'Operate-Application-Id': appId
                        }
                    }).then( res => {
						if (res.data.success) {
                            Bus.$emit('offUserWindow','addmodule');
							Message({
								message:'模块添加成功',
								duration:'1200',
								type:'success'
							})
						}else{
							Message({
								message:'模块添加失败',
								duration:'1200',
								type:'error'
                            })
                            this.isDisabled = false;
						}
					}).catch( () => {
                        this.isDisabled = false;
                    })
				} else {
                    this.isDisabled = false;
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
