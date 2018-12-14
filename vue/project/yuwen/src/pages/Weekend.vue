<template>
    <div class="m-box">
      <div class="w-box">
        <img class="w-img" src="./../assets/images/weekend_img.png" />
        <div class="active-btn">测一测</div>
        <div class="normal-btn">查看上周重点词汇</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "weekend"
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .w-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .w-img{
      width: 578/@rem;
      height: 560/@rem;
      margin-top: 122/@rem;
    }

  }

</style>
