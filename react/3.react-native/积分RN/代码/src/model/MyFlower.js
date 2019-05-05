import {isIOS} from '@iqiyi/rn-utils'

import {askToWithdraw, askToWithdrawState, executeTask, getFriendsList, flowerAddPush} from '../api';
import {GET_ENV} from '../constants/configs';
import {GARDEN_ENUM} from '../constants/IntegralEnum';
import {getObjectValueSafely} from '../common/util'

// 接口请求公共参数
const COMMON_PARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  verticalCode: 'iQIYI',
  agenttype: isIOS ? '20' : '21',
  typeCode: 'point',
  srcplatform: isIOS ? '20' : '21',
}

const SECURITY_PARAM = {
  dfp: global.CLIENT_INFO.dfp,
  did: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
  platform: isIOS ? 2 : 1,
  app_version: global.CLIENT_INFO.appVersion,
}

/**
 * 花儿页面接口数据处理
 */

function extractWateringInfo(data, userId = global.USER_INFO.userId) {
  let nextGift = (data.gifts || []).find(gift => gift.days > data.waterDays);
  let {waterCostScore} = data
  if(global.USER_INFO.userId === userId && data.waterDays === 0 && data.statusCode === 0) {
    waterCostScore = 0
  }
  return {
    wateredToday: data.wateredToday, // 今天是否已经浇水
    waterDays: data.waterDays, // 当前连续浇水天数
    waterDaysBeforeNextGift: (nextGift ? nextGift.days : data.maxWaterDays) - data.waterDays, // 距离下次领礼物还需浇水天数
    waterDaysBeforeDeath: data.waterDaysBeforeDeath, // 花儿临死前连续浇水天数
    maxWaterDays: data.maxWaterDays, // /最大连续浇水周期
    waterCostScore, // 浇水消耗的积分数值，给自己浇水第一次免费
  };
}

function formatDateOfWater(current) {
  const _current = []
  if(current.length) {
    current.map((item) => {
      const _item = item
      const date = new Date(item.timestamp);
      const day = `0${date.getDate()}`.substr(-2)
      const month = `0${date.getMonth() + 1}`.substr(-2)
      const year = date.getFullYear()
      _item.dateStr = `${day}${month}${year}`
      _current.push(item)
      return item
    })
    return _current
  }
}

// 获取抽奖信息
function getDrawInfo({vip = 0, lottery = null} = {}) {
  return {vip, lottery}
}

// 获取花儿日历提示文字
function getDaysTips(current = {}) {
  const exts = current.exts || []
  const calNotice = getObjectValueSafely(current, 'notes.calNotice', [])

  let tips = []

  for(const {days, notice} of calNotice) {
    if(notice) {
      tips.push({
        day: parseInt(days),
        type: 'period',
        platform: '',
        content: notice,
      })
    }
  }

  for(const {name, value} of exts) {
    const matchArr = name.match(/^(.*-)?daysTip_(.*)/)
    if(matchArr) {
      const [, platform, day] = matchArr
      tips.push({
        day: parseInt(day),
        type: 'gift',
        platform: !platform ? '' : platform.slice(0, -1),
        content: value,
      })
    }
  }

  return tips
}

// 获取花儿道具使用信息
function getPropInfo({
  reviveTotalCount = 0,
  reviveTotalLimit = 0,
  speedTotalCount = 0,
  speedTotalLimit = 0,
  speedDayCount = 0,
  speedDayLimit = 0,
} = {}) {
  return {
    reviveTotalCount,
    reviveTotalLimit,
    speedTotalCount,
    speedTotalLimit,
    speedDayCount,
    speedDayLimit
  }
}

/**
 * 花儿详情接口
 */
export function fetchFlowerDetail({userId = global.USER_INFO.userId}) {
  const requestHeader = {
    task_code: 'mageStats',
    timestamp: Date.now(),
  };
  const requestBody = {
    mageStats: Object.assign({}, COMMON_PARAM, {userId, detail: true}), // 是否返回用户详细数据
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000') {
        const {newborn, totalScore, current, available = []} = data.data,
          channelCode = current ? current.channelCode : '';
        return {
          flowerNewBorn: newborn,
          totalScore,
          statusCode: current ? current.statusCode : null, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          wateringInfo: current ? extractWateringInfo(current, userId) : {},
          gifts: current ? current.gifts : [],
          waterCostScore: current ? current.waterCostScore : 0,
          mode: current ? GARDEN_ENUM.CHANNELCODE_MODE[current.channelCode] : GARDEN_ENUM.CHANNELCODE_MODE.rose,
          beeCode: current ? current.beeCode : '',
          channelCode: newborn ? available[0] : channelCode,
          name: current ? current.name : '',
          drawInfo: current ? getDrawInfo(current) : {},
          daysInfo: current ? getDaysTips(current) : [],
          propInfo: current ? getPropInfo(current) : {},
          consumeEnd: current ? current.consumeEnd : 0, // 提现结束时间
          consumeStart: current ? current.consumeStart : 0, // 提现开始时间
          bookInfo: current ? {description: current.description, readMe: current.readMe} : {} // 金钱花培育书文案
        }
      }
    })
}

