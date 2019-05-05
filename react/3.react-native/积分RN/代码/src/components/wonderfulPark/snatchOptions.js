/**
 * Created by liuzhimeng.
 * @date 2018/10/10
 * @description
 */

import {formatRelativeTime, getObjectValueSafely} from '../../common/util'
import {showToast} from '../../common/QYNativeBridge'
import {participateTreasure} from '../../api/index'

export const STATUS_MAP = {
  IN_PROGRESS: '开奖失败',
  COMPLETE_SUCCESSFULLY: '开奖成功',
  COMPLETE_NOT_ENOUGH_PARTICIPANTS: '开奖失败',
  COMPLETE_FAIL: '开奖失败',
}


function showButton(period, status) {
  if(['before', 'after'].indexOf(period) !== -1) {
    return true
  }
  return status === 'IN_PROGRESS'
}

function getButtonStatus(period, permitStatus, currentNum, totalNum) {
  if(period === 'after') {
    return true
  }
  return currentNum >= totalNum || permitStatus
}

function getButtonOptions(period, permitStatus, isWin, isOrdered) {
  if(period === 'after') {
    if(isWin === true) {
      return {type: 'win', text: '查看奖品'}
    }
    return {type: 'detail', text: '查看详情'}
  }
  if(period === 'before') {
    if(isOrdered) {
      return {type: 'isOrdered', text: '已预约'}
    }
    return {type: 'notOrder', text: '开始提醒'}
  }
  if(permitStatus) {
    return {type: 'onLimit', text: '已达上限'}
  }
  return {type: 'participate', text: '立即夺宝'}
}

export function getPeriod(detail) {
  const {start_time: startTime, end_time: endTime, complete_status: status} = detail
  const nowTime = Date.now()

  if(nowTime < startTime && status === 'IN_PROGRESS') return 'before'
  if(nowTime > startTime && nowTime < endTime && status === 'IN_PROGRESS') return 'in'
  return 'after'
}

export function getPermitStatus(period, perLimit, currentUserNum) {
  if(['before', 'after'].indexOf(period) !== -1) {
    return false
  }
  return !!perLimit && (currentUserNum >= perLimit)
}

export function getDescription(period, startTime, endTime, status, isWin) {
  if(period === 'before') {
    return `开始时间：${formatRelativeTime(startTime, '.')}`
  } else if(period === 'in') {
    return status === 'IN_PROGRESS'
      ? `截止：${formatRelativeTime(endTime, '.')}`
      : STATUS_MAP[status]
  } else {
    if(isWin === undefined) {
      return STATUS_MAP[status]
    }
    if(status === 'COMPLETE_SUCCESSFULLY') {
      return isWin ? '已中奖' : '未中奖'
    } else {
      return '开奖失败，积分将返还'
    }
  }
}

export function getProgressBarStyle(period, status) {
  if(period === 'after' && status !== 'COMPLETE_SUCCESSFULLY') {
    return 'default'
  }
  return 'primary'
}

// 接口有修改， 未开始和 进行中的status都必须是 IN_PROGRESS 其他状态都不是 IN_PROGRESS
export function getSnatchOptions(detail, {isOrdered, ...exts}) {
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
  } = detail

  const period = getPeriod(detail)
  const permitStatus = getPermitStatus(period, perLimit, currentUserNum) // 是否达到上限

  return {
    isOrdered,
    ...exts,

    period,
    price,
    status, // 夺宝状态
    currentNum,
    currentUserNum,
    totalNum,
    permitStatus,
    showProgress: period !== 'before',
    title: getObjectValueSafely(item, 'item.name', ''),
    photos: getObjectValueSafely(item, 'item.photos', []),
    showButton: showButton(period, status),
    disabledButton: getButtonStatus(period, permitStatus, currentNum, totalNum),
    buttonOptions: getButtonOptions(period, permitStatus, exts.isWin, isOrdered),
    desc: getDescription(period, startTime, endTime, status, exts.isWin),
    progressBarStyle: getProgressBarStyle(period, status)
  }
}

export const participate = ({code, price, totalScore}) => {
  return new Promise((resolve, reject) => {
    if(totalScore < price) {
      showToast('参与失败，你的积分不足')
      return reject(new Error('failure'))
    }
    participateTreasure({code})
      .then((data) => {
        showToast('参与成功，在“我的夺宝记录”查看')
        return resolve(data)
      })
      .catch((err) => {
        showToast('参与失败，请稍后重试')
        return reject(err)
      })
  })
}
