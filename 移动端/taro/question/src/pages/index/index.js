import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import AddQuestion from './addquestion'
import AddQuestion from './addquestion'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentDidHide () { }
  addQuestion(){

  }
  render () {
    return (
      <View className='index'>
        <View className='title'>Taro 问答实例</View>
        <AddQuestion></AddQuestion>
        <Button onClick={this.addQuestion.bind(this)} className='btn-question'>按钮</Button>
      </View>
    )
  }
}

