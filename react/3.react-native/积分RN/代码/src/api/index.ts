/**
 * @author lzj
 * 定义所有用到的接口
 */

import {AsyncStorage} from 'react-native'
import {isIOS} from '@iqiyi/rn-utils'
import QYRequest from '../common/QYRequest'
import {creatShareUrl, getSign, getSignForCouponList, paramsSerializer} from '../common/util'

import {
  TaskParams,
  TaskExtsParams,
  GetPunchLastParams,
  MedalRank,
  FetchUserInfoParams,
  GetUserInfo
} from '../typings/apis'

const REQUEST_PARAMS = {
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIOS ? '20' : '21',
  srcplatform: isIOS ? '20' : '21',
  appKey: 'basic_h5',
}
const CONSTPARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  version: global.CLIENT_INFO.appVersion,
}
// 风控参数，指纹
const dfp = isIOS ? {dfp: global.CLIENT_INFO.dfp} : {}

const ApiList = {
  USER_INFO: 'user/info', // 用户信息
  CHECK_IN_QYID: 'dfp/score/add', // 积分累计接口 设备id
  CHECK_IN: 'score/add', // 签到
  GET_REWARD: 'score/getReward', // 任务领取奖励
  GET_REWARD_QYID: 'dfp/score/getReward',
  SCORE_CONSUME: 'score/consume', // 消耗积分
  SCORE_CONSUME_CALLBACK: 'score/consumeCallback', // 消耗积分回调
  TASK_LIST: 'task/list', // 任务列表
  TASK_EXECUTE: 'task/execute',
  TASK_REQUEST_BODY: 'task/requestBodyExample', // 获取执行任务参数
  TREASURE_LIST: 'treasure/list', // 夺宝列表
  SUBSCRIBE_PUSH: 'common/subscribePush', // 用户注册活动Push推送
  UNSUBSCRIBE_PUSH: 'common/unsubscribePush', // 用户取消注册活动Push推送
  SUBSCRIBE_PUSH_STATUS: 'common/subscribeStatus', // 查看用户是否注册活动Push推送
  TREASURE_NOTICE: 'treasure/notice', // 夺宝提醒
  PARTICIPATE_TREASURE: 'treasure/participate', // 参与夺宝
  SHOW_REWARD: 'paradise/reward', // 抢拍成功记录
  INTEGRAL_LIST: 'score/list', // 积分明细
  VIP_CHECK: 'api/process.action', // 查询是否付费会员
  VIP_TASKSTATUS: 'getTaskStatus', // 会员任务状态查询
  VIP_GETREWARD: 'getTaskRewards', // 会员任务领取奖励
  TASK_COMPLETE: 'task/complete', // 任务完成接口,
  COUPON_LIST: 'http://wallet.iqiyi.com/coupons/query/queryCoupons.action',
  GET_COUPON: 'http://wallet.iqiyi.com/services/coupon/pcw-send.action',
  WECHAT_QRCODE: 'http://wechat.if.iqiyi.com/apis/qrcode/bindWithCookie',
  INTEGRAL_SHOPPING: 'http://mall.iqiyi.com/apis/score/external/get_product_list.action',
  TOPIC_LIST: 'topic/list', // 话题列表,
  MY_TOPIC_LIST: 'topic/myList', // 我参与的话题列表,
  TOPIC_DETAIL: 'topic/detail', // 话题详情,
  TOPIC_VOTE: 'topic/vote', // 话题投票,
  TOPIC_GETREWARD: 'topic/getReward', // 领取话题奖励
  AVAILABLE_SCORE: 'topic/availableScores', // 用户可领取积分数
  PARADISE_MESSAGE: 'paradise/messages', // 乐园滚动消息接口
  AUCTION_DETAIL: 'auction/current', // 抢拍详情接口
  CURRENT_ATTENDER: 'auction/currentAttender', // 获取本轮实时出价人数与昵称列表
  USER_INFO_PASSPORT: 'http://h5.m.iqiyi.com/static/basketball',
  DANMU_INFO: 'userStatMedal',
  BIND_COUPONS: 'http://coupons.qiyi.domain/services/coupon/send.action',
  IS_VIP: 'http://vinfo.vip.iqiyi.com/external/vip_users',
  ORDER_RECORD: 'http://mall.iqiyi.com/apis/activity/baseline/score/ordercounts.action',
  AVALIABLE_SCORE: 'topic/availableScores',
  FLOWER_ADDPUSH: 'flower/addPush',
  FRIENDS_LIST: 'flower/friendList',
  ORDER_LIST: 'http://api.vienx.iqiyi.com/v1/user/orders.json', // 我的收获页面订单列表
  ORDER_DETAIL: 'http://buy.vienx.iqiyi.com/v1/order/query.json', // 我的收获页面订单详情
  SEND_GEO: '/user/geo/send', // 发送用户地理位置信息
  RISK_CONTROL: 'http://control.i.iqiyi.com/control/content_config?business=hottalk&is_iqiyi=true', // 风控
  PUNCHTAST_VOTE: 'punchTask/vote', // 打卡活动用户投票接口
  PUNCHTASK_PUNCH: 'punchTask/punch', // 打卡活动用户打卡
  PUNCHTASK_DETAIL: 'punchTask/detail', // 打卡活动详情接口
  PUNCHTASK_LASTPUNCH: 'punchTask/lastPunch', // 打卡活动昨日战况接口
  PUNCHTASK_HISTORY: 'punchTask/history', // 用户打卡详情接口
  PUNCHTASK_RESULT: 'punchTask/result', // 开奖结果接口
  TOPIC_VIEWCOMPLETEVOTE: 'topic/viewCompleteVotes', // 请求使当前用户可查看当前话题的完整票数
  REWARDS_INFO: 'lottery/attender', // 宝箱获奖信息
  REWARDS_RESULT: 'lottery/draw', // 宝箱获奖结果
  QICHUAN_AUTHORIZE: 'http://openapi.iqiyi.com/api/person/authorize',
  QICHUAN_UPLOADPIC: 'http://secupload.iqiyi.com/common_upload'
}

