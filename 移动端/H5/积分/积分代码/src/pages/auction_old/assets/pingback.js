/**
 * Created by liuzhimeng.
 * @date 2018/8/16
 * @description 积分抢拍pingback
 */

import {
  sendPingback,
  generateCommonParams,
} from 'Common/pingback'

export const homePingback = {
  rpage: 'jingpai',
  block: '901100',
}

export const myListPingback = {
  rpage: 'myjingpai',
  block: '901101',
}

export const pvPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...homePingback,
    t: 'rpagev',
    ...params,
  }))
export const showPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...homePingback,
    t: 'blockv',
    ...params,
  }))
export const clickPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...homePingback,
    t: 'click',
    ...params,
  }))
