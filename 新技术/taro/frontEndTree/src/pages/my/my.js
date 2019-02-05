import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import './my.less'

export default class My extends Component {

  config = {
    navigationBarTitleText: '我的'
  }
  state = {
    avatarUrl:'./user-unlogin.png',
    userInfo: {
      nickName: '点击授权信息'
    }
  }
  componentWillMount () { }

  componentDidMount () { }
  getUserInfo(e){
    // console.log(e)
    let userInfo = e.detail.userInfo
    this.setState({
      avatarUrl: userInfo.avatarUrl,
      userInfo
    })
  }
  render () {
    let {avatarUrl,userInfo} = this.state
    return (
      <View className='m_wapper'>
        <Button
          className='userinfo'
          openType='getUserInfo'
          onGetUserInfo={this.getUserInfo}
        >
          <View className='userinfo-avatar' style={{backgroundImage: `url(${avatarUrl})`}}></View>
          <Text className='userinfo-nickname'>{userInfo.nickName}</Text>
        </Button>
      </View>
    )
  }
}

