import 'core-js/features/promise'

import {
  paramsSerializer,
  stringParams,
  isOwnEmptyObj,
  createSign,
  isArray,
  getUserId,
  getAuthCookies,
  isIqiyi,
} from 'Common/utils'
import {
  iqiyiInit,
} from "Common/iqiyiPlugin"

const addBasepath = (url, excludeBasepath = false) => {
  const basepath = window.basePath || '//community.iqiyi.com/openApi/'
  return excludeBasepath ? url : `${basepath}${url}`
}

// 拼接url
const spliceUrl = (url, params) => {
  const query = isOwnEmptyObj(params) ? '' : `?${stringParams(params)}`
  return `${url}${query}`
}

export const request = ({
                          url,
                          type = 'GET',
                          data = {},
                          params = {},
                          dataType = 'json',
                          headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                          },
                          cache = true,
                          timeout = 6000,
                        },
                        excludeBasepath) => {

  url = addBasepath(url, excludeBasepath)
  url = spliceUrl(url, params)
  data = paramsSerializer(data)

  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type,
      data,
      dataType,
      headers,
      cache,
      timeout,
      success: res => {
        resolve(res)
      },
      error: (xhr, errorType, error) => {  // errorType: "timeout", "error", "abort", "parsererror"
        console.log('======== request error in error ajax start ========')
        console.error('data:', data)
        console.error('params:', params)
        console.error('xhr:', xhr)
        console.error('errorType:', errorType)
        console.error('error:', error)
        console.log('======== request error in error ajax end ========')
        reject({xhr, errorType, error})
      },
    })
  })
}

export const get = (url, params = {}) => request({
  type: 'GET',
  url,
  params
})

export const post = (url, data = {}, params = {}) => request({
  type: 'POST',
  url,
  data,
  params,
})

/**
 * 发起请求（内部使用）
 * @param options
 * @param response
 * @returns {Promise<any>}
 * @private
 */
const _request = (options, response = null) =>
  new Promise((resolve, reject) =>
    request(options)
      .then(res => {
        if (res && res.code === 'A00000') {
          return resolve(res.data)
        }
        if (response) {
          res = response(res)
        }
        return reject(res)
      })
      .catch(({xhr, errorType, error}) => {
        if (response) {
          xhr = response(xhr, errorType, error)
        }
        return reject(xhr)
      })
  )

/**
 * 请求参数生成器
 * @param getReqParamsByKeys {function} 由 paramsGenerator 生成的公共参数过滤方法
 * @returns {function(url, params, keys, extra)}
 *  params {object} 要携带的参数
 *  extra {boolean} 是否携带公共参数, 默认携带
 */
export const _buildParamsGenerator = (getReqParamsByKeys, keys) => {
  return (params, extra = true) => {
    const _params = extra
      ? {...getReqParamsByKeys(keys), ...params}
      : {...params}

    const query = paramsSerializer(_params)
    return {
      ...query,
      sign: createSign(query)
    }
  }
}

/**
 * 过滤公用参数生成器
 * @param REQUEST_PARAMS {object} 初始公共参数
 * @returns {function(keys)}
 * keys {array} 指定携带的初始公共参数
 */
export const paramsGenerator = (REQUEST_PARAMS = {}) => {
  return (keys = null) => {
    let params = {}
    if (isArray(keys)) {
      keys.forEach(key => {
        if (REQUEST_PARAMS.hasOwnProperty(key)) {
          params[key] = REQUEST_PARAMS[key]
        }
      })
      return params
    }
    return REQUEST_PARAMS
  }
}

