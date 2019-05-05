import React, {Component} from 'react'
import {
  StyleSheet
} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import {
  isLikeX,
  isIOS
} from '@iqiyi/rn-utils'
import px2dp from '../../common/px2dp'

const POSITION_TOP = isLikeX() ? 83 : 53
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visiable: false
    }
  }

  render() {
    const {visiable} = this.state
    if(!visiable) return null
    return (
      <View style={styles.content}>
        <View style={styles.icon}/>
        <View style={styles.title}>
          <Text style={styles.titleText}>戳这里可以分享你的脑洞呦~</Text>
        </View>
      </View>
    )
  }

  showTips = (visiable) => {
    // 防止重复点击
    if(this.state.visiable) return false
    this.setState({visiable}, () => {
      setTimeout(() => {
        this.setState({visiable: false})
      }, 3000)
    })
  }
}

const styles = StyleSheet.create({
  content: {
    // width: px2dp(187),
    // paddingHorizontal: px2dp(14),
    height: px2dp(36 + 7),
    position: 'absolute',
    right: px2dp(5),
    top: px2dp(isIOS ? POSITION_TOP : 41),
    alignItems: 'flex-end'
  },
  titleText: {
    color: '#fff',
    fontSize: px2dp(13)
  },
  title: {
    paddingHorizontal: px2dp(14),
    height: px2dp(36),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: px2dp(50),
    marginTop: isIOS ? 0 : -1
  },
  icon: {
    width: px2dp(13.5),
    marginRight: px2dp(16.5),
    borderWidth: px2dp(7),
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#000',
    borderRightColor: 'transparent',
  }
})
