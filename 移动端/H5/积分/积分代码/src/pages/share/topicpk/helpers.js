/**
 * Created by liuzhimeng.
 * @date 2018/9/25
 * @description
 */

import {isString} from 'Common/utils'

function setDom(k, v) {
  $(`[data-id="${k}"]`).html(v)
}

export const setState = (state, value) => {
  if(isString(state)) {
    setDom(state, value)
    return
  }
  for(let k in state) {
    setDom(k, state[k])
  }
}

export const getDayTime = (timeStamp) => {
  let time = new Date(timeStamp)
  return `${`0${time.getHours()}`.substr(-2)}:${`0${time.getMinutes()}`.substr(-2)}`
}
