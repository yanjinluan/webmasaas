<template>
    <div class="role-lists-box">
        <div class="role-lists-head">
            <h2>修改流控规则</h2>
            <div class="off" @click="offAppAllot">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="规则名称:" prop="name">
				<el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
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
            <!-- <div class="user-box">
                已分配资源:
            </div>
            <el-radio-group v-model="ruleForm.resourceId" class="user">
                <div v-for="item in resourceLists" :key="item.id" class="user-box">
                    <el-radio :label="item.id">
                        {{ item.name }}
                    </el-radio>
                </div>
            </el-radio-group> -->
		</el-form>
        <div class="btn-box">
            <el-button id="btn" type="primary" @click="setRule">保存</el-button>
            <el-button  @click="offAppAllot">取消</el-button>
        </div>
    </div>
</template>

<script>
import Bus from '@/modules/bus';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
    name:'EditFlowrule',
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
        var validateTime = (rule, value, callback) => {
            if ( !value ) {
                callback(new Error('请选择时间'));
            } else {
                callback()
            }
        };
        return{
            //resourceLists:[],
            //resourceName:'',
            //isUserShow:true,//无数据显示
            ruleForm:{
                name:'',
                //resourceId:'',
                value:'',
                time:[]
            },
            tenantLists:[],
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                value: [
                    { validator: validateValue, trigger: 'blur' }
                ],
                time: [
                    { validator: validateTime, trigger: 'change' }
                ]
            }
        }
    },
    created () {
        this.getRuleObj();
        // this.getResource();
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
			},
            ruleId (state) {
                return state.getId.id
            }
		})
	},
    // watch:{
    //     resourceLists ( val ) {
    //         if ( val.length > 0 ) {
    //             //有数据时隐藏无数据字符串
    //             this.isUserShow = false;
    //         }else {
    //             //无数据提示
    //             Message({
    //                 message:'查无此数据',
    //                 duration:1500,
    //                 type:'warning'
    //             });
    //             this.isUserShow = true;
    //         }
    //     }
    // },
    methods:{
        offAppAllot () {
            //关闭当前窗口
            Bus.$emit('offUserWindow','editflowrule');
        },
        // getResource () {//获取资源
        //     this.$http.get('/api/application/resources/',{
        //         params:{
        //             applicationId:this.applicationId,
        //             resourceName:this.resourceName
        //         }
        //     }).then( res => {
        //         this.resourceLists = res.data.resp;
        //     })  
        // },
        getRuleObj () {
            this.$http.get(`/api/application/fcrules/${this.ruleId}/?applicationId=${this.applicationId}`, {
                headers:{
                    'Operate-Application-Id': this.applicationId
                }
            }).then( res => {
                let obj = res.data.resp;
                this.ruleForm.name = obj.name;
                //this.ruleForm.resourceId = obj.resourceId;
                this.ruleForm.value = obj.value;
                this.ruleForm.time = [];
                this.ruleForm.time[0] = new Date(obj.validTime).getTime();
                this.ruleForm.time[1] = new Date(obj.expireTime).getTime();
            });
        },
        setRule () {
            // if(this.ruleForm.resourceId == '') {
            //     Message({
            //         message:'请选择资源',
            //         duration:1500,
            //         type:'warning'
            //     });
            //     return false
            // }
            let { name, value, time } = this.ruleForm;
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    this.$http.put(`/api/application/fcrules/${this.ruleId}/?applicationId=${this.applicationId}`, {
                        appId:this.applicationId,
                        name,
                        // resourceId,
                        value,
                        validTime:time[0],
                        expireTime:time[1],
                        id:this.ruleId
                    },{
                        headers:{
                            'Operate-Application-Id': this.applicationId
                        }
                    }).then ( res => {
                        if(res.data.success) {
                            Bus.$emit('offUserWindow','editflowrule');
                            Bus.$emit('busGetRuleLists')
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
                        }
                    })
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
            height: 220px;
            //overflow: auto;
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
