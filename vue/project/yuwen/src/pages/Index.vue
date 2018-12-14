<template>
  <div class="m-box">
    <div class="i-box">
      <img class="banner" src="./../assets/images/zs-banner.png" alt="" />
      <div class="learn-btn">我要学习</div>
    </div>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
  import BottomNav from '@/components/BottomNav'
    export default {
      name: "index",
      components:{
        BottomNav
      },
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .i-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .banner{
    width: 642/@rem;
    height: 700/@rem;
    display: block;
    margin: 102/@rem 0 0 0;
  }
</style>
