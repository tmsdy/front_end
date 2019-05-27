export default {
  path: 'mx',
  name: 'mx',
  component: () => import ('@/page/Main/MX/index'),
  children: [
    {// 订单管理
      path: 'orderManage',
      name: 'OrderManage',
      component: () => import ('@/page/Main/MX/OrderManage/index')
    },
    {// 消费明细
      path: 'spendDetail',
      name: 'SpendDetail',
      component: () => import ('@/page/Main/MX/SpendDetail/index')
    },
    {// 充值管理
      path: 'rechargeManage',
      name: 'RechargeManage',
      component: () => import ('@/page/Main/MX/RechargeManage/index')
    },
    {// 退款记录
      path: 'refundRecord',
      name: 'RefundRecord',
      component: () => import ('@/page/Main/MX/RefundRecord/index')
    },
    {// 开票邮寄
      path: 'openTicketMail',
      name: 'OpenTicketMail',
      component: () => import ('@/page/Main/MX/OpenTicketMail/index')
    },
    {// 最新消息
      path: 'newMsg',
      name: 'NewMsg',
      component: () => import ('@/page/Main/MX/NewMsg/index')
    },
    {// 财务管理
      path: 'financialManage',
      name: 'FinancialManage',
      component: () => import ('@/page/Main/MX/FinancialManage/index')
    },
    {// 文章管理
      path: 'articleManage',
      name: 'ArticleManage',
      component: () => import ('@/page/Main/MX/ArticleManage/index')
    },
    {// 运维管理
      path: 'operationMaintenance',
      name: 'OperationMaintenance',
      component: () => import ('@/page/Main/MX/OperationMaintenance/index')
    },
    {// 模板管理
      path: 'templateManage',
      name: 'TemplateMarketManage',
      component: () => import ('@/page/Main/MX/TemplateManage/index')
    },
    {// 图片管理
      path: 'imgManage',
      name: 'ImgManage',
      component: () => import ('@/page/Main/MX/ImgManage/index')
    },
    {// 活动
      path: 'activity',
      name: 'Activity',
      component: () => import ('@/page/Main/MX/Activity/index')
    }
  ]
}