/**
 * 种下种子接口
 * 种花接口 force值可取 true or false  true为强制铲除 = 重置种花周期 + 种下花
 */
export function askToPlantFlower({force = false, userId, channelCode}) {
  const requestHeader = {
    task_code: 'magePlant',
    timestamp: Date.now(),
  };
  const requestBody = {
    magePlant: Object.assign({}, COMMON_PARAM, {force, channelCode, userId}),
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000' && data.data) {
        let current = data.data;
        return {
          statusCode: current.statusCode, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          wateringInfo: extractWateringInfo(current),
          gifts: current.gifts || [],
          waterCostScore: current.waterCostScore,
          beeCode: current ? current.beeCode : '',
          channelCode: current ? current.channelCode : '',
          name: current ? current.name : '',
        }
      }
    })
}

/**
 * 花儿浇水接口
 */
export function askToWatering({userId, helper, minusHours, channelCode, speedUp = false}, orderCode = '') {
  const requestHeader = {
    task_code: 'mageWater',
    timestamp: Date.now(),
    ...SECURITY_PARAM,
    channelCode,
  }
  let requestBody = {
    mageWater: {
      ...COMMON_PARAM,
      userId,
      helper,
      minusHours,
      speedUp,
    },
  }

  if(orderCode) {
    requestBody = {
      ...requestBody,
      daojuOrderChangeProductStatus: {
        order_code: orderCode,
      },
    }
  }

  const options = {
    preCheckFn: true
  }

  return executeTask(requestHeader, requestBody, options)
    .then((data) => {
      if(data.code === 'A00000' && data.data.code === 'A0000' && data.data.data) {
        let current = data.data.data;
        return {
          statusCode: current.statusCode, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          wateringInfo: extractWateringInfo(current, userId),
          gifts: current.gifts || [],
          waterCostScore: current.waterCostScore,
          moneyRed: current.moneyRed,
          beeCode: current ? current.beeCode : '',
          name: current.name,
          drawInfo: getDrawInfo(current),
          propInfo: getPropInfo(current),
        }
      }
      return Promise.reject(data)
    })

}

/**
 * 蜜蜂出现接口
 */
export function fetchBeeType({userId = global.USER_INFO.userId, beeCode}) {
  const requestHeader = {
    task_code: 'fairyComplete',
    timestamp: Date.now(),
  };
  const requestBody = {
    fairyComplete: Object.assign({}, COMMON_PARAM, {userId, channelCode: beeCode}),
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000' && data.data) { // 只有返回正确码才表示要出现蜜蜂
        let current = data.data;
        return {
          morphCode: current.morphCode, // bee_point 积分（金币蜜蜂）  bee_flower （养花道具的蜜蜂）bee_ad（广告道具的蜜蜂）
        }
      }
    })
}

/**
 * 捕获蜜蜂接口
 */
export function askToCatchBee({userId = global.USER_INFO.userId, helper, beeCode}) {
  const requestHeader = {
    task_code: 'fairyGetReward',
    timestamp: Date.now(),
  };
  const requestBody = {
    fairyGetReward: Object.assign({}, COMMON_PARAM, {userId, helper, channelCode: beeCode}),
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000' && data.data) { // 只有返回正确码才表示要出现蜜蜂
        let current = data.data;
        return {
          rewardType: current.rewardType, // 1=奖励积分，2=奖励道具
          rewardScore: current.rewardScore, // 奖励的积分数
          itemId: current.itemId, // 奖励的道具ID
          itemName: current.itemName, // 奖励的道具名称
          itemCount: current.itemCount, // 奖励的道具数量
          itemType: current.itemType,
          itemSubType: current.itemSubType, // type和subType一起区分道具类别，前端决定跳转
          rewardChannel: current.rewardChannel, // 碎片任务code
        }
      }
      return Promise.reject(data)
    })
}

