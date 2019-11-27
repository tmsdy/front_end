import router from './index.js'
import store from '@/store'
import MXEventBus from '@/libs/event'
import { getStore, getToken } from '@/libs/utils.js'
import { accessToken, isFMApp } from '@/libs/config'
import perf from '@/libs/perf.js'

function getWhiteListRegExp() {
    // 对动态路由拦截处理,/main/client/tabs/seas/BF001 需要截取掉
    /*  白名单 new code
     *  注意：如果只是开发调试 请不要提交这个文件这部分的更改
     */
    const whitelist = [
        '/main/maintain',
        '/main/client/tabs',
        '/main/sale/tabs',
        '/main/sale/test',
        '/main/mail',
        '/workOrder/detail',
        '/feedback/detail',
        '/main/am/behaviorTrack',
        '/main/subordinate',
        '/main/customReport',
        // 下面写dev的
        'systemset/goodsClass',
        '/main/systemset/openPlatform',
        // 报关助记符
        '/main/customs/mnemonic'
    ]
    return new RegExp(whitelist.join('|'), 'g')
}
const WHITE_LIST_REG = getWhiteListRegExp()

router.beforeEach((to, from, next) => {
    if (process.env.NODE_ENV === 'development') {
        // console.log('beforeEach', to, from)
        if (to.path === '/login') {
            perf.init((perfData) => {
                perfData.page = 'login'
                console.log(perfData)
            })
        }
    }
    // 读取本地存储的Token是否过期，未过期跳转页面，过期到登录
    let accessTokenStr = getToken()[accessToken]
    if (accessTokenStr) {
        // 已登录
        const redirectAddress = ['/login', '/companyregister']
        if (redirectAddress.includes(to.path)) {
            next({ path: '/' })
        } else {
            let uRIs = [
                ...(store.getters.navigator.uRIs || getStore('navigator').uRIs || []),
                '/main/nopage'
            ]

            let isNext = false

            WHITE_LIST_REG.lastIndex = 0
            if (WHITE_LIST_REG.test(to.path)) {
                isNext = true
            } else {
                isNext = uRIs.indexOf(to.path) > -1
            }

            if (isNext) {
                next()
            } else {
                /*  不要改动这里， */
                /*  开发时没有配路由的话， */
                /*  去上面白名单里添加自己开发模块的路由  */
                next('/main/nopage')
            }
        }
    } else {
        // 登录页和企业注册页于登录无关
        if (to.path === '/login' || to.path === '/companyregister') {
            // 只允许这两个页面可以访问
            next()
        } else {
            // 客户端打开过期处理
            if (isFMApp) {
                MXEventBus.emit('showLockScreen')
            } else {
                // 访问别的页面都到登录页
                next({ path: '/login' })
            }
        }
    }
})
