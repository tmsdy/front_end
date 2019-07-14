
import Vue from 'vue'
import App from './App'
import VueLazyLoadImg from 'vue-lazy-load-img'

Vue.use(VueLazyLoadImg)

import '@/assets/css/reset.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
