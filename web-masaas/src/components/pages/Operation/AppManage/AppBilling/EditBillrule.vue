<template>
    <div class="role-lists-box">
        <div class="role-lists-head">
            <h2>修改计费规则</h2>
            <div class="off" @click="offAppAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="规则名称:" prop="name">
				<el-input type="text" 
                v-model="ruleForm.name" 
                style="width:258px"
                auto-complete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item 
                prop="type"
                label="计费类型:">
                <el-select v-model="ruleForm.type"
                    style="width:258px"
                    clearable
                    placeholder="请选择" 
                    class="select">
                    <el-option
                        v-for="item in typeLists"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
			<!-- <el-form-item 
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
            </el-form-item> -->
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
                v-model="ruleForm.price" 
                style="width:258px"
                auto-complete="off"></el-input>
			</el-form-item>
            <!-- <template v-if="ruleForm.type === 0">
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
                <el-radio-group v-model="ruleForm.resourceId"  class="user">
                    <div v-for="item in resourceLists" :key="item.id" class="user-box">
                        <el-radio :label="item.id">
                            {{ item.name }}
                        </el-radio>
                    </div>
                </el-radio-group>
            </template>
            <template v-if="ruleForm.type === 1">
                <div class="user-box">
                    可分配模块查询:
                </div>
                <div class="vague-box">
                    <div class="vague-box-left">
                    <el-input placeholder="请入输入模块名称" v-model="moduleName"></el-input>
                    </div>
                    <div class="vague-box-right">
                        <el-button  type="primary" @click="getModule">查询</el-button>
                    </div>
                </div>
                <el-radio-group v-model="ruleForm.moduleId"  class="user">
                    <div v-for="item in moduleLists" :key="item.id" class="user-box">
                        <el-radio :label="item.id">
                            {{ item.name }}
                        </el-radio>
                    </div>
                </el-radio-group>
            </template>
            <template v-if="ruleForm.type === 2">
                <div class="user-box">
                    可分应用:
                </div>
                <el-radio-group v-model="ruleForm.applicationId"  class="user">
                    <div v-for="item in appLists" :key="item.id" class="user-box">
                        <el-radio :label="item.id">
                            {{ item.name }}
                        </el-radio>
                    </div>
                </el-radio-group>
            </template> -->
		</el-form>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="changeRule">保存</el-button>
            <el-button  @click="offAppAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
    name:'EditBillrule',
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
        // var validateCycle = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输选择周期'));
        //     } else {
        //         callback()
        //     }
        // };
        // var validateType = (rule, value, callback) => {
        //     if (value === '' ) {
        //         callback(new Error('请选择类型'));
        //     } else {
        //         callback()
        //     }
        // };
        var validateTime = (rule, value, callback) => {
            if ( !value ) {
                callback(new Error('请选择时间'));
            } else {
                callback()
            }
        };
        return{
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
            moduleName:'',
            resourceLists:[],
            appLists:[],
            resourceName:'',
            ruleForm:{
                name:'',
                resourceId:'',
                moduleId:'',
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
                // cycle: [
                //     { validator: validateCycle, trigger: 'blur' }
                // ],
                // type:[
                //     { validator: validateType, trigger: 'blur' }
                // ],
                time: [
                    { validator: validateTime, trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        //获取租户数据
        this.$http.get(`/api/application/feerules/${this.ruleId}/?applicationId=${this.applicationId}`,{
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            let obj = res.data.resp;
            this.ruleForm.name = obj.name;
            this.ruleForm.resourceId = obj.resourceId;
            this.ruleForm.type = obj.type;
            this.ruleForm.price = obj.price;
            this.ruleForm.time = [];
            this.ruleForm.applicationId= obj.applicationId;
            this.ruleForm.moduleId = obj.moduleId;
            this.ruleForm.cycle = obj.cycle;
            this.ruleForm.time[0] = new Date(obj.validTime).getTime();
            this.ruleForm.time[1] = new Date(obj.expireTime).getTime();
        });
        //this.getModule();
        //this.getResource();
        //this.getApp();
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
			ruleId (state) {
				return state.getId.id;
            },
            userId (state) {
                return state.other.userInfo.id
            }
		})
	},
    methods:{
        getApp () {
            this.$http.get(`/api/aa/tokens/users/${this.userId}/applications/`).then(res => {
                this.appLists = res.data.resp;
            });
        },
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','editbillrule');
        },
        getModule () {//获取模块
            this.$http.get('/api/application/modules/',{
                params:{
                    applicationId:this.applicationId,
                    name:this.moduleName
                }
            }).then( res => {
                this.moduleLists = res.data.resp;
            })  
        },
        getResource () {//获取资源
            this.$http.get('/api/application/resources/',{
                params:{
                    applicationId:this.applicationId,
                    resourceName:this.resourceName
                }
            }).then( res => {
                this.resourceLists = res.data.resp;
            })  
        },
        changeRule () {
            this.$refs.ruleForm.validate((valid) => {
                if(valid){//三种情况 0 1 2
                    if(this.ruleForm.type === 0){
                        if(this.ruleForm.resourceId){
                            this.resRule();
                        }else{
                            Message({
                                message:'请选择资源',
                                duration:1500,
                                type:'warning'
                            });
                        }
                    }else if (this.ruleForm.type === 1) {
                        if(this.ruleForm.moduleId){
                            this.moduleRule();
                        }else{
                            Message({
                                message:'请选择模块',
                                duration:1500,
                                type:'warning'
                            });
                        }
                    }else{
                        if(this.ruleForm.applicationId){
                            this.appRule();
                        }else{
                            Message({
                                message:'请选择应用',
                                duration:1500,
                                type:'warning'
                            });
                        }
                    }
                }
            });
        },
        resRule () {
            let {name, price, resourceId, type, time} = this.ruleForm;
            this.$http.put(`/api/application/feerules/${this.ruleId}/?applicationId=${this.applicationId}`, {
                name, price, resourceId, type, 
                validTime: time[0],
                expireTime: time[1],
                id:this.ruleId
            }, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then (res => {
                if( res.data.success) {
                    Bus.$emit('offUserWindow','editbillrule');
                    Bus.$emit('busGetBillRule');
                    Message({
                        message:'修改成功',
                        duration:'1200',
                        type:'success'
                    })
                }
            })
        },
        moduleRule () {
            let {name, price, moduleId, type, time, cycle } = this.ruleForm;
            this.$http.put(`/api/application/feerules/${this.ruleId}/?applicationId=${this.applicationId}`, {
                name, price, moduleId, type, cycle, 
                validTime: time[0],
                expireTime: time[1],
                id:this.ruleId
            }, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then (res => {
               if( res.data.success) {
                    Bus.$emit('offUserWindow','editbillrule');
                    Bus.$emit('busGetBillRule');
                    Message({
                        message:'修改成功',
                        duration:'1200',
                        type:'success'
                    })
                }
            })
        },
        appRule () {
            let {name, price, appId,  type, time, cycle, applicationId } = this.ruleForm;
            this.$http.put(`/api/application/feerules/${this.ruleId}/?applicationId=${applicationId}`, {
                name, price, type, cycle, applicationId,
                validTime: time[0],
                expireTime: time[1],
                id:this.ruleId
            },{
                headers:{
                    'Operate-Application-Id': applicationId
                }
            }).then (res => {
                if( res.data.success) {
                    Bus.$emit('offUserWindow','editbillrule');
                    Bus.$emit('busGetBillRule');
                    Message({
                        message:'修改成功',
                        duration:'1200',
                        type:'success'
                    })
                }
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
            height: 220px;
            // overflow: auto;
        }
        .user-box{
            padding-left: 30px;
            clear: both;
            height: 40px;
            line-height: 40px;
            align-items: center; 
            color: #409EFF;
            font-size: 16px;
            font-weight: bold;
        }

        .vague-box{
            margin: 0 auto;
            height: 40px;
            line-height: 32px;
            box-sizing: border-box;
            
            .vague-box-left {
                padding-left: 80px;
                width: 280px;
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
