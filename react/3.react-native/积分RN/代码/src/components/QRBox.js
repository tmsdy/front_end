/**
 * 关注微信公众号任务弹窗
 */
import React, {Component} from 'react'
import {CameraRoll, StyleSheet, TouchableOpacity} from 'react-native'
import {View, Text, Image} from '@iqiyi/rn-ui'
import {takeSnapshot} from '@iqiyi/rn-view-shot'
import ConfirmModal from './ConfirmModal'
import {showToast} from '../common/QYNativeBridge'
import {getQRCode} from '../api/index'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrModalVisible: false,
      qrcodeUrl: ''
    }
  }
  render() {
    const {qrModalVisible, qrcodeUrl} = this.state
    if(!qrModalVisible) return null
    return (
      <ConfirmModal
        modalVisible={qrModalVisible}
        showCloseButton={true}
        cancelFn={this._hideQRModal}
      >
        <View style={styles.modalWrapper}>
          <Text style={styles.tip_header}>绑定微信任务</Text>
          <View style={styles.tip_content}>
            <Text style={styles.tip_text}>1.点击保存至相册</Text>
            <Text style={styles.tip_text}>2.打开微信，通过微信扫一扫-相册</Text>
            <Text style={styles.tip_text}>3.识别图中的二维码，关注爱奇艺官方微信公众号</Text>
          </View>
          <Image
            ref={(qr) => { this.qrImage = qr }}
            source={{uri: qrcodeUrl}}
            style={styles.qrcode}
          />
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.saveQRCode}
              underlayColor="#FF7E00"
              style={styles.qrbutton}
            >
              <Text style={{color: '#ffffff'}}>保存到本地</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ConfirmModal>
    )
  }
  // 展示二维码弹框
  showQRBox = () => {
    const {qrcodeUrl} = this.state
    if(qrcodeUrl) {
      return this.setState({
        qrModalVisible: true,
      })
    }
    const params = {
      p00001: global.USER_INFO.authCookie,
      originalId: 'gh_f206338003a1',
    }
    getQRCode(params)
      .then((data) => {
        const {longUrl} = data
        this.setState({
          qrcodeUrl: longUrl,
          qrModalVisible: true,
        })
      })
      .catch(err => showToast(err.message))
  }
  // 关闭二维码弹窗
  _hideQRModal = () => {
    this.setState({
      qrModalVisible: false,
    })
  }
  saveQRCode = () => {
    const options = {
      format: 'jpeg',
      quality: 0.8,
    }

    takeSnapshot(this.qrImage, options).then(
      (uri) => {
        CameraRoll.saveToCameraRoll(uri).then(() => {
          showToast('图片保存成功!')
        }).catch(err => showToast(err.message));
      },
      err => showToast(err.message),
    )
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 270,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tip_header: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FF8E00',
  },
  tip_content: {
    marginVertical: 18,
  },
  tip_text: {
    fontSize: 13,
    marginVertical: 3,
    color: '#333333',
  },
  qrcode: {
    width: 138,
    height: 138,
  },
  qrbutton: {
    width: 120,
    height: 30,
    borderRadius: 45,
    backgroundColor: '#FF7E00',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
