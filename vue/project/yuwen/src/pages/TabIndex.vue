<template>
    <div class="m-box">
      <div class="listen-box"  v-if="tabNav==2">
        <div class="l-header">古文音频</div>
        <div class="l-list">
          <div class="l-item" v-for="item,index in audioList" :key="index">
            <div class="l-img">
              <img :src="item.audioSrc" />
            </div>
            <p class="l-text">{{item.artical}}</p>
          </div>
        </div>
        <p class="select-text">请选择想听得古文（可多选）</p>
        <div class="control-btn">播放</div>
      </div>
      <div class="mine-box" v-if="tabNav==3">
        <div class="m-header">
          <img class="m-pho" src="./../assets/images/pho008.jpg" alt="" />
          <div class="m-middle">
            <p class="m-name">张菲菲</p>
            <p class="m-level">我的级别：状元</p>
          </div>
          <img class="m-icon" src="./../assets/images/next.png" />
        </div>
        <div class="m-item">
          <img src="./../assets/images/man.png" />
          <p class="m-text">邀请好友</p>
        </div>
        <div class="m-item">
          <img src="./../assets/images/xu.png" />
          <p class="m-text">续课报名</p>
        </div>
        <div class="m-item">
          <img src="./../assets/images/xuhuan.png" />
          <p class="m-text">开通另一个手机</p>
        </div>
      </div>
      <div class="tabbar">
        <div class="tab-item" @click="changeNav(0)">
          <img class="learn " :src="tabNav==0?require('./../assets/images/learn-active.png'):require('./../assets/images/learn.png')" />
          <p class="tab-text" :class="tabNav==0?'active':''">今日学习</p>
        </div>
        <div class="tab-item" @click="changeNav(1)">
          <img class="rili"  :src="tabNav==1?require('./../assets/images/rili-active.png'):require('./../assets/images/rili.png')" />
          <p class="tab-text" :class="tabNav==1?'active':''">学习记录</p>
        </div>
        <div class="tab-item" @click="changeNav(2)">
          <img class="listen" :src="tabNav==2?require('./../assets/images/listen-active.png'):require('./../assets/images/listen.png')" />
          <p class="tab-text" :class="tabNav==2?'active':''">听古文</p>
        </div>
        <div class="tab-item" @click="changeNav(3)">
          <img class="mine" :src="tabNav==3?require('./../assets/images/mine-active.png'):require('./../assets/images/mine.png')" />
          <p class="tab-text" :class="tabNav==3?'active':''">我的</p>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "mine",
      data(){
          return{
            tabNav: 2,
            audioList:[
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              },
              {
                audioSrc:require('./../assets/images/bianri.png'),
                artical:'两小儿辩日'
              }
            ]
          }
      },
      methods:{
        changeNav(n){
          this.tabNav = n ;
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .mine-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    .m-header{
      width: 100%;
      height: 190/@rem;
      margin-bottom: 54/@rem;
      background: #eff2db;
      display: flex;
      align-items: center;
      .m-pho{
        width: 144/@rem;
        height: 144/@rem;
        display: inline-block;
        border: 2/@rem solid #9e9e9e;
        border-radius: 100%;
        margin-left: 20/@rem;
      }
      .m-middle{
        margin-left: 22/@rem;
        margin-right: auto;
        .m-name{
          font-size: 38/@rem;
          font-weight: 600;
          letter-spacing: 2/@rem;
          line-height: 50/@rem;
        }
        .m-level{
          font-size: 30/@rem;
          letter-spacing: 4/@rem;
          color: #333;
          margin-top: 8/@rem;
        }
      }
      .m-icon{
        width: 22/@rem;
        height: 38/@rem;
        margin-right: 20/@rem;
      }
    }
    .m-item{
      width: 100%;
      height: 106/@rem;
      background: #eff2db;
      display: flex;
      align-items: center;
      margin-top: 10/@rem;
      img{
        width: 52/@rem;
        height: 52/@rem ;
        margin-left: 20/@rem;
      }
      .m-text{
        font-size: 32/@rem;
        margin-left: 24/@rem;
      }
    }
  }

  .listen-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .l-header{
      height: 86/@rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32/@rem;
      background: #cff9d8;
    }
    .l-list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .l-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 48/@rem 0 0 36/@rem;
        .l-img{
          width: 196/@rem;
          height: 148/@rem;
          border: 2/@rem solid #4d4031;
          border-radius: 10/@rem;
          background: #eaf3ec;
          img{
            width: 196/@rem;
            height: 148/@rem;
          }
        }
        .l-text{
          font-size: 28/@rem;
          color: #3f301f;
          margin-top: 20/@rem;
        }
      }
    }
    .select-text{
      font-size: 26/@rem;
      color: #3f301f;
      margin: 70/@rem 0 0 0;
    }
  }

  .tabbar{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 124/@rem;
    border-top: 1/@rem solid #a6a094;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .tab-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      .tab-text{
        font-size: 23/@rem;
        margin-top: 20/@rem;
        color: #333333;
        &.active{
          color: @btnColor;
        }
      }
      .learn{
        width: 70/@rem;
        height: 48/@rem;
      }
      .rili{
        width: 54/@rem;
        height: 50/@rem;
      }
      .listen{
        width: 62/@rem;
        height: 46/@rem;
      }
      .mine{
        width: 43/@rem;
        height: 52/@rem;
      }
    }

  }

  .control-btn{
    margin-top: 34/@rem;
  }

</style>
