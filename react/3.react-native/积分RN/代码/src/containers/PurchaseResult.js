/**
 * 购买结果页
 * @lzj
 */
// TODO 重构代码

import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Text, View} from '@iqiyi/rn-ui';
import {Width as width} from '@iqiyi/rn-utils';
import NavBar from '../components/DefaultNavBar';
import WebImage from '../components/WebImage';
import {sendClickPingback, sendPagePingback} from '../common/pingback'
import {executeTask} from '../api'
import {BASE_URL, DUIBA, GET_ENV} from '../constants/configs'
import {createUrl, getSignForDuiba} from '../common/util'
import {hideLoading} from '../common/QYNativeBridge'
import BasePage from '../components/BasePage';

export default class extends BasePage {
  pageName = 'buydone'

  constructor(props) {
    super(props)
    this.state = {
      duibaItems: [],
    }
  }

  componentDidMount() {
    hideLoading()
    sendPagePingback(this.pageName)
    this._getDuibaItems()
  }

  _getDuibaItems() {
    if(this.state.duibaItems.length) return

    // 兑吧参数，任务引擎透传
    const _param = {
      count: 8,
      timestamp: Date.now(),
      appKey: DUIBA[GET_ENV()].appKey, // 兑吧 appKey
    }

    const sign = getSignForDuiba(_param)

    const requestBody = {
      duibaFrontItem: {
        ..._param,
        sign
      }
    }

    const requestHeader = {
      task_code: 'duibaFrontItem',
      timestamp: Date.now(),
    }

    executeTask(requestHeader, requestBody)
      .then((data) => {
        const duibaItems = data.data
        this.setState({
          duibaItems,
        })
      })
      .catch()
  }

  clickItem = (item, index) => {
    if(index === 1000) {
      sendClickPingback('buydone', 100100, 'viewmoregoods')
    } else {
      sendClickPingback('buydone', 100100, `donegoods_${index + 1}`)
    }

    if(item.url) {
      const _url = this.getUrl(item.url)
      this.openWeb(_url)
    }
  }

  getUrl(url) {
    const params = {
      uid: global.USER_INFO.userId,
      credits: 100,
      timestamp: Date.now(),
      appKey: 'basic_h5',
      dbredirect: url,
    }

    const exemptUrl = `${BASE_URL.community[GET_ENV()]}/score/exemptLogin`;
    return createUrl(exemptUrl, params);
  }

  renderHotItem() {
    const {duibaItems} = this.state

    return (
      <View style={styles.wrapper}>
        {
          duibaItems.map((i, index) => (
            <TouchableOpacity
              key={i.title}
              activeOpacity={1}
              onPress={() => this.clickItem(i, index)}
              style={styles.itemBox}
            >
              <Image source={{uri: i.small_image}} style={{width: 106, height: 58}}/>
              <Text style={[styles.hot_title, {color: '#333333', fontSize: 15, marginTop: 14}]}>{i.title}</Text>
              <Text style={[styles.hot_title, {color: '#FF7E00', fontSize: 13, marginTop: 7}]}>
                {i.credits}积分
              </Text>
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }

  render() {
    const {result} = this.props.navigation.state.params

    return (
      <View style={styles.container}>
        <NavBar title="兑换结果" backgroundColor="#000000" backPress={this.back}/>
        <WebImage name="result_back" style={styles.backImage}>
          {
            result ?
              <View style={styles.infoWrap}>
                <View style={styles.header}>
                  <WebImage name="ok" style={styles.icon}/>
                  <Text style={styles.infoTitle}>兑换成功</Text>
                </View>
                <Text numberOfLines={1} style={styles.successText}>请至“我的-我的钱包-交易记录”查询订单详情</Text>
              </View>
              :
              <View style={styles.infoWrap}>
                <View style={styles.header}>
                  <WebImage name="warning" style={styles.icon}/>
                  <Text style={styles.infoTitle}>兑换失败</Text>
                </View>
                <Text numberOfLines={1} style={styles.failText}>请至“我的-帮助反馈-在线客服”联系我们</Text>
              </View>
          }
        </WebImage>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={styles.rowContainer}>
            <Text style={styles.bigTitle}>更多商品</Text>
          </View>
          {this.renderHotItem()}
          <View style={styles.rowContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.clickItem({url: 'http://home.m.duiba.com.cn/chome/index'}, 1000)}
              style={styles.button_more}
            >
              <Text style={styles.button_text}>更多精选商品</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImage: {
    width,
    height: (width * 329) / 750,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  infoWrap: {
    flex: 1,
    width: width - 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 6,
  },
  infoTitle: {
    fontSize: 20,
    color: '#333333',
    backgroundColor: 'transparent',
  },
  successText: {
    fontSize: 14,
    lineHeight: 15,
    color: '#09BB07',
    backgroundColor: 'transparent',
    marginTop: 23,
  },
  failText: {
    fontSize: 14,
    lineHeight: 15,
    color: '#F43530',
    backgroundColor: 'transparent',
    marginTop: 23,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 30,
  },
  itemBox: {
    width: (width - 36) * 0.48,
    height: 133,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E3E3E3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  hot_title: {
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  bigTitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 25,
  },
  button_more: {
    width: 148,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7E00',
    borderRadius: 25,
    marginBottom: 37,
  },
  button_text: {
    fontSize: 15,
    color: '#ffffff',
  }
})

