/**
 * Created by liuzhimeng.
 * @date 2018/8/16
 * @description 积分抢拍pingback
 */

import {sendPingback, generateCommonParams} from 'Common/pingback'
import {parseQueryString} from "Common/utils"

export const homePingback = {
  rpage: 'jingpai',
  block: '901100',
}

export const myListPingback = {
  rpage: 'myjingpai',
  block: '901101',
}

// url参数
const QUERY = parseQueryString()
// recommend 来源于首页；paradise 来源于我的积分页；share 来源于分享页
const from = QUERY.from ? QUERY.from : ''

export const pvPingback = (params = {}) => {
  generateCommonParams().then((common) => {
    sendPingback({
      ...common,
      ...homePingback,
      t: 'rpagev',
      from,
      ...params,
    }, true)
  })
}

export const showPingback = (params = {}) => {
  generateCommonParams().then((common) => {
    sendPingback({
      ...common,
      ...homePingback,
      t: 'blockv',
      from,
      ...params,
    }, true)
  })
}

export const clickPingback = (params = {}) => {
  generateCommonParams().then((common) => {
    sendPingback({
      ...common,
      ...homePingback,
      t: 'click',
      from,
      ...params,
    }, true)
  })
}
