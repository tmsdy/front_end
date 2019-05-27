import Vue from 'vue'
import Router from 'vue-router'
import { routerMode, accessToken, isFMApp } from '@/libs/config'

// 工作台
import WorkBench from './WorkBench/index'
// 系统设置
import SystemSet from './SystemSet/index'
// 邮件
import Mail from './Mail/index'
// 客户
import Client from './Client/index'
// 下属
import Subordinate from './Subordinate/index'
// 文档
import Document from './Document/index'
// AM
import AM from './AM/index'
// MX
import MX from './MX/index'
// 发现
import Discovery from './Discovery/index'

// 商品
import Goods from './Goods/index'

// 自定义报表
import CustomReport from './CustomReport/index'

// 没有页面
import Sale from './Sale/index'

// 没有页面
import NoPage from './NoPage/index'

import { getStore, getToken } from '@/libs/utils.js'
Vue.use(Router)

const router = new Router({

    hashbang: true,
    mode: routerMode,
    routes: [{
            path: '/',
            redirect: '/main/workbench'
        },
        {
            // 企业注册
            path: '/companyregister',
            name: 'CompanyRegister',
            component: () => import('@/page/CompanyRegister/index')
        },
        {
            // 登录
            path: '/login',
            name: 'Login',
            component: () => import('@/page/Login/index')
        },
        {
            // 主页面
            path: '/main',
            name: 'Main',
            component: () => import('@/page/Main/index'), // 使用异步加载
            children: [
                WorkBench,
                SystemSet,
                Mail,
                Client,
                Subordinate,
                Document,
                AM,
                MX,
                Discovery,
                Goods,
                CustomReport,
                NoPage,
                Sale
            ]
        }
    ]

})

window.getRouter = function() {
    return router
}

// 路由拦截
router.beforeEach((to, from, next) => {
    // 读取本地存储的Token是否过期，未过期跳转页面，过期到登录
    let accessTokenStr = getToken()[accessToken]
    if (accessTokenStr) {
        // 已登录
        if (to.path === '/login' || to.path === '/companyregister') {
            // 访问登录页面
            next({ path: '/' })
        } else {
            // 读取路径
            let navigator = getStore('navigator') || { uRIs: [] }
            // console.log(navigator)
            // next()
            let uRIs = navigator.uRIs || []
            uRIs.push('/main/nopage')

            let isNext = false
            // 对动态路由拦截处理,/main/client/tabs/seas/BF001 需要截取掉
            /*  白名单 new code
             *  注意：如果只是开发调试 请不要提交这个文件这部分的更改
             */
            const whitelist = [
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
                '/main/systemset/exchangeRate'
            ]

            if (new RegExp(whitelist.join('|'), 'g').test(to.path)) {
                isNext = true
            } else {
                isNext = uRIs.indexOf(to.path) > -1
            }

            // 判断用户访问路由有没有权限访问，没有到提示页
            if (isNext) {
                next()
            } else {
                /* 不要改动这里，开发时没有配路由的话，去上面白名单里添加自己开发模块的路由 */
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
                ep.emit('showLockScreen')
            } else {
                // 访问别的页面都到登录页
                next({
                    path: '/login'
                })
            }
        }
    }
})

export default router
