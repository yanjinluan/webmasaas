<template>
    <div class="add-box">
        <div class="add-head">
            <h2>修改资源信息</h2>
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
                label="资源名称:">
                <el-input 
                    v-model="ruleForm.name"
                    style="width:264px"></el-input>
            </el-form-item>
            <!-- <el-form-item 
                prop="tag"
                label="资源标识:">
                <el-input 
                    v-model="ruleForm.tag"
                    style="width:264px"></el-input>
            </el-form-item> -->
			<el-form-item 
                prop="uriRegex"
                label="资源URI模式表达式:">
                <el-input 
                    v-model="ruleForm.uriRegex"
                    style="width:196px"></el-input>
            </el-form-item>
            <div class="btn-box">
                <el-button  type="primary" id="btn" @click="changeResources">提交</el-button>
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
    name:'EditResource',
    data () {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入组织名称'));
            } else {
                callback()
            }
		};
		var validateUriRegex = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入表达式'));
            } else {
                callback()
            }
        };
        // var validateTag = (rule, value, callback) => {
		// 	if (!/[a-z0-9]{1,8}$/.test(value)) {
		// 		callback(new Error('请输入1-8位，英文或数字的组合'));
		// 	}else{
		// 		callback();
		// 	}
		// };
        return {
            ruleForm: {
                name:'',
				uriRegex:''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                // tag:[
				// 	{ validator: validateTag, trigger: 'blur' }
				// ],
				uriRegex:[
					{ validator: validateUriRegex, trigger: 'blur' }
				]
            }
        }
    },
    computed:{
		...mapState({
			applicationId (state) {
				return state.getId.appId;
            },
            resourceId (state) {
                return state.getId.id
            }
		})
	},
    created () {
        //初始数据
        this.$http.get(`/api/application/resources/${this.resourceId}/?applicationId=${this.applicationId}`, {
            headers:{
                'Operate-Application-Id': this.applicationId
            }
        }).then( res => {
            this.ruleForm = res.data.resp;
        });
    },
    methods:{
        offAmendWindow () {
            Bus.$emit('offUserWindow','editresource');
        },
        changeResources () {
            let { name, uriRegex, appId, tag } = this.ruleForm;
			this.$refs.ruleForm.validate( valid => {
				if(valid){//添加应用
					this.$http.put(`/api/application/resources/${this.resourceId}/?applicationId=${this.applicationId}`,{
						name, 
                        uriRegex, 
                        appId:this.applicationId,
                        id:this.resourceId
					}, {
                        headers:{
                            'Operate-Application-Id': this.applicationId
                        }
                    }).then( res => {
						if (res.data.success) {
							Bus.$emit('offUserWindow','editresource');
							Bus.$emit('busGetResourcesLists');
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
