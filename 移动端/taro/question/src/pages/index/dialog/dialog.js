import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './dialog.less'

export default class Dialog extends Component {

  config = {
    navigationBarTitleText: 'dialog'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    return (
      <View className='dialog'>
        {this.props.children}
      </View>
    )
  }
}

