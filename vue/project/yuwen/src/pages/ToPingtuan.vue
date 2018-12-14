<template>
    <div class="p-box">
      <div class="p-header">3人成团购</div>
      <div class="pt-list">
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">已选课程</p>
          <p class="black-text">粽子古文</p>
        </div>
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">请选择年级</p>
          <div class="pt-btn">三年级</div>
          <div class="sanjiao">
            <div></div>
          </div>
        </div>
        <div class="pt-item">
          <div class="line"></div>
          <p class="pt-title">课程费用</p>
          <span class="s-red">￥</span>
          <span class="price">199.00</span>
          <span class="old-price">299.00</span>
        </div>
        <div class="pt-item">
          <p class="pt-title">请添加您的手机号</p>
        </div>
        <div class="pt-item">
          <input placeholder="请填写手机号"/>
          <div class="yanzheng">获取验证码</div>
        </div>
        <div class="pt-item">
          <input placeholder="请填写验证码"/>
        </div>
      </div>
      <div class="control-btn">确定</div>
      <div class="notice-box">
        <p>团购须知:</p>
        <p>1、您选择【确定】支付199后，将邀请组团链接分享给好友，即发起团购。</p>
        <p>2、发起团购12小时内，满3人（含自己）报名，即组团成功，系统将推送学习账号给您。</p>
        <p class="cannot-pay">无法支付？联系付老师：<span class="s-red">400-8765776</span></p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "to-pingtuan"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .p-box{
    width: 100vw;
    height: 100vh;
    background: #fff;
    .p-header{
      width: 100%;
      height: 165/@rem;
      background: @btnColor;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 48/@rem;
      font-weight: 600;
      color: #fff;
    }
    .pt-list{
      width: 100%;
      .pt-item{
        width: 100%;
        height: 94/@rem;
        border-bottom: 2/@rem solid #999;
        display: flex;
        align-items: center;
        color: #444444;
        .line{
          width: 4/@rem;
          height: 34/@rem;
          background: @btnColor;
          margin-left: 22/@rem;
        }
        .pt-title{
          font-size: 30/@rem;
          margin-left: 13/@rem;
          margin-right: auto;
        }
        .black-text{
          font-size: 31/@rem;
          font-weight: 600;
          margin-right: 26/@rem;
          color: #000;
        }
        .pt-btn{
          width: 160/@rem;
          height: 56/@rem;
          background: #62ce97;
          border-radius: 8/@rem 0 0 8/@rem ;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 26/@rem ;
          margin-right: 2/@rem;
        }
        .sanjiao{
          width: 58/@rem;
          height: 56/@rem;
          background: #62ce97;
          border-radius:0 8/@rem 8/@rem 0 ;
          display: flex;
          justify-content: center;
          margin-right: 24/@rem;
          div{
            width: 0;
            height: 0;
            margin-top: 19/@rem;
            border-width: 18/@rem;
            border-style: solid;
            border-color: #fff  transparent transparent transparent;
          }
        }
        .price{
          font-size: 40/@rem;
          color: #ea2038;
          font-weight: 600;
          margin-right: 6/@rem;
        }
        .old-price{
          font-size: 24/@rem;
          color: #666666;
          text-decoration: line-through;
          margin-right: 24/@rem;
        }
        input{
          flex: 1;
          margin-left: 40/@rem;
        }
        .yanzheng{
          width: 204/@rem ;
          height: 56/@rem ;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #62ce97;
          border: 2/@rem solid #62ce97;
          border-radius: 6/@rem;
          margin-right: 24/@rem;
        }
      }
    }
    .notice-box{
      width: 94%;
      margin: 40/@rem auto 0;
      font-size: 28/@rem;
      line-height: 40/@rem;
      .cannot-pay{
        margin-top: 60/@rem;
        text-align: right;
      }
    }
  }
  .s-red{
    font-size: 26/@rem;
    color: #ea2038;
    font-weight: 600;
  }
  .control-btn{
    margin: 58/@rem auto 0;
  }

</style>
