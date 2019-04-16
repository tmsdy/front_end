/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description 抢拍页公共方法
 */

import {toString, isNumber, stringParams, parseQueryString} from "Common/utils"
import {clickPingback} from "./pingback"
import {getLifeCycle} from "./lifeCycle"

// 修改或添加from字段值为share
export const getShareLink = () => {
  const query = parseQueryString()
  query.from = 'share'
  return `${location.href.split('?')[0]}?${stringParams(query)}`
}

// 表单验证
export const checkBidValid = (bidCount, {LIFE_CYCLE_STATE, DETAIL_DATA, CURRENT_STATE}) => {
  // 只能为数字
  if (!isNumber(bidCount)) {
    return {
      status: false,
      type: 'invalidNumber',
      toast: '请输入合法数字~'
    }
  }
  // 不能为小数
  if (toString(bidCount).indexOf(".") > -1) {
    return {
      status: false,
      type: 'invalidInteger',
      toast: '请输入整数~'
    }
  }
  // 是否在出价时间内
  if (LIFE_CYCLE_STATE.nowStatus !== 'onBidding') {
    return {
      status: false,
      type: 'outtime',
      toast: '已超出出价时间，下次要快哦~'
    }
  }
  // 出价 < 底价
  if (bidCount < DETAIL_DATA.bottom_price) {
    return {
      status: false,
      type: 'belowBottomPrice',
      toast: `不能少于底价${DETAIL_DATA.bottom_price}积分`
    }
  }
  // 出价在用户积分外
  if (CURRENT_STATE.userScore < bidCount) {
    return {
      status: false,
      type: 'lackOfScore',
      toast: '输入积分超出你的总值'
    }
  }

  return {
    status: true,
    toast: '',
  }
}

// 添加道具扩展特定字段的click事件
export const addExtsListener = (exts = []) => {
  for (let i = 0; i < exts.length; i++) {
    const {value} = exts[i]
    if (value === 'IntegralPark') {
      exts[i]['onClick'] = () => {
        clickPingback({rseat: 'more_huodong'})
      }
    }
  }

  return exts
}

// 获取获奖记录中有效的数据，并判断用户是否中奖
export const getRecordState = (records = [], pageState) => {
  const {DETAIL_DATA, PARAMS} = pageState
  const {nowStatus} = getLifeCycle(DETAIL_DATA)
  let fixWin = false
  let userAward = null

  const fixRecords = records.map(i => {
    if (!i.errorMessage) {
      if (Number(i.userId) === Number(PARAMS.userId)) {
        if (nowStatus === 'onPublishing') {
          userAward = i
          fixWin = true
        }
      }
      i.isWin = true
      return i
    }
  })

  return {
    fixRecords,
    userAward,
    fixWin,
  }
}
