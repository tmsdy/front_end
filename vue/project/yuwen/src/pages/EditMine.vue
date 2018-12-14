<template>
    <div class="m-box">
      <div class="e-header">
        <img class="e-pho" src="./../assets/images/pho008.jpg" />
      </div>
      <div class="e-item">
        <span class="classify">姓名</span><span>张菲菲</span>
      </div>
      <div class="e-item">
        <span class="classify">年级</span><span>三年级</span>
      </div>
      <div class="e-item">
        <span class="classify">年龄</span><span>其他</span>
      </div>
      <div class="e-item">
        <span class="classify">手机</span><span>18116359489</span>
      </div>
      <div class="control-btn">保存</div>
    </div>
</template>

<script>
    export default {
        name: "edit-mine",

    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .e-header{
    width: 100%;
    height: 220/@rem;
    background: #eff2db;
    margin-bottom: 20/@rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .e-pho{
      width: 136/@rem;
      height: 136/@rem;
      border-radius: 100%;
      border: 2/@rem solid #9e9e9e;
    }
  }

  .e-item{
    width: 94%;
    height: 106/@rem;
    margin: 0 auto;
    border-bottom: 2/@rem solid #45bb7f;
    display: flex;
    align-items: center;
    font-size: 32/@rem;
    .classify{
      letter-spacing: 8/@rem;
      margin-right: 54/@rem;
    }
  }

  .control-btn{
    margin: 124/@rem auto;
  }

</style>
