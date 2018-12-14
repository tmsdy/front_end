import _Vue from 'vue'
import User from '@/utils/user'

export default {
  install(Vue: typeof _Vue) {
    Vue.prototype.$user = User
  },
}
