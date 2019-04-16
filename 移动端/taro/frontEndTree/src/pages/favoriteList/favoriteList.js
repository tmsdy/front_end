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
      },
      {
        id: 2 ,
        src: 'https://10.url.cn/qqcourse_logo_ng/ajNVdqHZLLBylP9zaaXkALowoB1XVr6mwIc0ia52chSdLnyF0ltmVL3qunJcViclOHx3nsshGKEVM/356',
        title: 'ES6_Javascript_最全最新讲解',
        introduction:'本视频详细讲解了ES6语言的核心知识并通过练习理解其作用，适合有JS基础的同学，快速进入ES6核心应用的大门',
        level: '初级',
        people_quntity: 1123,
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
