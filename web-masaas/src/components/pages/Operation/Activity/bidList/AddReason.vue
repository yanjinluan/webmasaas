<template>
    <div class="add-role-box">
        <div class="add-role-head">
            <h2>审核不通过</h2>
            <div class="off" @click="offAddReason">
               <i class="fa fa-close"></i>
            </div>
        </div>
        <div class="reasonCont">
        	<el-input type="textarea" v-model="refuseReason"></el-input>       	
        </div>
        <div class="btn">
            <el-button id="btn" @click="addReason" type="primary" :disabled="isDisabled">提交</el-button>
            <el-button @click="offAddReason">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import Bus from '@/modules/bus';
import { mapState } from 'vuex';

export default {
    name:'AddReason',
    data () {
 
        return{
            refuseReason:'',
            isDisabled:false,
            id:''

        }
    },
   
    created () {
    	 this.id=this.$route.params.bidId;  
    	 console.log(this.id);
    	//上个页面拿到传过来的数据	    
//	    Bus.$on('id', (data) => {     	
//	        this.id=data;
//          console.log(this.id);
//		
//	    })
                     
	},

    computed:{
		...mapState({

            token (state) {
                return state.token.token
            }
		})
	},
    methods:{
    	
        offAddReason () {
            Bus.$emit('offUserWindow','addreason');
        },
        
        addReason(){        	
            let params = {
    		  id:this.id,
			  refuseReason:this.refuseReason,
			  passState:'0'
            }	
        	console.log(params);                     
            this.$http.put('/api/activityApply', params, 
		               {
		                    headers:{
		                         'Content-Type': 'application/json'
		                    }
		                }
               	).then( res => {
                if(res.data){//成功逻辑
                    Message({
                        message:'提交成功',
                        duration:1500,
                        type:'success'
                    });
                    
                    //提交成功进入申办列表
                    this.$router.push({
				        name: 'bidList'
			
				    });
          
                }else{
                    Message({
                        message:'失败',
                        duration:1500,
                        type:'error'
                    });
                    this.isDisabled = false;
                }
            }).catch( () => {
                this.isDisabled = false;
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
        
        .reasonCont{
            padding: 20px 10px 20px 10px; 	
        }
    }
</style>

