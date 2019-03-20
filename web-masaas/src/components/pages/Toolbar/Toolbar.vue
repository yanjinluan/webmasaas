<template>
    <div class="toolbar-box">
        <a class="loading-container"></a>
        <navigation-header></navigation-header>
        <div class="main-box" v-if="!isShow">
            <div class="toolitem-box" v-for="tool in toollists" :key=tool.id>
                <div class="toolitem">
                    <i class="fa fa-cog"></i>
                    <p>{{ tool.name }}</p>
                    <el-button @click="changeUrl(tool.url, tool.id)">进入</el-button>
                </div>
            </div>
        </div>
        <iframe 
            ref="mssIframe"
            v-show="isShow"
            :src="iframeUrl" 
            class="iframe-box" 
            frameborder="no">
        </iframe>
    </div>
</template>

<script>
import NavigationHeader from '../../commos/NavigationHeader/NavigationHeader';
import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import Bus from '@/modules/bus';
import Vue from 'vue';
export default {
    name:'Toolbar',
    data () {
        return {
//          toollists:[],
            toollists:[
		{
			"adminRoleId":"5c1320aa89dbbc1e04f4fea8",
			"announce":"这是SAAS平台",
			"controlStatus":1,
			"controlTime":1544759065104,
			"describe":"此SAAS支撑平台应可以同时支撑多个业务平台的运行，以在将来新业务开发时，统一架构，并最大程度的复用代码以及软硬件基础设施",
			"id":"0",
			"joinTime":1544759065104,
			"name":"Masaas",
			"pageNumber":0,
			"pageSize":0,
			"pageStart":0,
			"status":2,
			"tag":"default",
			"url":""
		},
		{
			"adminRoleId":"5c13327f89dbbc3790e2dd33",
			"announce":"这是热计量平台",
			"controlStatus":1,
			"controlTime":1544761976879,
			"describe":"热计量",
			"id":"1",
			"joinTime":1544761976879,
			"name":"heat",
			"pageNumber":0,
			"pageSize":0,
			"pageStart":0,
			"status":2,
			"tag":"heat",
			"url":""
		},
		{
			"adminRoleId":"5c66115af22a720007193da4",
			"controlStatus":1,
			"describe":"测试",
			"id":"5c661157f22a720007193da3",
			"name":"曹朕珲",
			"pageNumber":0,
			"pageSize":0,
			"pageStart":0,
			"status":2,
			"tag":"1",
			"url":""
		}
	],
            iframeUrl:'',
            isShow:false
        }
    },
    components:{
        NavigationHeader
    },
    computed: mapState({
        userInfo:(state) => {
            return state.other.userInfo
        }
    }),
    created () {
//      this.$http.get(`/api/aa/tokens/users/${this.userInfo.id}/applications/`).then(res => {
//         this.toollists = res.data.resp;
//      });
 
//      if (sessionStorage.iframeUrl) {
//          this.isShow = true;
//          this.iframeUrl = sessionStorage.iframeUrl;
//          this.$nextTick( () => {
//              this.$refs.mssIframe.onload = () => {
//                  let iframe = this.$refs.mssIframe.contentWindow;
//                  let message = {
//                      type:true
//                  };
//                  //发送消息
//                  let strMessage = JSON.stringify(message)
//                  iframe.postMessage(strMessage,'*'); 
//              }
//          })
//      }
        Bus.$on('toIframe', this.changeUrl);
        this.toHome();     
    },
    beforeDestroy () {
        Bus.$off('toIframe');
        sessionStorage.removeItem('iframeUrl');
    },
    methods:{
        changeUrl (url, id) {
            if( id == 0 ){
                this.$router.push({name:'lackpage', params:{appId:id}});              
            }else{
                let loadingInstance = Loading.service({
                    text:'正在加载...',
                    customClass:'el-loading',
                    target:'.loading-container'
                });
                if(sessionStorage.iframeUrl == this.iframeUrl){ //当前页面切换当前页面结束加载
                    loadingInstance.close(); 
                }
                this.isShow = true;
                sessionStorage.iframeUrl = url;
                this.iframeUrl = url;
                this.$refs.mssIframe.onload = () => {
                    loadingInstance.close(); 
                    let iframe = this.$refs.mssIframe.contentWindow;
                    let message = {
                        userInfo:this.userInfo,
                        token:sessionStorage.token,
                        appId:id,
                        type:false
                    };
                    //发送消息
                    let strMessage = JSON.stringify(message)
                    iframe.postMessage(strMessage,'*'); 
                }
            }
        },
        toHome () {
            window.addEventListener("message",(e) => {
                if(e.data == 'exit') {
                    this.$router.push({name:'home'});
                    this.$clearSess();
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .toolbar-box {
        .main-box{
           min-width: 1100px;

           .toolitem-box {
                display: inline-block;
                width: 20%;
                height: 280px;

               .toolitem {
                    width: 180px;
                    height: 210px;
                    text-align: center;
                    margin: 16px auto;
                    color:#fff;
                    background: #409EFF;
                    overflow: hidden;

                    i{
                        display: block;
                        font-size: 56px;
                        margin-top: 26px;
                    }

                    p{
                        font-size: 16px;
                        color:#fff;
                        height: 50px;
                        line-height: 50px;
                    }
               }
           }
        }
        .iframe-box{
            position: fixed;
            width: 100%;
            height: 100%;
        }
    }
</style>