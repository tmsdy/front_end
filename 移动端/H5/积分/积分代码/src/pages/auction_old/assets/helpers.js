/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description 抢拍页公共方法
 */

import {
  toString,
  isNumber,
  isOwnEmptyObj,
  stringParams,
  parseQueryString,
} from "Common/utils"
import {
  clickPingback,
} from "./pingback"
import {
  getLifeCycle,
} from "./lifeCycle"

// 删除from字段
export const getShareLink = () => {
  const href = location.href
  const query = parseQueryString()
  if (!query.from) {
    return href
  }
  delete query.from
  const search = isOwnEmptyObj(query) ? '' : `?${stringParams(query)}`
  return href.split('?')[0] + search
}

// 表单验证
export const checkBidValid = (bidCount, {LIFE_CYCLE_STATE, DETAIL_DATA, CURRENT_STATE}) => {
  // 只能为数字
  if (!isNumber(bidCount)) {
    return {
      status: false,
      toast: '请输入合法数字~'
    }
  }
  // 不能为小数
  if (toString(bidCount).indexOf(".") > -1) {
    return {
      status: false,
      toast: '请输入整数~'
    }
  }
  // 是否在出价时间内
  if (LIFE_CYCLE_STATE.nowStatus !== 'onBidding') {
    return {
      status: false,
      toast: '已超出出价时间，下次要快哦~'
    }
  }
  // 出价 < 底价
  if (bidCount < DETAIL_DATA.bottom_price) {
    return {
      status: false,
      toast: `不能少于底价${DETAIL_DATA.bottom_price}积分`
    }
  }
  // 出价在用户积分外
  if (CURRENT_STATE.userScore < bidCount) {
    return {
      status: false,
      toast: '您的积分不足'
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
        clickPingback({
          rseat: 'more_huodong'
        })
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
      return i
    }
  })

  return {
    fixRecords,
    userAward,
    fixWin,
  }
}

// 抖动获奖名单入口
export const hakeAwardEntry = () => {
  const shake = 'shake-hard shake-constant'
  const awardEntry = $('*[data-award-entry]').children()
  if (awardEntry && awardEntry.length) {
    awardEntry.addClass(shake)
    setTimeout(() => {
      awardEntry.removeClass(shake)
    }, 500)
  }
}

export const loadAwardEntry = (pageState, lifeCycleState) => {
  // 整场活动第一轮结果公布后动画滑入获奖名单入口
  if (!pageState.LOADED_AWARD_ENTRY) {
    if (lifeCycleState.nowRound > 1 || lifeCycleState.nowRound === 1 && lifeCycleState.nowStatus === 'onPublishing') {
      $('*[data-award-entry]').animate({
        right: 0,
      }, 400)
      pageState.LOADED_AWARD_ENTRY = true
    }
  }
}
