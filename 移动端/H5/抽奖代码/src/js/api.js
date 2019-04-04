import  { createSign, formatParams, isIos } from 'Common/utils'
import {signGet} from './request'

const ENV = process.env.NODE_ENV

const apis = {
  taskComplete: 'task/complete',
  scoreAdd: 'score/add'
}
export const taskComplete = (data, params) => signGet(apis.taskComplete, data, params)
export const scoreAdd = (data, params) => signGet(apis.scoreAdd, data, params)

const BASE_URL = '//community.iqiyi.com/openApi/';

// 请求公用参数
const REQUEST_PARAMS = {
  
}

// 积分接口列表
const API_LIST = {
  USER_INFO: 'user/info', // 用户积分信息
  LOTTERY_INIT: 'lottery/init',
  DO_LOTTERY: 'lottery/draw',
  ATTENDER: 'lottery/attender',
  ADD_FREETIMES:'lottery/addExtFreeTimes',
  MULTI_DRAW:'lottery/multiDraw'
}

const RES_CODE = {
  success: 'A00000', // 返回成功
  userIdErr: 'A0098', // 用户ID不正确
  verticalErr: 'A0099', // 垂线编码不正确
  paramSignErr: 'A00101', // 接口参数校验失败
  userInfoErr: 'A00401', // ”用户身份校验失败,
  otherErr: 'A00002', // 其他错误
}

function QYRequest({url, params, method, type, data,headers}) {
  const _url = url.indexOf('iqiyi') > -1 ?  `${url}?${formatParams(params)}`:`${BASE_URL}${url}?${formatParams(params)}`
// console.log(_url)
  return new Promise((resolve, reject) => {
    $.ajax({
      url: _url,
      type:method || 'GET',
      dataType: type || 'json',
      headers: headers || '',
      data: JSON.stringify(data) || '',
      timeout: 1000000000,
      contentType:'application/json',
      success: function(res) {
        const { code, data, msg } = res
        if (code === RES_CODE.success) {
          resolve(data || res)
        } else {
          reject(res)
        }
      },
      error: function(err) {
        reject(err)
      },
    })
  })
}

function buildParams(params, extra=true) {
  let temp = params;
  const sign = createSign(temp)
  temp.sign = sign
  return temp
}

export function checkOrderSpringTask(params,ext){
  return QYRequest({
      url: API_LIST.CHECK_ORDER,
      params: buildParams(params, false),
      method:'POST',
      data:ext
  })
}

export function getUserInfo(params) {
  return QYRequest({
    url: API_LIST.USER_INFO,
    params: buildParams(params)
  })
}

export function getLotteryInit(params) {
  return QYRequest({
    url: API_LIST.LOTTERY_INIT,
    params: buildParams(params)
  })
}

export function doLottery(params) { //单抽
  return QYRequest({
    url: API_LIST.DO_LOTTERY,
    params: buildParams(params)
  })
}

export function getAttender(params) { //获取当前其他人中奖信息
  return QYRequest({
    url: API_LIST.ATTENDER,
    params: buildParams(params)
  })
}

export function addExtFreeTimes(params) { //增加免费抽奖机会
  return QYRequest({
    url: API_LIST.ADD_FREETIMES,
    method: 'POST',
    params: buildParams(params)
  })
}

export function multiDraw(params) { //多抽
  return QYRequest({
    url: API_LIST.MULTI_DRAW,
    params: buildParams(params)
  })
}