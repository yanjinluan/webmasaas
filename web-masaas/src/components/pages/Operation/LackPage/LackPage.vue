<template>
    <div class="lackbox" ref="lackbox">
        <img src="../../../../../static/images/lackpage.jpg" ref="img">
    </div>
</template>

<script>
export default {
    name:'LackPage',
    created () {
        this.fun = () => {
            let height = document.documentElement.clientHeight - 134;
            this.$refs.lackbox.style.height = height + 'px'; 
        }
        this.$nextTick( () => {
            window.addEventListener('resize', this.fun)
        })
    },
    mounted () {
        let height = document.documentElement.clientHeight - 134;
        this.$refs.lackbox.style.height = height + 'px'; 
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.fun)
    }
}
</script>

<style lang="scss" scoped>
    .lackbox{
        width: 100%;
        min-width: 900px;
        position: relative;

        img{
            width: 100%;
            height: 100%;
        }
    }

</style>
