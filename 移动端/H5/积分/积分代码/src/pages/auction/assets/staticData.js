function getState(active, text) {
  return {
    active, text
  }
}

/**
 *
 * @param cycle 所在竞拍周期 beforeAuction, onBidding, onCalcuting, onPublishing, afterAuction
 * @param type day(累积已达每人每天获奖总量上限), whole(累积已达每人获奖总量上限), unbid(未出价), bidded(已出价), beShotOf(积分不足), getAward(已中奖), loseAward(未中奖)
 * @param price 已出价的积分值
 * @returns {{active, text}}
 */
function getButtonState(cycle, {type, price} = {}) {
  if (cycle === false) {
    if (type === 'day') {
      return getState(false, '今日已获奖，明天再来')
    }
    if (type === 'whole') {
      return getState(false, '抢拍大神，手下留情')
    }
  }

  if (cycle !== 'afterAuction' && type === 'beShotOf') {
    return getState(true, '积分不足，去赚积分')
  }

  if (cycle === 'beforeAuction'
    || cycle === 'onCalcuting' && type === 'unbid'
    || cycle === 'onPublishing' && type === 'unbid'
  ) {
    return getState(false, '立即出价')
  }

  if (cycle === 'onBidding' && type === 'unbid') {
    return getState(true, '立即出价')
  }

  if (cycle === 'onBidding' && type === 'bidded'
    || cycle === 'onCalcuting' && type === 'bidded'
  ) {
    return getState(false, `已出价${price}积分`)
  }

  if (cycle === 'onPublishing' && type === 'getAward') {
    return getState(false, '本轮抢拍成功')
  }

  if (cycle === 'onPublishing' && type === 'loseAward') {
    return getState(false, '未拍中，下一轮加油')
  }

  if (cycle === 'afterAuction') {
    return getState(false, '活动已结束')
  }
}

const BUTTON = (state) => {
  if (state === 'lifecycle') {
    return {
      beforeAuction: (type) => getButtonState('beforeAuction', {type}),
      onBidding: (type, price = 0) => getButtonState('onBidding', {type, price}),
      onCalcuting: (type, price = 0) => getButtonState('onCalcuting', {type, price}),
      onPublishing: (type, price = 0) => getButtonState('onPublishing', {type, price}),
      afterAuction: (type, price = 0) => getButtonState('afterAuction', {type, price}),
    }
  }

  if (state === 'limit') {
    return {
      day: () => getButtonState(false, {type: 'day'}),
      whole: () => getButtonState(false, {type: 'whole'}),
    }
  }

  return null
}

const COUNT_DOWN = {
  beforeAuction: () => ({
    content: ['即将开始', '每分钟一轮'],
    active: true,
  }),
  onBidding: () => ({
    content: ['出价倒计时', '每分钟一轮'],
    active: true,
  }),
  onCalcuting: () => ({
    content: ['开奖倒计时', '每分钟一轮'],
    active: true,
  }),
  onPublishing: () => ({
    content: ['下一轮即将开始', '每分钟一轮'],
    active: true,
  }),
  afterAuction: () => ({
    content: ['开奖倒计时', '每分钟一轮'],
    active: false,
  }),
}

export default {
  BUTTON,
  COUNT_DOWN,
}
