import { CHANGE_APPLICATION } from './const';

export default {
    [CHANGE_APPLICATION] (state, newid) {
        state.applicationId = newid;
    }
}