import Vue from 'vue'
import App from './app.vue'

import Notification from './components/notification'

import './assets/styles/global.less'
import './assets/styles/footer.less'

Vue.use(Notification)

const root = document.createElement('div') ;
document.body.appendChild(root) ;

new Vue({
  render: (h) => h(App)
}).$mount(root)

