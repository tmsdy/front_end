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
  }
  componentWillMount () {
    console.log(this.$router.params)
  }

  componentDidMount () { }

  click_like(e){
    // let {src_list} = this.state
    // src_list.like_src = src_list.like_src === '../../assets/images/like_normal.png' 
    // ? '../../assets/images/like_active.png'
    // : '../../assets/images/like_normal.png'
    // this.setState({
    //   src_list
    // })
    let {like} = this.state
    this.setState({
      like: !like
    })
  }

  clickFavorite(e){
    console.log('clickFavorite')
    
  }

  changeVideo(){
    console.log('changeVideo')
  }

  render () {
    let {src_list,like} = this.state
    return (
      <View className='v_d'>
        <Video
          className="vd_video"
          src= {require('../../assets/video/React001.mp4')}
          // { like 
          //   ? require('../../assets/video/React001.mp4') 
          //   : require('../../assets/video/React002.mp4')}
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