// 从缓存判断当前环境
;(async () => { // eslint-disable-line
  const value = await AsyncStorage.getItem('envteststore')
  console.log(`====== CURRENT ENV: ${value} ======`) // eslint-disable-line no-console
  QYRequest.setEnv(value === 'test' ? 'test' : 'pro')
})()

QYRequest.setPreCheck((res) => {
  if(res) {
    // 兼容兑吧接口返回值
    if(res.status === 'ok') {
      return res
    } else if(res.code === 'A00000' || res.code === 'SUC0000') {
      return res.data
    } else if(typeof res === 'string') {
      return JSON.parse(res)
    }

    return Promise.reject(new Error(res.message))
  }
})

function buildParams(params = {}, extra = true) {
  let temp
  // const test = {
  //   appver: '9.7.0',
  //   version: '9.7.0',
  //   agentversion: '9.7.0'
  // }
  if(extra) {
    temp = {...REQUEST_PARAMS, ...global.COMMON_PARAMS, ...params}
  } else {
    temp = {
      ...global.COMMON_PARAMS,
      ...params,
      appKey: 'basic_h5',
    }
  }
  temp = paramsSerializer(temp)
  const sign = getSign(temp)
  temp.sign = sign
  return temp
}

function buildParams2(params) {
  const temp = params
  const sign = getSignForCouponList(temp)
  temp.sign = sign
  return temp
}

function buildParams3(params, extra = true) {
  let temp
  if(extra) {
    temp = {...REQUEST_PARAMS, ...CONSTPARAM, ...params}
  } else {
    temp = {
      ...params,
      appKey: 'basic_h5',
    }
  }
  const sign = getSign(temp)
  temp.sign = sign
  return temp
}

