import 'core-js/features/number/is-nan'
import 'core-js/features/number/is-finite'

import {cloneByJSON} from "./clone"

/**
 * 获取变量类型
 * @param v
 * @returns {*} 已校验 string/number/array/object/function/null/undefined/NaN/Infinity
 */
export const getVarType = v => {
  if (Number.isNaN(v)) return 'NaN'
  if (typeof v === 'number' && !Number.isFinite(v)) return 'Infinity'
  if (v === null) return 'null'
  if (typeof v !== 'object') return typeof v
  return Object.prototype.toString.call(v).toLowerCase().match(/\[\s*object\s*([^\]]*)\s*\]/)[1]
}

/* 判断是否是字符串 */
export const isString = value => {
  return typeof value === "string" || value instanceof String
}

/* 判断是否是布尔值 */
export const isBoolean = val => getVarType(val) === 'boolean'

/* 判断是否是数字 */
export const isNumber = val => getVarType(val) === 'number'

/* 判断是否是NaN */
export const isNaN = val => Number.isNaN(val)

/* 判断是否是有限数字 */
export const isFinite = val => Number.isFinite(val)

/* 判断是否是数组 */
export const isArray = val => getVarType(val) === 'array'

/* 判断是否是对象 */
export const isObject = val => getVarType(val) === 'object'

/* 判断是否是函数 */
export const isFunction = val => getVarType(val) === 'function'

// 检测是否是 DOM 元素
export const isElement = obj => {
  if (obj && (typeof HTMLElement === "function" || typeof HTMLElement === "object") && obj instanceof HTMLElement) {
    return true
  } else {
    return (obj && obj.nodeType && obj.nodeType === 1) ? true : false
  }
}

// 检测是否是 jquery 对象
export const isJquery = obj => (obj && obj.length && (typeof jQuery === "function" || typeof jQuery === "object") && obj instanceof jQuery) ? true : false

// 检测是否是 Zepto 对象
export const isZepto = o => (o && o.length && (typeof Zepto === "function" || typeof Zepto === "object") && Zepto.zepto.isZ(o)) ? true : false

/**
 * 判断对象是否为空（包含查询原型链上的key）
 * @param obj
 * @returns {boolean}
 */
export const isEmptyObj = obj => {
  for (let name in obj) {
    return false
  }
  return true
}

/**
 * 判断对象是否为空（不查询原型链上的key）
 * @param obj
 * @returns {boolean}
 */
export const isOwnEmptyObj = obj => {
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}

/**
 * 安全地获取对象的值
 * @param obj {Object} 原始对象
 * @param keyStr {String} 对象的key，以点号连接
 * @returns {*} 返回对象key的值
 * example:
 * const obj = {
 *   a: {
 *     b: {
 *       c: 1
 *     }
 *   }
 * }
 * getObjectValueSafely(obj, 'a.b.c') // 1
 * getObjectValueSafely(obj, 'c')     // null
 * getObjectValueSafely(obj, 'a.c')   // null
 * getObjectValueSafely(obj, 'e.f.c') // null
 */
export const getObjectValueSafely = (obj, keyStr, defaultValue = null) => {
  if (isObject(obj) && isString(keyStr)) {
    let _obj = cloneByJSON(obj)
    const keys = keyStr.split('.')
    for (let k of keys) {
      if (isObject(_obj) && _obj.hasOwnProperty(k)) {
        _obj = _obj[k]
        continue
      }
      return defaultValue
    }
    return _obj
  }
  return defaultValue
}
