/**
 * Created by liuzhimeng.
 * @date 2018/9/18
 * @description
 */

import {formatRelativeTime, getObjectValueSafely} from '../../common/util'
import {formatNumber} from './helpers'
import {BG_COLOR_BLUE, BG_COLOR_PINK} from './constants'

// 获取当前所在周期及细分信息
const getPeriod = (detail) => {
  const nowTime = Date.now()
  const {
    start_time: startTime, // 投票开始时间
    end_time: endTime, // 投票结束时间
    draw_time: drawTime, // 开奖时间
    reward_valid_time: rewardValidTime, // 领奖截止时间
  } = detail

  // 投票开始前
  if(nowTime < startTime) {
    return 'before'
  }
  // 投票进行中
  if(nowTime >= startTime && nowTime < endTime) {
    return 'in'
  }
  // 开奖时间
  if(nowTime >= endTime && nowTime < drawTime) {
    return 'draw'
  }
  // 领奖时间
  if(nowTime >= drawTime && nowTime < rewardValidTime) {
    return 'reward'
  }
  // 活动结束
  return 'after'
}

// 判断显示图文还是图表
const getMode = (period) => {
  if(period === 'before' || period === 'in') {
    return 'image'
  }
  return 'chart'
}

const getCheckedKey = ({options, user_option_code: userOptionCode}) => {
  return userOptionCode ? options.findIndex(i => i.option_code === userOptionCode) : -1
}


const getExtraText = (period, type, {price, total_reward: totalReward}) => {
  const reward = formatNumber(totalReward)
  if(period === 'in') {
    // 进行中的需要展示单次投票积分值
    return [
      {id: '1', text: '积分/票，'},
      {id: '2', text: '得票更高一方瓜分'},
      {id: '3', text: `hl|${reward}`},
      {id: '4', text: '积分'},
    ]
  }
  if(period === 'before') {
    // 进行中的需要展示单次投票积分值
    return null
  }
  if(type === 'my') {
    return [
      {id: '1', text: `hl|${price}`},
      {id: '2', text: '积分/票,瓜分'},
      {id: '3', text: `hl|${reward}`},
      {id: '4', text: '积分'},
    ]
  }
  return [
    {id: '1', text: '票高一方已瓜分'},
    {id: '2', text: `hl|${reward}`},
    {id: '3', text: '积分'},
  ]
}

const isShowButton = (period, type, {win_option_code: winOptionCode, user_option_code: userOptionCode}) =>
  period === 'draw' && type === 'my' || ['reward', 'after'].indexOf(period) !== -1 && type === 'my' && winOptionCode === userOptionCode

const isShowText = (period) => {
  return period === 'in' || period === 'before'
}

const isShowCheckedStatus = (type, period) => type === 'my' && period !== 'in'

const getButtonText = (period, type, {
  each_reward: eachReward,
  start_time: startTime,
  draw_time: drawTime,
  user_reward_given: userRewardGiven,
  win_option_code: winOptionCode,
  user_vote_number: userVoteNumber,
}) => {
  const totalReward = userVoteNumber * eachReward
  if(period === 'before') {
    return `${formatRelativeTime(startTime)}开始`
  }
  if(period === 'in') {
    // 进行中的话题 固定展示开奖时间
    return `${formatRelativeTime(drawTime)}开奖`
  }
  if(type === 'my') {
    if(period === 'draw') {
      return `${formatRelativeTime(drawTime)}开奖`
    }
    if(period === 'reward') {
      return userRewardGiven ? `已领取${totalReward}积分` : `领取${totalReward}积分`
    }
    if(period === 'after') {
      return winOptionCode && userRewardGiven ? `已领取${totalReward}积分` : '已超过领取时间'
    }
  }
  return ''
}

const getButtonTodo = (period, type) => {
  if(period === 'in') {
    return 'doCall'
  }
  if(type === 'my' && period === 'reward') {
    return 'getReward'
  }
  return ''
}

const getButtonActive = (period, {
  win_option_code: winOptionCode,
  user_option_code: userOptionCode,
  user_reward_given: userRewardGiven,
}) =>
  period === 'in' && !userOptionCode
  || period === 'reward' && winOptionCode === userOptionCode && !userRewardGiven

const getIconStatus = (type, optionCode, userOptionCode, winOptionCode) => {
  if(winOptionCode) {
    if(type === 'my') {
      if(optionCode === userOptionCode) {
        return userOptionCode === winOptionCode ? 'success' : 'fail'
      }
      return ''
    } else {
      if(optionCode === winOptionCode) {
        return 'success'
      }
      return ''
    }
  }
  return ''
}

/**
 *实际票数只有1位，展示全票数；@龚藤
*实际票数只有2位，展示“*”+个位票数；
*实际票数>=3位，展示“*”+十位、个位票数，*的数量=实际票数位数-2
 */
