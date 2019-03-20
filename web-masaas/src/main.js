import Vue from 'vue';
import App from './App';
import router from './router';
//router.beforeEach((to, from, next) => {
//  const userKey = sessionStorage.getItem('token');
//  if (!userKey && to.path !== '/home' && to.path !== '/forgetpassword'  && to.path !== '/register') {
//      next({
//          path: '/home',
//          query: {redirect: to.fullPath}
//      });
//  } else if (from.path === '/home' && to.path !== '/forgetpassword' && to.path !== '/register') {
//      let redirect = from.query.redirect
//      if (  redirect ) {//如果来源路由有query
//          if(to.path === redirect){//这行是解决next无限循环的问题
//              next();
//          }else{
//              next({path:redirect})//跳转到目的路由
//          }
//      } else {
//          next();
//      }
//  } else {
//      next();
//  }
//})
Vue.config.productionTip = false;
//引入rem布局监听
import './modules/rem';
//引入全局样式
import '../static/reset.css';
import '../static/common.css';
//md5
import md from './modules/md5.js'
Vue.prototype.$md = md;
import sign from './modules/sign.js'
//引入动画
import 'animate.css';
//引入store
import store from './store';
//按需引入表单
import {
    Form,
    FormItem,
    Input,
    Button,
    Select,
    Option,
    DatePicker,
    Table,
    TableColumn,
    Radio,
    Tree,
    RadioGroup,
    Message,
    MessageBox,
    RadioButton,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Dialog,
    Upload,
    Progress,
    Loading,
    Pagination,
    Switch,
    Tabs
} from 'element-ui';

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(DatePicker);
    Vue.use(Table);
    Vue.use(Tree);
    Vue.use(TableColumn);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Dialog);
    Vue.use(Upload);
    Vue.use(Progress);
    Vue.use(Loading);
    Vue.use(Pagination);
    Vue.use(Switch);
    Vue.use(Tabs);

    import 'element-ui/lib/theme-chalk/base.css';
    import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
    Vue.component(CollapseTransition.name, CollapseTransition);

//处理axios,让组件使用$http
import axios from 'axios';
// axios.defaults.timeout =  60000;
axios.defaults.keepAlive = true;
axios.interceptors.request.use(
    config => {
        //判断是否存在token，如果存在将每个页面header都添加token
        if(sessionStorage.token){
            // let signStr = sign(config,sessionStorage.token,store.state.appId.applicationId);
            // console.log(signStr)
            config.headers.common['Token'] = sessionStorage.token
            config.headers.common['Sign'] = sessionStorage.sign
            if (store.state.appId.applicationId){
                config.headers.common['Application-Id'] = store.state.appId.applicationId
            }
        }
        return config;
    },
    err => {
         return Promise.reject(err);
    }
);
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
                    Message({
                        message:'权限不足',
                        duration:1500,
                        type:'warning'
                    }); break;
                case 423:
                    Message({
                        message:'登录超时，请重新登录',
                        duration:1500,
                        type:'warning'
                    }); break;
                // case 500:
                //     Message({
                //         message:'网络异常服务器请求错误',
                //         duration:1500,
                //         type:'error'
                //     }); break;
                // case 501:
                //     Message({
                //         message:'网络异常服务器请求错误',
                //         duration:1500,
                //         type:'error'
                //     }); break;
                // case 502:
                //     Message({
                //         message:'网络异常服务器请求错误',
                //         duration:1500,
                //         type:'error'
                //     }); break;
                // case 503:
                //     Message({
                //         message:'网络异常服务器请求错误',
                //         duration:1500,
                //         type:'error'
                //     }); break;
                // case 504:
                    Message({
                        message:'网络异常服务器请求错误',
                        duration:1500,
                        type:'error'
                    }); break;
                default: break;
			}
		}
        return Promise.reject(error.response.data)
    }
);
Vue.prototype.$http = axios;
Vue.prototype.$clearSess = () => {
    sessionStorage.removeItem('iframeUrl');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('sign');
    sessionStorage.removeItem('userInfo');
};
//引入过滤器
import vfilter from './modules/vfilter.js';
Vue.filter('money', vfilter);

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
