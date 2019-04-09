/**
 * Created by liuzhimeng.
 * @date 2018/8/16
 * @description
 */

import {
  sendPingback,
  generateCommonParams,
} from 'Common/pingback'

export const listPingback = {
  rpage: 'topic_list',
}

export const myPkPingback = {
  rpage: 'mypk',
}

export const failPingback = {
  rpage: 'topic_list_fail',
}

export const detailPingback = {
  rpage: 'topic_detail',
}

export const choosePingback = {
  rpage: 'detail_choose',
}

export const pointPingback = {
  rpage: 'detail_lackpoint',
}

export const failDetailPingback = {
  rpage: 'topic_detail_fail',
}

export const callFailPingback = {
  rpage: 'detail_callfail',
}

export const pvPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...listPingback,
    t: 'rpagev',
    ...params,
  }))
export const showPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...listPingback,
    t: 'blockv',
    ...params,
  }))
export const clickPingback = params => generateCommonParams()
  .then(common => sendPingback({
    ...common,
    ...listPingback,
    t: 'click',
    ...params,
  }))
