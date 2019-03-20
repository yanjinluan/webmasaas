export default {
    userInfo:sessionStorage.userInfo?JSON.parse(sessionStorage.userInfo) : {
        userId:null,
        userName:''
    }
}