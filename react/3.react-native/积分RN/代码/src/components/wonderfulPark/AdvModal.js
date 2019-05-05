/**
 * Created by kerwinliu on 2018/7/31.
 */
/*
* 乐园运营弹框
* */
import React, {Component} from 'react'
import {StyleSheet, TouchableWithoutFeedback} from 'react-native'
import PropTypes from 'prop-types'
import {Image, Modal, View} from '@iqiyi/rn-ui'
import {filterExts} from '../../common/util'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../common/asyncStorage'
import {sendClickPingback} from '../../common/pingback'
import WebImage from '../WebImage'
import ModalCommonStyle from '../../constants/modalCommonStyle'
import {PARK_PAGE} from './pingback'

export const ADV_ASYNC_STORAGE_KEY = `WONDERFUL_PARK_ADV_MODAL_${global.USER_INFO.userId}`

export const getAdvStorageAsync = async () => {
  const _value = await getAsyncStoragePromise(ADV_ASYNC_STORAGE_KEY)
  const value = Number(_value)
  if(Number.isNaN(value)) return 0
  if(value) return value
  return 0
}

export default class extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    data: PropTypes.object,
    close: PropTypes.func,
  }

  static defaultProps = {
    isVisible: false,
    data: {},
    close: () => null,
  }

  render() {
    return (
      <Modal isVisible={this.props.isVisible} animationIn="slideIn" onModalShow={this.onModalShow}>
        <View style={ModalCommonStyle.modalContainerTrans}>
          <View style={ModalCommonStyle.innerContainer}>
            <TouchableWithoutFeedback onPress={this._openAdv}>
              <Image source={{uri: this.props.data.thumbnail_url}} style={styles.imageStyle}/>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.props.close}>
              <View style={[ModalCommonStyle.closeButton, {marginTop: 20}]}>
                <WebImage name="closeBtn" style={{width: 40, height: 40}}/>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    )
  }

  onModalShow = async () => {
    const hasTimes = await getAdvStorageAsync()
    saveAsyncStoragePromise(ADV_ASYNC_STORAGE_KEY, `${parseInt(hasTimes, 10) + 1}`)
  }

  _openAdv = () => {
    sendClickPingback(PARK_PAGE, '300104', 'gostraight')
    const {
      key_value_pair: keyValues,
      entity_url: entityUrl,
    } = this.props.data
    const clickEvent = filterExts(keyValues, 'clickEvent')
    if(clickEvent && entityUrl && clickEvent.toLocaleLowerCase() === 'h5') {
      this.props.openAdv(() => {
        this.props.openWeb(entityUrl)
      })
    }
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    width: 300,
    height: 350,
  },
})
