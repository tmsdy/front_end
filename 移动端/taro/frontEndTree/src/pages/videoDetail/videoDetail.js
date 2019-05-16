import Taro, { Component, requirePlugin } from '@tarojs/taro'
import { View, Video,Text,Button } from '@tarojs/components'
import './videoDetail.less'

export default class VideoDetail extends Component {

  config = {
    navigationBarTitleText: '视频详情'
  }
  state = {
    like: false,
    favorite: false,
    currentVideoId: 1,
    videoList:[
      {
        id: 1 ,
        title: 'React.js简介',
        totalTime: '4分钟',
        src: '../../assets/video/React001.mp4',
      },
      {
        id: 2 ,
        title: '开发环境搭建',
        totalTime: '9分钟',
        src: '../../assets/video/React002.mp4',
      },
      {
        id: 3 ,
        title: 'React组件',
        totalTime: '7分钟',
        src: '../../assets/video/React002.mp4',
      },
      {
        id: 4 ,
        title: 'React中最简单的JSX语法',
        totalTime: '7分钟',
        src: '../../assets/video/React001.mp4',
      },
      {
        id: 5 ,
        title: 'React中的虚拟DOM',
        totalTime: '14分钟',
        src: '../../assets/video/React001.mp4',
      },
      {
        id: 6 ,
        title: '深入理解虚拟DOM',
        totalTime: '11分钟',
        src: '../../assets/video/React002.mp4',
      }
    ]
  }
  componentWillMount () {
    console.log('视频详情',this.$router.params)
    let like = Taro.getStorageSync('liked') || false
    let favorite = Taro.getStorageSync('favorite') || false
      this.setState({
        like,
        favorite
      })
  }

  componentDidMount () { }

  click_like(e){
    let {like} = this.state
    if(!like){
      Taro.showToast({
        title: '点赞成功'
      })
    }else{
      Taro.showToast({
        title: '取消点赞成功'
      })
    }
    this.setState({
      like: !like
    })
    Taro.setStorageSync('liked',!like)
  }

  clickFavorite(e){
    let {favorite} = this.state
    if(!favorite){
      Taro.showToast({
        title: '收藏成功'
      })
    }else{
      Taro.showToast({
        title: '取消收藏成功'
      })
    }
    this.setState({
      favorite: !favorite
    })
    Taro.setStorageSync('favorite',!favorite)
  }

  changeVideo(id){
    let {currentVideoId} = this.state
    if(currentVideoId==id) return ;
    console.log(id)
    this.setState({
      currentVideoId: id
    })
  }

  render () {
    let {like,favorite,currentVideoId,videoList} = this.state
          //     ? 'http://rookiefeifei.top/frontEndTree/React001.mp4'
          // : 'http://rookiefeifei.top/frontEndTree/React002.mp4'
          // ? require('../../assets/video/React001.mp4')
            // : require('../../assets/video/React002.mp4')
    return (
      <View className='v_d'>
        <Video
          className="vd_video"
          src= {currentVideoId===1
               ? 'http://rookiefeifei.top/frontEndTree/React001.mp4'
               : 'http://rookiefeifei.top/frontEndTree/React002.mp4'
          }
          controls
          enable-progress-gesture
        />
        <View className="vd_header">
          <Text className="title">React教学视频</Text>
          <Image onClick={this.click_like.bind(this)} className="like"
            src={ like
              ? require('../../assets/images/like_active.png')
              : require('../../assets/images/like_normal.png')}></Image>
          <Image onClick={this.clickFavorite.bind(this)} className="favorite"
            src={ favorite
            ? require('../../assets/images/favorite_active.png')
            : require('../../assets/images/favorite_normal.png')}></Image>
        </View>
        <View className="vd_chapter_list">
          {
            videoList.map((video,index)=>{
              return (
                <View className="vd_chapter"
                  key={video.id}
                  onClick={this.changeVideo.bind(this,video.id)}>
                    <Image className="video" src={require('../../assets/images/icon/video.png')}></Image>
                    <View className="chapter-right">
                      <Text className="title">{video.title}</Text>
                      <Text className="small-gray">{video.totalTime}</Text>
                    </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

