<template>
    <div class="home-box">
        <div class="home" ref="home">
            <app-header></app-header>
            <login></login>
	    </div>
    </div>
</template>

<script>
//引入头部
import AppHeader from '../../commos/AppHeader/AppHeader';
//引入登录
import Login from './Login';

export default {
    name: 'Home',
    components:{
		AppHeader, Login
    }
}
</script>

<style lang="scss" scoped>
	.home-box{
        .home {
            position: absolute;
            width: 100%;
            height: 100%;
            background: url('../../../../static/images/home-bg.jpg'); 
            background-size: 100% 100%;
        }
    }
</style>