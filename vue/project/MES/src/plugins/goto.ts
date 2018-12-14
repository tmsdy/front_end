import _Vue from 'vue'
import Goto from '@/utils/goto'

export default {
  install(Vue: typeof _Vue) {
    Vue.prototype.$goto = Goto
  },
}
