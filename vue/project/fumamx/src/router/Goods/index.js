/**
 * AM
 */
export default {
    path: 'goods',
    name: 'Goods',
    component: () =>
        import ('@/page/Main/Goods/index.vue'),
    children: [{ // 商品列表
            path: 'goodsList',
            name: 'goodsList',
            component: () =>
                import ('@/page/Main/Goods/GoodsList/index.vue')
        },
        { // 商品属性
            path: 'goodsAttribute',
            name: 'goodsAttribute',
            component: () =>
                import ('@/page/Main/Goods/GoodsAttribute/index.vue')
        },
        { // 商品目录
            path: 'GoodsCatalog',
            name: 'GoodsCatalog',
            component: () =>
                import ('@/page/Main/Goods/GoodsCatalog/index.vue')
        },
        { // 商品分析
            path: 'GoodsAnalyse',
            name: 'GoodsAnalyse',
            component: () =>
                import ('@/page/Main/Goods/GoodsAnalyse/index.vue')
        }
    ]
}
