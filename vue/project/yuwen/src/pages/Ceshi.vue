 <template>
  <div class="m-box">
    <img class="i-bg" src="./../assets/images/beijing.jpg" alt="" />
    <div class="m-inner">
      <app-header :c_time="currentTime" :f_time="duration">
        <p slot="title" class="ph-title">读一读</p>
      </app-header>
      <audio id="audio" :src='audioSrc' controls>
      </audio>
      <div class="artical">
          <span v-for="item,index in data" :key="index" :class="curOff(item,index)?'active':''">
            {{item.seg_content}}
          </span>
      </div>


    </div>

    <div class="bottom-contain">
      <div class="audio-box">
        <div class="audio-inner">
          <div class="audio-item">
            <p>原音</p>
            <img src="./../assets/images/original_normal.png" alt="" />
          </div>
          <div class="audio-item">
            <p>点击录音</p>
            <img class="l-img" src="./../assets/images/_luyin_normal.png" alt="" />
          </div>
          <div class="audio-item">
            <p>录音</p>
            <img src="./../assets/images/luyin_active.png" alt="" />
          </div>
        </div>
        <div class="audio-pro">
          <div class=""></div>
        </div>
      </div>
      <div class="control-btn" @click="playControl()">{{btnText}}</div>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/AppHeader"
  import axios from 'axios'

  export default {
    name: "ceshi",
    components:{
      AppHeader
    },
    data (){
      return{
        audioSrc:require('./../assets/music/小巷酒馆.mp3'),
        currentTime:0,
        duration:60,
        isPlay: false,
        isEnd:false,
        data:[
          {
            seg_content:'隔岸江畔好像有家小巷酒馆' ,
            time: '00:00:22',
            second:22
          },
          {
            seg_content:'门庭若市却还一直破落不堪' ,
            time: '00:00:27',
            second:27
          },
          {
            seg_content:'缓身踱步走到槐树下酒旗旁' ,
            time: '00:00:32',
            second:32
          },
          {
            seg_content:'一双筷一壶酒洗去满身的惆怅' ,
            time: '00:00:37',
            second:37
          },
          {
            seg_content:'这里过客大都一样' ,
            time: '00:00:40',
            second:40
          },
          {
            seg_content:'独醉贪欢倾诉心肠' ,
            time: '00:00:43',
            second:43
          },
          {
            seg_content:'期盼一梦醒来忘掉过往' ,
            time: '00:00:45',
            second:45
          },
          {
            seg_content:'咽下了孟婆汤' ,
            time: '00:00:48',
            second:48
          }
        ]
      }
    },
    computed:{
      btnText(){
        let text = ''
        if(!this.isEnd){
          text = this.isPlay?'暂停':'播放'
        }else{
          text = '下一步'
        }
        return text
      }
    },
    mounted(){
      let audio = $('#audio')[0] ;
      let that = this ;
      audio.addEventListener('timeupdate', function () {
        that.currentTime = Number(this.currentTime.toFixed(2)) ;
        that.duration = audio.duration.toFixed(2) ;
      }, false);
      audio.addEventListener('ended', function () {
        that.isEnd = true ;
      }, false);
      axios.get('http://192.168.1.135:8080/haidong-emcee/course/TYCourse').then((res)=>{
        console.log(res) ;
      })
    },
    methods:{
      curOff(item,index){
        let off = false ;
        if(this.data[index+1]){
          off = item.second<this.currentTime&&this.data[index+1].second>this.currentTime ;
        }else {
          item.second<this.currentTime?off = true: off = false;
        }
        return off
      },
      playControl(){
          if(!this.isPlay){
            audio.play() ;
            this.isPlay = true ;
          }else {
            audio.pause() ;
            this.isPlay = false ;
          }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/public.less' ;

  .artical{
    width: 94%;
    margin: 130/@rem auto;
    font-size: 40/@rem;
    line-height: 70/@rem;
    font-weight: 500;
    text-indent: 2em;
    span{
      &.active{
        color: #3c851a;
      }
    }
  }

  .audio-box{
    width: 100%;
    margin-bottom: 180/@rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .audio-inner{
      width: 74%;
      display: flex;
      justify-content: space-around;
      .audio-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #333;
        font-size: 26/@rem;
        img{
          width: 104/@rem;
          height: 104/@rem;
          margin-top: 44/@rem;
        }
        .l-img{
          width: 140/@rem;
          height: 140/@rem;
          margin-top: 28/@rem;
        }
      }
    }
  }

  .music_box{
    margin: 50px auto;
    width: 422px;
  }
  .content{
    width: 402px;
    height: 200px;
    overflow: hidden;
    padding: 10px;
    background: #ccc;
  }
  #lrc_list{
    margin: 10px auto;
    background: #ccc;
  }
  #lrc_list li{
    font: normal 14px/2.1 'microsoft yahei';
    text-align: center;
  }
  #lrc_list li.hover{
    color: red;
    font-weight: bold;
    font-size: 18px ;
    transition: 0.6s ;
  }

</style>
