import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '精选视频'
  }
  state = {
    videoList: [
      {
        v_id: 1 ,
        v_src: ''
      },
      {
        v_id: 2 ,
        v_src: ''
      }
    ]
  }
  componentWillMount () { }
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
                      src={require('../../assets/images/react.jpg')}
                      // mode="scaleToFill"
                      ></Image>
                    <View className='vi_right'>
                      <View className='vi_title'>React教学视频</View>
                      <View className='vi_details'>本课程主要针对有一定xxx基础，并想要深入的了解xxx的同学，课程中有基础的语法讲解和实际项目中的常用案例展示，帮助大家快速的掌握xxx技术</View>
                      <View className='vi_tips'>中级 · 1218人学习</View>
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

