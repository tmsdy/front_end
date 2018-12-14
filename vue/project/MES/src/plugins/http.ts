import _Vue from 'vue'
import axios from 'axios'
import c from '@/config/index.ts'
import Goto from '@/utils/goto'
import User from '@/utils/user'

// 全局 axios 配置
axios.defaults.baseURL = c.apiBaseUrl
axios.defaults.validateStatus = status => status >= 200 && status < 400

// FIXME: 这里有一个问题，就是只会在进入系统的首次才会初始化
axios.defaults.headers.common['Authorization'] = `Bearer ${User.getToken()}`

axios.interceptors.response.use(
  response => {
    // Do something with response data
    // TODO: interceptors error code

    return response
  },
  (error: Error) => {
    // Do something with response error
    const errorMsg = error.message
    switch (true) {
      case errorMsg.indexOf('401') !== -1:
        Goto(c.URL_LOGIN)
        break
      case errorMsg.indexOf('Net Error') !== -1:
        break
    }
    return Promise.reject(error)
  },
)

export const Http = axios

export default {
  install(Vue: typeof _Vue) {
    Vue.prototype.$http = axios
  },
}