// function buildParamsForVip(param) {
//   let temp
//   let CONST = {
//     platform: isIOS ? '20' : '21',
//     appVersion: global.CLIENT_INFO.agentversion,
//     deviceId: global.CLIENT_INFO.deviceId,
//     bizSource: 'daoju',
//     messageId: getuuid(),
//     version: '3.0',
//     vipTypes: '1'
//   }
//   temp = {...CONST, ...param}
//   return temp
// }

/**
 * 获取用户信息
 * @param {FetchUserInfoParams}
 * @return {GetUserInfo} !!! 去掉了数组数据，返回数据第一项数据
 */
export async function fetchUserInfo(params: FetchUserInfoParams): Promise<GetUserInfo> {
  try {
    const data = await QYRequest.get({
      url: ApiList.USER_INFO,
      params: buildParams(params),
      domain: 'community',
    })

    if(data && data.length) {
      return data[0]
    }
    throw new Error('未获取到用户信息')
  } catch(e) {
    throw e
  }
}

// 获取用户信息（弃用，请使用 fetchUserInfo）
export async function getUserInfo(params: FetchUserInfoParams) {
  return QYRequest.get({
    url: ApiList.USER_INFO,
    params: buildParams(params),
    domain: 'community',
  })
}

/**
 * 兑吧生活精选
 * @param params
 * @param ext
 * @param options
 */
export function executeTask(params: TaskParams, ext: TaskExtsParams = {}, options = {preCheckFn: false}) {
  let _ext = ext
  // qipu_ 相关的接口，增加generalInfo
  if(params && params.task_code && /qipu_/.test(params.task_code)) {
    _ext = {
      generalInfo: {
        ...CONSTPARAM
      },
      ...ext,
    };
  }

  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    taskCode: params.task_code,
    params: buildParams(params, false),
    domain: 'community',
    ext: _ext.daojuProductList
      ? {
        daojuProductList: {
          ..._ext.daojuProductList,
          version: global.COMMON_PARAMS.version,
        },
      }
      : _ext,
    options
  })
}

export function executeTaskBody(params) {
  return QYRequest.get({
    url: ApiList.TASK_REQUEST_BODY,
    params: buildParams(params),
    domain: 'community',
  })
}

export function unLoginExecuteTask(params, ext) {
  const constParam = {
    agentversion: global.CLIENT_INFO.appVersion,
    version: global.CLIENT_INFO.appVersion,
    appver: global.CLIENT_INFO.appVersion,
    qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
  }
  const data = {...params, ...constParam}
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams3(data, false),
    domain: 'community',
    ext,
  })
}

// 任务列表页面获取 每日任务 挑战任务
export function getUnLoginTaskList(params) {
  const constParam = {
    agentversion: global.CLIENT_INFO.appVersion,
    version: global.CLIENT_INFO.appVersion,
    appver: global.CLIENT_INFO.appVersion,
    qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
  }
  const data = {...params, ...constParam}
  return QYRequest.get({
    url: ApiList.TASK_LIST,
    params: buildParams3(data),
    domain: 'community',
  })
}


// 获取任务列表，挑战任务，每日任务, DONE
export function getTaskList(params) {
  if(global.USER_INFO.isLogin) {
    return QYRequest.get({
      url: ApiList.TASK_LIST,
      params: buildParams(params),
      domain: 'community',
    })
  }
  return getUnLoginTaskList(params)
}

// 夺宝列表
export function getTreasureList(params) {
  return QYRequest.get({
    url: ApiList.TREASURE_LIST,
    params: buildParams(params),
    domain: 'community',
  })
}

// 用户注册活动Push推送 http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034
export function askSubscribePush(params) {
  return QYRequest.post({
    url: ApiList.SUBSCRIBE_PUSH,
    params: buildParams(params),
    domain: 'community',
  })
}

// 用户取消注册活动Push推送 http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034
export function askUnsubscribePush(params) {
  return QYRequest.post({
    url: ApiList.UNSUBSCRIBE_PUSH,
    params: buildParams(params),
    domain: 'community',
  })
}

