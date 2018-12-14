import Vue from 'vue'
import Element from 'element-ui'
import '@/common/scss/element-vars.scss'
import '@/assets/iconfont/iconfont.css'
import axios from '@/plugins/http'
import goto from '@/plugins/goto'
import user from '@/plugins/user'
import Login from './Login.vue'

Vue.use(Element)
Vue.use(axios)
Vue.use(goto)
Vue.use(user)

Vue.config.productionTip = false

new Vue({
  render: h => h(Login),
}).$mount('#app')
