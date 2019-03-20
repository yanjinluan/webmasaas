import { GET_TOKEN } from './const';

export default {
    [GET_TOKEN] (state, newId) {
        state.token = newId;
    }
}