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
      }
    ]
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
    return (
      <View className='v_d'>
        <Video
          className="vd_video"
          src= {currentVideoId===1
          ? require('../../assets/video/React001.mp4')
          : require('../../assets/video/React002.mp4')
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

