import Vue from 'vue'
import Element from 'element-ui'
import '@/common/scss/element-vars.scss'
import '@/assets/iconfont/iconfont.css'
import router from '@/router'
import store from '@/store'
import cache from '@/plugins/cache'
import user from '@/plugins/user'
import goto from '@/plugins/goto'
import http from '@/plugins/http'
import permission from '@/directives/permission'
import App from './App.vue'

Vue.use(Element)
Vue.use(cache)
Vue.use(user)
Vue.use(goto)
Vue.use(http)
Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
