import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import Child from './child'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  state = {
    name : 'feifei',
    obj: undefined
  }

  componentWillMount () {
    // console.log('componentWillMount')
   }

  componentDidMount () {
    // console.log('componentDidMount')
    this.setState({
      name: 'fangfang',
      obj: [{name:'aaa',age:22}]
    })
  }
  componentWillUnmount () { }

  componentDidShow () {
    // console.log('componentDidShow')
   }

  componentDidHide () { }
   change(){
     console.log('父组件的change')
   }
  render () {
    // console.log('render')
    let {name,obj} = this.state
    return (
      <View className='index'>
        <Child name={name} obj={obj} onChange={this.change} />
      </View>
    )
  }
}

