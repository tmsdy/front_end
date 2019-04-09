import {
  responseGenerator,
  paramsGenerator,
  signGetGenerator,
  signPostGenerator,
  generateCommonParams,
} from 'Common/request'
import {
  isIos,
  parseQueryString,
  getCookie,
} from "Common/utils"

// 抢拍接口列表
const API = {
  execute: 'task/execute',                            // 执行任务
  requestBodyExample: 'task/requestBodyExample',      // 获取执行任务
  userInfo: 'user/info',                              // 获取用户信息
  auctionDetail: 'auction/current',                   // 获取当前竞拍详情
  bid: 'auction/bid',                                 // 出价接口
  currentWinnerList: 'auction/currentWinner',         // 获取本轮次结果 && 用户出价结果
  winList: 'auction/winnerList',                      // 获取历史成功记录
  attenderList: 'auction/currentAttender',            // 获取本轮实时出价人数与昵称列表(每次只返回最新的20条数据)
}
// 分页limit
export const PAGE_SIZE = 20
// 公用参数
const code = parseQueryString(location.search, 'code')
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  code: code ? code : 'vip',
  agenttype: isIos() ? 20 : 21,
  srcplatform: isIos() ? 20 : 21,
  agentversion: '9.11.5',
  appver: '9.11.5',
  appKey: 'basic_h5',
})
// 错误响应
const getResponse = responseGenerator({
  'A0002': '登录抢VIP',
  'A00001': '您的登录已失效，请重新登录',
  'A00101': '您的登录已失效，请重新登录',
  'A00401': '您的登录已失效，请重新登录',
  'Q00601': '已达到激活上限',
})

const signGet = signGetGenerator(getReqParamsByKeys, getResponse)
const signPost = signPostGenerator(getReqParamsByKeys, getResponse)

// 获取当前竞拍详情
export const getAuctionDetail = () =>
  generateCommonParams().then(baseParams =>
    signGet(API.auctionDetail, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  )

// 获取本轮次结果 && 用户出价结果
export const getCurrentWinnerList = () =>
  generateCommonParams().then(baseParams =>
    signGet(API.currentWinnerList, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  )

// 出价接口
export const bidAjax = params => signGet(API.bid, params)

// 获取历史成功记录
export const getWinList = params => signGet(API.winList, params)

// 获取本轮实时出价人数与昵称列表(每次只返回最新的20条数据)
export const getAttenderList = params => signGet(API.attenderList, params)

// 执行任务
export const executeAJAX = (data = {}, params = {}, keys, extra) => signPost(API.execute, data, params, keys, extra)

// 获取执行任务（用于获取executeAJAX的接口参数）
export const requestBodyExampleAJAX = (task_code) =>
  generateCommonParams().then(baseParams =>
    signGet(API.requestBodyExample, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      timestamp: Date.now(),
      task_code,
    }, null, false)
  )

// 获取用户积分
export const getUserIntegral = () =>
  generateCommonParams().then(baseParams => {
    const _data = {
      passport_user_info: {
        authcookie: baseParams.authCookie,
        fields: 'userinfo',
      }
    }
    const _params = {
      task_code: 'passport_user_info',
      appKey: baseParams.appKey,
      timestamp: Date.now(),
    }

    return executeAJAX(_data, _params)
  })

// 获取用户信息（主要是积分信息）
export const getUserInfo = () =>
  generateCommonParams().then(baseParams =>
    signGet(API.userInfo, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  )

// dev && test
const devPartanerCode = '3uMpdUlwtjJAV33w'
// prod
const prodPartanerCode = '7V8Q8YfYksq6pGLo'
// 获取订单列表
export const getOrderList = (data = {}, params = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuOrderList: {
        vertical_code: 'iQIYI',
        partner_code: process.env.NODE_ENV === 'production' ? prodPartanerCode : devPartanerCode,
        user_id: baseParams.userId,
        ...data,
      }
    }
    const _params = {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code: 'daojuOrderList',
      timestamp: Date.now(),
      ...params,
    }

    return executeAJAX(_data, _params)
  })

// 获取订单详情
export const getOrderDetail = (data = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuProductDetail: {
        vertical_code: 'iQIYI',
        user_id: baseParams.userId,
        version: '9.8.0',
        ...data,
      }
    }
    const _params = {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code: 'daojuProductDetail',
      timestamp: Date.now(),
    }

    return executeAJAX(_data, _params)
  })

// 激活会员
export const activeMember = (data = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuPurchaseActivate: {
        user_id: baseParams.userId,
        app_key: 'qiyi_ruleEngine',
        dfp: getCookie('__dfp'),
        ...data,
      }
    }
    const _params = {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code: 'daojuPurchaseActivate',
      timestamp: Date.now(),
    }

    const keys = ['verticalCode', 'typeCode', 'agenttype', 'agentversion', 'srcplatform', 'appver', 'appKey']
    return executeAJAX(_data, _params, keys)
  })
