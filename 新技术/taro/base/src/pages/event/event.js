import Taro, { Component, redirectTo } from '@tarojs/taro'
import { View, Text,Button,Image} from '@tarojs/components'

const isH5 = process.env.TARO_ENV == 'h5'
// isH5 ? require('./h5.less') : require('./weapp.less')
export default class Event extends Component {
  state = {
    name: '张三'
  }
  componentWillMount(){
    console.log(env) //h5
  }
  testEvent(name,e){
    console.log(arguments)
    e.stopPropagation()
  }

  render () {
    return (
      <View className='index'>
        <Button onClick={this.testEvent.bind(this,'fangfang')}>测试事件</Button>
      </View>
    )
  }
}

