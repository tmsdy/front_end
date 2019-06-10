import './libs'
import './libs/start.js'
import Vue from 'vue'
import App from './page/App'
import router from './router'
import store from '@/store'
import mixins from '@/mixins'
import { i18n } from '@/plugin'
import VueLazyload from 'vue-lazyload'

// 指令
import './directive'
Vue.config.productionTip = false

// 全局混合
Vue.mixin(mixins)

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/images/goods/noImg.jpg',
    loading: '/static/images/goods/noImg.jpg',
    attempt: 1
})

/* eslint-disable no-new */

new Vue({
    el: '#app',
    mixins,
    i18n,
    router,
    store,
    render: h => h(App)
})
