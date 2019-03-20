
<template>  
  <div slot='tabcont2' class="tabcontent">
  	<!--<el-tree
  		ref='tree1'
		  :data="data2"
		  show-checkbox
		  node-key="id"
		  :default-expanded-keys="[1,2, 3,4]"
		  :default-checked-keys="[4]"
		  :props="defaultProps"
		  @check='check'>
		</el-tree>-->
		<el-tree
  		ref='tree1'
		  :data="data2"
		  show-checkbox
		  node-key="id"
		  :default-expand-all='true'
		  :default-checked-keys="checkedKeys"
		  :expand-on-click-node="true"
		  :props="defaultProps"
		  @check-change="handleCheckChange"

		  >
		</el-tree>
		 
		 <div style="float: right;">
		 	   <el-button type="primary" plain @click='submitInfo'>提交</el-button>
		 </div>
		 
		
  </div>  
</template>  
  

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
  export default {
    data() {
      return {
//      data2: [{
//        id: 1,
//        label: '一级 1',
//        children: [{
//          id: 4,
//          label: '二级 1-1',
//          children: [{
//            id: 9,
//            label: '三级 1-1-1'
//          }, {
//            id: 10,
//            label: '三级 1-1-2'
//          }]
//        }]
//      }, {
//        id: 2,
//        label: '一级 2',
//        children: [{
//          id: 5,
//          label: '二级 2-1'
//        }, {
//          id: 6,
//          label: '二级 2-2'
//        }]
//      }, {
//        id: 3,
//        label: '一级 3',
//        children: [{
//          id: 7,
//          label: '二级 3-1'
//        }, {
//          id: 8,
//          label: '二级 3-2'
//        }]
//      }],
//      defaultProps: {
//        children: 'children',
//        label: 'label'
//      }
                 
        data2:[],
        id:'',
        checkedKeys:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        index:''
             
      }
    },
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }
        })
    },
    created(){
        this.getData2();
    },
    methods:{
        check(data2){
//      	 console.log(data2);
        	 console.log(this.$refs.tree1.getCheckedNodes())
           console.log(this.$refs.tree1.getCheckedKeys());

//         console.log(data2.id);
//         this.checkid.push(data2.id);
//         console.log(this.checkid);
           
       }
       
      ,handleCheckChange(data2, checked, indeterminate) {
      	console.log(data2);
      	console.log(checked);
//    	console.log(indeterminate);
        if(data2.res_type){
        	  if(checked){
        	  	 this.checkedKeys.push(data2.id);
        	  }else{

                this.index= this.checkedKeys.indexOf(data2.id)
                console.log(this.index);
                this.checkedKeys.splice(this.index,1)
        	  }
        }
        
//      if(checked){
//      	 if(data2.res_type){
//  	 	       this.checkedArry.push(data2.id);
////  	 	       checkedKeys.push(data2.id);
////  	 	       a.concat(b)
//      	 }
//      }else{
//      	     this.checkedArry.splice(0,1)
//      }
        
      }
      ,submitInfo(){
      	debugger;
      	console.log(this.checkedKeys);
           	  let params={
           	  	  "roleId":this.id,    
	                'resourceIds':this.checkedKeys
           	  }
           	  console.log(params);
  			      this.$http.post('/api/RoleResourcees',params,{
                        headers: {
                        	  'token':this.token,
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    }).then( res => {	
						     	           
						      	         if( res.data ){
			                            Message({
			                                message:'提交成功',
			                                duration:1500,
			                                type:'success'
			                            });
			                 
			                        }
						      	this.getData2();         
						      	  						      	  
						      })
					      	
      }
      ,getData2(){
					      	   //  	
					    	this.id=this.$route.params.roleId;
					//		  console.log(this.$route.params.roleId)
					    	this.$http.get('/api/findPermissionsTree',{
					                params:{
					                    "roleId":this.id,
					                    'token': this.token
					                }
					//              ,
					//              headers:{
					//                  'token': 'D6ABB3EA4EC8729FC297B4F6BD66448C'
					
					//              }
					      }).then( res => {
					//      	console.log(res.data);
					        	this.data2=res.data.resp;
					        	this.data2.forEach((currentValue)=>{
					//      		 console.log(currentValue);
					        		  if(currentValue.selected){
					        		  	 this.checkedKeys.push(currentValue.id)
					        		  }else{
					        		  	currentValue.children.forEach((currentValue1)=>{
					//      		  		   console.log(currentValue1);
										        		 
									        		 if(currentValue1.selected){
									        		 	   this.checkedKeys.push(currentValue1.id)
									        		 }
									        		 else{
									        		 	  if(currentValue1.children){
									        		 	  	  	currentValue1.children.forEach((currentValue2)=>{
					//						        		 	   	       console.log(currentValue2);
					
																	        		  if(currentValue2.selected){
																		        		 	   this.checkedKeys.push(currentValue2.id)
																		        		 }
																	        		 
											        		 	   })
									        		 	  	
									        		 	  }
									        
									        		 }
					        		  	})
					        		  }
					        	})
					            
					        })
      }
      
    }
  };
</script>
 
<style lang="scss" scoped>
	.tabcontent{
		width: 96%;
		margin: 0 auto;
		height: 100%;
		margin-top: 15px;
	}
</style>