/**
 * 领取礼物接口
 */
export function askToGetReward({userId}) {
  const requestHeader = {
    task_code: 'mageGift',
    timestamp: Date.now(),
  };
  const requestBody = {
    mageGift: Object.assign({}, COMMON_PARAM, {userId}),
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000' && data.data) {
        const current = data.data
        return (current)
      }
    })
}

/**
 * 获取好友列表接口
 */
export function fetchFriendsList({pageSize, page}) {
  const param = Object.assign({}, COMMON_PARAM, {
    limit: pageSize,
    offset: page * pageSize,
    userId: global.USER_INFO.userId,
  })
  return getFriendsList(param)
    .then((data) => {
      if(data) {
        return {
          contents: data.contents,
          total: data.total,
        }
      }
      return {
        contents: [],
        total: data.total,
      }
    })
}

// 获取花儿订单信息
export function fetchOrderInfo(subType, productStatus = 1) {
  const requestHeader = {
    task_code: 'daojuUserOrders',
    timestamp: Date.now(),
  }
  const requestBody = {
    daojuUserOrders: {
      product_status: productStatus,
      type: 8,
      sub_type: subType,
      partner_code: GET_ENV() === 'test' ? 'O2Vnjhxq78XGspD7' : '0oQOj2vrS1z89jkZ', // 产品 柯慧士
      user_id: global.USER_INFO.userId,
      vertical_code: 'iQIYI',
    },
  }
  return executeTask(requestHeader, requestBody)
}

/**
 * 获取用户加速肥信息
 */
export function fetchSpeederInfo() {
  return fetchOrderInfo(24)
    .then((data) => {
      if(data.data) {
        const {total, contents} = data.data
        return {
          totalNum: total,
          speederList: contents,
        }
      }
      return {
        totalNum: 0,
        speederList: [],
      }
    })
}

// 获取提现卡信息
export async function fetchWithdrawInfo(productStatus) {
  try {
    const {data} = await fetchOrderInfo(19, productStatus)
    if(data) {
      const {total, contents} = data
      return {total, list: contents}
    }
    return {total: 0, list: []}
  } catch(e) {
    return {total: 0, list: []}
  }
}

/**
 * 获取用户复活化肥信息
 */
export function fetchReliveInfo() {
  return fetchOrderInfo(18)
    .then((data) => {
      if(data.data) {
        const {total, contents} = data.data
        return {
          totalNum: total,
          reviveList: contents,
        }
      }
      return {
        totalNum: 0,
        reviveList: [],
      }
    })
}

// 使用复活化肥
export function askToRevive(orderCode) {
  const requestHeader = {
    task_code: 'mageRevive',
    timestamp: Date.now(),
  }
  const requestBody = {
    mageRevive: Object.assign({}, COMMON_PARAM, {userId: global.USER_INFO.userId}),
    daojuOrderChangeProductStatus: {
      order_code: orderCode,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A0000' && data.data) {
        let current = data.data;
        return {
          statusCode: current.statusCode, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          wateringInfo: extractWateringInfo(current),
          gifts: current.gifts || [],
          waterCostScore: current.waterCostScore,
          beeCode: current ? current.beeCode : '',
        }
      }
    })
}

/**
 * 添加好友接口
 */
export function askToAddFriends({userId = global.USER_INFO.userId, avatar, nickname, friendId, friendAvatar, friendNickname}) {
  const requestHeader = {
    task_code: 'relationAddFriend_v3',
    timestamp: Date.now(),
    ...SECURITY_PARAM,
    invite_uid: friendId,
  }
  const requestBody = {
    relationAddFriend: Object.assign({}, {
      userId,
      avatar,
      nickname,
      friendId,
      friendAvatar,
      friendNickname,
    }),
    streamDevicePeople: {
      deviceId: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data && data.data.success) {
        return {
          success: data.data.success, // 添加好友是否成功
          newReviver: !!data.newReviver, // 是否获得新的复活化肥
          newCollection: !!data.newMoneyChip, // 是否获得新的金钱花碎片
          newSpeeder: !!data.newSpeeder, // 是否获得新的加速液
        }
      }
      return Promise.reject(data)
    })
}

