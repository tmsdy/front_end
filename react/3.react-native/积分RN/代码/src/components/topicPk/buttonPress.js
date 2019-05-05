/**
 * Created by liuzhimeng.
 * @date 2018/9/19
 * @description
 */

import {
  showToast,
} from '../../common/QYNativeBridge'
import {
  setVoteTopic,
  getReward,
} from './apis'

export const doVoteTopic = ({price, code: topicId}, optionId, totalScore) =>
  new Promise((resolve, reject) => {
    if (price > totalScore) {
      // sendBlockPingback('home_lackpoint')
      showToast('积分不足，快去做任务吧')
      return reject()
    }

    const params = {
      topicCode: topicId,
      optionCode: optionId,
    }

    console.log('setVoteTopic')

    setVoteTopic(params)
      .then((data) => {
        if (data.voteSuccessfully) {
          return resolve(data)
        }
        showToast('网络繁忙，请稍候重试')
        return reject(data)
      })
      .catch(err => {
        // sendBlockPingback('home_callfail')
        showToast('网络繁忙，请稍候重试')
        return reject(err)
      })
  })

export const getPkReward = ({detail}) => {
  const {code} = detail

  return new Promise((resolve, reject) => {
    const params = {
      topicCode: code
    }
    getReward(params)
      .then((data) => {
        if (data.getRewardSuccessfully) {
          return resolve(data)
        }
        showToast('领取奖励失败')
        return reject(data)
      })
      .catch(err => {
        showToast('领取奖励失败')
        return reject(err)
      })
  })
}
