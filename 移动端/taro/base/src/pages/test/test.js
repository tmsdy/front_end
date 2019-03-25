import Taro, { Component, redirectTo } from '@tarojs/taro'
import { View, Text, Button ,Image} from '@tarojs/components'
import {setDate,getDate} from '../../utils/utils'
import './test.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '测试页面'
  }
  state = {
    list: [
      {id:1,num:111},
      {id:2,num:222},
      {id:3,num:333}
    ]
  }
  componentWillMount(){
    console.log(setDate,getDate)
  }
  clickHandle(){
    let name = 'hanfei'
    // redirectTo的话就是没返回了
    Taro.navigateTo({
      url: '/pages/index/index?name='+name
    })
  }

  render () {
    let {list} = this.state
    return (
      <View className='index'>
        <Text>测试页面</Text>
        {
          false?<Image className='img' src={require('../../images/pho002.jpg')}></Image>:null
        }
        <Button onClick={this.clickHandle.bind(this)}>跳转</Button>
        {
          list.map((item,index)=>{
            return <View key={item.id}>{item.id}:{item.num}</View>
          })
        }
      </View>
    )
  }
}

