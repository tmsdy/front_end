import Taro, { Component, requirePlugin } from '@tarojs/taro'
import { View, Video,Text,Button } from '@tarojs/components'
import './videoDetail.less'

export default class VideoDetail extends Component {

  config = {
    navigationBarTitleText: '视频详情'
  }
  state = {
    favoritelike: false,
    favorite: false,
    videoIndex: 1
  }
  componentWillMount () {
    console.log(this.$router.params)
  }

  componentDidMount () { }

  click_like(e){
    let {like} = this.state
    this.setState({
      like: !like
    })
  }

  clickFavorite(e){
    let {favorite} = this.state
    this.setState({
      favorite: !favorite
    })
  }

  changeVideo(){
    let {videoIndex} = this.state
    videoIndex = videoIndex === 1 ? 2 : 1
    this.setState({
      videoIndex
    })
  }

  screenchange(){
    console.log('screenchange')
  }

  render () {
    let {like,favorite,videoIndex} = this.state
    console.log(videoIndex)
    return (
      <View className='v_d'>
        <Video
          className="vd_video"
          src= {videoIndex===1
          ? require('../../assets/video/React001.mp4') 
          : require('../../assets/video/React002.mp4')
          }
          OnFullScreenChange={this.screenchange}
          bindfullscreenchange={this.screenchange}
          controls
          enable-progress-gesture
        />
        <View className="vd_header">
          <Text className="title">React视频</Text>
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
          <Button onClick={this.changeVideo.bind(this)}>改变video</Button>
        </View>
      </View>
    )
  }
}

