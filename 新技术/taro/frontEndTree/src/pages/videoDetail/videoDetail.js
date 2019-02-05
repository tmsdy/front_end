import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import './videoDetail.less'

export default class VideoDetail extends Component {

  config = {
    navigationBarTitleText: '视频详情'
  }
  state = {
  }
  componentWillMount () {
    console.log(this.$router.params)
  }

  componentDidMount () { }
  render () {
    return (
      <View className='videoDetail'>
        videoDetail
      </View>
    )
  }
}

