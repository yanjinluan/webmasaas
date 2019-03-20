import { CHANGE_USER_INFO } from './const';
import router from '../../router';

export default {
    [CHANGE_USER_INFO] (state, newuserInfo) {
        state.userInfo = newuserInfo;
        sessionStorage.userInfo = JSON.stringify(newuserInfo);
    }
}