// 推荐好物列表组件

import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {filterPic} from '../../common/util'
import DefaultImage from '../home/DefaultImage'

const itemWidth = (Width - 42) / 2
const itemHeight = itemWidth * 0.83

// 单个图片wrap
export const RecommondItem = (props) => {
  const {item} = props
  const {itemId, name, credits, score, photoList, remain, infinity} = item
  const picMap = filterPic(photoList)
  const uri = picMap.movepic || picMap.smallpic || picMap.largepic || 'http://www.iqiyipic.com/common/fix/h5-aura/iqiyi-logo.png'
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.goDetail(name, itemId)
      }}
    >
      <View style={{width: itemWidth, marginBottom: 9}}>
        <View style={styles.item}>
          <DefaultImage
            source={uri}
            style={{width: 119, height: 119, opacity: infinity === 0 && remain <= 0 ? 0.5 : 1}}
            errorImageStyle={{
              height: 119,
              width: 119
            }}
          />
          {infinity === 0 && remain <= 0 && (
            <View style={styles.solded}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10
                }}
              >
                已兑完
              </Text>
            </View>
          )}
          {!!name && (
            <View style={[styles.tagContent, {backgroundColor: item.productTagColor}]}>
              <Text style={{color: '#fff', fontSize: 10}}>{name}</Text>
            </View>
          )}
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {name}
        </Text>
        <View style={styles.priceBox}>
          <Text style={{color: '#ff6600', fontSize: 12}}>{credits || score}积分</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  titleContent: {
    flex: 1,
    borderTopColor: '#EEE',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFF',
    height: 50,
    marginTop: 15
  },
  titleText: {
    lineHeight: 50,
    fontSize: 16,
    color: '#333',
    marginLeft: 20,
    fontWeight: 'bold'
  },
  content: {
    width: Width,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    paddingBottom: 23
  },
  item: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 4,
    backgroundColor: '#fbfbfb',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#333',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 7.2
  },
  priceBox: {
    height: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tagContent: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    borderRadius: 2.5,
    height: 19,
    paddingHorizontal: 3.5,
    justifyContent: 'center'
  },
  solded: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: (itemHeight - 45) / 2,
    left: (itemWidth - 45) / 2,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
