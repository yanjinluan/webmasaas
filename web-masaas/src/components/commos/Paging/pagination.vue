<template>
    <div  v-if="isShow">
        <el-button type="primary" class="top-page" @click="pageUp">上一页</el-button>
        <el-button type="primary" class="next-page" @click="pageNext">下一页</el-button>
    </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
    name:'pagination',
    props:["isFuzzy", "initLists", "fuzzyLists", "pageNumber", "pageNumberAdd", "pageNumberJian", "lists"],
    data () {
        return {
            isShow:false
        }
    },
    watch:{
        lists:{
            immediate: true,
            handler (val)  {
               if ( val.length >= 10 || this.pageNumber > 1 ) {
                   this.isShow = true;
               } else {
                   this.isShow = false
               }
            }
        }
    },
    methods:{
        pageNext () {
            if ( this.lists.length < 10 ) {//当前页数据不足10条
                Message({
                    message:'没有更多了',
                    duration:1500,
                    type:'warning'
                });
            }else{
                this.pageNumberAdd();
                if(this.isFuzzy){//点击过查询后翻页
                    this.fuzzyLists('next')
                }else{//没有点击查询翻页
                    this.initLists('next')
                }
            }
        },
        pageUp () {
            if(this.pageNumber>1){
                this.pageNumberJian();
                if(this.isFuzzy){//点击过查询后翻页
                    this.fuzzyLists()
                }else{//没有点击查询翻页
                    this.initLists()
                }
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
