/**
 * 蜜蜂优惠券Modal
 */
import React, {PureComponent} from 'react'

import {Image, Text, View} from '@iqiyi/rn-ui'
import WebImage from '../../WebImage'
import CommonButton from '../../CommonButton'

export default class CouponModal extends PureComponent {
  render() {
    const {itemName, itemImg = ''} = this.props.rewardInfo
    return (
      <View style={styles.container}>
        <WebImage name="flower/coupon-bg-pink" style={styles.couponBg}/>
        <View style={styles.titleWrapper}>
          <WebImage name="flower/coupon-title" style={styles.couponTitle}/>
        </View>
        <View style={styles.imageWrapper}>
          <WebImage name={itemImg} style={styles.couponImage}/>
        </View>
        <Text numberOfLines={2} style={styles.prodTitle}>{itemName}</Text>
        <CommonButton
          mode="pure"
          width={120}
          pureColor="#FF8A1F"
          containerStyle={{position: 'absolute', bottom: 20, left: 70}}
          buttonWrapperStyle={{flexDirection: 'row'}}
          onPress={this.goToMyRecord}
        >
          <Text style={styles.btnText}>去查看</Text>
          <Image source={{uri: 'integral_bee_coupon_arrow'}} style={styles.arrowPic}/>
        </CommonButton>
      </View>
    )
  }

  goToMyRecord = () => {
    this.props.hide().then(() => {
      this.props.gotoOrderList()
    })
  }
}
const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    width: 260,
    height: 315,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  couponBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 260,
    height: 230,
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    top: 22,
    alignItems: 'center',
    width: 260,
  },
  couponTitle: {
    width: 114,
    height: 30,
  },
  imageWrapper: {
    position: 'absolute',
    left: 0,
    top: 70,
    alignItems: 'center',
    width: 260,
  },
  couponImage: {
    width: 208,
    height: 102,
  },
  prodTitle: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    textAlign: 'center',
    color: '#333333',
    fontSize: 14,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 40,
  },
  arrowPic: {
    width: 10,
    height: 10,
    marginLeft: 3
  },
})
