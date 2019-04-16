/**
 * 获取页面生命周期状态数据
 * beforeAuction(竞拍开始前), onBidding(出价期间), onCalcuting(结果计算期间), onPublishing(结果公布期间), afterAuction(竞拍活动结束后)
 * @param data
 * @returns {object}
 */

export const getLifeCycle = (data, nowTime = Date.now()) => {
  const {
    start_time: startTime,
    end_time: endTime,
  } = data
  let {
    bid_time_cost: bidTime, // 出价期间耗时
    result_time_cost: calcTime, // 计算结果耗时
    publish_time_cost: publishTime, // 公布结果耗时
  } = data

  bidTime *= 1000
  calcTime *= 1000
  publishTime *= 1000

  let state = {
    startTime,
    endTime,
    nowStatus: 'beforeAuction',
    nowTime: null,
    nowRound: null,
    nextTime: null,
    nextRoundTime: null,
    hasRound: 0,
  }

  // 活动开始前
  if (nowTime < startTime) {
    return {
      ...state,
      nowStatus: 'beforeAuction',
      nowTime,
      nowRound: null,
      nextStatus: 'onCalcuting',
      nextTime: startTime,
      nextRoundTime: startTime,
      hasRound: 0,
    }
  }

  // 活动结束后
  if (nowTime >= endTime) {
    return {
      ...state,
      nowStatus: 'afterAuction',
      nowTime,
      nowRound: null,
      nextStatus: null,
      nextTime: null,
      nextRoundTime: null,
      hasRound: 0,
    }
  }

  // 计算每轮次周期
  const roundPeriod = bidTime + calcTime + publishTime
  // 计算当前轮次
  const tempNowRound = nowTime - startTime
  const nowRound = Math.ceil(tempNowRound / roundPeriod)

  const hasRound = nowRound - 1

  // 当前轮次起始时间
  const currentRoundStartTime = startTime + roundPeriod * hasRound
  // 当前轮次计算结果开始时间
  const currentRoundCalcStartTime = currentRoundStartTime + bidTime
  // 当前轮次结果公布开始时间
  const currentRoundPublishStartTime = currentRoundCalcStartTime + calcTime
  // 当前轮次结束时间
  const currentRoundEndTime = currentRoundPublishStartTime + publishTime

  // 出价期间
  if (nowTime >= currentRoundStartTime && nowTime < currentRoundCalcStartTime) {
    return {
      ...state,
      nowStatus: 'onBidding',
      nowTime,
      nowRound,
      nextStatus: 'onCalcuting',
      nextTime: currentRoundCalcStartTime,
      nextRoundTime: currentRoundEndTime,
      hasRound,
    }
  }

  // 计算结果期间
  if (nowTime >= currentRoundCalcStartTime && nowTime < currentRoundPublishStartTime) {
    return {
      ...state,
      nowStatus: 'onCalcuting',
      nowTime,
      nowRound,
      nextStatus: 'onPublishing',
      nextTime: currentRoundPublishStartTime,
      nextRoundTime: currentRoundEndTime,
      hasRound,
    }
  }

  // 当前如果为最后一轮，nextStatus = afterAuction
  let nextStatus = 'onBidding'
  if (nowTime >= currentRoundEndTime && nowTime >= endTime) {
    nextStatus = 'afterAuction'
  }
  // 公布结果期间
  if (nowTime >= currentRoundPublishStartTime && nowTime < endTime) {
    return {
      ...state,
      nowStatus: 'onPublishing',
      nowTime,
      nowRound,
      nextStatus,
      nextTime: currentRoundEndTime,
      nextRoundTime: currentRoundEndTime,
      hasRound,
    }
  }

  return null
}
