/**
 * 首页加载等候弹窗
 */
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, ActivityIndicator } from '@iqiyi/rn-ui'
import ConfirmModal from '../components/ConfirmModal'

export default class extends Component {
  render() {
    const { loadingModalVisible } = this.props
    return (
      <ConfirmModal
        modalVisible={loadingModalVisible}
        cancelFn={null}
      >
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#0BBE06" text="正在领取..."/>
        </View>
      </ConfirmModal>
    )
  }
}

const styles = StyleSheet.create({
  loadingBox: {
    width: 200,
    height: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
