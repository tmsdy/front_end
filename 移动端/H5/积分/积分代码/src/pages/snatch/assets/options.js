import {filterExts, getObjectValueSafely, isIqiyi, formatRelativeTime, transferTimeTo, isURL} from 'Common/utils'
import {GET_ENV, INTEGRAL_HOST} from '../../../constants/configs'

/**
 * Created by liuzhimeng.
 * @date 2018/8/14
 * @description
 */

export const STATUS_MAP = {
  IN_PROGRESS: '开奖失败',
  COMPLETE_SUCCESSFULLY: '开奖成功',
  COMPLETE_NOT_ENOUGH_PARTICIPANTS: '开奖失败',
  COMPLETE_FAIL: '开奖失败',
}

// 是否显示按钮
function showButton(period, status) {
  if(['before', 'after'].indexOf(period) !== -1) {
    return true
  }
  return status === 'IN_PROGRESS'
}

// 是否禁用按钮
function getButtonStatus(period, permitStatus, currentNum, totalNum) {
  if(['before', 'after'].indexOf(period) !== -1) {
    return true
  }
  return currentNum >= totalNum || permitStatus
}

// 获取按钮配置
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

// 获取夺宝周期
export function getPeriod(detail) {
  const {start_time: startTime, end_time: endTime, complete_status: status} = detail
  const nowTime = Date.now()

  if(nowTime < startTime && status === 'IN_PROGRESS') return 'before'
  if(nowTime > startTime && nowTime < endTime && status === 'IN_PROGRESS') return 'in'
  return 'after'
}

// 是否达到上限
export function getPermitStatus(period, perLimit, currentUserNum) {
  if(['before', 'after'].indexOf(period) !== -1) {
    return false
  }
  return !!perLimit && (currentUserNum >= perLimit)
}

// 获取描述内容
export function getDescription(period, startTime, endTime, status, isWin) {
  if(period === 'before') {
    return `开始：${formatRelativeTime(startTime, '.')}`
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

// 获取进度条状态
export function getProgressBarStyle(period, status) {
  if(period === 'after' && status !== 'COMPLETE_SUCCESSFULLY') {
    return 'default'
  }
  return 'primary'
}

// 更新空态页
export function updateEmpty(type, text) {
  if(type === 'empty') {
    $('#emptyState').removeClass('image-network')
    $('#emptyText').text(text)
  } else {
    $('#emptyState').addClass('image-network')
    $('#emptyText').text(text)
  }
}

/**
 * 接口有修改， 未开始和 进行中的status都必须是 IN_PROGRESS 其他状态都不是 IN_PROGRESS
 * @param detail 夺宝详情
 * @param isOrdered 是否已预约
 * @param exts 额外参数
 * @returns {object} 夺宝配置信息
 */
export function getProdOptions(detail, {isOrdered, ...exts}) {
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
    isOrdered, // 是否已预约
    ...exts,

    period, // 夺宝周期
    price, // 夺宝价格
    status, // 夺宝状态
    currentNum, // 当前夺宝进度
    currentUserNum, // 当前用户夺宝进度
    totalNum, // 夺宝总数
    permitStatus, // 当前用户是否达到上限
    showProgress: period !== 'before', // 是否显示进度条
    title: getObjectValueSafely(item, 'name', ''), // 夺宝标题
    photos: getObjectValueSafely(item, 'photos', []), // 夺宝images
    showButton: showButton(period, status), // 是否显示按钮
    disabledButton: getButtonStatus(period, permitStatus, currentNum, totalNum), // 是否禁用按钮
    buttonOptions: getButtonOptions(period, permitStatus, exts.isWin, isOrdered), // 按钮配置信息
    desc: getDescription(period, startTime, endTime, status, exts.isWin), // 详情
    progressBarStyle: getProgressBarStyle(period, status) // 进度条样式
  }
}

// 夺宝成功列表配置
export function getMySuccessOptions(detail, exts = {}) {
  const {name: title, type, subType, redeemCodes, photoList, productsPrice, orderCode: orderId, offlineTime: _offTime} = detail

  const timeStr = transferTimeTo('datetime', _offTime, '.')
  const offlineTime = timeStr ? timeStr.split(' ')[0] : ''

  const extMap = filterExts(detail.exts)
  const showButton = ([4, 6].indexOf(type) !== -1 && subType === 11 && isURL(redeemCodes))
    || (type === 5 && subType === 0 && extMap.touse)

  return {
    ...exts,
    title,
    photoList,
    offlineTime,
    productsPrice,
    orderId,
    showButton,
    id: 'mySuccess',
    disabled: false,
    inProgressing: false,
    extMap: filterExts(detail.exts),
    isExpried: Date.now() > _offTime, // 是否过期
  }
}

export function getNode(name) {
  return $(`[data-id="${name}"]`)
}

// 跳转至详情页（避免回退时刷新页面，采用开启新容器的方式）
export function getDetailUrl(code) {
  if(isIqiyi()) {
    const host = INTEGRAL_HOST[GET_ENV()]
    return `iqiyi://mobile/webview?&url=${encodeURIComponent(`${host}/integralh5/snatch/detail?id=${code}`)}`
  }
  return `/integralh5/snatch/detail?id=${code}`
}
