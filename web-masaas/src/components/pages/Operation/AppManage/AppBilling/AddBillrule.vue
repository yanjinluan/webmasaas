<template>
    <div class="role-lists-box">
        <div class="role-lists-head">
            <h2>新增计费规则</h2>
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
                    style="width:258px">
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
                prop="tenantId"
                label="隶属租户:">
                <el-select v-model="ruleForm.tenantId"
                    style="width:258px"
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
			<el-form-item label="规则名称:" prop="name">
				<el-input type="text" 
                style="width:258px"
                v-model="ruleForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item 
                v-if="this.applicationId !=''"
                prop="type"
                label="计费类型:">
                <el-select v-model="ruleForm.type"
                    style="width:258px"
                    clearable
                    placeholder="请选择" 
                    @change="typeChange"
                    class="select">
                    <el-option
                        v-for="item in typeLists"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form 
                v-if="this.ruleForm.type==1"
                :model="ruleForm" 
                :rules="rulesModule" 
                label-width="120px"
                status-icon ref="ruleFormMoudle">
                <el-form-item 
                    prop="moduleId"
                    label="一级模块:">
                    <el-select v-model="ruleForm.moduleId"
                        style="width:258px"
                        clearable
                        placeholder="请选择" 
                        @change="modueChange"
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
                    label="二级模块:">
                    <el-select
                        v-model="twoModuleId"
                        style="width:258px"
                        clearable
                        placeholder="非必填" 
                        class="select">
                        <el-option
                            v-for="item in twoModuleLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form 
                    v-if="this.ruleForm.type===0"
                    :model="ruleForm" 
                    :rules="rulesResource" 
                    label-width="120px"
                    status-icon ref="rulesResource">
                <el-form-item 
                    prop="resourceId"
                    label="资源选择:">
                    <el-select v-model="ruleForm.resourceId"
                        style="width:258px"
                        clearable
                        placeholder="请选择" 
                        class="select">
                        <el-option
                            v-for="item in resourceLists"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
			<el-form-item 
                v-if="ruleForm.type!==0"
                prop="cycle"
                label="计费周期:">
                <el-select v-model="ruleForm.cycle"
                    style="width:258px"
                    clearable
                    placeholder="请选择" 
                    class="select">
                    <el-option
                        v-for="item in cycleLists"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                prop="time"
                label="管控时间:">
                <el-date-picker
                    value-format="timestamp"
                    v-model="ruleForm.time"
                    style="width:258px; float:left"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
		    <el-form-item label="计费价格:" prop="price">
				<el-input type="text" 
                style="width:258px"
                v-model="ruleForm.price" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="setRule" :bisabled="isDisabled">保存</el-button>
            <el-button  @click="offAppAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
    name:'AddBillrule',
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入规则名称'));
            } else {
                callback()
            }
        };
        var validatePrice = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入金额'));
            } else {
                callback()
            }
        };
        var validateCycle = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输选择周期'));
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
        var validateType = (rule, value, callback) => {
            if (value === '' ) {
                callback(new Error('请选择类型'));
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
        var validateModule = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择模块'));
            } else {
                callback()
            }
        };
        var validateResource = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择资源'));
            } else {
                callback()
            }
        };
        return{
            isDisabled:false,
			typeLists:[
				{value:0, name:'按资源计费'},
				{value:1, name:'按模块计费'},
				{value:2, name:'按应用计费'}
			],
			cycleLists:[
				{value:0, name:'按日'},
				{value:1, name:'按月'},
				{value:2, name:'按年'}
            ],
            moduleLists:[],
            appLists:[],
            resourceLists:[],
            twoModuleLists:[],
            twoModuleId:'',
            ruleForm:{
                name:'',
                tenantId:'',
                resourceId:'',
                moduleId:'',
                appId:'',
				time:[],
				type:'',
				price:'',
				cycle:''
            },
            tenantLists:[],
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                price: [
                    { validator: validatePrice, trigger: 'blur' }
                ],
                cycle: [
                    { validator: validateCycle, trigger: 'change' }
                ],
                type:[
                    { validator: validateType, trigger: 'change' }
                ],
                tenantId: [
                    { validator: validateTenantId, trigger: 'change' }
                ],
                appId:[
					{ validator: validateAppId, trigger: 'change' }
				],
                time: [
                    { validator: validateTime, trigger: 'change' }
                ]
            },
            rulesModule:{
                moduleId: [
                    { validator: validateModule, trigger: 'change' }
                ]
            },
            rulesResource:{
                resourceId: [
                    { validator: validateResource, trigger: 'change' }
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
            if(this.ruleForm.type == 0) {
                this.ruleForm.resourceId = '',
                this.resourceLists = [];
                this.getResource();
            }else if(this.ruleForm.type == 1){
                this.ruleForm.moduleId = '';
                this.moduleLists = [];
                this.twoModuleLists = [];
                this.twoModuleId = '';
            }
            this.ruleForm.tenantId = '';
            if(val) {
                this.getTenant();
                if(this.ruleForm.type == 0) {
                    this.getResource();
                }else if(this.ruleForm.type == 1){
                   this.getModule();
                };
            };
        }
    },
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','addbillrule');
        },
        typeChange () {
            switch (this.ruleForm.type) {
                case 1: this.getModule();break;
                case 0: this.getResource(); break;
                default:break;
            }
        },
        modueChange (val) {
            this.twoModuleLists = [];
            this.twoModuleId = '';
            this.moduleLists.forEach(item => {
                if(item.id === val) {
                    this.twoModuleLists = item.children;
                }
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
        getResource () {//获取资源
            this.$http.get(`/api/application/resources/?applicationId=${this.applicationId}`,{
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( res => {
                this.resourceLists = res.data.resp;
            })  
        },
        setRule () {
            this.isDisabled = true;
            this.$refs.ruleForm.validate( valid => {
                if(valid){//三种情况 0 1 2
                    if(this.ruleForm.type === 0){
                        this.$refs.rulesResource.validate( valid => {
                            if (valid) {
                                this.resRule();
                            }else{
                                this.isDisabled = false;
                            }
                        })  
                    }else if (this.ruleForm.type === 1) {
                        this.$refs.ruleFormMoudle.validate( valid => {
                            if (valid) {
                                this.moduleRule();
                            }else{
                                this.isDisabled = false;
                            }
                        })  
                    }else{
                        this.appRule();
                    }
                }else {
                    this.isDisabled = false;
                }
            });
        },
        resRule () {
            let {name, price, resourceId, tenantId, type, time } = this.ruleForm;
            this.$http.post(`/api/application/feerules/?applicationId=${this.applicationId}`, {
                name, price, resourceId, tenantId, type,
                applicationId: this.applicationId,
                validTime: time[0],
                expireTime: time[1]
            }, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then (res => {
                if( res.data.success) {
                    Bus.$emit('offUserWindow','addbillrule');
                    Message({
                        message:'新增成功',
                        duration:'1200',
                        type:'success'
                    })
                }
            }).catch( () => {
                this.isDisabled = false;
            })
        },
        moduleRule () {
            let {name, price, moduleId, tenantId, type, time, cycle } = this.ruleForm;
            this.$http.post(`/api/application/feerules/?applicationId=${this.applicationId}`, {
                name, 
                price, 
                moduleId:this.twoModuleId?this.twoModuleId:moduleId, 
                tenantId, 
                type, 
                cycle,
                applicationId: this.applicationId,
                validTime: time[0],
                expireTime: time[1]
            }, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then (res => {
                if( res.data.success) {
                    Bus.$emit('offUserWindow','addbillrule');
                    Message({
                        message:'新增成功',
                        duration:'1200',
                        type:'success'
                    })
                }
            }).catch( () => {
                this.isDisabled = false;
            })
        },
        appRule () {
            let {name, price, appId, tenantId, type, time, cycle } = this.ruleForm;
            this.$http.post(`/api/application/feerules/?applicationId=${this.applicationId}`, {
                name, price, tenantId, type, cycle,
                applicationId: this.applicationId,
                validTime: time[0],
                expireTime: time[1]
            }, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then (res => {
                if( res.data.success) {
                    Bus.$emit('offUserWindow','addbillrule');
                    Message({
                        message:'新增成功',
                        duration:'1200',
                        type:'success'
                    })
                }
            }).catch( () => {
                this.isDisabled = false;
            })
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
            height: 340px;
            overflow-y: auto;
        }
        
        .no-user{
            text-align: center;
            margin: 20px 0;
        }

        .user{
            padding-left: 20px;
            display: block;
            height: 120px;
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
