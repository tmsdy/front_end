/**
 * Created by lzj
 * on 2017/12/7.
 */

import {isIOS} from '@iqiyi/rn-utils'
import {NetworkModule} from '@iqiyi/rn-base-modules'
import {formatParams} from './util'

// 积分投递
// const url = 'http://msg.qy.net/v5/acg/jifen_act'
// @since 20190225 修改为我们后端转发，后端 蔡伟伟
const url = 'https://qici.iqiyi.com/v5/acg/jifen_act';

function sendPingback(options) {
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
    biqid: global.CLIENT_INFO.biqid || ''
  }

  const params = {...param, ...options}
  const _url = `${url}?${formatParams(params)}`
  NetworkModule.get(_url).then(() => {}, () => {})
}

// 页面展示 pingback
export function sendPagePingback(rpage, options = {}) {
  sendPingback({
    t: 'rpagev',
    rpage,
    ...options
  })
}

// 点击 pingback
export function sendClickPingback(rpage, block, rseat, options = {}) {
  sendPingback({
    t: 'click',
    rpage,
    block,
    rseat,
    ...options
  })
}

// 展示pingback
export function sendBlockPingback(rpage, block, options = {}) {
  sendPingback({
    t: 'blockv',
    rpage,
    block,
    ...options
  })
}
