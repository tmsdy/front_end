/**
 *依赖库
 */
// import $ from 'jquery' // "jquery": "^3.3.1",
// import Cookies from 'js-cookie' //  "js-cookie": "^2.2.0",
// import _ from 'underscore' // "underscore": "^1.9.1",
// import EventProxy from 'eventproxy' //  "eventproxy": "~1.0.0",
import store from 'store'
import 'pinyin4js'
import { getCookie, setCookie } from './utils.js'

window.store = store
// window.$ = $
// window.Cookies = Cookies
// window._ = _
/* window.EventProxy = EventProxy
window.ep = new EventProxy() */

// 全局变量,语言和时区
window.LOCALE = 'zh-cn' // 默认语言中文
let language = getCookie('language')
if (language && language != 'undefined') { // 本地有
    window.LOCALE = language // 使用本地
} else { // 本地没有
    window.LOCALE = localLanguage // 使用服务端的语言
    setCookie('language', window.LOCALE, { expires: 7, path: '' })
}
document.querySelector('html').setAttribute('lang', window.LOCALE)
document.querySelector('body').setAttribute('class', window.LOCALE)

window.TIMEZONE = '+8'
var timezone = getCookie('timezone')
if (timezone) {
    window.TIMEZONE = timezone
} else {
    window.TIMEZONE = localTimezone
    setCookie('timezone', window.TIMEZONE, { expires: 7, path: '' })
}
