import Taro, { Component, redirectTo } from '@tarojs/taro'
import { View, Text,Button,Image} from '@tarojs/components'

export default class Dialog extends Component {

  render () {
    return (
      <View className='index'>
        我是弹窗组件
        {this.props.myImg}
        {
          this.props.children
        }
      </View>
    )
  }
}

