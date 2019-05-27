import Vue from 'vue'
import VueI18n from 'vue-i18n'
import dateTimeFormats from './dateTimeFormats'
import numberFormats from './numberFormats'

// element-ui语言包文件
import zhcnLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhtwLocale from 'element-ui/lib/locale/lang/zh-TW'
import enlocale from 'element-ui/lib/locale/lang/en'
import ElementLocale from 'element-ui/lib/locale'

let i18nMessages = {
  'zh-cn': zhcnLocale,
  'zh-tw': zhtwLocale,
  'en': enlocale
}
let language = window.LANGUAGE
Object.keys(i18nMessages).forEach((key) => {
  Object.assign(i18nMessages[key], language[key])
})

Vue.use(VueI18n)

// 读取服务返回语言配置。
let locale = window.LOCALE

// 实例化语言插件
let i18n = new VueI18n({
  locale: locale,
  messages: i18nMessages,
  dateTimeFormats,
  numberFormats
})
// 设置element-ui语言程序
ElementLocale.i18n((key, value) => i18n.t(key, value))

/**
 * 设置语言
 */
let setI18nLanguage = lang => {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  document.querySelector('body').setAttribute('class', lang)
}
Vue.prototype.$setI18nLanguage = setI18nLanguage

/**
 * 对整个站点语言数据做异步加载
 */
let i18nSetMessages = function (data) {
  Object.keys(i18nMessages).forEach(key => {
    i18n.setLocaleMessage(key, Object.assign(i18nMessages[key], data[key]))
  })
}
window.i18nSetMessages = i18nSetMessages
Vue.prototype.$i18nSetMessages = i18nSetMessages

export default i18n
