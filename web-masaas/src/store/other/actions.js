import { CHANGE_USER_INFO } from './const';
import axios from 'axios' ;
import qs from 'qs';

export default {
    login ({commit},{username, password, callback}){
        let params = {
            userName:username,
            password
        };
        //登录
        axios.post('/api/aa/tokens/',{},{
            headers: {
                'User-Id':username,
                'Secret':password
            }
        }).then( res => {
            if(res.data.success) {
                //获取token并且存入session
                let userInfo = res.data.resp;
                sessionStorage.token = res.headers.token;
                sessionStorage.sign = res.headers.sign;
                commit( CHANGE_USER_INFO, userInfo );
                callback(1);
            }else{
                callback(2, res.data.message);
            }
        }).catch( () => {
            callback(2, '登录失败');
        })
    }
}