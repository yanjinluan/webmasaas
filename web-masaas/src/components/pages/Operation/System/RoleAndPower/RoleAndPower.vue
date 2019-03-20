
<template>  
  <div >  
    <div class="radio-wrap">  
      <div class="radio-group" v-model="tabView">   
        <span 
           v-for="(tab ,index) in tabs" 
           :class="iscur==index?activetab:''" 
           @click="iscur=index,tabChange('tabcont' + (index + 1))">
             {{tab.name}}
        </span>  
      </div>  
      <div  class="line"></div>  
      <keep-alive>   
        <component v-bind:is="tabView"></component>  
      </keep-alive> 
      
      <div class="btn-wrap">
      	 <el-button type="warning" plain   @click="gobackRole">返回</el-button>
      </div>
      
    </div>  
  </div>  
</template>  
  
<script>
	import Bus from '@/modules/bus';
	import { mapState } from 'vuex';
  import tabcont1 from './tabcont1.vue';  
  import tabcont2 from './tabcont2.vue';   
  export default {  
    name: '',  
      data () {  
        return {  
          tabView: 'tabcont1',
          iscur: 0,   
          tabs: [{name: "角色信息详情"}, {name: "角色权限信息"} ],
          activetab:'activetab',
          id:''
        }  
  }, 
  created () {
	  this.id=this.$route.params.roleId;
  	console.log(this.$route.params.roleId)
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
  components: {  
    tabcont1,  
    tabcont2
//  select3  
  },  
  methods: {  
    tabChange:function(tab){  
      this.tabView = tab;  
    } ,
    
    gobackRole(){
    	this.$router.push({
        name: 'Rolemanage'
      })
    }
  }  
}  
</script>  

<style lang="scss" scoped>
    .radio-wrap {
    	width: 100%;
    	height: 100%;
    	position: relative;
    	.radio-group{
    	 	 font-size: 14px;
    	 	 height: 44px;
    	 	 line-height: 44px;
    	 	 display: -webkit-flex; /* Safari */
  			 display: flex;
  			 flex-direction: row;
  			 flex-wrap: nowrap;
  			 margin: 2% 2% 0 2%;
    	 }
    	 .radio-group span{
    	 	  background:#fff;
    	 	  width: 18%;
    	 	  color: #409EFF;
    	 	  /*margin-right: 20px;*/
    	 	  text-align: center;
    	 	  border: 1px solid #409EFF;
    	 	  border-bottom: none;
    	 	  /*border-radius: 5px;*/
    	 }
    	 .line{
    	 	border: 1px solid #409EFF;
    	 }
    	 .radio-group .activetab{
    	 	  background:#409EFF ;
    	 	  color: #fff;
    	 }
    	 .btn-wrap{
    	 	 position: absolute;
    	 	 right:2%;
    	 	 top: 0;
     	 }
    }
	
</style>



