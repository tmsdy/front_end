/**
 * Created by liuzhimeng.
 * @date 2018/9/25
 * @description
 */

import {getAuthCookies, getUserId, isIos} from 'Common/utils'
import {paramsGenerator, signGetGenerator} from 'Common/request'

// 公用参数
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIos() ? 20 : 21,
  srcplatform: isIos() ? 20 : 21,
  appKey: 'basic_h5',
  agentversion: '9.9.5',
  appver: '9.9.5',
})

export const signGet = signGetGenerator(getReqParamsByKeys)

const apis = {
  detail: 'topic/detail', // 话题详情
}

const PARAMS = {
  authCookie: getAuthCookies(),
  userId: getUserId(),
}

// 话题详情
export const getDetail = (params = {}) => {
  return signGet(apis.detail, {
    authCookie: PARAMS.authCookie,
    userId: PARAMS.userId,
    ...params,
  })
}
