/**
 * Created by lzj.
 * @date 2019-04-07
 * @description pingback
 */

import {isIOS} from '@iqiyi/rn-utils'
import {NetworkModule} from '@iqiyi/rn-base-modules'
import {formatParams} from './util'

type rpageType = string;
type blockType = string | number;
type rseatType = string;

// 积分投递
// const url = 'http://msg.qy.net/v5/acg/jifen_act'
// @since 20190225 修改为我们后端转发，后端 蔡伟伟
const url = 'https://qici.iqiyi.com/v5/acg/jifen_act'

const sendPingback = async (options: object) => {
  try {
    const param = {
      p1: isIOS ? '2_22_221' : '2_22_222', // 平台
      u: global.CLIENT_INFO.qyId, // 终端用户唯一标识，
      pu: global.USER_INFO.userId, // 登录用户 ID
      v: global.CLIENT_INFO.appVersion, // 客户端版本
      rn: Date.now(), // 随机数，防止客户端缓存
      nu: 0, // 是否新用户,
      hu: global.USER_INFO.isVIP ? 1 : 0, // 会员状态标识
      stime: Date.now(), // UNIX时间戳,
      mod: global.mod,
      from: global.from,
      iqid: global.CLIENT_INFO.iqid || '',
      biqid: global.CLIENT_INFO.biqid || '',
      ua: global.CLIENT_INFO.ua
    }

    const params = {...param, ...options}
    const _url = `${url}?${formatParams(params)}`

    return NetworkModule.get(_url)
  } catch(e) {
    // console.log(e)
  }
}

interface PingbackOptions {
  score?: number;
  [p: string]: any;
}
// 页面展示 pingback
export function sendPagePingback(rpage: rpageType, options: PingbackOptions = {}) {
  let newOptions = {
    ...options,
  }

  // score 如果不存在，不投递~
  if(options.hasOwnProperty('score') && !options.score) {
    delete newOptions.score
  }

  sendPingback({
    t: 'rpagev',
    rpage,
    ...newOptions,
  })
}

// 点击 pingback
export function sendClickPingback(rpage: rpageType, block: blockType, rseat: rseatType, options: PingbackOptions = {}) {
  sendPingback({
    t: 'click',
    rpage,
    block,
    rseat,
    ...options,
  })
}

// 展示pingback
export function sendBlockPingback(rpage: rpageType, block: blockType, options: PingbackOptions = {}) {
  sendPingback({
    t: 'blockv',
    rpage,
    block,
    ...options,
  })
}
