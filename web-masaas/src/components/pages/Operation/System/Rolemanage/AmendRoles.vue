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
				prop="appId"
				label="选择应用">
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
            <el-form-item 
                prop="roleName"
                label="角色名称">
                <el-input 
                    placeholder="请输入中文"
                    v-model="ruleForm.roleName"
                    style="width:264px"></el-input>
            </el-form-item>
            <el-form-item 
                prop="roleDescribe"
                label="角色说明">
                <el-input 
                	placeholder="请输入中文"
                    v-model="ruleForm.roleDescribe"
                    style="width:264px"></el-input>
            </el-form-item>
         
            
            <el-form-item 
                prop="isAvailable"
                label="是否有效">
            	<el-radio v-model="ruleForm.isAvailable" label="0">是</el-radio>
				<el-radio v-model="ruleForm.isAvailable" label="1">否</el-radio>
            </el-form-item>
            
            
        </el-form>
        
        <div class="btn">
            <el-button id="btn" @click="amendRole" type="primary">更新</el-button>
            <el-button @click="offAmendRole">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AmendRoles',
    data () {
         var validateName = (rule, value, callback) => {
            if (/^[\u0391-\uFFE5]{2,}$/.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的角色名称'));
            }
        };
        return{
        	pageNum:'',
            ruleForm: {
                appId:'',
                roleName:'',
                roleDescribe:'',
                updateUserId:'',
                isAvailable: ''
            },
            appLists:[
                {name:'应用1', id:'1'},
                {name:'应用2', id:'2'},
                {name:'应用3', id:'3'},
                {name:'应用4', id:'4'}
            ],
            
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ]
            }
        }
    },
//  mounted(){
//    Bus.$on('pageNumber', (data) => {     	
//      this.pageNum=data;
//      console.log(this.pageNum);
//    })
//
//  },


    created () {
        //获取当前角色信息
         let params={
            	pageSize:10,
	            pageNumber:this.pageNum,
	            id:this.userId	           
        }
        console.log(params);
//      this.$http.get('/api/sysRole',{params:{pageNumber:1,pageSize:10,query:{'id':this.userId},token:this.token}}
        
        this.$http.get('/api/sysRole',{params,  headers:{
                    'token' :this.token
        }}
             
        ).then( res => {
        	console.log(res.data);
            this.ruleForm = res.data.resp.records[0];
        })
        
    },
    computed:{
        ...mapState({
            token:(state) => {//拿到要修改的角色数据
                return state.token.token;
            },
            
  
            userId:(state) => {//拿到要修改的用户id
                return state.getId.id;
            },
    
            applicationId (state) {
				return state.getId.appId;
			}
        })
    },
    methods:{
        offAmendRole () {//关闭窗口
            Bus.$emit('offUserWindow','amendroles');
        },
        amendRole () {
//          this.$refs.ruleForm.validate((valid) => {
//              if(valid){
	
                	let params = { 
                		id:this.userId,
                        appId:this.ruleForm.appId,
                        roleName:this.ruleForm.roleName,
                        roleDescribe:this.ruleForm.roleDescribe,
                        isAvailable:this.ruleForm.isAvailable
                    }

                    this.$http.put('/api/sysRole', params,{
                    	headers:{                   
		                     'token' :this.token
		                }
                    }).then(res =>{
                    	console.log(res.data);
                        if(res.data){//成功逻辑
                            Message({
                                message:'角色修改成功',
                                duration:1500,
                                type:'success'
                            });
                            Bus.$emit('busGetRoleLists');//刷新数据
                            Bus.$emit('offUserWindow','amendroles');
                        }else{
                            Message({
                                message:'失败',
                                duration:1500,
                                type:'error'
                            });
                        }
                    });
                    

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

