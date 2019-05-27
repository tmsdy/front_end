/**
 * AM
 */
export default {
    path: 'am',
    name: 'AM',
    component: () =>
        import('@/page/Main/AM/index.vue'),
    children: [{ // 邮件营销
            path: 'mailMarketing',
            name: 'mailMarketing',
            component: () =>
                import('@/page/Main/AM/mailMarketing/index.vue')
        },
        { // 开发信
            path: 'developmentLetter',
            name: 'developmentLetter',
            component: () =>
                import('@/page/Main/AM/developmentLetter/index.vue')
        },
        // { // 模板市场
        //     path: 'templateMarket',
        //     name: 'templateMarket',
        //     component: () =>
        //         import('@/page/Main/AM/templateMarket/index.vue'),
        //     meta: { keepAlive: false } // false为不缓存
        // },
        { // 接收人
            path: 'sendee',
            name: 'sendee',
            component: () =>
                import('@/page/Main/AM/sendee/index.vue')
        },
        { // 统计报表
            path: 'statsReportform',
            name: 'statsReportform',
            component: () =>
                import('@/page/Main/AM/statsReportform/index.vue')
        },
        { // 发送设置
            path: 'sendSet',
            name: 'sendSet',
            component: () =>
                import('@/page/Main/AM/sendSet/index.vue')
        },
        { // 短信营销
            path: 'messageMarketing',
            name: 'messageMarketing',
            component: () =>
                import('@/page/Main/AM/messageMarketing/index.vue')
        },
        {
            path: 'automationStrategy',
            name: 'AutomationStrategy',
            component: () =>
                import('@/page/Main/AM/AutomationStrategy/index.vue'),
            meta: { keepAlive: true }
        },
        {
            path: 'actionManage',
            name: 'ActionManage',
            component: () =>
                import('@/page/Main/AM/ActionManage/index.vue'),
            meta: { keepAlive: true }
        },
        {
            path: 'inquiries',
            name: 'Inquiries',
            component: () =>
                import('@/components/BillTemplate/index.vue')
        },
        {
            path: 'behaviorTrack',
            name: 'BehaviorTrack',
            component: () =>
                import('@/page/Main/AM/BehaviorTrack/index.vue'),
            children: [{
                    path: 'list',
                    name: 'List',
                    component: () =>
                        import('@/page/Main/AM/BehaviorTrack/List/index.vue'),
                    meta: { keepAlive: false } // false为不缓存
                },
                {
                    path: 'detail/:id',
                    name: 'Detail',
                    component: () =>
                        import('@/page/Main/AM/BehaviorTrack/Detail/index.vue'),
                    meta: { keepAlive: false } // false为不缓存
                }
            ]
        },
        { // LandingPage
            path: 'landingPage',
            name: 'landingPage',
            component: () =>
                import('@/page/Main/AM/LandingPage/index.vue'),
            meta: { keepAlive: false } // false为不缓存
        }
    ]
}
