<template>
  <div class="bottom-nav">
    <div class="nav-item">
      <img src="./../assets/images/zr_icon.png" alt="" />
      <p>学习记录</p>
    </div>
    <div class="b-line"></div>
    <div class="nav-item">
      <img src="./../assets/images/zr_icon.png" alt="" />
      <p>听古文</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "bottom-nav"
    }
</script>

<style lang="less" scoped>
  @rem:30rem ;
  .bottom-nav{
    width: 100vw;
    height: 84/@rem;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 33;
    display: flex;
    align-items: center;
    background: #fff;
  .nav-item{
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 28/@rem;
    line-height: 58/@rem;
    color: #68a945;
  img{
    width: 56/@rem;
    height: 58/@rem;
    margin: 0 26/@rem 0 97/@rem;
  }
  }
  .b-line{
    width: 2/@rem;
    height: 52/@rem;
    background: #b4b0ad;
  }
  }
</style>
