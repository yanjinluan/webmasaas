<template>
    <header>
        <div class="logo"></div>
    </header>
</template>

<script>
export default {
    name:'AppHeader'
}
</script>

<style lang="scss" scoped>
    header {
        width: 100%;
        height: 100px;
        .logo {
            background: url("../../../../static/images/logo-MSS.png") no-repeat 40px center ;
            background-size: 200px 64px;
            width:400px;
            height: 100px;
            float: left;
        }
    }
</style>

