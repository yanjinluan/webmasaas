import { CHANGE_ID, CHANGE_APPID } from './const';

export default {
    [CHANGE_ID] (state, newId) {
        state.id = newId;
    },
    [CHANGE_APPID] (state, newId) {
        state.appId = newId;
    }
}