const getHideVoteNumber = (current, another) => {
  let result = ''
  const currentLength = current.length
  let maxLength = currentLength > another.length ? currentLength : another.length;
  const _result = maxLength === currentLength ? current : `${[...Array(maxLength - currentLength + 1)].join('0')}${current}`
  if(maxLength === 1) {
    result = _result
  } else if(maxLength === 2) {
    result = _result.replace(/./, '*')
  } else {
    const _distance = maxLength - 2
    const reg = new RegExp(`(.{${_distance}})`)
    const replaceStr = (new Array(_distance + 1)).join('*')
    result = _result.replace(reg, replaceStr)
  }
  return result
}

const getViewOption = (option, key, mode, period, type, {
  user_option_code: userOptionCode,
  win_option_code: winOptionCode,
  options = [],
}, anotherVoteNumber = 0) => {
  const {option_code: optionCode} = option
  if(mode === 'image') {
    return {
      option,
      id: optionCode,
      title: option.title,
      imgUrl: option.picture,
      desc: period === 'in' && !!userOptionCode ? `${getHideVoteNumber(option.vote_number.toString(), anotherVoteNumber.toString())}票` : '',
      mainColor: optionCode === '1' ? BG_COLOR_BLUE : BG_COLOR_PINK,
      checked: false,
      userOptionCode,
      disalbed: !!(period === 'before'), // 只有即将开始才明确是灰色按钮，进行中需要判断当前按钮是否是用户已选的
    }
  }

  const total = options.length === 2 ? Number(options[0].vote_number) + Number(options[1].vote_number) : 0
  return {
    total,
    option,
    mode: key === 1 ? 'right' : 'left',
    id: optionCode,
    title: option.title,
    desc: `${Math.round(option.vote_number * 100 / total)}%`,
    current: Number(option.vote_number),
    disabled: !!winOptionCode && winOptionCode !== optionCode,
    status: getIconStatus(type, optionCode, userOptionCode, winOptionCode),
  }
}

const getViewOptions = (mode, period, type, detail, options) => {
  return {
    checkKey: -1,
    lists: options.map((i, k) => {
      // 需要对比2个投票值，进行隐藏处理
      const anotherVoteNumber = k === 0 ? options[1] && options[1].vote_number : options[0] && options[0].vote_number
      return getViewOption(i, k, mode, period, type, detail, anotherVoteNumber)
    }),
  }
}

const getVoteResultOptions = (mode, type, options) => {
  if(mode === 'image') {
    return null
  }
  return {
    left: getObjectValueSafely(options[0], 'vote_number', 0),
    right: getObjectValueSafely(options[1], 'vote_number', 0),
  }
}

const getVoteResultStatus = (mode, type, detail) => {
  const {user_option_code: userOptionCode, win_option_code: winOptionCode} = detail
  if(type === 'my' && winOptionCode) {
    if(userOptionCode === winOptionCode) {
      return 'success'
    }
    return 'fail'
  }
  return ''
}
export const getSharePic = (period, detail) => {
  const _temp = getObjectValueSafely(detail, 'options')[0] || {}
  const result = getObjectValueSafely(_temp, 'picture') || ''
  return result
}
export const getLifeCycleState = ({detail = {}, userScore = -1}, {type = 'all'} = {}) => {
  const {
    code: id,
    name, // 标题
    options,
    user_vote_number: userVoteNumber,
    limit_number: limitNumber,
    view_complete_votes: viewCompleteVotes // 如果用户可查看当前话题完整票数则为true 否则为false
  } = detail
  const period = getPeriod(detail)

  const mode = getMode(period, type)
  const topicOptions = {
    title: name,
    checkedKey: getCheckedKey(detail),
    showButton: isShowButton(period, type, detail),
    showText: isShowText(period),
    showCheckedStatus: isShowCheckedStatus(type, period),
    buttonText: getButtonText(period, type, detail),
    buttonTodo: getButtonTodo(period, type),
    extra: getExtraText(period, type, detail),
    userVoteNumber,
    limitNumber: limitNumber === null ? 1 : limitNumber, // 后台约定，如果limitNumber为null,表示是1,且唯一不会有其他值为null @潘乐婷
    viewCompleteVotes,
    picture: getSharePic(period, detail)
  }
  const buttonOptions = {
    mode: 'pure',
    disabled: !getButtonActive(period, detail),
  }
  const viewOptions = getViewOptions(mode, period, type, detail, options)

  const voteResultOptions = getVoteResultOptions(mode, type, options)

  const voteResult = getVoteResultStatus(mode, type, detail)

  return {
    detail,
    userScore,
    type,
    id,
    period,
    mode,
    topicOptions,
    buttonOptions,
    viewOptions,
    voteResultOptions,
    voteResult
  }
}
