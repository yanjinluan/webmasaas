<template>
    <div class="app-box">
        <div class="app"
            v-for="item in appLists"
            :key="item.id"
            @click="toApp(item.url, item.id)"
        >{{item.name}}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Bus from '@/modules/bus';

export default {
    name:'AppList',
    data () {
        return {
            appLists:[]
        }
    },
    created () {
        //获取应用列表
//      this.$http.get(`/api/aa/tokens/users/${this.userInfo.id}/applications/`).then( res => {
//          this.appLists = res.data.resp
//      })
    },
    computed: mapState({
        userInfo:(state) => {
            return state.other.userInfo
        }
    }),
    methods:{
        toApp (url, id) {
            //跳转应用
            setTimeout( () => {
                Bus.$emit('toIframe', url, id);
            }, 100)
            this.$router.push({name:'toolbar'});    
        }
    }
}
</script>

<style lang="scss" scoped>
    .app-box{
        width: 200px;
        height: 120px;
        overflow: auto;
        background: #fff;
        border: 1px solid #ccc;
        position: absolute;
        top: 50px;
        color: #333;

        .app{
            height: 30px;
            line-height: 30px;
            padding: 0 20px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
        }
        .app:hover{
            background: #f1f1f1;
        }
    }
</style>

