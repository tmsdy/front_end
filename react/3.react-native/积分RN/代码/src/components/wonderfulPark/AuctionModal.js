/**
 * Created by kerwinliu on 2018/8/13.
 */
import React from 'react'
import {View, Text} from '@iqiyi/rn-ui'
import {StyleSheet, TouchableWithoutFeedback} from 'react-native'
import LinearGradient from '@iqiyi/rn-gradient-view'
import WebImage from '../WebImage'
import ConfirmModal from '../ConfirmModal'
import ModalCommonStyle from '../../constants/modalCommonStyle'

export default function AuctionModal({isVisible, data, hideModal, open}) {
  return (
    <ConfirmModal modalVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{fontSize: 16, color: '#333'}}>抢拍成功</Text>
          <View style={styles.detail}>
            <Text style={{color: '#666666', fontSize: 14, marginVertical: 1}}>
              恭喜你花<Text style={{color: '#151515'}}> {data.cost || 0} </Text>积分
            </Text>
            <Text style={{color: '#666666', fontSize: 14, marginVertical: 1}}>拍得{data.productName || 'VIP天卡'},已发放至账户</Text>
          </View>
          <TouchableWithoutFeedback onPress={open}>
            <View style={[styles.button, {borderRadius: 50, marginTop: 15}]}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                colors={['#FF2C97', '#FF724D']}
                style={styles.button}
              >
                <Text style={{fontSize: 16, color: '#ffffff'}}>立即使用</Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <WebImage name="985_qiangpai" style={styles.icon}/>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={[ModalCommonStyle.closeButton, {marginTop: 20}]}>
            <WebImage name="closeBtn" style={{width: 40, height: 40}}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ConfirmModal>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 62.5,
  },
  box: {
    width: 270,
    height: 220,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingTop: 48.5,
    alignItems: 'center'
  },
  icon: {
    width: 175,
    height: 100,
    top: 0,
    left: 47.5,
    position: 'absolute'
  },
  detail: {
    width: 222.5,
    height: 63.5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 236,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
