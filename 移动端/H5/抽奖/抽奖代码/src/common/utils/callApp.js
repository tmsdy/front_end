
import 'core-js/features/array/find-index'

import {stringParams} from "./transfer"
import {isIos, isWeixin, isIqiyi} from "./userAgent"
import {callNative, callOrDownloadApp} from "@iqiyi/callordownloadapp"

const APP_ORIGIN = 'iqiyi://mobile/'           // Schema Origin
const REGISTER_BUSINESS = 'register_business/' // 唤起注册制
const PID_MAP = {
  qyclient: 'qyclient',     // 基线
  webview: 'webview',       // webview
}

/**
 * 生成 url 地址
 * @param route {string}pid route
 * @param params {object}
 * @param register 是否为注册制跳转，注册制跳转需要额外添加 register_business 字段，且参数需要encode 两次
 * @returns {string}
 */
const generateURL = (route = 'qyclient', params = null, register = true) => {
  const host = register
    ? `${APP_ORIGIN}${REGISTER_BUSINESS}${PID_MAP[route]}`
    : `${APP_ORIGIN}${PID_MAP[route]}`
  return params ? `${host}?${stringParams(params, false, register ? 2 : 1)}` : `${host}`
}

// 生成跳转积分RN的注册制参数
const genetateIntegralParams = (pageName, integralPrams = {}) => (
  JSON.stringify({
    biz_id: 100,
    biz_plugin: 'qiyibase',
    biz_params: {
      biz_sub_id: 106,
      biz_params: 'bizId=IntegralRN&componentName=RNIntegral',
      biz_dynamic_params: `initParams=${JSON.stringify({pageName, ...integralPrams})}`,
    }
  })
)

// 注册制 router name
export const ROUTER_MAP = [
  {name: 'HomePage', type: 'integral'},
  {name: 'ShoppingMall', type: 'integral'},
  {name: 'GoodsDetail', type: 'integral'},
  {name: 'IntegralPark', type: 'integral'},
  {name: 'TaskList', type: 'integral'},
  {name: 'TopicPk', type: 'integral'},
  {name: 'MyGain', type: 'integral'},
  {name: 'QuestionList', type: 'integral'},
  {name: 'QuestionDetail', type: 'integral'},
  {name: 'gamezhibo', type: 'game'},
  {name: 'kaquan', type: 'wallet'},
  {name: 'gotosetting', type: 'setting'},
]

// 生成注册制参数
const getRegisterParams = (name) => {
  switch (name) {
    case 'gamezhibo':  // 跳转到游戏直播首页
      return generateURL('qyclient', {
        pluginParams: JSON.stringify({
          biz_id: 9,
          biz_plugin: 'com.qiyi.game.live.plugin',
          biz_params: {
            biz_sub_id: 1,
            biz_dynamic_params: 'type=4',
            biz_statistics: 'block=jifen-1',
          }
        })
      })
      break
    case 'qixiulibao': // 跳转到奇秀礼包页面(985新增)
      return generateURL('qyclient', {
        pluginParams: JSON.stringify({
          biz_id: 2,
          biz_plugin: 'com.iqiyi.ishow',
          biz_params: {
            biz_sub_id: 2,
            biz_dynamic_params: 'roomId=0&anchorId=0&showGiftPanel=999',
            biz_statistics: 'block=jifenlibao',
          }
        })
      })
      break
    case 'kaquan': // 跳转到 我的-我的钱包-卡券
      return generateURL('qyclient', {
        pluginParams: JSON.stringify({
          biz_id: 104,
          biz_params: {
            biz_sub_id: 14,
          }
        })
      })
      break
    case 'gamevip': // 跳转到 游戏会员（只有安卓）
      return generateURL('qyclient', {
        pluginParams: JSON.stringify({
          biz_id: 5,
          biz_plugin: 'com.qiyi.gamecenter',
          biz_params: {
            biz_sub_id: 23,
            biz_extend_params: '',
            biz_statistics: 'block=bsline_store',
          }
        })
      })
      break
    case 'gotosetting': // 去设置页面
      return generateURL('qyclient', {
        pluginParams: JSON.stringify({
          biz_id: 100,
          biz_params: {
            biz_sub_id: '431',
            biz_params: '',
            biz_dynamic_params: '',
            biz_extend_params: '',
            biz_statistics: '',
          },
          biz_plugin: 'qiyibase',
        })
      })
      break
  }
}

/**
 * 生成callNative/callOrDownloadApp参数
 * @param type {string} pageName: 按已有注册制跳转；applink：第三方调起基线；url：自定义url跳转
 * @param value {string} pageName value；applink value；url value
 * @param params {object} 可选，额外注册制参数
 * @param integralPrams {object} 可选，积分RN参数
 * @returns {*}
 */
export const createAppPageURL = ({type = 'pageName', value = '', params, integralPrams}) => {
  // 根据页面关键字进行注册制跳转
  if (type === 'pageName') {
    // 跳转到积分相关页面
    const isIntetral = ROUTER_MAP.findIndex(i => i.type === 'integral' && i.name === value)
    if (isIntetral !== -1) {
      return generateURL('qyclient', {
        pluginParams: genetateIntegralParams(value, integralPrams)
      })
    }

    // 跳转到其他页面
    const router = ROUTER_MAP.find(i => i.name === value) || {}
    if (router.name) {
      return getRegisterParams(router.name)
    }
  } else if (type === 'applink') { // 第三方调起基线（非注册制
    return generateURL(value, params, false)
  } else if (type === 'url') { // 根据指定url跳转
    return value
  }

  console.error('createAppPageURL 没有匹配到合法的URL地址:', type, value)
  return ''
}

export const createCallAppParam = (createAppPageURL, params) => {
  const defaultConfig = {
    SCHEME: createAppPageURL(params),
    FAILBACK: {
      IOS: 'https://itunes.apple.com/cn/app/id393765873?mt=8',
      ANDROID: '//mbdapp.iqiyi.com/j/ap/iqiyi_1845.apk'
    },
    TIMEOUT: 2000,
  }
  if (isIos()) {
    defaultConfig['COVER_IMG'] = 'https://statics-web.iqiyi.com/h5/integralh5/res/img/browser_open.png'
  } else if (isWeixin()) {
    defaultConfig['FAILBACK']['YYB'] = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qiyi.video&android_schema=' + encodeURIComponent(createAppPageURL(params))
  }
  
  return defaultConfig
}

const appParams = (params) => {
  return createCallAppParam(createAppPageURL, params)
}

export const goToApp = (params) => {
  // 客户端内直接唤起
  if(isIqiyi()) {
    return callNative(appParams(params))
  }
  // 其他则先唤起下载页
  return callOrDownloadApp(appParams(params))
}
