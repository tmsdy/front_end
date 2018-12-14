<template>
    <div class="p-box">
      <div class="p-inner">
        <img src="./../assets/images/bm-img01.png" />
        <img src="./../assets/images/bm-img02.png" />
        <img src="./../assets/images/bm-img03.png" />
        <img src="./../assets/images/bm-img04.png" />
      </div>
      <div class="bottom-nav">
        <div class="b-left">
          <p class="b-title">3人组团购买粽子古文</p>
          <span class="old-price">原价：￥299</span>
          <span class="price">售价：￥</span><span class="big-text">199</span>
        </div>
        <div class="b-right">立即购买</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "purchase"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .p-box{
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    position: relative;
    background: #fff;
    .p-inner{
      width: 100%;
      background: #f9eac4;
      padding-bottom:124/@rem;
      img{
        width: 100%;
      }
    }
    .bottom-nav{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 124/@rem;
      background: #fff;
      display: flex;
      .b-left{
        flex: 1;
        font-size: 34/@rem;
        color: #ea2038;
        margin: 25/@rem 0 0 25/@rem;
        .b-title{
          margin-bottom: 12/@rem;
        }
        .old-price{
          font-size: 24/@rem;
          text-decoration: line-through;
          color: #ffacb6;
          margin-right: 18/@rem;
        }
        .price{
          font-size: 24/@rem;
        }
        .big-text{
          font-size: 38/@rem;
          font-weight: 700;
          line-height: 40/@rem;
        }
      }
      .b-right{
        width: 260/@rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 38/@rem;
        background: #ee5466;
      }
    }
  }

</style>
