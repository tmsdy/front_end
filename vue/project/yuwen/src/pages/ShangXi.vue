<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header>
        <p slot="title" class="ph-title">赏一赏</p>
      </app-header>
      <div class="artical">
        <div class="a-title">
          <p>杨氏之子<span class="auther">刘义庆</span></p>
        </div>
        <div class="main-content">
          <img src="./../assets/images/finger.png" alt="" />
          <span>梁国杨氏子九岁，甚聪惠。孔君平
        诣其父，父不在，乃呼儿出。为设果，
        果有杨梅。孔指以示儿曰：“此是君家
        果。”儿应声答曰：“未闻孔雀是夫子
        家禽。”</span>
        </div>
      </div>
      <div class="artical">
        <div class="main-content">
          <img src="./../assets/images/fanyi.png" alt="" />
          <span>梁国杨氏子九岁，甚聪惠。孔君平
        诣其父，父不在，乃呼儿出。为设果，
        果有杨梅。孔指以示儿曰：“此是君家
        果。”儿应声答曰：“未闻孔雀是夫子
        家禽。”</span>
        </div>
      </div>
    </div>

    <div class="bottom-contain">
      <div class="control-btn">结束</div>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
    export default {
      name: "shang-xi",
      components: {AppHeader}
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .artical{
    width: 94%;
    margin: 80/@rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .a-title{
        font-size: 46/@rem;
        font-weight: 600;
        margin-left: 60/@rem;
        .auther{
          margin-left: 30/@rem;
          font-size: 24/@rem;
          font-weight: 500;
        }
    }
    .main-content{
      width: 100%;
      margin-top: 62/@rem;
      font-size: 40/@rem;
      line-height: 56/@rem;
      img{
        width: 64/@rem;
        height: 54/@rem;
      }
    }
  }

</style>
