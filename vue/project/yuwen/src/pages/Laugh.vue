<template>
    <div class="m-box">
      <div class="l-box">
        <img class="l-img01" src="./../assets/images/laugh-img01.png" />
        <div class="l-content">
          <img class="l-img02" src="./../assets/images/laugh-img02.png" />
          <p class="l-detail">
            有一天，小明对老师说，墙上有好多蚂蚁。老师又是教英语的，习惯性地问了句“ 蚂蚁怎么说？” 小明愣了一会，说“ 蚂蚁什么也没说。”
          </p>
          <div class="answer-btn">答案</div>
        </div>
        <div class="control-btn">跳过</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "laugh"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .l-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .l-img01{
      width: 580/@rem;
      height: 102/@rem;
      margin-top: 56/@rem;
    }
    .l-content{
      width: 620/@rem;
      height: 840/@rem;
      margin-top: 36/@rem ;
      position: relative;
      .l-img02{
        width: 100%;
        height: 100%;
        .postion(0,0,2) ;
      }
      .l-detail{
        width: 470/@rem ;
        .postion(88,148,22) ;
        font-size: 32/@rem;
        line-height: 48/@rem;
        text-indent: 2em;
      }
      .answer-btn{
        width: 178/@rem;
        height: 68/@rem;
        box-sizing: border-box;
        border-radius: 26/@rem;
        background: #7bd6a7 ;
        color: #fff;
        letter-spacing: 1em;
        text-align: center;
        line-height: 68/@rem;
        padding-left: 1em;
        box-shadow: 0 3/@rem 10/@rem #666 ;
        position: absolute;
        left: 222/@rem;
        bottom: 250/@rem;
        z-index: 22;
      }
    }

  }
  .control-btn{
    margin-top: 60/@rem;
  }

</style>
