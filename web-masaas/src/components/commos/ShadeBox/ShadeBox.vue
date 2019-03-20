<template>
    <div class="shade-box"></div>
</template>

<script>
export default {
    name:'ShadeBox'
}
</script>

<style lang="scss" scoped>
    .shade-box{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 6;
    }
</style>

