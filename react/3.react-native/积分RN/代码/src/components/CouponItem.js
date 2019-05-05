/**
 * 优惠券组件
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Image,
  View,
  Text,
} from '@iqiyi/rn-ui';
import QYNewList from '@iqiyi/rn-new-list';
import WebImage from './WebImage';

const { Button } = QYNewList

const PARTNERNAME_MAP = {
  movie_ticket: '电影票',
  iqiyi_mall: '商城',
  manhua_iqiyi: '漫画',
  chongzhi: '流量充值',
  qiyue: '会员',
}

function getCorrectStatus(coupon, handleClick) {
 if (coupon.sendStatus) {
    return (
      <Button
        onPress={handleClick}
      >
        <View style={styles.coupon_button}>
          <Text style={{fontSize: 14, color: '#ffffff', backgroundColor: 'transparent'}}>立即兑换</Text>
        </View>
      </Button>
    )
  } else if (!coupon.sendStatus && coupon.num) {
    return (
      <WebImage name="get"style={{width: 45, height: 45}} />
    )
  } else if (!coupon.sendStatus && !coupon.num) {
    return (<WebImage name="stockout"style={{width: 45, height: 45}} />)
  }
}

export default function CouponItem({coupon, handleLeftClick, handleRightClick}) {
  return (
    <View style={styles.coupon_item}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleLeftClick}
        style={{flex: 1}}
      >
        <View style={styles.coupon_left}>
          <Image source={{uri: `http://pic0.iqiyipic.com/common/20180308/${coupon.partner}.jpg`}} style={styles.coupon_icon} />
          <View style={styles.coupon_desc}>
            <Text style={styles.coupon_title}>{coupon.couponName}</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.tag_wrapper}>
                <Text style={styles.coupon_tag}>{PARTNERNAME_MAP[coupon.partner]}</Text>
              </View>
              <Text style={styles.coupon_value}>{coupon.requiredIntegral}积分</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.coupon_right}>
        {
          getCorrectStatus(coupon, handleRightClick)
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  coupon_item: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E3E3E3',
  },
  coupon_left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coupon_right: {
    width: 86,
    justifyContent: 'center',
    alignItems: 'center'
  },
  coupon_icon: {
    width: 68,
    height: 60,
  },
  coupon_desc: {
    marginLeft: 10,
    marginTop: 10,
  },
  coupon_title: {
    fontSize: 16,
    color: '#333333',
  },
  coupon_value: {
    fontSize: 15,
    color: '#FD7E23',
  },
  coupon_button: {
    width: 86,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 1.5,
    borderColor: '#FF7E00',
    borderRadius: 30,
    backgroundColor: '#FF8410',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag_wrapper: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: '#FFF3E7',
    borderRadius: 30,
    marginRight: 4,
  },
  coupon_tag: {
    fontSize: 12,
    color: '#FF5000',
  }
})
