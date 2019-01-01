import Taro, { Component } from '@tarojs/taro'
import { View, Text , Button} from '@tarojs/components'
// import Demo from './Child'//竟然名字不一致没报错
import Child from './Child'
import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () {
    this.setState({
      name : 'feifei'
    })
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  click(){
    //1.state数值更新是异步的，react里的有可能异步有可能同步
    //2.setState第二个参数callback里面能拿到异步操作后数据结果
    this.setState({
      name : 'fangfang',
      age: 15
    },()=>{
      console.log(this.state.name)
    })
  }
  changeAge(){
    console.log(123)
    // this.setState({age})
  }

  render () {
    return (
      <View className='index'>
        <Child age={this.state.age} onchangeAge={this.changeAge.bind(this)} />
        <Button onClick={this.click}>点击改变名字</Button>
        <Text>{this.state.name}</Text>
      </View>
    )
  }
}

