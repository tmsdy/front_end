import Taro, { Component, redirectTo } from '@tarojs/taro'
import { View, Text,Button,Image} from '@tarojs/components'
import Dialog from './dialog'

export default class TestDialog extends Component {

  render () {
    return (
      <View className='index'>
        <Dialog>
          <Text>我是Text传入</Text>
        </Dialog>
        <Dialog myImg={<Image src={require('../../images/pho002.jpg')}></Image>}>
          <Image src={require('../../images/pho002.jpg')}></Image>
        </Dialog>
        <Dialog>
          <Button>我是Button</Button>
        </Dialog>
      </View>
    )
  }
}

