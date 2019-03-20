<template>
    <div class="paging-box" v-if="isShow">
        <el-button type="primary" class="top-page" @click="pageUp">上一页</el-button>
        <el-button type="primary" class="next-page" @click="pageNext">下一页</el-button> 
    </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
    name:'Paging',
    props:["getLists", "pageNumber", "pageNumberAdd", "pageNumberJian", "lists"],
    data () {
        return {
            isShow:false
        }
    },
    watch:{
        lists:{
            immediate: true,
            handler (val)  {
               if ( val.length === 10 || this.pageNumber > 1 ) {
                   this.isShow = true;
               } else {
                   this.isShow = false
               }
            }
        }
    },
    methods:{
        pageNext () {
            if ( this.lists.length < 10 ) {
                Message({
                    message:'没有更多了',
                    duration:1500,
                    type:'warning'
                });
            }else{
                this.pageNumberAdd();
                this.getLists('next');
            }
        },
        pageUp () {
            if(this.pageNumber>1){
                this.pageNumberJian();
                this.getLists();
            }else{
                Message({
                    message:'已经是第一页了',
                    duration:1500,
                    type:'warning'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .paging-box{
        margin-top: 40px;
        width: 100%;
        min-width: 450px;
        padding: 0 30%;
        height: 100px;

        .top-page{
            float: left;
        }
        .next-page{
            float: right;
        }
    }
</style>
