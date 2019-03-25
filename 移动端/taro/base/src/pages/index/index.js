import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import Child from './child'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  state = {
    name : '',
    obj: undefined
  }

  componentWillMount () {
    // console.log('componentWillMount')
    let {name} = this.$router.params
    console.log(name)
    this.setState({
      name
    })
   }

  componentDidMount () {
    // console.log('componentDidMount')
    this.setState({
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
     this.setState({
      name: 'fangfang3',
      obj: [{name:'aaa3',age:33}]
    })
   }
  render () {
    // console.log('render')
    let {name,obj} = this.state
    return (
      <View className='index'>
        <Child name={name} obj={obj} onChange={this.change.bind(this)} />
      </View>
    )
  }
}

