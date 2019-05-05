/**
 * Created by liuzhimeng.
 * @date 2018/10/22
 * @description 勋章页顶部组件片段
 */
import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Image, Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import WebImage from '../../WebImage'
import {TEXT_COLOR_DEFAULT, TEXT_COLOR_TIPS} from '../src/constants'
import {TOUCH_NONE} from '../../../constants/touchableStyle'
import {MEDAL_COUNT_WIDTH, TOP_CONTAINER_HEIGHT, USER_PROTRAIT_SIZE} from './constants'

// 顶部背景容器组件
export const Background = ({children}) => (
  <WebImage style={styles.bgContainer} name="integralmedal/top_all_bg">
    {children}
  </WebImage>
)

// 勋章数量展示组件
export const MedalCount = ({count, text, medalRankInfo = {}}) => {
  return (
    <View style={styles.medalContainer}>
      <Text style={styles.medalCount}>{count}</Text>
      <Text style={styles.medalText}>{text}</Text>
      {
        medalRankInfo.hasGeo ? renderMedalRank(medalRankInfo) : null
      }
    </View>
  )
}
MedalCount.propTypes = {
  count: PropTypes.number,
  text: PropTypes.string,
}
MedalCount.defaultProps = {
  count: 0,
  text: '已获勋章',
}
function renderMedalRank({province, city, rank} = {}) {
  const region = getRegion(province, city)
  return (
    <View style={styles.medalRank}>
      <WebImage style={styles.rankImg} name="medal_rank" />
      <Text style={styles.rankText}>{region}排名：前{rank}</Text>
    </View>
  )
}
function getRegion(province, city) {
    const citys = ['北京', '上海', '天津', '深圳']
    if(citys.includes(city)) return city
    return `${province}${city}`
}
// 用户信息展示组件
export const UserInfo = ({protrait, name, renderMedal}) => {
  return (
    <View style={styles.userContainer}>
      <View style={styles.protraitWrapper}>
        <Image style={styles.userProtrait} source={{uri: protrait}}/>
      </View>
      <View style={styles.userInfo}>
        <Text numberOfLines={1} style={styles.userName}>{name}</Text>
        <View>{renderMedal}</View>
      </View>
    </View>
  )
}
UserInfo.propTypes = {
  protrait: PropTypes.string,
  name: PropTypes.string,
  renderMedal: PropTypes.node,
}

// 未解锁提示组件
export const UnlockTips = ({isVisible, style, onPress}) => {
  return isVisible && (
    <WebImage style={StyleSheet.flatten([styles.unlockTips, style])} name="integralmedal/lock_tips">
      <Text style={styles.unlockTipText}>暂无可佩戴的勋章，快去获取吧～</Text>
      <TouchableOpacity {...TOUCH_NONE} style={styles.unlockClose} onPress={onPress}>
        <WebImage style={{flex: 1}} name="integralmedal/unlock_close"/>
      </TouchableOpacity>
    </WebImage>
  )
}
UnlockTips.propTypes = {
  isVisible: PropTypes.bool,
}
UnlockTips.defaultProps = {
  isVisible: false,
}

const styles = StyleSheet.create({
  // 勋章顶部容器
  bgContainer: {
    width: DEVICE_WIDTH,
    height: TOP_CONTAINER_HEIGHT,
    backgroundColor: '#ffffff',
  },

  // 勋章数量
  medalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: MEDAL_COUNT_WIDTH,
  },
  medalCount: {
    lineHeight: MEDAL_COUNT_WIDTH,
    color: TEXT_COLOR_DEFAULT,
    fontFamily: 'DINAlternate-Bold',
    fontWeight: 'bold',
    fontSize: 50,
  },
  medalText: {
    marginTop: 3,
    lineHeight: 20,
    color: TEXT_COLOR_TIPS,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // 用户信息展示组件
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protraitWrapper: {
    width: USER_PROTRAIT_SIZE,
    height: USER_PROTRAIT_SIZE,
    borderRadius: USER_PROTRAIT_SIZE / 2,
    overflow: 'hidden',
  },
  userProtrait: {
    width: USER_PROTRAIT_SIZE,
    height: USER_PROTRAIT_SIZE,
  },
  userInfo: {
    paddingLeft: 15,
  },
  userName: {
    maxWidth: 112,
    marginBottom: 7.5,
    lineHeight: 22.5,
    color: TEXT_COLOR_DEFAULT,
    fontFamily: 'PingFang-SC-Regular',
    fontSize: 16,
    fontWeight: 'bold',
  },

  unlockTips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 349,
    height: 67,
    paddingLeft: 21,
    paddingRight: 11,
    paddingTop: 11,
  },
  unlockTipText: {
    paddingLeft: 19,
    textAlign: 'left',
    fontSize: 14,
    color: '#ffffff',
  },
  unlockClose: {
    width: 42,
    height: 42,
  },
  medalRank: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  rankImg: {
    width: 8,
    height: 9,
  },
  rankText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#666666',
    // marginTop: 7
  }
})
