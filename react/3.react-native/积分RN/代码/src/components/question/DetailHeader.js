import React, {PureComponent} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  Width,
  isLikeX,
  isIOS
} from '@iqiyi/rn-utils'
import NavBar from '../DefaultNavBar'
import WebImage from '../WebImage'

const isIphoneX = isLikeX()
const getNavHeight = () => {
  if(isIphoneX) return 95
  if(isIOS) return 65
  return 46
}
const HeaderHeight = getNavHeight()

export default class extends PureComponent {
  render() {
    const {pressBack, questionTitle} = this.props
    return (
      <React.Fragment>
        <View style={[styles.hideHeader]} >
          <View
            style={[{flex: 1, opacity: 0, backgroundColor: '#fff', width: Width, height: HeaderHeight + 2}, isIOS ? styles.iosBottomLine : styles.bottomLine]}
            ref={(detailHeader) => { this.detailHeader = detailHeader }}
          >
            <NavBar
              title={questionTitle}
              type="black"
              titleColor="#333333"
              backgroundColor="#ffffff"
              backPress={pressBack}
            />
          </View>
          <TouchableOpacity activeOpacity={1} onPress={pressBack} style={styles.leftBack}>
            <WebImage style={styles.leftBackIcon} name="back"/>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    )
  }
  setHeaderTop = (top = 0) => {
    // marginTop 介于 0 和 -44 之间
    const scrollValue = top > 0 ? top : 0
    // this.detailHeader.setNativeProps({
    //   marginTop: Math.min(scrollValue, 44) * -1
    // })
    if(scrollValue >= 44) {
      this.detailHeader.setNativeProps({
        opacity: 1
      })
      // this.bottomLine.setNativeProps({
      //   height: 1
      // })
    } else {
      this.detailHeader.setNativeProps({
        opacity: 0
      })
      // this.bottomLine.setNativeProps({
      //   height: 0
      // })
    }
  }
}

const styles = StyleSheet.create({
  hideHeader: {
    height: HeaderHeight + 1,
    width: Width,
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
    left: 0,
    // opacity: 0
    // overflow: 'hidden',
    // paddingTop: isIphoneX ? 50 : (isIOS ? 20 : 0),
  },
  bottomLine: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 2,
  },
  iosBottomLine: {
    shadowColor: 'rgb(153,153,153)',
    shadowOffset: {h: 10, w: 10},
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
  leftBack: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 40,
    height: 44,
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  leftBackIcon: {
    width: 28,
    height: 28,
  },
})
