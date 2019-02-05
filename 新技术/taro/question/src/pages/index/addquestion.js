import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import Dialog from './dialog/dialog'

export default class AddQuestion extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  render () {
    return (
      <View>
        <Dialog>
          <View className='add-question'>
            1111
          </View>
        </Dialog>

      </View>

    )
  }
}

