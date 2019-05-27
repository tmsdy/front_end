/**
 * 自定义报表
 */
export default {
    path: 'customReport',
    name: 'CustomReport',
    component: () =>
        import('@/page/Main/CustomReport/index.vue'),
    children: [{
            path: 'list/:id?',
            name: 'CustomReportList',
            component: () => import('@/page/Main/CustomReport/List/index.vue')
        },
        {
            path: 'create/:id?',
            name: 'Create',
            component: () => import('@/page/Main/CustomReport/Create/index.vue')
        },
        {
            path: 'delete',
            name: 'Delete',
            component: () => import('@/page/Main/CustomReport/Delete/index.vue')
        },
        {
            path: 'subscribe',
            name: 'Subscribe',
            component: () => import('@/page/Main/CustomReport/Subscribe/index.vue')
        },
        {
            // 自定义报表详情
            path: 'reportdetail',
            name: 'ReportDetail',
            meta: {
                keepAlive: true // 需要被缓存
            },
            component: () =>
                import('@/page/Main/CustomReport/ReportDetail/index.vue')
        }
    ]
}
