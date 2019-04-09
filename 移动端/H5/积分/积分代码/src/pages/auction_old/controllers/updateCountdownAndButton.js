/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description
 */

import {staticData} from '../assets'

const {COUNT_DOWN, BUTTON} = staticData

/**
 * 获取用户当前状态类型
 * @param nowStatus     当前周期
 * @param isWin         是否获奖
 * @param isBid         是否出价
 * @param bottomScore   底价
 * @param userScore     用户总积分
 * @returns {string}    unbid、bid、beShotOf、loseAward、getAward
 */
function getUserType(nowStatus, isWin, isBid, bottomScore, userScore, userAward) {
  if (nowStatus === 'onPublishing' && isWin && userAward) {
    return 'getAward'
  }
  if (isBid) {
    if (nowStatus === 'onPublishing' && !isWin) {
      return 'loseAward'
    }
    return 'bidded'
  }
  if (bottomScore > userScore) {
    return 'beShotOf'
  }
  return 'unbid'
}

/**
 * 更新倒计时状态及配文
 * @param {object} lifeCycle数据
 */
export function updateCountdown({nowStatus}) {
  const {
    content: [
      countdownTitle,
      countdownSubTitle,
    ],
    active,
  } = COUNT_DOWN[nowStatus]()

  $('*[data-countdown="title"]').text(countdownTitle)
  $('*[data-countdown="subTitle"]').text(countdownSubTitle)

  if (active) {
    $('*[data-countdown-id="countdown"]').removeClass('disabled')
  } else {
    $('*[data-countdown-id="countdown"]').addClass('disabled')
  }
}

/**
 * 更新出价按钮
 * @param nowStatus   当前状态
 * @param data        竞拍详情
 */
export function updateBidButton({nowStatus}, data) {
  const {
    is_limit: isLimit,
    is_bid: isBid,
    bottom_price: bottomScore,
    currentBid,
    userScore,
    userAward,
    isWin,
  } = data
  let buttonObj = null
  let type = null

  // 用户已达竞拍限制
  const state = isLimit ? 'limit' : 'lifecycle'
  const buttonState = BUTTON(state)

  if (isLimit) {
    buttonObj = buttonState.day
    type = 'day'
  } else {
    type = getUserType(nowStatus, isWin, isBid, bottomScore, userScore, userAward)
    buttonObj = buttonState[nowStatus]
  }
  // console.log('type:', type, 'nowStatus:',nowStatus, 'isWin:', isWin, 'isBid:',isBid, 'bottomScore',bottomScore, 'userScore',userScore, 'userAward:',userAward)

  // 处理用户积分接口错误情况
  if (userScore === null) {
    return
  }

  $('*[data-score]').text(userScore)

  const {text, active} = buttonObj(type, currentBid)
  const $button = $('*[data-bid="button"]')
  $button.text(text)
  if (active) {
    $button.removeClass('disabled')
  } else {
    $button.addClass('disabled')
  }
}