// 获取用户获得复活化肥的数量
// http://wiki.qiyi.domain/pages/viewpage.action?pageId=222496081#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%89%A7%E8%A1%8C%E4%BB%BB%E5%8A%A1%E8%AF%B4%E6%98%8E-4.getNewReviver
export function fetchNewPropsInfo(flowerCode) {
  const requestHeader = {
    task_code: 'getNewReviver',
    timestamp: Date.now(),
  }
  const requestBody = {
    newReviver: {
      userId: global.USER_INFO.userId,
      flowerCode,
    },
    generalInfo: {
      agentversion: COMMON_PARAM.agentversion,
      appver: COMMON_PARAM.appver,
      agenttype: COMMON_PARAM.agenttype,
      srcplatform: COMMON_PARAM.srcplatform,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      return {
        newReviverNum: data.newReviverNum || 0, // 复活肥
        newCollectionNum: data.moneyChip || 0, // 集宝卡
        newWithdrawNum: data.newWithdrawNum || 0, // 提现卡
        newSpeederNum: data.newSpeederNum || 0, // 加速液
      }
    })
}

// 获取收集碎片数据
export function fetchConditionStatus(channelCode) {
  const requestHeader = {
    task_code: 'mageGetConditionStatus',
    timestamp: Date.now(),
  }
  const requestBody = {
    mageGetConditionStatus: {
      ...COMMON_PARAM,
      channelCode,
      userId: global.USER_INFO.userId,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then(({code, data}) => {
      if(code === 'A0000') {
        return data
      }
      return {}
    })
}

// 用户金币查询
export function fetchUserMoney() {
  const requestHeader = {
    task_code: 'userMoney',
    timestamp: Date.now(),
  }
  const requestBody = {
    userMoney: {
      ...COMMON_PARAM,
      userId: global.USER_INFO.userId,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then(({code, data}) => {
      if(code === 'A0000') {
        return data
      }
      return {}
    })
}

// 查询用户历史累计消费金币总额
export async function fetchUserConsumedMoney() {
  try {
    const requestHeader = {
      task_code: 'userMoneySummaryConsume',
      timestamp: Date.now(),
    }
    const requestBody = {
      userMoneySummaryConsume: {
        ...COMMON_PARAM,
        userId: global.USER_INFO.userId,
      },
    }
    const {code, data} = await executeTask(requestHeader, requestBody)
    if(code === 'A0000') {
      return data
    }
    return {}
  } catch(e) {
    return {
      code: 'error',
      message: '网络繁忙，提现金额查询失败',
    }
  }
}

// 获取是否已提现过
export function fetchIsWithdrawed(channelCode) {
  const requestHeader = {
    task_code: 'mageStatsCash',
    timestamp: Date.now(),
  }
  const requestBody = {
    mageStatsCash: {
      ...COMMON_PARAM,
      userId: global.USER_INFO.userId,
      channelCode,
    },
  }
  return executeTask(requestHeader, requestBody)
    .then(({code, data}) => {
      if(code === 'A0000') {
        return data
      }
      return false
    })
}

// 获取用户提现情况（包含是否提现、未提现金额、累计已提现金额）
export async function fetchWithdrawState(channelCode) {
  try {
    const requestHeader = {
      task_code: 'mageWithdrawInfo',
      timestamp: Date.now(),
    }
    const requestBody = {
      mageStatsCash: {
        ...COMMON_PARAM,
        userId: global.USER_INFO.userId,
        channelCode,
      },
    }
    return askToWithdrawState(requestHeader, requestBody)
  } catch(e) {
    return {
      code: 'error',
      message: '网络繁忙，提现金额查询失败',
    }
  }
}

// 提现到爱奇艺钱包
export async function askToWithdrawInFlower(orderId) {
  try {
    const requestHeader = {
      task_code: 'daojuUseWithdrawCard',
      timestamp: Date.now(),
      ...SECURITY_PARAM,
    }
    const requestBody = {
      daojuOrderChangeProductStatus: {
        agentversion: COMMON_PARAM.agentversion,
        srcplatform: COMMON_PARAM.srcplatform,
        appver: COMMON_PARAM.appver,
        vertical_code: 'iQIYI',
        user_id: global.USER_INFO.userId,
        order_code: orderId,
      },
    }
    const {code, data, message = '网络繁忙，提现失败'} = await askToWithdraw(requestHeader, requestBody)
    if(code === 'A00000') {
      return data
    }
    return {code, message}
  } catch(e) {
    return {
      code: 'error',
      message: '网络繁忙，提现失败',
    }
  }
}

// 获取用户历史种花信息
export function fetchHistory() {
  const requestHeader = {
    task_code: 'mageHistory',
    timestamp: Date.now(),
  }
  const requestBody = {
    mageHistory: Object.assign({}, COMMON_PARAM, {userId: global.USER_INFO.userId}),
  }
  return executeTask(requestHeader, requestBody)
    .then(({code, data = []}) => {
      if(code === 'A0000' && data && data.length) {
        const newData = data
        for(let i = 0; i < data.length; i++) {
          const item = data[i]
          newData[i].mode = GARDEN_ENUM.CHANNELCODE_MODE[item.channelCode]
        }
        return newData
      }
      return []
    })
}

// 花儿日记分页接口
export function fetchDiaryDataByPage({pageSize, page, userId = global.USER_INFO.userId}) {
  const requestHeader = {
    task_code: 'flowerDiaryGetDiary',
    timestamp: Date.now()
  }
  const requestBody = {
    flowerDiaryGetDiary: Object.assign({}, COMMON_PARAM, {
      limit: pageSize,
      offset: page * pageSize,
      userId
    })
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A00000' && data.data.contents.length) {
        return {
          total: data.data.total,
          contents: formatDateOfWater(data.data.contents)
        }
      } else {
        return {
          contents: [],
          total: 0
        }
      }
    })
}

// 花儿日记是否展示红点
export function fetchHasNewDiary(userId = global.USER_INFO.userId) {
  const requestHeader = {
    task_code: 'flowerDiaryHasNewDiary',
    timestamp: Date.now()
  }
  const requestBody = {
    flowerDiaryHasNewDiary: Object.assign({}, {
      userId
    })
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      if(data.code === 'A00000') {
        return {
          hasNew: data.data.hasNew
        }
      }
      return {
        hasNew: false
      }
    })
}

// 花儿图鉴接口
export function fetchFlowerIllustration() {
  const requestHeader = {
    task_code: 'mageHandbooks',
    timestamp: Date.now()
  }
  const requestBody = {
    mageHandbooks: Object.assign({}, COMMON_PARAM, {
      userId: global.USER_INFO.userId
    })
  }
  return executeTask(requestHeader, requestBody).then((data) => {
    if(data.code === 'A0000') {
      return data.data
    }
    return []
  })
}

export function fetchHasShowVipCard() { // 查询是否展示vip天卡弹窗
  const requestHeader = {
    task_code: 'showPopup',
    timestamp: Date.now()
  }
  const requestBody = {
    userId: global.USER_INFO.userId,
    channelCode: 'draw_isshow' // vip_isshow：VIP卡弹窗；draw_isshow：抽奖弹窗
  }
  return executeTask(requestHeader, requestBody).then((data) => {
    return data.vipShow
  })
}

export function askToCloseVipModal() { // 展示弹窗调用接口告诉后端已展示过了
  const requestHeader = {
    task_code: 'closePopup',
    timestamp: Date.now()
  }
  const requestBody = {
    userId: global.USER_INFO.userId,
    channelCode: 'draw_isshow' // vip_isshow：VIP卡弹窗；draw_isshow：抽奖弹窗
  }
  return executeTask(requestHeader, requestBody).then()
}

// 领取抽奖奖励
export function askToGetDrawReward(lotteryId) {
  const requestHeader = {
    task_code: 'mageLottery',
    timestamp: Date.now()
  }
  const requestBody = {
    mageLottery: {
      ...COMMON_PARAM,
      userId: global.USER_INFO.userId,
      lotteryId,
    },
  }
  return executeTask(requestHeader, requestBody)
}

export function fetchFlowerSeeds() {
  const requestHeader = {
    task_code: 'mageSeeds',
    timestamp: Date.now()
  }
  const requestBody = {
    mageSeeds: {
      ...COMMON_PARAM,
      userId: global.USER_INFO.userId,
    }
  }
  return executeTask(requestHeader, requestBody).then((data) => {
    if(data.code === 'A0000') {
      return data.data || []
    }
    return []
  })
}

// 打开浇水通知（通过引擎操作）
export function askToFlowerAddPush() {
  return flowerAddPush({
    agenttype: COMMON_PARAM.agenttype,
    agentversion: COMMON_PARAM.agentversion,
    srcplatform: COMMON_PARAM.srcplatform,
    appver: COMMON_PARAM.appver,
    userId: global.USER_INFO.userId,
  })
}
// 查询金钱花加好友进度
export function fetchAddFriendsProcess() {
  const requestHeader = {
    task_code: 'addFriendsProcess',
    timestamp: Date.now()
  }
  const requestBody = {
    friend_get_list: {
      userId: global.USER_INFO.userId,
    }
  }
  return executeTask(requestHeader, requestBody).then((data) => {
    return data
  })
}
