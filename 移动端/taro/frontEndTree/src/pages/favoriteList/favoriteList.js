import Taro, { Component, requirePlugin } from '@tarojs/taro'
import { View, Video,Text,Button } from '@tarojs/components'
import './favoriteList.less'

export default class favoriteList extends Component {
  config = {
    navigationBarTitleText: '收藏列表'
  }
  state = {
    videoList: [
      {
        id: 1 ,
        src: 'https://i04picsos.sogoucdn.com/2916c40f6b2bca10',
        title: 'React开发教学',
        introduction:'小白入门React教程, 最新最全精细讲解, 如何使用React进行开发以及如何使用Redux',
        level: '初级',
        people_quntity: 1883,
      }
    ]
  }
  componentWillMount () {
   }
  componentDidShow () { }
  enterVideoDetail(v_id){
    console.log(v_id)
    Taro.navigateTo({
      url: '/pages/videoDetail/videoDetail?v_id='+v_id
    })
  }
  render () {
    let {videoList} = this.state
    return (
      <View className='index'>
          <View className='video_wrapper'>
            <View className='video_list' >
              {
                videoList.map((video,index)=>{
                  return <View className='video_item'
                    onClick={this.enterVideoDetail.bind(this,video.v_id)}
                    key={video.v_id}
                  >
                    <Image className='vi_img'
                      src={video.src}
                      ></Image>
                    <View className='vi_right'>
                      <View className='vi_title'>{video.title}</View>
                      <View className='vi_details'>{video.introduction}</View>
                      <View className='vi_tips'>{video.level} · {video.people_quntity}人学习</View>
                    </View>
                  </View>
                })
              }
            </View>
          </View>
      </View>
    )
  }
}
