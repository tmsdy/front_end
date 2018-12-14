import _Vue from 'vue'
import localStore from '@/utils/storage/local'

export default {
  install(Vue: typeof _Vue) {
    Vue.prototype.$cache = localStore
  },
}
