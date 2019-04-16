import {createSign, formatParams, isIos} from './util'

const BASE_URL = '//community.iqiyi.com/openApi/'

// 请求公用参数
const REQUEST_PARAMS = {
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIos() ? 20 : 21, // H5-QiYi
  srcplatform: isIos() ? 20 : 21,
  appKey: 'basic_h5',
  agentversion: '9.11.5',
  appver: '9.11.5',
}

// 积分接口列表
const API_LIST = {
  USER_INFO: 'user/info', // 用户积分信息
  TOPIC_LIST: 'topic/list', // 话题列表接口
  TOPIC_DETAIL: 'topic/detail', // 话题详情接口
  TOPIC_VOTE: 'topic/vote', // 话题投票接口
  GET_REWARD: 'topic/getReward', // 领取话题奖励
  MY_LIST: 'topic/myList', // 我参与的话题列表
}

const RES_CODE = {
  success: 'A00000', // 返回成功
  userIdErr: 'A0098', // 用户ID不正确
  verticalErr: 'A0099', // 垂线编码不正确
  paramSignErr: 'A00101', // 接口参数校验失败
  userInfoErr: 'A00401', // ”用户身份校验失败,
  otherErr: 'A00002', // 其他错误
}

function QYRequest({url, params, method, type, data, headers}) {
  const _url = url.indexOf('iqiyi') > -1 ? `${url}?${formatParams(params)}` : `${BASE_URL}${url}?${formatParams(params)}`

  return new Promise((resolve, reject) => {
    $.ajax({
      url: _url,
      type: method || 'GET',
      dataType: type || 'json',
      headers: headers || '',
      data: JSON.stringify(data) || '',
      timeout: 10000,
      contentType: 'application/json',
      success: function (res) {
        const {code, data} = res
        if (code === RES_CODE.success) {
          resolve(data || res)
        } else {
          reject(res)
        }
      },
      error: function (err) {
        reject(err)
      },
    })
  })
}

function buildParams(params, extra = true) {
  let temp
  if (extra) {
    temp = params ? {...REQUEST_PARAMS, ...params} : {...REQUEST_PARAMS}
  } else {
    temp = params
  }
  const sign = createSign(temp)
  temp.sign = sign
  return temp
}

export function getTopiList(params) { // 话题列表接口
  return QYRequest({
    url: API_LIST.TOPIC_LIST,
    params: buildParams(params),
  })
}

export function getMyList(params) { // 我参与的话题列表
  return QYRequest({
    url: API_LIST.MY_LIST,
    params: buildParams(params),
  })
}


export function getTopiDetail(params) { // 话题详情接口
  return QYRequest({
    url: API_LIST.TOPIC_DETAIL,
    params: buildParams(params),
  })
}

export function setTopicVote(params) { // 话题投票接口
  return QYRequest({
    url: API_LIST.TOPIC_VOTE,
    params: buildParams(params),
  })
}

export function getIntegralUserInfo(params) {
  return QYRequest({
    url: API_LIST.USER_INFO,
    params: buildParams(params),
  })
}

export function getScoreReward(params) {
  return QYRequest({
    url: API_LIST.GET_REWARD,
    params: buildParams(params),
  })
}


