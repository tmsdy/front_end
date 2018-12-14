<template>
    <div class="m-box">
      <div class="bl-box">
        <img class="bl-img" src="./../assets/images/bl_img.png"  alt=""/>
        <p class="act-title">两小儿辩日</p>
        <p class="bl-title">每天学一点 名校近一点</p>
        <div class="btn-group">
          <div class="bl-btn">听一听</div>
          <div class="bl-btn">学一学</div>
          <div class="bl-btn">做一做</div>
          <div class="bl-btn">笑一笑</div>
        </div>
      </div>
      <bottom-nav></bottom-nav>
    </div>
</template>

<script>
  import BottomNav from '@/components/BottomNav'
    export default {
        name: "before-learn",
      components:{
        BottomNav
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .bl-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .bl-img{
      width: 460/@rem;
      height: 510/@rem;
      margin-top: 96/@rem;
    }
    .act-title{
      font-size: 40/@rem;
      color: #72531c;
      margin: 32/@rem 0 74/@rem;
    }
    .bl-title{
      font-size: 44/@rem ;
      color: @mColor;
      font-weight: 600;
      margin-top: 30/@rem;
    }
    .btn-group{
      margin-top: 132/@rem;
      width: 64%;
      display: flex;
      flex-wrap: wrap;
      margin-left: 34/@rem;
      .bl-btn{
        width: 204/@rem;
        height: 92/@rem;
        margin: 0 34/@rem 26/@rem 0 ;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18/@rem;
        background: #5fd097;
        color: #fff;
        font-size: 32/@rem;
        box-shadow: 0 4/@rem 4/@rem #666;
      }
    }
  }

</style>
