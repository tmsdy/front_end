/**
 * Created by lixiaoxi1.
 * @date 2019/4/4
 * @description
 */

import {getStorage, setStorage} from '../common/util'
import {STORAGE_ENUM} from '../constants/IntegralEnum';


/**
 * 积分是否已经发放
 */

/**
 * 获取打卡状态？
 * @returns {Promise<boolean>}
 */
export async function getPunchStatusFromStorage() {
  let status = false;
  try {
    const key = STORAGE_ENUM.PUNCH_FAIL
    status = getStorage(key)
  } catch(e) {
    // do nothing
  }

  return status;
}

export function setPunchStatus(timestamp) { // 打卡失败记录缓存
  const key = STORAGE_ENUM.PUNCH_FAIL
  const value = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString()}`
  setStorage(key, value);
}

export async function getPunchStatusFromStory(timestamp) {
  const key = STORAGE_ENUM.PUNCH_FAIL
  let status = false
  try {
    const nowValue = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString()}`
    const value = await getStorage(key)
    status = nowValue === value
  } catch(e) {
    // do nothing
  }

  return status
}
/**
 * 是否已经显示正在计算奖励中的弹框
 * @returns {Promise<boolean>}
 */
export async function isAlreayShowCompute(timestamp) {
  let status = false
  const key = STORAGE_ENUM.PUNCH_NOTICE
  try {
    const nowValue = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString()}`
    const value = await getStorage(key)
    status = nowValue === value
  } catch(e) {
    // do nothing
  }

  return status;
}

export async function setAlreadyShowComuteModal(timestamp) {
  const key = STORAGE_ENUM.PUNCH_NOTICE
  const value = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString(timestamp)}`
  setStorage(key, value)
}

export async function isAlreayShowGetScoreModal(timestamp) {
  let status = false
  const key = STORAGE_ENUM.PUNCH_GET_SCORE
  try {
    const nowValue = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString()}`
    const value = await getStorage(key)
    status = nowValue === value
  } catch(e) {
    // do nothing
  }

  return status;
}

export function setGetScoreModal(timestamp) {
  const key = STORAGE_ENUM.PUNCH_GET_SCORE
  const value = `${global.USER_INFO.userId}${new Date(timestamp).toLocaleDateString()}`
  setStorage(key, value)
}
// 是否八点到九点
export function isInComputeTime(timestamp) {
  const eightTimeStasmp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime() + (20 * 60 * 60 * 1000 + 60 * 1000)).getTime()
  const nineTimeStamp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime() + (21 * 60 * 60 * 1000 - 60 * 1000)).getTime()
  return (timestamp - eightTimeStasmp > 0 && timestamp - nineTimeStamp < 0)
}

export function isInPunchTime(timestamp) {
  const zeroTimeStasmp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime()).getTime()
  const eightTimeStamp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime() + (20 * 60 * 60 * 1000 + 59 * 1000)).getTime()
  return (timestamp - zeroTimeStasmp > 0 && timestamp - eightTimeStamp < 0)
}

export function isSendScoreTime(timestamp) {
  const nineTimeStasmp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime() + 21 * 60 * 60 * 1000).getTime()
  const twelveTimeStamp = new Date(new Date(new Date(timestamp).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000).getTime()
  return (timestamp - nineTimeStasmp > 0 && timestamp - twelveTimeStamp < 0)
}
export function getScoreWithComma(score = '') {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
