import {isNaN, isArray, isObject} from './verify'

export const toString = val => val === null || val === undefined
  ? ''
  : isObject(val)
    ? JSON.stringify(val)
    : String(val)

export const toNumber = v => {
  const n = parseFloat(v)
  return isNaN(n) ? v : n
}

/* 获取url参数 or 转换字符串为对象 */
export const parseQueryString = (str = window.location.search, key) => {
  let urlArray = []
  let o = {}
  str = decodeURIComponent(toString(str))

  if (str) {
    if (/^[\?|\#]/.test(str.slice(0, 1))) {
      urlArray = str.slice(1).split("&")
    } else {
      urlArray = str.split("&")
    }
  }

  for (let i = 0; i < urlArray.length; i++) {
    let array = urlArray[i].split("=")
    o[array[0]] = decodeURIComponent(array[1])
  }

  if (key) {
    if (o.hasOwnProperty(key)) {
      return o[key]
    }
    return null
  }

  return o
}

/**
 * 格式化参数
 * 将值类型为数组的参数格式化为','连接的字符串
 * 将值类型为undefined/null/empty string的参数删除
 * @param params {object}
 * @returns {object}
 */
export const paramsSerializer = params => {
  if (isObject(params)) {
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (isArray(value)) {
        params[key] = value.join()
      }
      if (value === null || value === '' || value === undefined) {
        delete params[key]
      }
    })
  }

  return params
}

// const toEncode = (v, n) => [...Array(n).keys()].reduce(i => encodeURIComponent(i), v)
const toEncode = (v, n) => {
  let s = v
  for (let i = 0; i < n; i++) {
    s = encodeURIComponent(s)
  }
  return s
}
// transfer object to querystring
export const stringParams = (params, serialize = true, encodeNum = 1) => {
  if (serialize) {
    params = paramsSerializer(params)
  }
  return Object.keys(params).map(k => `${k}=${toEncode(params[k], encodeNum)}`).join('&') || ''
}
