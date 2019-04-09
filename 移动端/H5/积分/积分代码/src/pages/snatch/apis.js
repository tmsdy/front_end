import {isIos} from 'Common/utils'
import {generateCommonParams, paramsGenerator, responseGenerator, signGetGenerator, signPostGenerator} from 'Common/request'
import {getPeriod} from './assets'

// 夺宝列表每页请求数量（由于接口性能问题，太大会影响加载体验）
export const PAGE_SIZE = 6
// 积分接口列表
const API = {
  userInfo: 'user/info', // 获取用户信息（主要是积分信息）
  execute: 'task/execute', // 执行任务
  requestBodyExample: 'task/requestBodyExample', // 获取执行任务
  detail: 'treasure/detail', // 夺宝详情
  list: 'treasure/list', // 夺宝列表
  subscribe: 'common/subscribePush', // 用户注册活动Push推送
  unsubscribe: 'common/unsubscribePush', // 用户取消注册活动Push推送
  subscribeState: 'common/subscribeStatus', // 查看用户是否注册活动Push推送
  participate: 'treasure/participate', // 参与夺宝
  myList: 'treasure/myList', // 我的夺宝历史
  notice: 'treasure/notice', // 有夺宝提醒
}

// 公用参数
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIos() ? 20 : 21,
  srcplatform: isIos() ? 20 : 21,
  agentversion: '9.10.0',
  appver: '9.10.0',
  appKey: 'basic_h5',
})

const getResponse = responseGenerator({
  A00001: '请登录后查看',
  E00502: '夺宝已结束',
  E00503: '夺宝次数已满',
  E00504: '参与失败，您的积分不足',
})

export const signGet = signGetGenerator(getReqParamsByKeys, getResponse)
export const signPost = signPostGenerator(getReqParamsByKeys, getResponse)

// 执行任务
export const executeAJAX = (data = {}, params = {}, keys, extra) => {
  return signPost(API.execute, data, params, keys, extra)
}

// 获取用户信息（主要是积分信息）
export const getUserInfo = () => {
  return generateCommonParams().then((baseParams) => {
    return signGet(API.userInfo, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  })
}

// 夺宝详情
export const getSnatchDetail = (code) => {
  return generateCommonParams().then((baseParams) => {
    return signGet(API.detail, {
      userId: baseParams.userId,
      authCookie: baseParams.authCookie,
      ext: true, // 是否返回夺宝扩展信息
      code,
    })
  })
}

// 夺宝列表
export const getSnatchList = (offset, limit) => {
  return generateCommonParams().then(({userId, authCookie, global}) => {
    const params = {
      // debugMode: 'mdb',  // 测试环境绕过校验
      userId,
      authCookie,
      offset,
      limit,
    }
    if(global.version) {
      params.agentversion = global.version
      params.appver = global.version
    }
    return signGet(API.list, params)
  })
}

// 参与夺宝
export const participate = (code) => {
  return generateCommonParams().then((baseParams) => {
    return signGet(API.participate, {
      userId: baseParams.userId,
      authCookie: baseParams.authCookie,
      code,
    })
  })
}

// 我的夺宝历史
export const getMyList = ({page, size}) => {
  return generateCommonParams().then((baseParams) => {
    return signGet(API.myList, {
      userId: baseParams.userId,
      authCookie: baseParams.authCookie,
      page,
      size,
    })
  })
}

// dev && test
const devPartanerCode = '2Q7DHSSalRYQple1'
// prod
const prodPartanerCode = 'tuEeSMno1wV8DkMY'
// 获取是否有最新的夺宝成功记录
export const getNewNotice = ({view}) => {
  return generateCommonParams().then((baseParams) => {
    return signGet(API.notice, {
      userId: baseParams.userId,
      authCookie: baseParams.authCookie,
      view,
    })
  })
}

// 获取订单列表
export const getOrderList = (params = {}) => {
  return generateCommonParams().then((baseParams) => {
    const _data = {
      daojuOrderList: {
        vertical_code: 'iQIYI',
        partner_code: process.env.NODE_ENV === 'production' ? prodPartanerCode : devPartanerCode,
        user_id: baseParams.userId,
        ...params,
      },
    }
    const _params = {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code: 'daojuOrderList',
      timestamp: Date.now(),
    }

    return executeAJAX(_data, _params)
      .then((data) => {
        if(data && data.data) {
          return data.data
        }
        return {contents: [], total: 0}
      })
      .catch(() => {
        return {contents: [], total: 0}
      })
  })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return generateCommonParams().then((baseParams) => {
    const _data = {
      daojuProductDetail: {
        vertical_code: 'iQIYI',
        user_id: baseParams.userId,
        version: '9.10.0',
        product_id: id,
      },
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
}

// 查询开启提醒状态
export const fetchSnatchSubscribeState = (codeList = []) => {
  return generateCommonParams().then(({userId, authCookie, global}) => {
    const params = {
      userId,
      authCookie,
      activity: 'treasure', // 夺宝
      code: codeList.filter(i => !!i).join(),
    }
    if(global.version) {
      params.agentversion = global.version
      params.appver = global.version
    }

    return signGet(API.subscribeState, params)
      .then(({subscribeStatus}) => {
        return subscribeStatus
      })
      .catch(() => {
        return {}
      })
  })
}

// 夺宝开启提醒
export const askSubscribeSnatch = (codeList = []) => {
  return generateCommonParams().then(({userId, authCookie, global}) => {
    const params = {
      userId,
      authCookie,
      activity: 'treasure', // 夺宝
      code: codeList.filter(i => !!i).join(),
    }
    if(global.version) {
      params.agentversion = global.version
      params.appver = global.version
    }

    return signPost(API.subscribe, {}, params)
  })
}

// 夺宝关闭提醒
export const askUnsubscribeSnatch = (codeList = []) => {
  return generateCommonParams().then(({userId, authCookie, global}) => {
    const params = {
      userId,
      authCookie,
      activity: 'treasure', // 夺宝
      code: codeList.filter(i => !!i).join(),
    }
    if(global.version) {
      params.agentversion = global.version
      params.appver = global.version
    }

    return signPost(API.unsubscribe, {}, params)
  })
}

// 查询预约提醒状态
export function getOrderState(list) {
  let hasBefore = false
  const beforeSnatchCodes = list.map((i) => {
    const period = getPeriod(i)
    if(period === 'before') {
      hasBefore = true
      return i.code
    }
    return ''
  })

  if(hasBefore) {
    return fetchSnatchSubscribeState(beforeSnatchCodes)
  }

  return Promise.resolve({})
}
