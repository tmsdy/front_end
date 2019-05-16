import Taro, { Component, requirePlugin } from '@tarojs/taro'
import { View, Video,Text,Button } from '@tarojs/components'
import './connectUs.less'

export default class ConnectUs extends Component {
  config = {
    navigationBarTitleText: '联系我们'
  }
  state = {
  }
  componentWillMount () {
   }
  componentDidShow () { }
  render () {
    return (
      <View className='index'>
        联系我们
      </View>
    )
  }
}
