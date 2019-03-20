<template>
    <div class="tenant-info-box">
        <div class="container">
            <header>
                <i class="fa fa-user-o"></i>
                <b>基本信息</b>
            </header>
             <main>
                <div class="content-box">
                    <p>租户ID:</p>
                    <div class="read">123456</div>
                </div>
                <div class="content-box">
                    <p>租户名称:</p>
                    <div class="read">北京华大智宝科技有限公司</div>
                </div>
                <div class="content-box">
                    <p>隶属应用:</p>
                    <div class="read">应用1</div>
                </div>
                <div class="content-box">
                    <p>计费类型:</p>
                    <div class="read">预付款</div>
                </div>
                <div class="content-box">
                    <p>服务状态:</p>
                    <div class="read">已接入</div>
                </div>
                <div class="img-box">
                    <img src="">
                </div>
            </main>
        </div>
    </div>
</template>

<script>
export default {
    name:'TenantInfo'
}
</script>

<style lang="scss" scoped>
    .tenant-info-box{
        width: 100%;
        height: 100%;
        color: #333;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-justify-content: center;
        -ms-justify-content: center;
        -moz-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        -ms-align-items: center;
        -moz-align-items: center;
        align-items: center;
       
       .container{
           width: 600px;
           box-shadow: 0 0 10px #ccc;
           background: #fff;
          
            header{
                height: 60px;
                line-height: 60px;
                text-indent: 20px;
                border-bottom: 1px solid #ccc;
                box-shadow: 0 0 4px #ccc;
                font-size: 20px;
                color: #409EFF;
            }

            main{
                position: relative;

                .content-box{
                    padding: 10px 0;

                    p{
                        text-indent: 50px;
                    }
                    .read{
                        color: #666;
                        margin: 8px 0 0 70px;
                        padding-right: 15px;
                        height: 40px;
                        line-height: 40px;
                    }
                }

                .img-box{
                    width: 120px;
                    height: 130px;
                    position: absolute;
                    top: 20px;
                    left: 460px;
                    right: 20px;
                    border: 1px solid #ccc;

                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
       }    
    }
</style>
