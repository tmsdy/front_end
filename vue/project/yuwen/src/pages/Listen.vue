<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header>
        <p slot="title" class="ph-title">听一听</p>
      </app-header>
      <img class="l-img" src="./../assets/images/bianri.png" alt="" />
      <div class="l-artical">
        <div class="l-topic">
          <p class="l-title">两小儿辩日</p>
          <p class="l-author">列御寇</p>
        </div>
        <div class="l-content">
          <p>孔子东游，见两小儿辩斗，问其故。</p>
          <p>一儿曰：“我以日始出时去人近，而日中时远也。”</p>
          <p>一儿以日初出远，而日中时近也。</p>
          <p>一儿曰：“日初出大如车盖，及日中</p>
        </div>
      </div>
    </div>

    <div class="bottom-contain">
      <div class="control-btn">开始读古文</div>
    </div>

  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
    export default {
        name: "listen",
      components: {AppHeader}
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .l-img{
    width: 652/@rem;
    height: 356/@rem;
    display: block;
    margin: 40/@rem auto 0;
  }

  .l-artical{
    width: 94%;
    margin: 60/@rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .l-topic{
      display: flex;
      align-items: flex-end;
      .l-title{
        font-size: 46/@rem;
        font-weight: 600;
      }
      .l-author{
        font-size: 24/@rem;
        font-weight: 500;
        margin-left: 20/@rem;
      }
    }
    .l-content{
      font-size: 38/@rem;
      line-height: 82/@rem;
      font-weight: 600;
      letter-spacing: 4/@rem;
      margin-top: 20/@rem ;
    }
  }

</style>
