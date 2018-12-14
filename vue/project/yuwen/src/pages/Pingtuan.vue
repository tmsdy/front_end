<template>
    <div class="m-box">
      <div class="p-box">
        <img class="pt-img" src="./../assets/images/pt-img01.png"/>
        <div class="content-box">
          <div class="c-header">
            <div class="line"></div>
            <div class="c-title">3人成团</div>
            <div class="line"></div>
          </div>
          <div class="person-box">
            <div class="person-item">
              <div class="p-pho">
                <img src="./../assets/images/pho008.jpg" />
              </div>
              <p class="p-name">feifei</p>
            </div>
            <img class="plus" src="./../assets/images/plus.png" />
            <div class="person-item">
              <div class="p-pho">
                <img src="./../assets/images/pho008.jpg" />
              </div>
              <p class="p-name">虚位以待</p>
            </div>
            <img class="plus" src="./../assets/images/plus.png" />
            <div class="person-item">
              <div class="p-pho">
                <img src="./../assets/images/pho008.jpg" />
              </div>
              <p class="p-name">虚位以待</p>
            </div>
          </div>
          <p class="t-title">12小时组团进行中... ...</p>
          <p class="t-content">点击下方“邀请好友”，一起参团，享受优惠！</p>
          <div class="t-box">
            <span class="t-red">11</span>小时<span class="t-red">59</span>分<span class="t-red">56</span>秒 后截止
          </div>
          <p class="gray-text top">谁是孩子熟识的小伙伴？</p>
          <p class="gray-text">邀请他们一起！</p>
          <p class="gray-text">集体学习，更有动力！</p>
          <div class="control-btn">邀请好友</div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "pingtuan"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .m-box{
    background: #f0efee;
    .p-box{
      width: 96%;
      height: 96%;
      border-radius: 14/@rem;
      background: #fff;
      margin: 28/@rem auto;
      position: relative;
      .pt-img{
        width: 685/@rem;
        height: 740/@rem;
        .postion(10,24,2)
      }
      .content-box{
        width: 620/@rem;
        .postion(40,150,22) ;
        display: flex;
        flex-direction: column;
        align-items: center;
        .c-header{
          display: flex;
          align-items: center;
          .c-title{
            font-size: 46/@rem;
            font-weight: 600;
            margin: 0 26/@rem;
            color: #2ea468;
          }
          .line{
            width: 42/@rem;
            height: 4/@rem;
            background: #2ea468;
          }
        }
        .person-box{
          margin-top: 40/@rem;
          display: flex;
          align-items: center;
          .plus{
            width: 38/@rem;
            height: 38/@rem;
            margin: 0 12/@rem;
          }
          .person-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            .p-pho{
              width: 158/@rem;
              height: 158/@rem;
              box-sizing: border-box;
              border: 2/@rem solid #45bb7f;
              border-radius: 16/@rem;
              padding: 8/@rem;
              img{
                width: 140/@rem ;
                height: 140/@rem ;
                border-radius:16/@rem;
              }
            }
            .p-name{
              font-size: 22/@rem;
              margin-top: 16/@rem;
            }
          }
        }
      }
      .t-title{
        font-size: 38/@rem;
        font-weight: 600;
        color: #ea2038;
        margin-top: 48/@rem;
      }
      .t-content{
        font-size: 28/@rem;
        color: #ea2038;
        margin-top: 32/@rem;
      }
      .t-box{
        width: 338/@rem;
        height: 54/@rem;
        margin-top: 48/@rem;
        box-sizing: border-box;
        border: 2/@rem solid #999792;
        border-radius: 6/@rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26/@rem;
        color: #666666;
        .t-red{
          color:#ea2038
        }
      }
      .gray-text{
        font-size: 32/@rem;
        color: #555555;
        margin-top: 24/@rem;
        &.top{
          margin-top: 126/@rem;
        }
      }
      .control-btn{
        margin-top: 88/@rem;
      }
    }
  }

</style>
