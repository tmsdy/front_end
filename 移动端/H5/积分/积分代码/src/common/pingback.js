/**
 * Created by liuzhimeng.
 * @date 2018/8/16
 * @description
 */

import {getCookie, getUserId, isIos, isIqiyi, stringParams, toString} from 'Common/utils'

import {iqiyiInit} from './iqiyiPlugin'

// 投递地址
const SEND_URL = 'https://msg.qy.net/v5/acg/jifen_act'
// 公共参数
let commonParams = {
  p1: isIos() ? '2_22_221' : '2_22_222',
  u: getCookie('QC005') || '',
  pu: getUserId() || '',
  v: '9.9.0',
  rn: toString(Math.floor(999999999 * Math.random())),
  stime: Date.now(),
}

/**
 * 获取终端用户唯一标识
 * @returns {Promise<any>}
 */
export const generateCommonParams = () => {
  return new Promise((resolve, reject) => {
    if(isIqiyi() || !commonParams.u) {
      iqiyiInit(data => {
        commonParams.u = data.qyID
        commonParams.v = data.version
        resolve(commonParams)
      }, err => {
        reject(err)
      })
    } else {
      resolve(commonParams)
    }
  })
}

//发送pingback
export const sendPingback = (params, serialize = false) => {
  const image = new Image()
  const query = stringParams(params, serialize)

  SEND_URL.indexOf('?') == -1
    ? image.src = `${SEND_URL}?${query}`
    : image.src = `${SEND_URL}&${query}`

    return image
}

/**
 * pingback生成器
 * @param base {Object} 区分pingback类别
 * @returns {function(*=, *=, *=): function(*=): Image} 返回pingback生成器
 * defaultParams {Object} 生成器的默认参数，每个页面的默认参数都不一样，可由defaultParams指定
 */
export const pingbackGenerator = (baseParams = {}) => (params = {}) => {
  const sendParams = {
    ...commonParams,
    ...baseParams,
    ...params,
  }
  return sendPingback(sendParams)
}

export const pagePingback = (rpage, options = {}) => {
  generateCommonParams().then((common) => {
    sendPingback({
      ...common,
      t: 'rpagev',
      rpage,
      ...options,
    })
  })
}

export const clickPingback = (rpage, block, rseat, options = {}) => {
  generateCommonParams().then((common) => {
    sendPingback({
      ...common,
      t: 'click',
      rpage,
      block,
      rseat,
      ...options
    })
  })
}
