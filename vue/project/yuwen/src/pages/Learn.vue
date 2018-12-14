<template>
  <div class="m-box">
    <div class="m-inner">
      <app-header>
        <p slot="title" class="ph-title">学一学</p>
      </app-header>
      <div class="artical">
        <div class="main-content">
          <div class="l-item">
            <img class="finger" src="./../assets/images/finger.png" alt="" />
            <p class="sentence">孔子东游，见两小儿辩日，问其故。</p>
            <p class="translate">孔子向东游历，见到两个小孩在争辩，就问他们在争辩的原因。</p>
          </div>
          <div class="l-item">
            <p class="sentence">一儿曰：“我以日始出时去人近，而日中时远也。”</p>
            <p class="translate">一个小孩子说：“我认为太阳刚刚升起的时候距离人近，而正午的时候距离人远。”</p>
          </div>
          <div class="l-item">
            <p class="sentence">一儿以日初出远，而日中时近也。</p>
            <p class="translate">另一个小孩子认为太阳刚刚升起的时候距离人比较远，而正午的时候距离人比较近。</p>
          </div>
          <div class="l-item">
            <p class="sentence">一儿曰：“日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？”</p>
            <p class="translate">一个小孩儿说：“太阳刚出时像车的车盖一样大，到了中午时就如同盘子一般小了，这不是远小近大的道理吗？”</p>
          </div>
          <div class="l-item">
            <p class="sentence">一儿曰：“日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？”</p>
            <p class="translate">另一个小孩儿说：“太阳刚出来时凉爽，到了中午的时候热得如同把手伸进热水中，这不是近的就感觉热，而远就觉得凉的道理吗？”</p>
          </div>
          <div class="l-item">
            <p class="sentence">孔子不能决也。</p>
            <p class="translate">孔子听了之后不能判断他们俩谁对谁错。</p>
          </div>
          <div class="l-item">
            <p class="sentence">两小儿笑曰：“孰为汝多知乎？”</p>
            <p class="translate">两个小孩子笑着对孔子说：“是谁说你智慧多呢？”</p>
          </div>
        </div>
      </div>

        <div class="translate-contain">
          <img class="fanyi" src="./../assets/images/fanyi.png" alt="" />
          <div class="translate-box">
            <p class="translate">孔子向东游历，见到两个小孩在争辩，就问他们在争辩的原因。</p>
            <p class="translate">一个小孩子说：“我认为太阳刚刚升起的时候距离人近，而正午的时候距离人远。”</p>
            <p class="translate">另一个小孩子认为太阳刚刚升起的时候距离人比较远，而正午的时候距离人比较近。</p>
            <p class="translate">一个小孩儿说：“太阳刚出时像车的车盖一样大，到了中午时就如同盘子一般小了，这不是远小近大的道理吗？”</p>
            <p class="translate">另一个小孩儿说：“太阳刚出来时凉爽，到了中午的时候热得如同把手伸进热水中，这不是近的就感觉热，而远就觉得凉的道理吗？”</p>
            <p class="translate">孔子听了之后不能判断他们俩谁对谁错。</p>
            <p class="translate">两个小孩子笑着对孔子说：“是谁说你智慧多呢？”</p>
          </div>
          <div class="summary-box">
            <img class="wenli" src="./../assets/images/wenli.png" alt="" />
            <div class="summary">
              《两小儿辩日》表现了古人为认识自然、探求客观事理而独立思考、大胆质疑、实事求是的精神；同时阐述了“学无止境”的道理
            </div>
          </div>

        </div>

    </div>

    <div class="bottom-contain">
      <div class="control-btn">开始闯关</div>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
    export default {
        name: "learn",
      components: {AppHeader}
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .m-box{
    background: url("./../assets/images/beijing.jpg");
    .m-inner{
      overflow: scroll;
      .main-content{
        width: 94%;
        margin: 56/@rem auto 0;
        font-size: 40/@rem;
        line-height: 56/@rem;
        .l-item{
          line-height: 60/@rem;
          margin-bottom: 20/@rem;
          position: relative;
          .finger{
            width: 64/@rem;
            height: 54/@rem;
            .postion(0,0,2)
          }
          .sentence{
            text-indent: 2em;
            font-size: 40/@rem;
            font-weight: 600;
          }
        }
      }
    }

  }

  .translate-contain{
    width: 94%;
    padding-bottom: 680/@rem;
    margin: 56/@rem auto 0;
    font-size: 40/@rem;
    line-height: 56/@rem;
    position: relative;
    .summary-box{
      width: 100%;
      position: relative;
      .wenli{
        width: 100%;
        margin-top: 30/@rem;
        .postion(0,0,11)
      }
      .summary{
        width: 540/@rem;
        .postion(100,100,33)
      }
    }
    .fanyi{
      width: 64/@rem;
      height: 54/@rem;
      .postion(0,0,2)
    }
  }


  .translate{
    text-indent: 2em;
    font-size: 36/@rem;
  }


</style>
