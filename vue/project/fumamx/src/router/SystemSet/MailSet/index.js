export default {
  path: 'mailset',
  name: 'MailSet',
  component: () => import ('@/page/Main/SystemSet/MailSet/index'),
  children: [
    {// 邮件设置
      path: 'setindex',
      name: 'SetIndex',
      component: () => import ('@/page/Main/SystemSet/MailSet/SetIndex/index')
    },
    { // 邮件账号
      path: 'mailaccount',
      name: 'MailAccount',
      component: () => import ('@/page/Main/SystemSet/MailSet/MailAccount/index')
    },
    { // 邮件模板
      path: 'templatemanage',
      name: 'TemplateManage',
      component: () => import ('@/page/Main/SystemSet/MailSet/TemplateManage/index')
    },
    { // 开发信
      path: 'developmentletter',
      name: 'DevelopmentLetter',
      component: () => import ('@/page/Main/SystemSet/MailSet/DevelopmentLetter/index')
    },
    { // 签名管理
      path: 'autographmanage',
      name: 'autographmanage',
      component: () => import ('@/page/Main/SystemSet/MailSet/AutographManage/index')
    },
    { // 快速文本
      path: 'fasttext',
      name: 'FastText',
      component: () => import ('@/page/Main/SystemSet/MailSet/FastText/index')
    }
  ]
}