// 查看用户是否注册活动Push推送 http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034
export function fetchSubscribePushStatus(params) {
  return QYRequest.get({
    url: ApiList.SUBSCRIBE_PUSH_STATUS,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getTreasureNotice(params) {
  return QYRequest.get({
    url: ApiList.TREASURE_NOTICE,
    params: buildParams(params),
    domain: 'community',
  })
}

// 参与夺宝
export function participateTreasure(params) {
  return QYRequest.get({
    url: ApiList.PARTICIPATE_TREASURE,
    params: buildParams(params),
    domain: 'community',
  })
}

// 查询是否展示抢拍记录
export function getQiangPaiReward(params = {}) {
  return QYRequest.get({
    url: ApiList.SHOW_REWARD,
    params: buildParams(params),
    domain: 'community',
  })
}

export function userCheckinUnlogin(params) {
  const constParam = {
    agentversion: global.CLIENT_INFO.appVersion,
    version: global.CLIENT_INFO.appVersion,
    appver: global.CLIENT_INFO.appVersion,
    qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
  }
  const data = {...params, ...constParam}
  return QYRequest.get({
    url: ApiList.CHECK_IN_QYID,
    params: buildParams3(data),
    domain: 'community',
  })
}

// 签到接口，DONE
export function userCheckin(params) {
  if(global.USER_INFO.isLogin) {
    return QYRequest.get({
      url: ApiList.CHECK_IN,
      params: buildParams({...params, ...dfp}),
      domain: 'community',
    })
  } else {
    return userCheckinUnlogin(params)
  }
}

export function getRewardUnlogin(params) {
  const constParam = {
    agentversion: global.CLIENT_INFO.appVersion,
    version: global.CLIENT_INFO.appVersion,
    appver: global.CLIENT_INFO.appVersion,
    qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
  }
  const data = {...params, ...constParam}
  return QYRequest.get({
    url: ApiList.GET_REWARD_QYID,
    params: buildParams3(data),
    domain: 'community',
  })
}

// 任务完成领取奖励，DONE
export function getReward(params) {
  if(global.USER_INFO.isLogin) {
    return QYRequest.get({
      url: ApiList.GET_REWARD,
      params: buildParams({...params, ...dfp}),
      domain: 'community',
    })
  } else {
    return getRewardUnlogin(params)
  }
}

// 消耗积分
export function consumeScore(params) {
  return QYRequest.get({
    url: ApiList.SCORE_CONSUME,
    params: buildParams({...params, ...dfp}),
    domain: 'community',
  })
}

// 积分消耗回调
export function consumeCallback(params) {
  return QYRequest.get({
    url: ApiList.SCORE_CONSUME_CALLBACK,
    params: buildParams(params),
    domain: 'community',
  })
}

// 积分明细接口, DONE
export function getIntegralList(params) {
  return QYRequest.get({
    url: ApiList.INTEGRAL_LIST,
    params: buildParams(params),
    domain: 'community',
  })
}

// 查询是否付费会员
export function checkVIPStatus() {
  return QYRequest.get({
    url: ApiList.VIP_CHECK,
    params: {
      interfaceCode: '8ce1b7e4f71e9f5e',
      P00001: global.USER_INFO.authCookie,
    },
    domain: 'vip',
  })
}

// 会员任务领取奖励
export function getVipRewards(params) {
  return QYRequest.get({
    url: ApiList.VIP_GETREWARD,
    params: {
      ...params,
      P00001: global.USER_INFO.authCookie,
      platform: isIOS ? 'bb35a104d95490f6' : 'bb136ff4276771f3',
      lang: 'zh_CN',
      app_lm: 'cn',
    },
    domain: 'viptask',
  })
}

export function setMedalTaskGetReward(params) {
  return QYRequest.get({
    url: ApiList.GET_REWARD,
    params: buildParams({...params, ...dfp}),
    domain: 'community',
  })
}

export function completeTask(params) {
  return QYRequest.get({
    url: ApiList.TASK_COMPLETE,
    params: buildParams(params),
    domain: 'community',
  })
}

// 获取卡券列表
export function getCouponList(params) {
  return QYRequest.get({
    url: ApiList.COUPON_LIST,
    params: buildParams2(params),
  })
}

// 兑券
export function exchangeCoupon(params) {
  return QYRequest.get({
    url: ApiList.GET_COUPON,
    params,
  })
}

// 生成微信关注二维码
export function getQRCode(params) {
  return QYRequest.get({
    url: ApiList.WECHAT_QRCODE,
    params,
  })
}

export function getIntegralShopping() {
  return QYRequest.get({
    url: ApiList.INTEGRAL_SHOPPING,
  })
}

// 获取话题列表
export function getTopicList(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_LIST,
    params: buildParams(params),
    domain: 'community',
  })
}

// 我参与的话题列表
export function getMyTopicList(params) {
  return QYRequest.get({
    url: ApiList.MY_TOPIC_LIST,
    params: buildParams(params),
    domain: 'community',
  })
}

// 获取话题详情
export function getTopicInfo(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_DETAIL,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getTopicViewCompleteVotes(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_VIEWCOMPLETEVOTE,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getUnloginTopInfo(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_DETAIL,
    params: buildParams3(params),
    domain: 'community',
  })
}

// 话题投票
export function voteTopic(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_VOTE,
    params: buildParams(params),
    domain: 'community',
  })
}

