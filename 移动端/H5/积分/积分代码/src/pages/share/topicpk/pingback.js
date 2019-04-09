/**
 * Created by liuzhimeng.
 * @date 2018/9/27
 * @description
 */

import {generateCommonParams, sendPingback} from 'Common/pingback'

export const TOPIC_LIST_RPAGE = 'topic_share'

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
