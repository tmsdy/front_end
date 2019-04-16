import {md5} from './md5'
import {
  isString,
  isObject,
  isFunction,
} from './verify'
import {
  parseQueryString,
  stringParams,
} from './transfer'

export const isURL = str => isString(str)
  ? !!str.trim().match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)
  : false

// 生成签名
export const createSign = params => {
  // 对参数字典排序
  const keys = Object.keys(params).sort()
  const sign = `${keys.map(k => `${k}=${params[k]}`).join('|')}|NKebb0M17dC5ihNSoTlX`
  return md5(sign)
}

export const createUrl = (url, param) => {
  const sign = createSign(param)
  param['sign'] = sign
  return `${url}?${stringParams(param)}`
}

/**
 * 设置当前窗口url中param或hash值
 * @param val1 {string/object} 参数key 或 参数map
 * @param val2 {string/null} 参数value
 * @param target {string} param/hash 要修改的目标
 * @param historyMode {boolean} 是否参与history模式，默认为false
 * @param reset {boolean} 是否重置原来的param或hash，默认为false
 */
export const setUrlHashAndParam = (val1, val2, {target = 'param', historyMode = false, reset = false} = {}) => {
  const old = reset
    ? {}
    : target === 'hash'
      ? parseQueryString(location.hash)
      : parseQueryString(location.search)
  const valMap = isObject(val1)
    ? {...old, ...val1,}
    : {...old, [val1]: val2}
  const value = stringParams(valMap)
  const search = target === 'param' ? '?' + value : location.search
  const hash = target === 'hash' ? '#' + value : location.hash
  const url = `${location.pathname}${search}${hash}`

  // 首选html5无刷新模式
  if (historyMode && history && isFunction(history.pushState)) {
    history.pushState({}, document.title, url)
  } else {
    location.href = url
  }
}
