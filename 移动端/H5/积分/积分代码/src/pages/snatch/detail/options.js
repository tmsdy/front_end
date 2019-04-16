/**
 * Created by liuzhimeng.
 * @date 2019-02-27
 * @description
 */
import {formatRelativeTime, getObjectValueSafely} from 'Common/utils'
import {getPeriod, getPermitStatus, getProgressBarStyle} from '../assets/options'

export const STATUS_MAP = {
  IN_PROGRESS: '开奖失败，积分将返还',
  COMPLETE_SUCCESSFULLY: '开奖成功',
  COMPLETE_NOT_ENOUGH_PARTICIPANTS: '开奖失败，积分将返还',
  COMPLETE_FAIL: '开奖失败，积分将返还',
}

// 获取描述内容
export function getDetailDescription(period, startTime, endTime, status, isWin, currentUserNum) {
  if(period === 'before') {
    return `开始时间：${formatRelativeTime(startTime, '.')}`
  } else if(period === 'in') {
    return status === 'IN_PROGRESS'
      ? `截止：${formatRelativeTime(endTime, '.')}`
      : STATUS_MAP[status]
  } else {
    if(!currentUserNum) {
      return STATUS_MAP[status]
    }
    if(status === 'COMPLETE_SUCCESSFULLY') {
      return isWin ? '已中奖' : '未中奖'
    } else {
      return '开奖失败，积分将返还'
    }
  }
}

function getDetailButtonOptions(period, status, price, permitStatus, USER_INFO = {}, isLogin, isOrdered) {
  const totalScore = getObjectValueSafely(USER_INFO, 'totalScore', 0)
  if(period === 'before') {
    if(!isLogin) return {type: 'unlogin', text: '开始提醒'}
    if(isOrdered) return {type: 'isOrdered', text: '已预约'}
    return {type: 'notOrder', text: '开始提醒'}
  }
  if(period === 'in') {
    if(!isLogin) return {type: 'unlogin', text: '立即登录'}
    if(permitStatus) return {type: 'onLimit', text: '夺宝次数已达上限'}
    if(totalScore < price) return {type: 'beShortOf', text: '去赚积分'} // 积分不足
    return {type: 'participate', text: '立即夺宝'}
  }
  if(status === 'COMPLETE_SUCCESSFULLY') return {type: 'success', text: '开奖成功'}
  return {type: 'fail', text: '开奖失败'}
}

// 接口有修改， 未开始和 进行中的status都必须是 IN_PROGRESS 其他状态都不是 IN_PROGRESS
export function getDetailOptions(detail, {USER_INFO, isLogin, isOrdered, ...exts}) {
  const {
    price,
    item = [],
    current_num: currentNum = 0,
    total_num: totalNum = 0,
    start_time: startTime,
    end_time: endTime,
    current_user_num: currentUserNum = 0,
    per_limit: perLimit,
    complete_status: status, // 夺宝进行状态：（IN_PROGRESS:未开奖，COMPLETE_SUCCESSFULLY: 正常完成，COMPLETE_NOT_ENOUGH_PARTICIPANTS:人数不满，COMPLETE_FAIL:开奖失败）
    is_current_user_win: isWin,
  } = detail

  const period = getPeriod(detail)
  const permitStatus = getPermitStatus(period, perLimit, currentUserNum) // 是否达到上限

  return {
    USER_INFO, // 用户信息
    isLogin, // 是否登录
    isOrdered, // 是否已预约提醒
    ...exts,

    period,
    price,
    status, // 夺宝状态
    currentNum,
    currentUserNum,
    totalNum,
    permitStatus,
    title: getObjectValueSafely(item, 'name', ''),
    photos: getObjectValueSafely(item, 'photos', []),
    desc: getDetailDescription(period, startTime, endTime, status, isWin, currentUserNum),
    progressBarStyle: getProgressBarStyle(period, status),
    buttonOptions: getDetailButtonOptions(period, status, price, permitStatus, USER_INFO, isLogin, isOrdered),
  }
}

export function updateDetailOptions(data, newData, exts) {
  const d = {...data, ...newData}
  return {
    ...d,
    _options: getDetailOptions(d, exts)
  }
}
