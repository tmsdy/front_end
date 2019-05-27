export default {
    path: 'discovery',
    name: 'Discovery',
    component: () => import('@/page/Main/Discovery/index.vue'),
    children: [{ // 孚盟搜
            path: 'fumaSearch',
            name: 'FumaSearch',
            component: () => import('@/page/Main/Discovery/FumaSearch/index.vue')
        },
        { // 深挖记录
            path: 'record',
            name: 'Record',
            component: () => import('@/page/Main/Discovery/Record/index.vue')
        },
        { // 媒体互动
            path: 'socialMedia',
            name: 'SocialMedia',
            component: () => import('@/page/Main/Discovery/SocialMedia/index.vue')
        },
        { // 设置
            path: 'setting',
            name: 'Setting',
            component: () => import('@/page/Main/Discovery/Setting/index.vue')
        },
        { // 优质买家
            path: 'qualityBuyer',
            name: 'QualityBuyer',
            component: () => import('@/page/Main/Discovery/QualityBuyer/index.vue')
        },
        { // 我的关注
            path: 'myFollow',
            name: 'MyFollow',
            component: () => import('@/page/Main/Discovery/MyFollow/index.vue')
        },
        { // 发现商机
            path: 'businessOpportunity',
            name: 'BusinessOpportunity',
            component: () => import('@/page/Main/Discovery/BusinessOpportunity/index.vue')
        },
        {
            path: 'customsData',
            name: 'CustomsData',
            component: () => import('@/page/Main/Discovery/CustomsData/index.vue')
        }
    ]
}