/**
 * 响应结果生成器
 * @param resMaps {Object}
 *  resMaps: 响应结果map. key: 错误码；value: {String} 错误消息，{Array} arr[0]: keyname，arr[1]: 错误消息
 *  exp: {
 *    'defaultText': '系统忙，稍后再试'，可用于设置默认错误提示
 *    'networkError': '网络未连接，请检查网络设置'，可用于设置未发出的网络请求错误
 *    'timeout': '网络繁忙，请点击重试'，可用于设置请求超时提示
 *    'A00001': '无数据',
 *    'A00002': '请求失败',
 *    'A00003': ['networkError', '网络错误'],
 *    'A00004': ['unlogin', '未登录'],
 *  }
 *
 * @returns {Function}
 *  Function return {Object} code: 错误码；message: 错误消息；key: keyname（可选）
 *  exp: {
 *    code: 'A00001',
 *    message: '无数据',
 *    key: 'networkError',
 *  }
 */
export const responseGenerator = resMaps => {
  // 默认响应结果
  resMaps = {
    defaultText: '网络错误，请点击重试',
    networkError: '网络未连接，请检查网络设置',
    timeout: '网络错误，请点击重试',
    ...resMaps,
  }
  // 根据resMaps格式化响应结果
  const response = res => {
    const {code} = res
    const result = resMaps[code] || resMaps.defaultText

    if (isArray(result)) {
      return {
        code,
        key: result[0],
        message: result[1],
      }
    }

    return {
      code,
      message: result,
    }
  }

  // 匹配响应结果
  return (res, type) => {
    if (res && res.code) {
      return response(res)
    }

    if (type === 'timeout') {
      return response({
        code: 'timeout',
      })
    } else if (type === 'abort') {
      return response({
        code: 'networkError',
      })
    } else if (['parsererror', 'error'].indexOf(type) !== -1) {
      return response({
        code: 'defaultText',
      })
    }

    console.error('未匹配此响应结果:', JSON.stringify(res), type)
    return res
  }
}

/**
 * generator of get request with sign
 * @param getReqParamsByKeys {function} 由 paramsGenerator 生成的公共参数过滤方法
 * @returns {function(url, params, keys, extra)}
 *  url {string} 请求地址
 *  params {object} 请求参数
 *  keys {array} 指定携带的公共参数
 *  extra {boolean} 是否携带公共参数, 默认携带
 */
export const signGetGenerator = (getReqParamsByKeys, response) => {
  return (url, params = {}, keys, extra = true) => {
    const reqParams = _buildParamsGenerator(getReqParamsByKeys, keys)
    return _request({
      url,
      type: 'GET',
      params: reqParams(params, extra),
    }, response)
  }
}

/**
 * generator of post request with sign
 * @param getReqParamsByKeys {function} 由 paramsGenerator 生成的公共参数过滤方法
 * @returns {function(url, data, params, keys, extra)}
 *  url {string} 请求地址
 *  params {object} 请求body
 *  params {object} 请求参数
 *  keys {array} 指定携带的公共参数
 *  extra {boolean} 是否携带公共参数, 默认携带
 */
export const signPostGenerator = (getReqParamsByKeys, response) => {
  return (url, data = {}, params = {}, keys, extra = true) => {
    const reqParams = _buildParamsGenerator(getReqParamsByKeys, keys)
    return _request({
      url,
      type: 'POST',
      data: JSON.stringify(data),
      params: reqParams(params, extra),
    }, response)
  }
}

// 生成公共参数，获取设备及用户信息（兼容Android cookies注入失败问题）
// http://statics-web.iqiyi.com/common/jssdk/src/#_162
export const generateCommonParams = ({isAsync = true} = {}) => {
  return new Promise((resolve, reject) => {
    const authCookie = getAuthCookies()

    if (!isAsync || !isIqiyi()) {
      return resolve({
        authCookie,
        userId: getUserId(),
        appKey: 'basic_h5',
        global: {}
      })
    }

    iqiyiInit(
      (data) => {
        console.log('iqiyi version |', data.version)
        const _authCookie = data['P00001']
        const _userId = data['P00003']
        resolve({
          global: data,
          authCookie: _authCookie && _authCookie !== '0' ? _authCookie : '',
          userId: _userId && _userId !== '0' ? _userId : '',
          appKey: 'basic_h5',
        })
      },
      (err) => {
        console.log('generateCommonParams iqiyiInit err |', err)
        reject(err)
      }
    )

  })
}
