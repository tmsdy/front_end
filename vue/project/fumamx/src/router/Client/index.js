/**
 * 客户管理
 */
export default {
  path: 'client',
  name: 'Client',
  component: () => import ('@/page/Main/Client/index.vue'),
  children: [
    // tabs,#/main/client/tabs/list/BF001/33871/index
    {
      path: 'tabs/:viewName?/:moduleCode?/:id?',
      name: 'ClientTabs',
      component: () => import('@/page/Main/Client/Tabs/index.vue')
    }
  ]
}
