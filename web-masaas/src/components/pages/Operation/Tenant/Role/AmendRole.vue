<template>
    <div class="add-role-box">
        <div class="add-role-head">
            <h2>修改角色信息</h2>
            <div class="off" @click="offAmendRole">
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
                label="角色名称:">
                <el-input 
                    v-model="ruleForm.name"
                    style="width:264px"></el-input>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button id="btn" @click="amendRole" type="primary">提交</el-button>
            <el-button @click="offAmendRole">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AmendRole',
    data () {
         var validateName = (rule, value, callback) => {
            if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色名称'));
            }
        };
        return{
            ruleForm: {
                name:'',
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        //获取当前角色信息
        this.$http.get(`/api/tenant/roles/${this.roleId}/`, {
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.ruleForm = res.data.resp;
        })
    },
    computed:{
        ...mapState({
            roleId:(state) => {//拿到要修改的角色数据
                return state.getId.id;
            },
            applicationId (state) {
				return state.getId.appId;
			}
        })
    },
    methods:{
        offAmendRole () {//关闭窗口
            Bus.$emit('offUserWindow','amendrole');
        },
        amendRole () {
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    let params = {
                        id:this.roleId,
                        name:this.ruleForm.name,
                        appId:this.applicationId,
                    }
                    this.$http.put(`/api/tenant/roles/${this.roleId}/`, params, {
                        headers:{
                            'Operate-Application-Id': this.applicationId
                        }
                    }).then(res =>{
                        if(res.data.success){//成功逻辑
                            Message({
                                message:'角色修改成功',
                                duration:1500,
                                type:'success'
                            });
                            Bus.$emit('busGetRoleLists');//刷新数据
                            Bus.$emit('offUserWindow','amendrole');
                        }else{
                            Message({
                                message:'失败',
                                duration:1500,
                                type:'error'
                            });
                        }
                    });
                }
            }) 
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-role-box{
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

         .add-role-head{
            h2{
                height: 50px;
                line-height: 50px;
                background: #409EFF;
                text-align: center;
                color: #fff;
            }
        }

        .demo-ruleForm{
            padding: 20px 0 0 10px; 
        }
        .btn{
            text-align: center;
            padding-bottom: 20px;
        }
    }
</style>

