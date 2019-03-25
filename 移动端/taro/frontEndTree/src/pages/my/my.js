import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import './my.less'

export default class My extends Component {

  config = {
    navigationBarTitleText: '我的'
  }
  state = {

    userInfo: {
      avatarUrl:'http://rookiefeifei.top/frontEndTree/user-unlogin.png',
      nickName: '点击授权信息'
    }
  }
  componentWillMount () {
    let userInfo = Taro.getStorageSync('userInfo')
    if(userInfo){
      this.setState({
        userInfo
      })
    }
  }
  componentDidMount () { }
  getUserInfo(e){
    let userInfo = e.detail.userInfo
    // console.log()
    this.setState({
      avatarUrl: userInfo.avatarUrl,
      userInfo
    })
    Taro.setStorageSync('userInfo',userInfo)
  }
  render () {
    let {userInfo} = this.state
    return (
      <View className='m_wapper'>
        <Button
          className='userinfo'
          openType='getUserInfo'
          onGetUserInfo={this.getUserInfo}
        >
          <View className='userinfo-avatar' style={{backgroundImage: `url(${userInfo.avatarUrl})`}}></View>
          <Text className='userinfo-nickname'>{userInfo.nickName}</Text>
        </Button>
        <View className="my_menu">
          <View className="menu_item">
            收藏列表
          </View>
          <View className="menu_item">
            设置
          </View>
          <View className="menu_item">
            联系我们
          </View>
        </View>
      </View>
    )
  }
}

