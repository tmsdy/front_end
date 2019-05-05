/**
 * Created by kerwinliu.
 * @date 2019-04-01
 * @description 新版提现弹框图片背景
 */
import React, {PureComponent} from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import WebImage from '../../WebImage'

// 底部图片按钮
export const WebImageButton = ({buttonStyle, buttonImage, onPress = null}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.footerButton, buttonStyle]}
      onPress={onPress}
    >
      <WebImage name={buttonImage} style={styles.buttonImage}/>
    </TouchableOpacity>
  )
}

// 图文弹框
export class ImageBox extends PureComponent {
  render() {
    const {
      containerImage,
      containerStyle = {},
      containerText,
      priceValue,
      onPress,
      buttonImage,
      buttonStyle,
      children = null
    } = this.props
    return (
      <WebImage style={[styles.totalRewardrBg, containerStyle]} name={containerImage}>
        <Text style={styles.totalTitle}>{containerText}</Text>
        <View style={styles.totalValueOut}>
          <Text style={styles.totalValue}>{priceValue}</Text>
          <Text style={styles.totalValueText}>元</Text>
        </View>
        {
          WebImageButton({buttonStyle, buttonImage, onPress})
        }
        {children}
      </WebImage>
    )
  }
}


const CONTAINER_WIDTH = 300
// const REWARD_RATIO = 0.428 // UI 稿和 弹框宽度的比例
const styles = BaseStyleSheet.create({
  totalRewardrBg: {
    width: CONTAINER_WIDTH,
    height: 316,
    alignItems: 'center',
    paddingTop: 141,
  },
  totalTitle: {
    fontSize: 10,
    color: '#FF5654',
    lineHeight: 14
  },
  totalValue: {
    fontWeight: BaseStyleSheet.FontWeight.bold,
    fontSize: 35,
    fontFamily: 'PingFangSC-Semibold',
    color: '#FF5654',
    textAlignVertical: 'bottom'
  },
  totalValueText: {
    fontWeight: BaseStyleSheet.FontWeight.bold,
    color: '#FF5654',
    fontSize: 13,
    lineHeight: 30,
    position: 'absolute',
    right: -15
  },
  totalValueOut: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 45
  },
  footerButton: {
    width: 155,
    height: 60,
    position: 'absolute',
    bottom: 23.5
  },
  buttonImage: {
    width: 155,
    height: 60,
  }
})
