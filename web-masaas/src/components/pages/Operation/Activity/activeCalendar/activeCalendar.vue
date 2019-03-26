

<template>
    <vue-event-calendar :events="demoEvents" ></vue-event-calendar>
</template>



<script>
import Bus from '@/modules/bus';
import {mapState} from 'vuex';
import { Message, MessageBox ,Pagination } from 'element-ui';
import Vue from 'vue'

import 'vue-event-calendar/dist/style.css' 
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, {locale: 'zh',color:'#409EFF'}) //可以设置语言，支持中文和英文

export default {
    name:'activeCalendar',
    data() {

    return {
       
        demoEvents: [{
            date: '2019/3/15',
            title: '活动1',
            desc: '地址：用友产业园东区1号楼'
        },{
            date: '2019/3/12',
            title: '活动2',
            desc: '地址：用友产业园西区8号楼'
        },{
            date: '2019/4/5',
            title: '活动3',
            desc: '地址：用友产业园中区3号楼'
        }]
    }


    },
    components:{
//      Paging
    },
    
    computed:{
        ...mapState({
            token:(state) => {
                return state.token.token;
            }

        })
    },
    
    created () { 

    },
    beforeDestroy () {

    },
    methods: {

      
    },
    mounted() {

    }

    
}
</script>


<style lang="scss" scoped>
	.calender-box{		
		width: 96%;
		margin: 0 auto;
		height: 100%;
		margin-top: 15px;
		ul {
            list-style-type: none;
        }
        body {
            font-family: Verdana, sans-serif;
            background: #E8F0F3;
        }
        #calendar{
            width:100%;
            margin: 0 auto;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12);
        }
        .month {
            width: 100%;
            background: #8cc5ff;
        }
        .month ul {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: space-between;
        }
        .year-month {
            display: flex;
            
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
        }
        .year-month:hover {
            background: rgba(150, 2, 12, 0.1);
        }
        .choose-year {
        	font-size: .4rem;
            padding-left: 20px;
            padding-right: 20px;
        }
        .choose-month {
            text-align: center;
            font-size: .4rem;
        }
        .arrow {
            padding: .2rem;
        }
        .arrow:hover {
            background: rgba(100, 2, 12, 0.1);
        }
        .month ul li {
            color: white;
            font-size: .1rem;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .weekdays {
            margin: 0;
            padding: 10px 0;
            background-color: #8cc5ff;
            display: flex;
            flex-wrap: wrap;
            color: #FFFFFF;
            justify-content: space-around;
        }
        .weekdays li {
            display: inline-block;
            width: 13.6%;
            text-align: center;
            font-size: .3rem;
           
        }
        .days {
            padding: 10px 0;            
            background: #FFFFFF;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .days li {
            list-style-type: none;
            display: inline-block;
            width: 14.2%;
            text-align: center;
            padding-bottom: 15px;
            padding-top: 15px;
            font-size: .3rem;
            color: #000;
            position: relative;
        }
        .days li  .circle_tag{
        	display: inline-block;
        	position: absolute;
        	right:50%;
        	bottom:8%;
        	width: 5px;
        	height: 5px;
        	border-radius: 50%;
        	background: #66B1FF;
        } 
        .days li .active {
            padding: 6px 6px;
            border-radius: 50%;
            background: #fa6854;
            color: #fff;
        }
        .days li .other-month {
            padding: 5px;
            color: gainsboro;
        }
        .days li:hover {
            background: #e1e1e1;
        }
    }

      
    </style>


