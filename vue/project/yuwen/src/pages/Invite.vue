<template>
    <div class="m-box">
      <div class="i-box">
        <img class="i-img" src="./../assets/images/tuijian_img.png" />
        <div class="i-item">
          <img class="item-img" src="./../assets/images/i-img01.png" />
          <div class="item-right">
            <p class="i-title">好友报名，立减20</p>
            <p class="i-content">好友报名本期课程，享受立减20元优惠！</p>
          </div>
        </div>
        <div class="i-item">
          <img class="item-img" src="./../assets/images/i-img02.png" />
          <div class="item-right">
            <p class="i-title">自己第二级报名，立减20</p>
            <p class="i-content">自己报名本期课程，享受立减20元优惠！</p>
          </div>
        </div>
        <div class="control-btn">邀请好友</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "invite"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .m-box{
    background: #f0efee;
    .i-box{
      width: 96%;
      height: 96%;
      margin: 22/@rem auto ;
      border-radius: 20/@rem;
      background: #fff6e3;
      display: flex;
      flex-direction: column;
      align-items: center;
      .i-img {
        width: 100%;
        height: 480/@rem;
      }
      .i-item{
        width: 648/@rem;
        height: 186/@rem;
        background: #fff;
        border-radius: 16/@rem;
        display: flex;
        align-items: center;
        .item-img{
          width: 114/@rem;
          height: 114/@rem;
          margin: 0 50/@rem 0 48/@rem;
        }
        .item-right{
          width: 384/@rem;
          .i-title{
            font-size: 33/@rem ;
            color: @btnColor;
            font-weight: 600;
            line-height: 54/@rem;
          }
          .i-content{
            font-size: 24/@rem;
            line-height: 34/@rem;
          }
        }
      }
      .i-item:nth-of-type(1){
        margin-top: 88/@rem;
      }
      .i-item:nth-of-type(2){
        margin-top: 24/@rem;
      }
    }
  }
  .control-btn{
    margin-top: 98/@rem;
  }
</style>
