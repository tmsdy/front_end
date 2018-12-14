<template>
  <div class="pro-header">
    <slot name="title"></slot>
    <div id="all" class="ph-box">
      <div id="cur" class="complete"></div>
      <div class="uncomplete"></div>
    </div>
    <!--<img class="laba" src="./../assets/images/laba.png" alt="" />-->
    <div class="zheng" @click="show_tc()">正</div>
    <div class="mask" v-if="tc_off">
      <div class="tc-box">
        <div class="artical-box">
          <p v-for="item,index in articalList">{{item.seg_content}}</p>
        </div>
        <img @click="close_tc()" class="exit" src="./../assets/images/exit.png" />
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "app-header",
      props:['c_time','f_time'],
      data(){
        return{
          tc_off:false,
          articalList:[
            {
              seg_content:'孔子东游，见两小儿辩日，问其故。'
            },
            {
              seg_content:'一儿曰：“我以日始出时去人近，而日中时远也。”'
            },
            {
              seg_content:'一儿以日初出远，而日中时近也。'
            },
            {
              seg_content:'一儿曰：“日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？”'
            },
            {
              seg_content:'一儿曰：“日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？”'
            },
          ]
        }
      },
      updated(){
       let totalWidth =  $('#all').css('width') ;
       let width = (this.c_time/this.f_time)*parseInt(totalWidth) ;
        $('#cur').css('width',width) ;
      },
      methods:{
        show_tc(){
          this.tc_off = true ;
        },
        close_tc(){
          this.tc_off = false ;
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .pro-header{
    height: 40/@rem;
    width: 100vw;
    margin-top: 36/@rem;
    display: flex;
    align-items: center;
    padding-top: 22/@rem;
    .ph-title{
      font-size: 40/@rem;
      font-weight: 600;
      margin: 0 30/@rem 0  ;
    }
    .ph-box{
      width: 444/@rem;
      height: 18/@rem;
      border: 4/@rem solid #fff;
      border-radius: 18/@rem;
      display: flex;
      .complete{
        width: 1/@rem;
        border-radius: 18/@rem;
        background: #b0ef94;
      }
      .uncomplete{
        flex:1 ;
        background:#edffe5 ;
      }
    }
    .laba{
      height: 100%;
      width: 38/@rem;
      margin-left: 34/@rem;
    }
    .zheng{
      width: 72/@rem;
      height: 72/@rem;
      background: #fff;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #28915c;
      font-size: 30/@rem;
      margin-left: 26/@rem;
    }
  }

  .mask{
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    .postion(0,0,22) ;
  }
  .tc-box{
    width: 700/@rem;
    height: 82%;
    background: #fff;
    border-radius: 18/@rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .postion(28,46,122) ;
    .artical-box{
      width: 604/@rem;
      margin-top: 90/@rem;
      p{
        font-size: 34/@rem;
        letter-spacing: 2/@rem;
        line-height: 62/@rem;
        text-indent: 2em;
      }
    }
    .exit{
      width: 56/@rem;
      height: 56/@rem;
      position: absolute;
      left: 320/@rem;
      bottom: 52/@rem;
    }
  }

</style>
