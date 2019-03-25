import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './index.less'
import {videoList} from '../../videoList'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '精选视频'
  }
  state = {
    videoList: []
  }
  componentWillMount () {
    console.log(videoList)
    this.setState({videoList})
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
                      // mode="scaleToFill"
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

