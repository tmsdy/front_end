/**
 * 邮件
 */
export default {
  path: 'mail',
  name: 'Mail',
  component: () => import ('@/page/Main/Mail/index'),
  children: [{ // 邮件主页
    path: 'home/:id?',
    name: 'home',
    component: () => import ('@/page/Main/Mail/Home/index')
  }
  ]
}
