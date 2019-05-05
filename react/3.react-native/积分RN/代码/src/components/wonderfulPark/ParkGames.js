/**
 * 积分乐园游戏列表
 */

import React from 'react'
import {ScrollView, StyleSheet, TouchableHighlight} from 'react-native'
import PropTypes from 'prop-types'
import {Image, Text, View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils';
import {QYRNBridge} from '@iqiyi/rn-base-modules';
import {formatExts, goToLogin, createUrl} from '../../common/util'
import TabTitle from './TabTitle'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle'
import {CONTENT_PADDING_HORIZONTAL} from './constants'
import {sendClickPingback} from '../../common/pingback';
import {GAME_BLOCK, getGameClickPingback, PARK_PAGE} from './pingback'
import {BASE_URL, GET_ENV} from '../../constants/configs';

const ZERO = '0'
const ONE = '1'

function getUrl(url, totalScore) {
  const params = {
    uid: global.USER_INFO.userId,
    credits: totalScore,
    timestamp: Date.now(),
    appKey: 'basic_h5',
    dbredirect: url,
  };
  const exemptUrl = `${BASE_URL.community[GET_ENV()]}score/exemptLogin`;
  return createUrl(exemptUrl, params);
}

function goToUrl(item, index, totalScore) {
  // isHorizontal 是否横屏; showTitlebar 是否隐藏titlebar
  const {cp, URL: url, isHorizontal, showTitlebar, transDeviceid} = formatExts(item.key_value_pair)
  const params = {}
  let _url = url;

  // 支持注册制连接
  if(/iqiyi:\/\//.test(_url)) {
    QYRNBridge.navigate(_url);
    return false;
  }

  // 小游戏cp 链接写死
  if(cp === 'xiaoyouxi') {
    const gameurl = isIOS ? {
      biz_id: '5',
      biz_params: {
        biz_sub_id: '3',
        biz_extend_params: {
          h5url: url,
          orientation: ONE === isHorizontal ? 'landscape' : 'portrait',
          qipu_id: '214850820',
        },
        biz_statistics: 'serverid1=jfly',
      },
    } : {
      biz_id: '3',
      biz_plugin: 'com.qiyi.gamecenter',
      biz_params: {
        biz_sub_id: '3',
        biz_extend_params: `{βh5urlβ:β${url}β,βorientationβ:β${ONE === isHorizontal ? '1' : '2'}β,βqipu_idβ:β216148420β}`,
        biz_statistics: 'block=jfly',
      },
    }
    QYRNBridge.navigate(JSON.stringify(gameurl));
    return false;
  }

  if(isIOS) { // ios 和 安卓 跳转参数不一样因此分开来写
    // isHorizontal为1则横屏 为0则竖屏
    if(ONE === isHorizontal) {
      params.isFullScreen = '1'
    }
    // showTitlebar配置为0则隐藏titlebar
    if(ZERO === showTitlebar) {
      params.uiMode = 6
    } else {
      params.uiMode = 9
    }

  } else {
    if(ONE === isHorizontal) {
      params.orientation = 'landscape'
    } else if(ZERO === showTitlebar) {
      params.visibility = 8 // visibility 取值分别是 0  4  8 隐藏的话传8就OK
    }
    params.have_operation_view = false;
    params.disable_hardware_acceleration = true;
  }

  // duiba iqiyi doudizhu travelxiaolu
  if(cp === 'duiba') { // 兑吧游戏调用免登陆接口
    _url = getUrl(url, totalScore)
  } else if(cp === 'iqiyi') { // iqiyi游戏
    if(ZERO === transDeviceid) { // cp 为iqiyi 且 transDeviceid为0 则为投篮机游戏
      const userIcon = encodeURIComponent(global.USER_INFO.userIcon)
      const userId = encodeURIComponent(global.USER_INFO.userId)
      _url = url.indexOf('?') === -1 ? `${url}?userIcon=${userIcon}&userId=${userId}` : `${url}&userIcon=${userIcon}&userId=${userId}`
    } else {
      const deviceid = encodeURIComponent(global.CLIENT_INFO.deviceId)
      _url = url.indexOf('?') === -1 ? `${url}?deviceid=${deviceid}` : `${url}&deviceid=${deviceid}`
    }
  }
  params.url = _url
  QYRNBridge.navigate(JSON.stringify(params))
  return params
}


const onGamePress = (item, index, {isLogin, totalScore}) => {
  sendClickPingback(PARK_PAGE, GAME_BLOCK, getGameClickPingback(index + 1))
  if(!isLogin) {
    return goToLogin()
  }
  goToUrl(item, index, totalScore);
}

export default function GameList({list, isLogin, totalScore}) {
  const WrapperComponent = list.length > 2 ? ScrollView : View;

  const content = [];
    list.forEach((item, index) => {
    if(item && item.values) {
      const {description} = item.values;
      content.push((
        <TouchableHighlight
          {...TOUCH_LIGHT_MASK}
          key={item.order}
          style={styles.itemWrapper}
          onPress={() => onGamePress(item, index, {isLogin, totalScore})}
        >
          <View style={{flex: 1}}>
            <Image style={styles.images} source={{uri: item.thumbnail_url}}/>
            <Text style={styles.title} numberOfLines={1}>{item.title.proper_title}</Text>
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
          </View>
        </TouchableHighlight>
      ))
    }
  })

  return !content.length
    ? null
    : (
      <View style={styles.container}>
        <View style={styles.labelTitle}>
          <TabTitle title="热血竞技"/>
        </View>
        <WrapperComponent
          horizontal={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {content}
        </WrapperComponent>
      </View>
    )
}
GameList.propTypes = {
  list: PropTypes.array,
}

GameList.defaultProps = {
  list: [],
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  labelTitle: {
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
  },
  rightPic: {
    position: 'absolute',
    right: 0,
    top: 5,
    width: 46,
    height: 30,
  },
  itemWrapper: {
    width: 130.5,
    marginLeft: 13,
    paddingHorizontal: 22.5,
    paddingTop: 22.5,
    paddingBottom: 15,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 0.5,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  images: {
    width: 85,
    height: 85,
    marginBottom: 15,
    borderRadius: 20,
  },
  title: {
    marginBottom: 3,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
  },
  description: {
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#999999',
  },
})
