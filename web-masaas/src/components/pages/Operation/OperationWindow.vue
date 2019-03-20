<template>
    <div class="operation-window" :style="{'paddingLeft':isMenuShow?'244px':'0px'}">
        <div class="operation-container">
           <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name:'OperationWindow',
    //根据isMenuShow控制operation-window的padding值
    props:['isMenuShow'] 
}
</script>

<style lang="scss" scoped>
    .operation-window {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        padding:0px 0px 0px 244px;
        z-index: 0;
        overflow-y: auto;

        .operation-container{
            // width: 100%;
            // height: 100%;
            background: #fff;
            //position: relative;
        }
    }
</style>

