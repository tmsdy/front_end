import {isIos} from 'Common/utils'
import {createSign, paramsSerializer, stringParams, isEmptyObj, parseQueryString} from './utils'

const query = parseQueryString()

// 公用参数
const GET_REQUEST_PARAMS = (keys = []) => {
  const REQUEST_PARAMS = {
    verticalCode: 'iQIYI',
    typeCode: 'point',
    agenttype: isIos() ? 20 : 21, // H5-QiYi
    agentversion: '9.8.0',
    srcplatform: isIos() ? 20 : 21,
    appver: '9.8.0',
    appKey: 'basic_h5',
  }

  let params = {}
  if (keys && keys.length) {
    keys.forEach(key => {
      if (REQUEST_PARAMS.hasOwnProperty(key)) {
        params[key] = REQUEST_PARAMS[key]
      }
    })
    return params
  }
  return REQUEST_PARAMS
}

const addBasepath = (url, excludeBasepath = false) => {
  const basepath = '//community.iqiyi.com/openApi/'
  return excludeBasepath ? url : `${basepath}${url}`
}

// 拼接url
const spliceUrl = (url, params) => {
  const query = isEmptyObj(params) ? '' : `?${stringParams(params)}`
  return `${url}${query}`
}

const generateResponse = res => {
  const {data, code} = res
  return code === 'A00000' ? data : res
}

const buildParams = (params, keys, extra = true) => {
  const _params = extra
    ? {
      ...GET_REQUEST_PARAMS(keys),
      ...params,
    }
    : {
      ...params,
    }

  return {
    ..._params,
    sign: createSign(_params)
  }
}

const request = ({
                   url,
                   type = 'GET',
                   data = {},
                   params = {},
                   dataType = 'json',
                   headers = {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                   },
                   timeout = 6000
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
      timeout,
      success: (res) => {
        const {code} = res
        const respose = generateResponse(res)
        if (code === 'A00000') {
          resolve(respose)
        } else {
          console.error('request error in success:', respose)
          reject(respose)
        }
      },
      error: (err) => {
        console.error('request error in error:', err)
        reject(err)
      },
    })
  })
}

export default request

export const get = (url, params = {}) => request({
  type: 'GET',
  url,
  params
})

export const post = (url, data = {}) => request({
  type: 'POST',
  url,
  data
})

export const signGet = (url, params = {}, keys) => request({
  url,
  type: 'GET',
  params: buildParams(params, keys),
})

export const signPost = (url, data = {}, params = {}) => request({
  url,
  type: 'POST',
  data: JSON.stringify(data),
  params: buildParams(params, [], false),
})
