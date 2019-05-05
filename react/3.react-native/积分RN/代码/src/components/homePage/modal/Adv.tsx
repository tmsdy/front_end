/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 积分中心运营弹框
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import BaseStyleSheet from '../../../common/BaseStyleSheet'
import WebImage from '../../WebImage'

import {setStorage, getStorage} from '../../../common/util'
import {QipuDataItem} from '../../../typings/apis/homePage'

import {sendClickPingback} from '../../../common/pingback'

export const INTEGRAL_CENTER_ADV = `INTEGRAL_CENTER_ADV_${global.USER_INFO.userId}`

interface AdvProps {
  data: QipuDataItem;
  openWeb(s: string): void;
  hideConfirmModal(): any;
}

export default class Adv extends PureComponent<AdvProps, {}> {
  componentDidMount() {
    this.onModalShow()
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.openAdv}>
        <WebImage uri={this.props.data.imgUrl} style={styles.image} />
      </TouchableOpacity>
    )
  }

  onModalShow = async () => {
    const hasTimes = await getStorage(INTEGRAL_CENTER_ADV)
    setStorage(INTEGRAL_CENTER_ADV, hasTimes + 1)
  }

  openAdv = () => {
    sendClickPingback('homePage', '300104', 'gostraight')
    const {
      imgUrl,
      values: {
        clickEvent,
      }
    } = this.props.data

    if(imgUrl && clickEvent === 'h5') {
      this.props.hideConfirmModal().then(() => {
        this.props.openWeb(imgUrl)
      })
    }
  }
}

const styles = BaseStyleSheet.create({
  image: {
    width: 300,
    height: 350,
  },
})
