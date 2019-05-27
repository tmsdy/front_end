export default {
  path: 'sale',
  name: 'Sale',
  component: () => import ('@/page/Main/Sale/index.vue'),
  children: [
    // tabs,#/main/client/tabs/list/BF001/33871/index
    {
      path: 'tabs/:viewName?/:moduleCode?/:id?',
      name: 'SaleTabs',
      component: () => import('@/page/Main/Sale/Tabs/index.vue'),
      meta: { keepAlive: false }
    },
    {
      path: 'test',
      name: 'Test',
      component: () => import('@/page/Main/Sale/Test/index.vue')
    }
  ]
}
