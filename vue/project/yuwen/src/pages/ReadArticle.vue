<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header>
        <p slot="title" class="ph-title">读一读</p>
      </app-header>

      <div class="artical">
        一儿曰：“日初出大如车盖，及日
        中则如盘盂，此不为远者小而近者大乎？
        日初出大如车盖，及日日初出大如。
      </div>

    </div>

    <div class="bottom-contain">
      <div class="audio-box">
          <div class="audio-inner">
            <div class="audio-item">
              <p>原音</p>
              <img src="./../assets/images/original_normal.png" alt="" />
            </div>
            <div class="audio-item">
              <p>点击录音</p>
              <img class="l-img" src="./../assets/images/_luyin_normal.png" alt="" />
            </div>
            <div class="audio-item">
              <p>录音</p>
              <img src="./../assets/images/luyin_active.png" alt="" />
            </div>
          </div>
        <div class="audio-pro">
          <div class=""></div>
        </div>
      </div>
      <div class="control-btn">继续</div>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
    export default {
        name: "read-article",
      components:{
        AppHeader
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .artical{
    width: 94%;
    margin: 130/@rem auto;
    font-size: 40/@rem;
    line-height: 70/@rem;
    font-weight: 500;
  }

  .audio-box{
    width: 100%;
    margin-bottom: 180/@rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .audio-inner{
      width: 74%;
      display: flex;
      justify-content: space-around;
      .audio-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #333;
        font-size: 26/@rem;
        img{
          width: 104/@rem;
          height: 104/@rem;
          margin-top: 44/@rem;
        }
        .l-img{
          width: 140/@rem;
          height: 140/@rem;
          margin-top: 28/@rem;
        }
      }
    }
  }

</style>
