import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '精选视频'
  }

  componentWillMount () { }
  componentDidShow () { }

  render () {
    return (
      <View className='index'>
        <Text>精选视频</Text>
      </View>
    )
  }
}

