<template>
    <div class="add-box">
        <up-organization 
            :appId="ruleForm.appId"
            :offUpOrg="offUpOrg"
            :changeIdAndUpOrg="changeIdAndUpOrg"
            v-if="upOrganizationShow">
        </up-organization>
        <div class="add-head">
            <h2>新增机构</h2>
            <div class="off" @click="offAddWindow">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form 
            class="demo-ruleForm"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm">
            <el-form-item
				prop="appId"
				label="选择应用:">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.appId"  
                    style="width:264px">
                    <el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
            <div class="rent-box" v-if="isShow">
                <div class="rent-title">
                    上级机构:
                </div>
                <div class="rent">
                    <div class="up-organization" @click="openUpOrg">
                        <span
                            :class="[upOrganization !='请选择' ? 'fontcolor' : '']"
                        >{{upOrganization}}</span>
                        <i class="icon-down fa fa-search"></i>
                    </div>
                </div>
            </div>
            <el-form-item
                label="机构名称:"
                prop="name">
                <el-input 
                    style="width:264px"
                    v-model="ruleForm.name"
                    placeholder="组织名称" 
                    class="role-name">
                </el-input>
            </el-form-item>
            <el-form-item 
                prop="index"
                label="机构在本级机构中的排序顺序:">
                <el-input 
                    style="width:138px"
                    v-model="ruleForm.index"
                    class="org-index"></el-input>
            </el-form-item>
            <div class="btn-box">
                <el-button id="btn" type="primary" @click="addOrganization" :disabled="isDisabled">提交</el-button>
                <el-button @click="offAddWindow">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import UpOrganization from './UpOrganization';

export default {
    name:'AddOrganization',
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
        var validateAppId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择应用'));
            } else {
                callback()
            }
        };
        return {
            isDisabled:false,
            isShow:false,
            tenantLists:[],
            appLists:[],
            upOrganization:'请选择',
            parentId:'',
            upOrganizationShow:false,
            ruleForm: {
                name:'',
                index:'',
                appId:''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                index:[
                    { validator: validateIndex, trigger: 'blur' }
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
            },
            applicationId () {
                return this.ruleForm.appId
            }
		})
    },
    watch:{
        applicationId () {
            this.isShow = true;
            this.parentId = '';
            this.upOrganization = '请选择';
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
        changeIdAndUpOrg (id, name) {
            this.upOrganization = name;
            this.parentId = id;
        },
        offAddWindow () {
            Bus.$emit('offUserWindow','addorganization');
        },
        openUpOrg () {//打开上级机构窗口
            this.upOrganizationShow = true;
        },
        offUpOrg () {//关闭上级机构窗口
            this.upOrganizationShow = false;
        },
        addOrganization () {
            this.isDisabled = true;
            this.$refs['ruleForm'].validate( valid => {
                if (valid) {
                    this.$http.post(`/api/tenant/organizations/`,{
                        name: this. ruleForm.name,
                        parentId: this.parentId?this.parentId:'',
                        index: this.ruleForm.index,
                        appId: this.ruleForm.appId
                    }, {
                        headers:{
                            'Operate-Application-Id': this.ruleForm.appId
                        }
                    }).then( res => {
                        if(res.data.success){//新增机构成功
                            Bus.$emit('offUserWindow','addorganization');
                            Message({
                                message:'添加机构成功',
                                duration:1500,
                                type:'success'
                            });
                        }else{
                            Message({
                                message:'添加机构失败',
                                duration:1500,
                                type:'error'
                            });
                            this.isDisabled = false;
                        }
                    }).catch( () => {
                         this.isDisabled = false;
                    })
                } else {
                    this.isDisabled = false;
                }
            })
        }
    },
    components:{
        UpOrganization
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
