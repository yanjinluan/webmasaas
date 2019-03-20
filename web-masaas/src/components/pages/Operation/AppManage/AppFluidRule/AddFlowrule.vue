<template>
    <div class="role-lists-box">
        <div class="role-lists-head">
            <h2>新增流控规则</h2>
            <div class="off" @click="offAppAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item
				prop="appId"
				label="选择应用">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.appId"  
                    style="width:278px">
                    <el-option
                        v-for="item in appLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="规则名称:" prop="name">
				<el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
			</el-form-item>
            <el-form-item 
                v-if="ruleForm.appId?true:false"
                prop="tenantId"
                label="隶属租户:">
                <el-select v-model="ruleForm.tenantId"
                    style="width:278px"
                    clearable
                    placeholder="请选择" 
                    class="select">
                    <el-option
                        v-for="item in tenantLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="resourceId"
				label="选择资源">
				<el-select 
					placeholder="请选择"
                    v-model="ruleForm.resourceId"  
                    style="width:278px">
                    <el-option
                        v-for="item in resourceLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
			</el-form-item>
            <el-form-item label="每分钟请求量:" prop="value">
				<el-input type="text" v-model="ruleForm.value" auto-complete="off"></el-input>
			</el-form-item>
            <el-form-item 
                prop="time"
                label="管控时间:">
                <el-date-picker
                    value-format="timestamp"
                    v-model="ruleForm.time"
                    style="width:278px; float:right"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
           </el-form-item>
		</el-form>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="setRule" :disabled='isDisabled'>提交</el-button>
            <el-button  @click="offAppAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
    name:'AddFlowrule',
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入规则名称'));
            } else {
                callback()
            }
        };
        var validateValue = (rule, value, callback) => {
            if (value <= 0 ) {
                callback(new Error('请输入正确的数量'));
            } else {
                callback()
            }
        };
        var validateTenantId = (rule, value, callback) => {
            if (value === '' ) {
                callback(new Error('请选择租户'));
            } else {
                callback()
            }
        };
        var validateTime = (rule, value, callback) => {
            if ( value ) {
                if ( value.length == 0 ) {
                    callback(new Error('请选择时间'));
                } else {
                    callback()
                }
            } else {
                callback(new Error('请选择时间'));
            }
        };
        var validateAppId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择应用'));
            } else {
                callback()
            }
        };
        var validateResourceId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择资源'));
            } else {
                callback()
            }
        };
        return{
            isDisabled:false,
            resourceLists:[],
            appLists:[],
            ruleForm:{
                name:'',
                tenantId:'',
                resourceId:'',
                value:'',
                time:[],
                appId:''
            },
            tenantLists:[],
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                value: [
                    { validator: validateValue, trigger: 'blur' }
                ],
                tenantId: [
                    { validator: validateTenantId, trigger: 'change' }
                ],
                time: [
                    { validator: validateTime, trigger: 'change' }
                ],
                appId:[
					{ validator: validateAppId, trigger: 'change' }
				],
                resourceId: [
                    { validator: validateResourceId, trigger: 'change' }
                ]
            }
        }
    },
    created () {
        this.getApp();
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
            this.ruleForm.tenantId = '';
            this.ruleForm.resourceId = '';
            this.resourceLists = [];
            if(val) {
                this.getResource();
                this. getTenant();
            }
        }
    },
    methods:{
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','addflowrule');
        },
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        getTenant (val) {
             this.$http.get(`/api/application/tenants/?applicationId=${this.applicationId}`, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( res => {
                this.tenantLists = res.data.resp;
            }) 
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
        setRule () {
            this.isDisabled = true;
            let { name, tenantId, resourceId, value, time } = this.ruleForm;
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    this.$http.post(`/api/application/fcrules/?applicationId=${this.applicationId}`, {
                        appId:this.applicationId,
                        name,
                        tenantId,
                        resourceId,
                        value,
                        validTime:time[0],
                        expireTime:time[1]
                    }, {
                        headers:{
                            'Operate-Application-Id': this.applicationId
                        }
                    }).then ( res => {
                        if(res.data.success) {
                            Bus.$emit('offUserWindow','addflowrule');
                            Message({
                                message:'添加成功',
                                duration:1500,
                                type:'success'
                            });
                        }else{
                            Message({
                                message:'添加失败',
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
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-lists-box{
        position: fixed;
        width: 450px;
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

        .demo-ruleForm{
            padding-top: 20px;
            padding-right: 50px;
            overflow-y: auto;
        }

        .btn-box{
            clear: both;
            text-align: center;
            padding: 10px 0 30px 0;
        }
    }
</style>
