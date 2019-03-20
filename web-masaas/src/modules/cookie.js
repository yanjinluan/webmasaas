/*
	author:CaoZhenHui
	function:登陆7天自动存储密码
	Last Update:2018-11-20
*/

export default {
    //创建cookie
    createCookie(key,value,expires){
        //'key=value;path=/'
        var cookieText = encodeURIComponent(key) + '=' + encodeURIComponent(value) + ";path=/";
        //判断是否设置cookie的有效期
        if(!isNaN(expires)){
            var date = new Date();
            date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000+ 8*60*60*1000));
            cookieText += ";expires=" + date.toUTCString();
        }
        document.cookie = cookieText;
    },
    //获取cookie
    getCookie(key){
        var arr = document.cookie.split('; ');
        for(var i = 0,len = arr.length;i < len;i ++){
            var list = arr[i].split('=');
            if(encodeURIComponent(key) === list[0]){
                return decodeURIComponent(list[1]);
            }
        }
    },
    //删除cookie
    removeCookie(key){
        document.cookie = encodeURIComponent(key) + '=;expires=' + new Date(0) + ';path=/';
    }
}