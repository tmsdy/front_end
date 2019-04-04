const _ua = navigator.userAgent.toLowerCase()

export const isIos = () => /(iPhone\sOS)/i.test(_ua)
export const isWeixin = () => /(MicroMessenger)/i.test(_ua)
export const isIqiyi = () => /(iqiyi)/.test(_ua)  // 爱奇艺客户端
export const isChrome = () => /Chrome\//.test(_ua) && !/Version\/4/.test(_ua)
export const iosEgt9 = () => /iPhone OS (\d+)/i.exec(_ua) && /iPhone OS (\d+)/i.exec(_ua)[1] >= 9
export const isIE = () => /msie/.test(_ua)
export const isIEVer = ver => {
  let b = document.createElement('b')
  b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
  return b.getElementsByTagName('i').length === 1
}
