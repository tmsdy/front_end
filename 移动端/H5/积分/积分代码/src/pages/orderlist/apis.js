import {
  isIos,
  getCookie,
} from "Common/utils"
import {
  generateCommonParams,
  paramsGenerator,
  responseGenerator,
  signGetGenerator,
  signPostGenerator,
} from 'Common/request'

// 公用参数
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIos() ? 20 : 21, // H5-QiYi
  srcplatform: isIos() ? 20 : 21,
  appKey: 'basic_h5',
  agentversion: '9.7.0',
  appver: '9.7.0',
})

const getResponse = responseGenerator({
  'A00001': '请登录后查看',
  'A00101': '请登录后查看',
  'A00401': '请登录后查看',
})

export const signGet = signGetGenerator(getReqParamsByKeys, getResponse)
export const signPost = signPostGenerator(getReqParamsByKeys, getResponse)

// 积分接口列表
const apis = {
  userInfo: 'user/info',    // 获取用户信息（主要是积分信息）
  execute: 'task/execute', // 执行任务
  requestBodyExample: 'task/requestBodyExample', // 获取执行任务
}

export const PAGE_SIZE = 20

// 执行任务
export const executeAJAX = (data = {}, params = {}, keys, extra) => signPost(apis.execute, data, params, keys, extra)

// 获取执行任务（用于获取接口参数）
export const requestBodyExampleAJAX = (task_code, timestamp = Date.now()) =>
  generateCommonParams().then(baseParams =>
    signGet(apis.requestBodyExample, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
      appKey: baseParams.appKey,
      task_code,
      timestamp,
    }, null, false)
  )

// 激活会员
export const activeMember = (data = {}) =>
  generateCommonParams()
    .then(baseParams => {
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
      return executeAJAX(_data, _params)
    })


// 获取用户信息（主要是积分信息）
export const getUserInfo = () =>
  generateCommonParams().then(baseParams =>
    signGet(apis.userInfo, {
      authCookie: baseParams.authCookie,
      userId: baseParams.userId,
    })
  )


// dev && test
// const devPartanerCode = 'Iva3o2QhXCqSXEbV,QxAmLwi2HuQCaI17,8P1rBOZn3ML1zmtl,cqbbSCkPJ5szXnvd,uViunFe51grmuOUE,3uMpdUlwtjJAV33w,2Q7DHSSalRYQple1,ABZgYR9CynY90mdh,qBL00MmEyzHQeyqe'
// // prod
// const prodPartanerCode = 'IlXgtU467lIZOKCu,uTHySO675COlmuHx,tuEeSMno1wV8DkMY,7V8Q8YfYksq6pGLo,xfGpb8iTFls4a02g,TI7mSLL9V8J0GAzG,GDheGyKPyUZ1QRJt,isSgWPdkPbn4oh4F,dS8yt6swNqJTDySW,PgJsTCizg0PwRmxI'
// 获取订单列表
export const getOrderList = (data = {}, params = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuOrderList: {
        vertical_code: 'iQIYI',
        // partner_code: process.env.NODE_ENV === 'production' ? prodPartanerCode : devPartanerCode,
        user_id: baseParams.userId,
        tag: '兑换记录',
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
        version: '9.7.0',
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

// 提交订单收货信息
export const submitOrder = (data = {}) =>
  generateCommonParams().then(baseParams => {
    const _data = {
      daojuPurchaseAddress: {
        app_key: 'qiyi_ruleEngine',
        ...data,
      }
    }
    const _params = {
      appKey: baseParams.appKey,
      task_code: 'daojuPurchaseAddress',
      timestamp: Date.now(),
    }

    return executeAJAX(_data, _params, null, false)
  })
