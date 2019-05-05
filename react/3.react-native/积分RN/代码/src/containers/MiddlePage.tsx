/**
 * 升级中间页
 */
import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import BasePage from '../components/BasePage'
import BaseStyleSheet from '../common/BaseStyleSheet'
import WebImage from '../components/WebImage'

import {hideLoading} from '../common/QYNativeBridge'
import {sendPagePingback} from '../common/pingback'

interface MiddlePageState {
  text: string;
}

export default class MiddlePage extends BasePage<{}, MiddlePageState> {
  pageName = 'middle_page'

  constructor(props: object) {
    super(props)

    this.state = {
      text: '糟了，当前不是最新版本爱奇艺'
    }
  }

  componentDidMount() {
    hideLoading()
    sendPagePingback(this.pageName)
  }

  render() {
    return (
      <View style={styles.contain}>
        <WebImage name="version-empty" style={styles.image} />
        <Text style={styles.text}>{this.state.text}</Text>
        <TouchableOpacity onPress={this.openUrl}>
          <View style={styles.btnContain}>
            <Text style={styles.btnText}>去升级</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  openUrl = () => {
    const url = isIOS
      ? 'itms-apps://itunes.apple.com/us/app/id393765873?mt=8'
      : 'https://a.app.qq.com/o/simple.jsp?pkgname=com.qiyi.video'

    this.openWeb(url)
  }

}
const styles = BaseStyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  text: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 35
  },
  btnContain: {
    width: 100,
    height: 40,
    borderRadius: 47 / 2,
    borderColor: '#FF6600',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 16,
    color: '#FF6600'
  }
})
