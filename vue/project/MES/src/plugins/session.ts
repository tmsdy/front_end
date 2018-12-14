import _Vue from 'vue'
import sessionStore from '@/utils/storage/session'

export default {
  install(Vue: typeof _Vue) {
    Vue.prototype.$cache = sessionStore
  },
}