// 领取话题奖励
export function getTopicReward(params) {
  return QYRequest.get({
    url: ApiList.TOPIC_GETREWARD,
    params: buildParams(params),
    domain: 'community',
  })
}

// 用户可领取积分数
export function getAvailableScore(params) {
  return QYRequest.get({
    url: ApiList.AVAILABLE_SCORE,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getParadiseMessage(params) {
  return QYRequest.get({
    url: ApiList.PARADISE_MESSAGE,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getAuctionDetail(params) {
  return QYRequest.get({
    url: ApiList.AUCTION_DETAIL,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getCurrentAttender(params) {
  return QYRequest.get({
    url: ApiList.CURRENT_ATTENDER,
    params: buildParams(params),
    domain: 'community',
  })
}

export function getUserInfoByPasspost(params) {
  return QYRequest.get({
    url: ApiList.USER_INFO_PASSPORT,
    params: buildParams2(params),
  })
}

// 获取用户的弹幕信息
export function getDanmuInfoByUser() {
  return QYRequest.get({
    url: ApiList.DANMU_INFO,
    params: {
      authcookie: global.USER_INFO.authCookie,
      qypid: isIOS ? '02032001010000000000' : '02022001010000000000',
    },
    domain: 'danmu',
  })
}

// 获取卡券列表
export function bindCoupon(params) {
  return QYRequest.get({
    url: ApiList.BIND_COUPONS,
    params,
  })
}

export function queryOrderNum() {
  return QYRequest.get({
    url: creatShareUrl(ApiList.ORDER_RECORD, {
      uid: global.USER_INFO.userId,
    }),
  })
}

// 获取用户是否有可领取的话题积分
export function getAvaliableScore(params) {
  return QYRequest.get({
    url: ApiList.AVALIABLE_SCORE,
    params: buildParams(params),
    domain: 'community',
  })
}


export function flowerAddPush(params, ext) {
  return QYRequest.post({
    url: ApiList.FLOWER_ADDPUSH,
    params: buildParams(params, false),
    domain: 'community',
    ext,
  })
}

export function getFriendsList(params) {
  return QYRequest.get({
    url: ApiList.FRIENDS_LIST,
    params: buildParams(params),
    domain: 'community',
  })
}

/**
 * 用户订单列表接口（根据订单商品使用状态查询）
 */
export function getOrderList({requestHeader: params, requestBody: ext}) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: true},
    ext,
  })
}

/**
 * 订单详情查询
 */
export function getOrderDetail({requestHeader: params, requestBody: ext}) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: true},
    ext,
  })
}

/**
 * 商品激活
 */
export function activateCommodity({requestHeader: params, requestBody: ext}) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: true},
    ext,
  })
}

