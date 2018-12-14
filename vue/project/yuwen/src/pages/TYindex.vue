<template>
  <div class="index-box">
    <div class="i-inner">
      <div class="i-header">
        <img class="zong-img" src="./../assets/images/zong.png" alt="" />
        <p class="i-title">子古文体验课</p>
      </div>
    </div>
    <div class="learn-btn">我要学习</div>
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
      mounted(){
          // localStorage.setItem('ex_course',JSON.stringify(this.$store.state.ex_courseList)) ;
          // console.log()
        this.$store.commit('save_ex_course',JSON.parse(localStorage.getItem('ex_course'))) ;
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;
  .index-box{
    width: 100vw ;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: #fff6e4;
    .i-inner{
      width: 644/@rem;
      height: 854/@rem;
      .postion(54,64,22) ;
      .i-banner{
        width: 100%;
        height: 100%;
        .postion(0,0,22) ;
      }
      .i-header{
        height: 98/@rem;
        width: 100%;
        .postion(0,130,22) ;
        display: flex;
        align-items: center;
        .zong-img{
          width: 112/@rem;
          height: 100%;
          margin-left: 58/@rem ;
        }
        .i-title{
          font-size: 64/@rem;
          font-weight: 700;
          line-height: 98/@rem;
          color: #68a945;
        }
      }
    }

  }

</style>
