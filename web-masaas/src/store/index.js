import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//vuex引起IE无法打开
import 'babel-polyfill';

import other from './other'; //登录注销数据
import appId  from './appId';//应用id
import getId from './getId';

import token from './token';

const store = new Vuex.Store ({
	modules: {
		other, appId, getId,token
	}
})

export default store
