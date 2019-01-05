import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import Head from '../../components/head/head'
import Todo from '../../components/todo/todo'
import Footer from '../../components/footer/footer'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  render () {
    return (
      <View className='app'>
        <View className='cover'></View>
        <Head></Head>
        <Todo></Todo>
        <Footer></Footer>
      </View>
    )
  }
}

