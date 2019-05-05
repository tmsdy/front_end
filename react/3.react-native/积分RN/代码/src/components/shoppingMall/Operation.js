// 运营位组件

import React from 'react'
import {StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native'
import {View, Text, Touchable} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import WebImage from '../WebImage'
import {sendClickPingback} from '../../common/pingback'

// 单个图片wrap
export const Operation = (props) => {
  const {operationList} = props
  return (
    <View style={styles.operationContain}>
      {operationList[0].length > 0 ? BigOperation(props) : null}
      {operationList[1].length > 0 ? SmallOperation(props) : null}
    </View>
  )
}
// 大运营位
const BigOperation = (props) => {
  const {openWeb, operationList} = props
  const item = operationList[0][0]
  // const {values: {platforms = ''} = {}} = item
  // seat无值则该运营位隐藏
  // if(!seat) return null
  // const showPlatform = getLimitPlatform(platforms)
  /* eslint no-param-reassign: 2 */
  item.openWeb = openWeb
  // switch (showPlatform) {
  //   case 0:
  //     return null
  //   case 2:
  //     return isIOS ? renderBigOperationItem(item) : null
  //   case 3:
  //     return !isIOS ? renderBigOperationItem(item) : null
  //   default:
  //     return renderBigOperationItem(item)
  // }
  return renderBigOperationItem(item)
}
// 大运营位view
const renderBigOperationItem = (item) => {
  const {openWeb, values: {defImg_webp: defImgWebp = '', URL = ''} = {}} = item
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        sendClickPingback('allgoods', '', 'allgoods_big_banner')
        openWeb(URL)
      }}
    >
      <View style={styles.bigOperationImage}>
        <WebImage name={defImgWebp} style={styles.bigImage} />
      </View>
    </TouchableWithoutFeedback>
  )
}
// 小运营位
const SmallOperation = (props) => {
  const {operationList, openWeb} = props
  const smallOperationList = operationList[1]
  const fourItemStyle = smallOperationList.length > 3 && styles.fourItemStyle
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} scrollEnabled={smallOperationList.length > 3}>
      {smallOperationList.map((item = {}, index) => {
        const {order} = item
        // seat无值则该运营位隐藏 产品又不要这个逻辑判断了......
        // if(!seat) return null
        // const showPlatform = getLimitPlatform(platforms)
        /* eslint no-param-reassign: 2 */
        item.newBg = getSmallOperationItemBg(order)
        item.openWeb = openWeb
        // switch (showPlatform) {
        //   case 0:
        //     return null
        //   case 2:
        //     return isIOS ? renderSmallOperationItem(item, index) : null
        //   case 3:
        //     return !isIOS ? renderSmallOperationItem(item, index) : null
        //   default:
        //     return renderSmallOperationItem(item, index)
        // }
        return renderSmallOperationItem(item, index, fourItemStyle)
      })}
    </ScrollView>
  )
}
// 小运营位单个view
const renderSmallOperationItem = (item, index, fourItemStyle) => {
  const {order, openWeb, newBg = '', values: {text = '', defImg_webp: defImgWebp = '', URL = '', key = ''} = {}} = item
  return (
    <Touchable
      key={order}
      onPress={() => {
        sendClickPingback('allgoods', '', `allgoods_small_${index + 1}banner`)
        openWeb(URL)
      }}
    >
      <View style={[styles.smallOperationItem, {backgroundColor: newBg}, fourItemStyle]}>
        <Text style={styles.key}>{key}</Text>
        <Text style={styles.text}>{text}</Text>
        <WebImage style={styles.smallImage} name={defImgWebp} />
      </View>
    </Touchable>
  )
}
/**
 * @description: 资源位展示平台
 * @param {string}
 * @return: {number}
 * @{0} 不需要展示
 * @{1} ios和android都要展示
 * @{2}  ios展示
 * @{3}  android展示
 */
// const getLimitPlatform = (platforms) => {
//   if(!platforms) return 1
//   const formatPlatForms = platforms.toLocaleLowerCase()
//   const isIOSPlatform = formatPlatForms.includes('ios')
//   const isAndroidPlatform = formatPlatForms.includes('android')
//   if(isIOSPlatform && isAndroidPlatform) return 1
//   if(isIOSPlatform) return 2
//   if(isAndroidPlatform) return 3
// }
/**
 * @description: 获取每个item的背景色
 * @param {number}
 * @return: {string}
 */
const getSmallOperationItemBg = (order) => {
  const colorMap = {
    0: '#EEF7FE',
    1: '#FDFAE9',
    2: '#FEF4F3'
  }
  if(order % 3 === 1) return colorMap[1]
  if(order % 3 === 2) return colorMap[2]
  if(order % 3 === 0) return colorMap[0]
  return ''
}
const styles = StyleSheet.create({
  operationContain: {
    paddingTop: 6.5,
    paddingLeft: 13,
    marginBottom: 15,
  },
  bigOperationImage: {
    marginTop: 5,
    marginBottom: 6.5,
    width: Width - 26,
    height: (Width - 26) * .38682,
    borderRadius: 10,
    overflow: 'hidden'
  },
  bigImage: {
    width: Width - 26,
    height: 135
  },
  smallOperationItem: {
    width: 111,
    height: 74.5,
    marginRight: 7.5,
    paddingTop: 6,
    paddingLeft: 6,
    position: 'relative',
    borderRadius: 5
  },
  fourItemStyle: {
    width: 106,
    height: 71,
  },
  key: {
    fontSize: 14,
    color: '#322D1D'
  },
  text: {
    fontSize: 10,
    color: '#999999'
  },
  smallImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 127 / 2,
    height: 97 / 2
  }
})
