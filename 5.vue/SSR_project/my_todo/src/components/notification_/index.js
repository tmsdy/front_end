import Notification from './notification.vue'
import notify from './function'

export default (Vue) => { //把Notification在全局注册方便直接使用
  Vue.component(Notification.name, Notification)
  Vue.prototype.$notify = notify
}
