/*
  积分乐园头部banner图
*/
import React from 'react'
import {StyleSheet, TouchableHighlight} from 'react-native'
import PropTypes from 'prop-types'
import {Image, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {TOUCH_NONE} from '../../constants/touchableStyle'
import {CONTENT_PADDING_HORIZONTAL} from './constants'
import {sendClickPingback} from '../../common/pingback'
import {getBannerBlockPingback, PARK_PAGE} from './pingback'
import {formatExts, goToLogin} from '../../common/util'

const onBannerPress = (item, index, {isLogin, goTo, openWeb}) => {
  sendClickPingback(PARK_PAGE, '', getBannerBlockPingback(index + 1))
  const {clickEvent, isNeedLogin, URL} = formatExts(item.key_value_pair)
  if(isNeedLogin === 1 && !isLogin) {
    return goToLogin()
  }
  if(clickEvent === 'goods') {
    return goTo('ShoppingMall')
  }
  if(clickEvent === 'topicpk') {
    return goTo('TopicPk')
  }
  if(clickEvent === 'H5') {
    return openWeb(URL)
  }
}

export default function FocusMap({list, isLogin, totalScore, goTo, openWeb}) {
  return (
    !!list.length && (
      <View style={styles.container}>
        {list.slice(0, 2)
          .map((item, index) => (
            <TouchableHighlight
              {...TOUCH_NONE}
              key={item.order}
              style={styles.bannerItem}
              onPress={() => onBannerPress(item, index, {isLogin, totalScore, goTo, openWeb})}
            >
              <Image source={{uri: item.thumbnail_url}} style={styles.bannerImage}/>
            </TouchableHighlight>
          ))}
      </View>
    )
  )
}
FocusMap.propTypes = {
  list: PropTypes.array,
  onPress: PropTypes.func,
}
FocusMap.defaultProps = {
  list: [],
  onPress: () => null,
}

const IMAGE_WIDTH = (DEVICE_WIDTH - CONTENT_PADDING_HORIZONTAL * 2 - 7) / 2
const IMAGE_HEIGHT = (IMAGE_WIDTH / 171) * 65
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    marginBottom: 15,
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
  },
  bannerItem: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bannerImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
})