// 提现到爱奇艺钱包
export function askToWithdraw(requestHeader, requestBody) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(requestHeader),
    domain: 'community',
    options: {preCheckFn: true},
    ext: requestBody,
  })
}

// 获取用户提现情况（包含是否提现、未提现金额、累计已提现金额）
export function askToWithdrawState(requestHeader, requestBody) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(requestHeader),
    domain: 'community',
    options: {preCheckFn: true},
    ext: requestBody,
  })
}

/**
 * 发送用户地理位置信息
 */
export function sendGeoInfo({requestHeader: params, requestBody: ext}) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: true},
    ext
  })
}

export function riskControl({qypid}) {
  return QYRequest.get({
    url: ApiList.RISK_CONTROL,
    params: buildParams({qypid}),
  })
}
/**
 * 获取地理位置勋章排名
 */
export function getMedalRank({requestHeader: params, requestBody: ext}) {
  return QYRequest.post({
    url: ApiList.TASK_EXECUTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: true},
    ext
  }).then((data: MedalRank) => {
    return data
  })
}

// 打卡活动用户投票接口
export function askPunchVote({params = {}, ext = {}}) {
  return QYRequest.post({
    url: ApiList.PUNCHTAST_VOTE,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}

// 打卡活动用户打卡接口
export function askPunch({params = {}, ext = {}}) {
  return QYRequest.post({
    url: ApiList.PUNCHTASK_PUNCH,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}

// 打卡活动用户打卡详情
export function getPunchDetail({params = {}, ext = {}}: GetPunchLastParams) {
  return QYRequest.get({
    url: ApiList.PUNCHTASK_DETAIL,
    params: params.userId ? buildParams(params) : buildParams3(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}

// 打卡活动用户历史记录
export function getPunchHistory({params = {}, ext = {}}: GetPunchLastParams) {
  return QYRequest.get({
    url: ApiList.PUNCHTASK_HISTORY,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}

export function getPunchLast({params = {}, ext = {}}: GetPunchLastParams) {
  return QYRequest.get({
    url: ApiList.PUNCHTASK_LASTPUNCH,
    params: params.userId ? buildParams(params) : buildParams3(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}

export function getPunchResult({params = {}, ext = {}}) {
  return QYRequest.get({
    url: ApiList.PUNCHTASK_RESULT,
    params: buildParams(params),
    domain: 'community',
    options: {preCheckFn: false},
    ext
  })
}
/**
 * @description: 宝箱抽奖获奖信息
 * @param {code}lotteryCode 抽奖标识符
 * @param {wiki}wiki http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%96%B0%E6%8E%A5%E5%8F%A3WIKI-2.6%E6%8A%BD%E5%A5%96%E8%8E%B7%E5%A5%96%E4%BF%A1%E6%81%AF%EF%BC%9A/openApi/lottery/attender
 */
export function getAwardsInfo(code = 'baoxiang') {
  return QYRequest.get({
    url: ApiList.REWARDS_INFO,
    params: buildParams({code}),
    domain: 'community',
    options: {preCheckFn: false},
  })
}
/**
 * @description: 宝箱抽奖结果
 * @param {wiki} wiki http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%96%B0%E6%8E%A5%E5%8F%A3WIKI-2.2%E6%8A%BD%E5%A5%96%EF%BC%9A/openApi/lottery/draw
 * @param {lotteryCode}lotteryCode 抽奖标识符
 */
export function getAwardResult(lotteryCode = 'baoxiang') {
  return QYRequest.get({
    url: ApiList.REWARDS_RESULT,
    params: buildParams({lotteryCode, ...dfp}),
    domain: 'community',
    options: {preCheckFn: true},
  })
}

export function getQiChuanToken(param) {
  return QYRequest.get({
    url: creatShareUrl(ApiList.QICHUAN_AUTHORIZE, param),
  })
}

export function getQiChuanLoadPic(param) {
  return QYRequest.get({
    url: creatShareUrl(ApiList.QICHUAN_UPLOADPIC, param),
  })
}
