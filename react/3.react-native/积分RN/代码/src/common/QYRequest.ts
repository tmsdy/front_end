/**
 * Created by lzj on 2017/11/9.
 */

import {BASE_URL} from '../constants/configs'
import {formatParams} from './util/index';
import RNQoe from '../qoe'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const FETCH_TIMEOUT = 60000

let Env = 'pro'
let preCheckFn = null

// 接口请求加载时长统计
const sendApiLoadingTime = (urlName: string, apiLoadingTime: number, taskCode = 'not_excute') => {
  try {
    if(!urlName || __DEV__) return false
    const timeData = {
      info_name: urlName,
      tmts_ajax: apiLoadingTime,
      info_msg: taskCode
    }
    const sendName = taskCode === 'not_excute' ? 'rn_api_time' : `rn_api_time_${taskCode}`
    RNQoe.sendInterface(sendName, timeData)
  } catch(e){} // eslint-disable-line
}

// 接口请求加载时长统计
const sendApiError = (urlName: string, errInfo: any, taskCode = 'not_excute') => {
  try {
    if(!urlName || __DEV__) return false
    const timeData = {
      info_name: urlName + taskCode,
      info_msg: errInfo.message ? encodeURI(errInfo.message) : JSON.stringify(errInfo)
    }
    const sendName = taskCode === 'not_excute' ? 'rn_api_error' : `rn_api_error_${taskCode}`
    RNQoe.sendInterface(sendName, timeData)
  } catch(e){} // eslint-disable-line
}

const fetchWithTimeout = (url: string, params, urlName?: string, taskCode?: string) => {
  let didTimeout = false

  const timeout = setTimeout(() => {
    didTimeout = true
  }, FETCH_TIMEOUT)
  const apiStartTime = Date.now()
  return fetch(url, params)
    .then((response) => {
      const apiEndTime = Date.now()
      sendApiLoadingTime(urlName, apiEndTime - apiStartTime, taskCode)
      // clear the timeout as cleanup
      clearTimeout(timeout)
      if(!didTimeout) {
        return response.json();
      }
      return Promise.reject(new Error('接口请求超时，请稍候重试'))
    })
    .then((data) => {
      // console.log(data,'==',url,'==',params)
      if(data.code !== 'A00000' && data.code !== 'A0000') {
        sendApiError(urlName, data, taskCode)
      }
      if(params.preCheckFn) return data // 业务方需要单独处理响应code码，preCheckFn存在直接返回data
      return preCheckFn ? preCheckFn(data) : data;
    })
    .catch((e) => {
      // 报错信息
      sendApiError(urlName, e, taskCode)
      if(didTimeout) return Promise.reject(new Error('接口请求超时，请稍候重试'))
      return Promise.reject(new Error('网络连接异常，请检查网络设置'))
    })
}

const checkMock = (url: string, postData, domain: string, urlName: string, taskCode = 'not_excute') => {
  let realUrl = domain ? `${BASE_URL[domain][Env]}${url}` : url;
  if(__DEV__) {
    const RequestConfig = require('../../request.config').default;
    if(RequestConfig.mock) {
      return fetchWithTimeout(`http://localhost:3001/mock/${realUrl.replace(/^.*?\w\//, '')}`, postData).catch(() => {
        return fetchWithTimeout(realUrl, postData, urlName, taskCode);
      });
    }
  }
  return fetchWithTimeout(realUrl, postData, urlName, taskCode)
}

export default {
  post({
    url,
    params,
    domain,
    ext,
    options,
    taskCode
  }) {
    const urlName = url
    let _url = ''
    if(params) {
      _url = `${url}?${formatParams(params)}`
    }

    const postData = {
      ...options,
      method: 'POST',
      headers: {
        ...defaultHeaders
      },
      body: JSON.stringify(ext || '')
    };

    return checkMock(_url, postData, domain, urlName, taskCode)
  },
  get({
    url,
    params,
    domain,
    options
  }) {
    const urlName = url
    let _url = url
    if(params) {
      const _param_ = formatParams(params);
      _url = `${_url}?${_param_}`;
    }

    const postData = {
      ...options,
      method: 'GET',
      headers: {
        ...defaultHeaders
      }
    };

    return checkMock(_url, postData, domain, urlName)
  },
  setEnv(env) {
    Env = env;
  },
  setPreCheck(fn) {
    preCheckFn = fn
  },
}
