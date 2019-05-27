import Vue from 'vue'
import VueResource from 'vue-resource'
import * as Config from '@/libs/config.js'
import { setStore, setItem, getToken, getUAResult } from '@/libs/utils.js'

Vue.use(VueResource)
// 获取浏览器及操作系统信息
let UAResult = getUAResult()

/**
 * 拦截器
 */
Vue.http.interceptors.push((request, next) => {
    // 请求方式
    let method = request.method.toLowerCase()
    // 解决ie11一下低版本浏览器重缓存里读取数据
    if (method === 'get') {
        // 请求参数不是一个对象时
        if (typeof request.params !== 'object') {
            request.params = {}
        }
        Object.assign(request.params, { '_@#time': new Date().getTime() })
    }

    // 发送前触发
    // 请求后端api时带上个人认证信息
    let individualAccessTokenStr = getToken()[Config.individualAccessToken]
    if (individualAccessTokenStr) {
        if (method === 'get' || method === 'delete') {
            Object.assign(request.params, {
                [Config.individualAccessToken]: individualAccessTokenStr
            })
        } else if (method === 'post' || method === 'put' || method === 'patch') {
            Object.assign(request.body, {
                [Config.individualAccessToken]: individualAccessTokenStr
            })
        }
    }

    // 请求后端api时带上企业认证信息
    let accessTokenStr = getToken()[Config.accessToken]
    if (accessTokenStr) {
        if (method === 'get' || method === 'delete') {
            Object.assign(request.params, {
                [Config.accessToken]: accessTokenStr
            })
        } else if (method === 'post' || method === 'put' || method === 'patch') {
            Object.assign(request.body, {
                [Config.accessToken]: accessTokenStr
            })
        }
    }

    // 登录时带上登录信息
    if (request.url.indexOf('/auth') !== -1 && method === 'post') {
        Object.assign(request.body, { 'agent': UAResult.browser.name, 'agentVersion': UAResult.browser.version, 'device': UAResult.device.model || 'pc', 'os': UAResult.os.name + UAResult.os.version })
    }

    // 在响应之后传给then之前对response进行修改和逻辑判断。
    // 对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    next((response) => {
        // 登录成功，统一处理
        if (response.url.indexOf('auth') !== -1) {
            if (response.body.code.toString() === '0' && response.body.data && response.body.data.accessToken) {
                // 存全部登录信息
                setStore('auth', response.body.data)
                // 将个人Token写入本地
                setItem(Config.individualAccessToken, JSON.stringify(response.body.data.accessToken))
            }
        }

        // 接口Toke过期
        if (response.data && response.data.code && response.data.code.toString() === '-2') {
            try {
                console.warn('Toke invalid')
                ep.emit('showLockScreen', { eventName: 'disconnect' })
            } catch (e) {
                console.error("ep.emit('showLockScreen'); error!")
            }
        } else if (response.data && response.data.code && response.data.code.toString() === '0') {
            return response
        }
    })
})
