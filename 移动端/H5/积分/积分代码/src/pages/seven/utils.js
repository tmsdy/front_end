import 'core-js/features/number/is-nan'
import 'core-js/features/number/is-finite'
import {md5} from 'Common/utils'

const _ua = navigator.userAgent.toLowerCase()

// deep clone
export const clone = obj => obj ? JSON.parse(JSON.stringify(obj)) : null

// 获取变量类型
export const getVarType = variable => {
  if (Number.isNaN(variable)) return "NaN"
  if (typeof variable === "number" && !Number.isFinite(variable)) return "Infinity"
  if (variable === null) return String(variable)
  else if (typeof variable !== "object") return typeof variable
  else return Object.prototype.toString.call(variable).toLowerCase().match(/\[\s*object\s*([^\]]*)\s*\]/)[1]
}

/* 判断是否是字符串 */
export const isString = value => {
  return typeof value === "string" || value instanceof String
}

/* 判断是否是数字 */
export const isNumber = val => getVarType(val) === 'number'

/* 判断是否是数组 */
export const isArray = val => getVarType(val) === 'array'

/* 判断是否是对象 */
export const isObject = val => getVarType(val) === 'object'

/* 判断是否是函数 */
export const isFunction = val => getVarType(val) === 'function'



/* 生成组件随机id */
export const generateComponentId = component => {
  let prefix = ""
  if (component) prefix = `${component}-id-`
  let date = new Date().getTime()
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return `${prefix}${uuid}`
}

// 生成签名
export const createSign = params => {
  // 对参数字典排序
  const keys = Object.keys(params).sort()
  const sign = `${keys.map(k => `${k}=${params[k]}`).join('|')}|NKebb0M17dC5ihNSoTlX`
  return md5(sign)
}

// 格式化参数
export const paramsSerializer = params => {
  if (getVarType(params) === 'object') {
    Object.keys(params).forEach(key => {
      const value = params[key]
      const valueType = getVarType(params[key])
      if (valueType === "array") {
        params[key] = value.join()
      }
      if (value === null || value === '' || value === undefined) {
        delete params[key]
      }
    })
  }

  return params
}

// transfer object to querystring
export const stringParams = params => {
  params = paramsSerializer(params)
  return Object.keys(params).map(key => (`${key}=${encodeURIComponent(params[key])}`)).join('&')
}

export const isEmptyObj = obj => {
  for (let name in obj) {
    return false
  }
  return true
}

export const setCookie = (NameOfCookie, value, expiredays) => {
  const ExpireDate = new Date()
  ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000))

  document.cookie = NameOfCookie + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString())
}

export const getCookie = NameOfCookie => {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(NameOfCookie + "=")
    if (begin != -1) {
      begin += NameOfCookie.length + 1
      let end = document.cookie.indexOf(";", begin)
      if (end == -1) end = document.cookie.length
      return decodeURIComponent(document.cookie.substring(begin, end))
    }
  }
  return null
}

export const delCookie = NameOfCookie => {
  if (getCookie(NameOfCookie)) {
    document.cookie = NameOfCookie + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT"
  }
}

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getLocalStorage = (key) => {
  return localStorage.getItem(key)
}

export const removeLocalStorage = (key) => {
  return localStorage.removeItem(key)
}

export const isIos = () => /(iPhone\sOS)/i.test(_ua)
export const isWeixin = () => /(MicroMessenger)/i.test(_ua)
export const isIqiyi = () => /(iqiyi)/.test(_ua)
export const isSafari = () => /(safari)/.test(_ua)

export const createRNIntegral = (pageName = "HomePage") => {
  let integralUrl = ''
  let url = 'iqiyi://mobile/register_business/qyclient?pluginParams='
  const initparams = JSON.stringify({"pageName": pageName})
  const params = {
    biz_id: 100,
    biz_plugin: 'qiyibase',
    biz_params: {
      biz_sub_id: 106,
      biz_params: 'bizId=IntegralRN&componentName=RNIntegral',
      biz_dynamic_params: 'initParams=' + initparams,
    }
  }
  integralUrl = url + encodeURIComponent(encodeURIComponent(JSON.stringify(params)))
  return integralUrl
}

export const createCallAppParam = (pageName = "HomePage") => {
  const defaultConfig = {
    SCHEME: createRNIntegral(pageName),
    FAILBACK: {
      IOS: 'https://itunes.apple.com/cn/app/id393765873?mt=8',
      ANDROID: '//mbdapp.iqiyi.com/j/ap/iqiyi_1845.apk'
    },
    TIMEOUT: 2000,
  }
  if (isIos()) {
    defaultConfig['COVER_IMG'] = 'http://www.iqiyipic.com/common/fix/browserOpen-img/browserOpen-img.png'
  } else if (isWeixin() && !isIos()) {
    defaultConfig['FAILBACK']['YYB'] = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qiyi.video&android_schema=' + encodeURIComponent(createRNIntegral(pageName))
  }
  return defaultConfig
}



export const getAuthCookies = () => getCookie('P00001') ? getCookie('P00001') : null
export const getUserId = () => getCookie('P00003') ? getCookie('P00003') : null

export function GetQueryString(name){
  function getAllParams() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          var strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
              theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
          }
      }
      return theRequest;
  }
  return getAllParams()[name] || null;
};

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
