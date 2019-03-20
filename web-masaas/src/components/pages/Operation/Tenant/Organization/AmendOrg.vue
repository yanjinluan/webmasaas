<template>
    <div class="add-box">
        <up-organization 
            :appId="appId"
            :offUpOrg="offUpOrg"
            :changeIdAndUpOrg="changeIdAndUpOrg"
            v-if="upOrganizationShow">
        </up-organization>
        <div class="add-head">
            <h2>修改机构</h2>
            <div class="off" @click="offAmendWindow">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form 
            class="demo-ruleForm"
            :model="orgObj"
            :rules="rules"
            ref="orgObj">
            <el-form-item
                label="组织名称:"
                prop="name">
                <el-input 
                    v-model="orgObj.name"
                    class="role-name">
                </el-input>
            </el-form-item>
            <div class="rent-box">
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
                label="机构在本级机构中的排序顺序:"
                prop="index">
                <el-input 
                    v-model="orgObj.index"
                    style="width:138px">
                </el-input>
            </el-form-item>
            <div class="btn-box">
                <el-button id="btn" type="primary" @click="putOrg">保存</el-button>
                <el-button @click="offAmendWindow">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { Message } from 'element-ui';
import UpOrganization from './UpOrganization';
import { mapState } from 'vuex';

export default {
    name:'AmendOrg',
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
            orgObj:{},
            tenantLists:[],
            upOrganization:'请选择',
            parentId:'',
            upOrganizationShow:false,
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
            orgId:(state) => {//获取机构Id
                return state.getId.id;
            },
            appId (state) {
				return state.getId.appId;
			}
        })
    },
    created () {
        this.$http.get(`/api/tenant/organizations/${this.orgId}/`, {
            params:{
                appId: this.appId
            },
            headers:{
                'Operate-Application-Id': this.appId
            }
        }).then( res => {
           this.orgObj = res.data.resp;
           this.parentId = this.orgObj.parentId;
        })
    },
    watch:{
        orgObj (val) {
            if(val.parentId){//存在上级
                this.$http.get(`/api/tenant/organizations/${val.parentId}/`).then( res => {
                    this.upOrganization = res.data.resp.name;
                })
            }else{//无上级
                this.upOrganization = '无上级机构'
            }
        }
    },  
    methods:{
        changeIdAndUpOrg (id, name) {
            this.upOrganization = name;
            this.parentId = id;
        },
        offAmendWindow () {
            Bus.$emit('offUserWindow','amendorg');
        },
        openUpOrg () {//打开上级机构窗口
            this.upOrganizationShow = true;
        },
        offUpOrg () {//关闭上级机构窗口
            this.upOrganizationShow = false;
        },
        putOrg () {
            if(this.upOrganization === this.orgObj.name){
                 Message({
                    message:'上级机构不能选择自己',
                    duration:1500,
                    type:'warning'
                });
                return false;
            };
            this.$refs['orgObj'].validate( (valid) => {
                if (valid) {
                    this.$http.put(`/api/tenant/organizations/${this.orgObj.id}/`,{
                        id: this.orgObj.id,
                        name: this.orgObj.name,
                        parentId: this.parentId?this.parentId:'',
                        appId: this.appId,
                        index: this.orgObj.index
                    }, {
                        headers:{
                            'Operate-Application-Id': this.appId
                        }
                    }).then( res => {
                        if(res.data.success){
                            Bus.$emit('offUserWindow','amendorg');
                            Bus.$emit('busGetOrgLists', this.appId);
                            Bus.$emit('busGetOrgObj', this.orgObj.id, this.appId);
                            Message({
                                message:'修改机构成功',
                                duration:1500,
                                type:'success'
                            });
                        }
                    })
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

            .role-name{
                width: 78%;
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
