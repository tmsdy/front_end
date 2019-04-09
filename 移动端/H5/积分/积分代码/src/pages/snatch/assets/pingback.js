/**
 * Created by liuzhimeng.
 * @date 2018/8/17
 * @description
 */

import {generateCommonParams, sendPingback} from 'Common/pingback'

export const HOME_PB = {
  rpage: 'duobao',
  block: '120001',
}

export const MY_LIST_PB = {
  rpage: 'myduobao',
  block: '120002',
}

export const MY_SUCCESS_PB = {
  rpage: 'myduobao',
  block: '120004',
}

export const DETAIL_PB = {
  rpage: 'duobaodetail',
  block: '',
}

export const pvPingback = (params) => {
  return generateCommonParams().then((common) => {
    return sendPingback({
      ...common,
      ...HOME_PB,
      t: 'rpagev',
      ...params,
    })
  })
}

export const showPingback = (params) => {
  return generateCommonParams().then((common) => {
    return sendPingback({
      ...common,
      ...HOME_PB,
      t: 'blockv',
      ...params,
    })
  })
}

export const clickPingback = (params) => {
  return generateCommonParams().then((common) => {
    return sendPingback({
      ...common,
      ...HOME_PB,
      t: 'click',
      ...params,
    })
  })
}
