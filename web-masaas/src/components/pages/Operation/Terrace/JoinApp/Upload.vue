<template>
	<div class="add-app-box">
		<div class="add-app-head">
			<p>上传配置文件</p>
			<div class="off" @click="offUpload">
				<i class="fa fa-close"></i>
			</div>
		</div>
        <div class="upload-box">
            <el-upload
                :action="urlApp"
                class="upload-demo"
                accept=".yml, .yaml"
                :before-upload="beforeUpload"
                ref="upApp"
                :http-request="upAppHandler"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传应用定义文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传yml文件，且不超过1024kb</div>
            </el-upload>
            <el-progress :percentage="appjindu" v-if="isShow"></el-progress>
            <br/>
            <br/>
            <el-upload
                class="upload-demo"
                ref="upRoles"
                accept=".yml, .yaml"
                :action="urlRoles"
                :http-request="upRolesHandler"
                :before-upload="beforeUpload"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传角色定义文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传yml文件，且不超过1024kb</div>
                <div slot="tip" class="el-upload__tip">*注意：当没有角色定义文件时，请上传空的yaml文件</div>
            </el-upload>
            <el-progress :percentage="rolesjindu" v-if="rolesIsShow"></el-progress>
        </div>
	</div>
</template>
<script>
import Bus from '@/modules/bus';
import { Message, MessageBox } from 'element-ui';
import { mapState } from 'vuex';

export default {
    name:'Upload',
    data () {
        return {
            appjindu:0,
            rolesjindu:0,
            isShow:false,
            rolesIsShow:false
        }
    },
	computed:{
		...mapState({
			appId (state) {
				return state.getId.id;
            },
            urlApp () {//上送地址
                return `/api/platform/applications/${this.appId}/resources/`;
            },
            urlRoles () {
                return `/api/platform/applications/${this.appId}/roles/`;
            }
		})
	},
    methods: {
		offUpload (){
			Bus.$emit('offUserWindow','upload');
        },
        handleExceed(files, fileList) {
            Message.warning(`当前限制选择 1 个文件`);
        },
        beforeRemove(file, fileList) {
            return MessageBox.confirm(`确定移除 ${ file.name }？`);
        },
        beforeUpload (file) {
            let name = file.name;
            let size = file.size/1024/1024;
            let num = name.lastIndexOf('.') + 1;
            let lastName = name.substr(num);
            if (size > 1) {
                Message({
                    message:'添加文件大于1024kb',
                    duration:'1500',
                    type:'warning'
                })
                return false
            };
        },
        upAppHandler (e) {
            this.isShow=true;
            this.$http.post(e.action, e.file, {
                headers:{
                    'Content-Type':'application/octet-stream'       
                },
                onUploadProgress: progressEvent => {
                    var complete = (progressEvent.loaded / progressEvent.total * 100)
                    this.appjindu = complete
                },
            }).then (res => {
                if(res.data == 'notNull'){
                    e.onError();
                    this.isShow = false;
                    this.appjindu = 0;
                    Message({
                        message:'上传文件失败，上传文件不能为空',
                        duration:'1500',
                        type:'warning'
                    })
                    return false;
                }else if (res.data) {
                    e.onSuccess();
                    this.isShow = false;
                    this.appjindu = 0;
                    Message({
                        message:'上传文件成功',
                        duration:'1500',
                        type:'success'
                    })
                }else{
                    e.onError();
                    this.isShow = false;
                    this.appjindu = 0;
                    Message({
                        message:'上传文件失败，请重新选择文件上传',
                        duration:'1500',
                        type:'error'
                    })
                }
            })
        },
        upRolesHandler (e) {
            this.rolesIsShow=true;
            this.$http.post(e.action, e.file, {
                headers:{
                    'Content-Type':'application/octet-stream'       
                },
                onUploadProgress: progressEvent => {
                    var complete = (progressEvent.loaded / progressEvent.total * 100)
                    this.rolesjindu = complete
                },
            }).then (res => {
                if(res.data == 'notNull'){
                    e.onError();
                    this.rolesIsShow = false;
                    this.rolesjindu = 0;
                    Message({
                        message:'上传文件失败，上传文件不能为空',
                        duration:'1500',
                        type:'warning'
                    })
                    return false;
                }else if (res.data) {
                    e.onSuccess();
                    this.rolesIsShow = false;
                    this.rolesjindu = 0;
                    Message({
                        message:'上传文件成功',
                        duration:'1500',
                        type:'success'
                    })
                }else{
                    e.onError();
                    this.rolesIsShow = false;
                    this.rolesjindu = 0;
                    Message({
                        message:'上传文件失败，请重新选择文件上传',
                        duration:'1500',
                        type:'error'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-app-box{
        position: absolute;
        width: 400px;
        background: #fff;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 10;
        .add-app-head{
            height:50px;
            padding:0 20px;
            margin-bottom:20px;
            background:#409EFF;
            p{
                float:left;
                line-height:50px;
                font-size:20px;
                font-weight:500;
                color:#fff;
            }
        }
        .upload-box{
            padding: 10px 30px 30px;
        }
    }
</style>
