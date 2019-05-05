/**
 * Created by liuzhimeng.
 * @date 2018/8/29
 * @description
 */

import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  View,
  Text,
  Image,
} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';

const CouponImage = props => {
  const {
    price,
    unit,
    name,
    imgUri,
    ...attrs
  } = props

  return (
    <WebImage name="coupon-bg" style={styles.wrapper} {...attrs} >
      <View style={styles.leftWrapper}>
        <View style={styles.priceWrapper}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        <View style={styles.nameWrapper}>
          <View style={styles.nameLine}></View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.nameLine}></View>
        </View>
      </View>
      <Image source={{uri: imgUri}} style={styles.image} resizeMode="contain"/>
    </WebImage>
  )
}

CouponImage.defaultProps = {
  price: 0,
  unit: '元',
  name: '优惠券',
}

export default CouponImage

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 265,
    height: 130,
    paddingHorizontal: 15,
    paddingRight: 30,
  },
  leftWrapper: {
    flex: 1,
  },
  priceWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  price: {
    height: 40,
    lineHeight: 40,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF375C',
  },
  unit: {
    height: 30,
    lineHeight: 30,
    fontSize: 12,
    color: '#FF375C',
  },
  nameWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  nameLine: {
    marginVertical: 8,
    width: 18,
    height: 1,
    backgroundColor: '#FF375C',
    opacity: .8,
    borderRadius: 4,
  },
  name: {
    height: 17,
    lineHeight: 17,
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#FF375C',
  },
  image: {
    width: 100,
    height: 100
  },
})
