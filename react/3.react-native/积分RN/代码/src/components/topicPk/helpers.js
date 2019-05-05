/**
 * Created by liuzhimeng.
 * @date 2018/9/19
 * @description
 */
import {DeviceModule} from '@iqiyi/rn-base-modules'

export const getNetInfo = () => new Promise((resolve, reject) => {
  DeviceModule.getDeviceInfo()
    .then((data) => {
      const {networkType} = data
      return networkType === 'disconnect' ? reject() : resolve({netInfo: 0})
    })
    .catch(() => {
      resolve({netInfo: 0})
    })
})

// 格式化整数部分
const formatInteger = (str) => {
  const len = str.length
  if(len < 4) return str

  let _str = ''
  const count = Math.ceil(len / 3)
  for(let k = 1; k <= count; k++) {
    if(k === 1) {
      _str = str.slice(0 - 3 * k)
      continue // eslint-disable-line
    }
    const slicer = str.slice(0 - 3 * k, 0 - 3 * (k - 1))
    _str = k === 1 ? slicer : `${slicer},${_str}`
  }

  return _str
}

// 格式化小数部分
const formatDecimal = (str) => {
  if(str.length < 4) return str
  const hasFooter = !!(str.length % 3)
  const body = str.match(/(.{3})/g).reduce((a, i) => `${a},${i}`)
  return hasFooter ? `${body},${str.slice(0 - (str.length % 3))}` : body
}

// 格式化数字为货币类型
export const formatNumber = (num) => {
  const originStr = String(num) || ''
  const originArr = originStr.split('.')

  if(originArr.length === 1) {
    return formatInteger(originStr)
  }

  let _str = ''
  for(let k = 0; k < originArr.length; k++) {
    const str = originArr[k]
    if(k === 0) {
      _str = formatInteger(str)
    }
    if(k === 1) {
      _str += `.${formatDecimal(str)}`
      break
    }
  }

  return _str
}
