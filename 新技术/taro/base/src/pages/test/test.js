import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '测试页面'
  }
  state = {
  }


  render () {

    return (
      <View className='index'>
        <Text>测试页面</Text>
      </View>
    )
  }
}

