/**
 * Created by liuzhimeng.
 * @date 2018-12-14
 * @description 乐园公告
 */
import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import Swiper from '@iqiyi/rn-swiper-new'
import {Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import WebImage from '../WebImage'
import {CONTENT_PADDING_HORIZONTAL} from './constants'

const NoticeText = ({children}) => (
  <View style={styles.textWrapper}>
    <Text style={styles.text} numberOfLines={1}>{children}</Text>
  </View>
)

export default function Announcement({list}) {
  return (
    <View style={styles.container}>
      <View style={styles.disabled}/>
      <View style={styles.wrapper}>
        <WebImage name="985_paradise_gonggao" style={styles.icon}/>
        <View style={{flex: 1}}>
          <Swiper
            loop={true}
            autoplay={true}
            height={CONTAINER_HEIGHT}
            removeClippedSubviews={false}
            showsPagination={false}
            horizontal={false}
          >
            {list.map(item => <NoticeText key={item}>{item}</NoticeText>)}
          </Swiper>
        </View>
        <View style={styles.transparentBg}/>
      </View>
    </View>
  )
}
Announcement.propTypes = {
  list: PropTypes.array,
}
Announcement.defaultProps = {
  list: [],
}

const CONTAINER_HEIGHT = 30
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: CONTAINER_HEIGHT,
    marginBottom: 15,
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
  },
  disabled: {
    position: 'absolute',
    top: 0,
    left: CONTENT_PADDING_HORIZONTAL,
    width: DEVICE_WIDTH - CONTENT_PADDING_HORIZONTAL * 2,
    height: CONTAINER_HEIGHT,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: CONTAINER_HEIGHT,
    paddingLeft: 12,
    borderRadius: 2.5,
    backgroundColor: '#F8F7F7',
  },
  transparentBg: {
    width: 346,
    height: CONTAINER_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 47,
    height: 11,
  },
  textWrapper: {
    justifyContent: 'space-between',
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 10,
  },
  text: {
    height: CONTAINER_HEIGHT,
    lineHeight: CONTAINER_HEIGHT,
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PingFangSC-Regular',
  },
})
