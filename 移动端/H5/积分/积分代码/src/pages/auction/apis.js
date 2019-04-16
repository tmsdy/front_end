import 'core-js/features/array/includes'

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
  filterPic,
  isURL,
  transferTimeTo,
  getObjectValueSafely,
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
  todayPeak: 'auction/todayPeak',                     // 获取当日最高、最低价
}
// 分页limit
export const PAGE_SIZE = 20
// 公用参数
const AUCTION_CODE = parseQueryString(location.search, 'code') || 'vip'
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  code: AUCTION_CODE,
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
  'G00042': '您已经激活过了',
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
export const bidAjax = (score, nickname, avatar) =>
  generateCommonParams().then((baseParams) =>
    signGet(API.bid, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      score,
      nickname,
      avatar,
    })
  )

// 获取历史成功记录
export const getWinnerList = (size) =>
  signGet(API.winList, {size, code: AUCTION_CODE})
    .then(({records, max = 0, min = 0}) => {
      const list = records.map(i => ({
        imgUrl: isURL(i.avatar) ? i.avatar : 'http://www.iqiyipic.com/common/fix/headicons/male-130.png',
        name: i.nickname,
        time: transferTimeTo('datetime', i.time),
        cost: i.cost,
        orderId: i.orderId
      }))
      return {list, max, min}
    })

// 获取本轮实时出价人数与昵称列表(每次只返回最新的20条数据)
export const getAttenderList = params => signGet(API.attenderList, params)

// 获取当日最高、最低价
export const getTodayPeak = () => signGet(API.todayPeak)

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

const taskPromise = (data, params, keys, extra) => new Promise((resolve, reject) => (
  executeAJAX(data, params, keys, extra)
    .then((res) => {
      if (res && res.code && ['A0000', 'A00000'].includes(res.code)) {
        return resolve(res.data)
      }
      if (res && !res.code) {
        return resolve(res)
      }
      return reject(res)
    })
    .catch(err => reject(err))
))

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
      .then((data) => {
        const userInfo = getObjectValueSafely(data, 'data.userinfo')
        if (userInfo) return userInfo
        throw new Error('getUserIntegral err | 获取用户信息失败')
      })
      .catch(err => {
        console.log(err)
      })
  })

// 获取用户信息（主要是积分信息）
export const getUserInfo = () =>
  generateCommonParams().then(baseParams =>
    signGet(API.userInfo, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  )

// 获取订单列表
export const getOrderList = (data = {}, params = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuOrderList: {
        vertical_code: 'iQIYI',
        partner_code: process.env.NODE_ENV === 'production' ? '7V8Q8YfYksq6pGLo' : '3uMpdUlwtjJAV33w',
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

    if (baseParams.userId) {
      _data.daojuOrderList.user_id = baseParams.userId
    }

    return executeAJAX(_data, _params)
  })

// 获取订单详情
export const getOrderDetail = (data = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuProductDetail: {
        vertical_code: 'iQIYI',
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

    if (baseParams.userId) {
      _data.daojuProductDetail.user_id = baseParams.userId
    }

    return executeAJAX(_data, _params)
  })

// 激活会员
export const activeMember = (data = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuPurchaseActivate: {
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

    if (baseParams.userId) {
      _data.daojuPurchaseActivate.user_id = baseParams.userId
    }

    const keys = ['verticalCode', 'typeCode', 'agenttype', 'agentversion', 'srcplatform', 'appver', 'appKey']
    return executeAJAX(_data, _params, keys)
  })

// 获取推荐商品列表（取热门兑换前6个商品）
export const getProductList = () => (
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuProductListWithPage: {
        vertical_code: 'iQIYI',
        version: '9.11.5',
        platform: isIos() ? '2_22_221' : '2_22_222',
        need_ext: true,
        partner_code: process.env.NODE_ENV === 'production' ? 'IlXgtU467lIZOKCu' : 'QxAmLwi2HuQCaI17',
        page: 1,
        size: 6,
      }
    }
    const _params = {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code: 'daojuProductListWithPage',
      timestamp: Date.now(),
    }

    if (baseParams.userId) {
      _data.daojuProductListWithPage.user_id = baseParams.userId
    }

    return taskPromise(_data, _params)
      .then(({contents = []}) => {
        if (contents && contents.length) {
          const list = contents.map((item) => {
            const photoMaps = filterPic(item.photoList)
            return {
              title: item.name,
              image: photoMaps.movepic || photoMaps.largepic || photoMaps.smallpic,
              price: `${item.score}积分`,
              used: `${item.store - item.remain}人兑换`,
              productTag: item.productTag,
              productTagColor: item.productTagColor,
              photoMaps,
              _item: item,
            }
          })
          return list
        }
        return []
      })
  })
)
