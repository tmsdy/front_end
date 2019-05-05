/**
 * 道具后台、兑吧生活精选商品
 * @author lzj
 */

import React, { Component } from 'react'
import {
  TouchableHighlight,
  StyleSheet,
} from 'react-native'
import {
  View,
  Image,
  Text,
} from '@iqiyi/rn-ui'
import {
  lessText,
  filterPic,
} from '../common/util'
import WebImage from '../components/WebImage'
import {TOUCH_COLORFUL_MASK} from '../constants/touchableStyle';

export default class extends Component {

  handleItemClick = () => {
    const {
      item,
      index,
      handleClick
    } = this.props

    handleClick(item, index)
  }

  render() {
    const { item } = this.props
    const picMap = filterPic(item.photoList)
    const imgUri = picMap.movepic || picMap.smallpic
    return (
      <TouchableHighlight
        {...TOUCH_COLORFUL_MASK}
        onPress={this.handleItemClick}
        style={{borderRadius: 6, height: 80, marginRight: 8}}
      >
        <WebImage name="bg_card" style={styles.hotBox}>
          <View style={styles.imageWrapper}>
            <Image source={{uri: imgUri}} style={styles.smallPic} />
          </View>
          <View style={{marginLeft: 10, width: 84}}>
            <Text style={[styles.text, {color: '#333', fontSize: 14}]} numberOfLines={1}>{item.title || item.name}</Text>
            <Text style={[styles.text, {color: '#FF6600', fontSize: 12, marginTop: 5}]}>
              {item.credits || item.score}积分{item.price ? `+${item.price / 100}元` : '' }
            </Text>
          </View>
        </WebImage>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  hotBox: {
    width: 170,
    height: 80,
    backgroundColor: '#FFF9F0',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  imageWrapper: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  smallPic: {
    width: 55,
    height: 55,
  },
  text: {
    backgroundColor: 'transparent',
  }
})
