<template>
  <div class="m-box">
    <p class="dk-title">每天学一点，名校近一点</p>
    <div class="dk-main">
      <div class="dk-header">
        <div class="left">
          <div class="pho">
            <img src="./../assets/images/pho008.jpg" alt="" />
          </div>
          <p class="name">张菲菲</p>
        </div>
        <div class="right">
          <div class="learn">
            <p class="num">28</p>
            <p class="m-text">学习天数</p>
            <div class="learn green">我也要学</div>
          </div>
          <div class="line"></div>
          <div class="learn">
            <p class="num">18</p>
            <p class="m-text">获得点赞</p>
            <div class="learn yellow">给TA点赞</div>
          </div>
        </div>
      </div>
      <img class="lian" src="./../assets/images/lian.png" alt="" />

      <div class="detail">
        <p class="title">我今天学了</p>
        <p class="content">孔子东游，见两小儿辩日，问其故。一儿曰：“我以日始出时去人近，而日中时远也。”... ...</p>
        <p class="end">— —《两小儿辩日》</p>
      </div>

      <img class="green-bg" src="./../assets/images/green-bottom.png" />
      <div class="baoming-btn">我要报名</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "daka"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .dk-title{
    width: 100%;
    font-size: 46/@rem;
    text-align: center;
    margin: 44/@rem 0 ;
  }
  .dk-main{
    width: 656/@rem;
    height: 1114/@rem;
    margin: 0 auto;
    background: #fff9ef;
    border-radius: 24/@rem;
    position: relative;
    .dk-header{
      width: 100%;
      display: flex;
      .left{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 44/@rem 0 0 26/@rem;
        img{
          width: 168/@rem;
          height: 168/@rem;
          border-radius: 100%;
          border: 2/@rem solid #333;
        }
        .name{
          font-size: 34/@rem;
          margin-top: 24/@rem;
        }
      }
      .right{
        margin: 80/@rem 0 0 64/@rem;
        display: flex;
        .line{
          width: 2/@rem;
          height: 110/@rem;
          margin: 0 18/@rem;
          background: #666;
        }
        .learn{
          text-align: center;
          .num{
            font-size: 40/@rem;
            line-height: 50/@rem;
            font-weight: 600;
          }
          .m-text{
            font-size: 30/@rem;
            line-height: 60/@rem;
          }
          .learn{
            width: 158/@rem;
            height: 48/@rem;
            border-radius: 12/@rem;
            line-height: 48/@rem;
            font-size: 24/@rem;
            margin-top: 10/@rem;
            &.green{
              border: 2/@rem solid #7fc95c;
              color: #7fc95c;
            }
            &.yellow{
              border: 2/@rem solid #ffc84d;
              color: #ffc84d;
            }
          }
        }
      }
    }
    .detail{
      width: 94%;
      margin: 0 auto;
      .title{
        font-size: 40/@rem;
        color: #88cd7a;
        text-align: center;
        margin: 60/@rem 0 ;
      }
      .content{
        text-indent: 2em;
        font-size: 32/@rem;
        line-height: 48/@rem;
        font-weight: 600;
      }
      .end{
        font-size: 32/@rem;
        line-height: 48/@rem;
        font-weight: 600;
        margin-top: 20/@rem;
        text-align: right;
      }
    }
    .lian{
      width: 100%;
      margin-top: 36/@rem;
    }
    .green-bg{
      width: 100%;
      height: 260/@rem;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 3;
    }
    .baoming-btn{
      position: absolute;
      left: 160/@rem;
      bottom: 60/@rem;
      z-index: 14;
      width: 324/@rem;
      height: 82/@rem;
      border-radius: 82/@rem;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #39890d;
      font-size: 40/@rem;
      letter-spacing: 4/@rem;
    }

  }

</style>
