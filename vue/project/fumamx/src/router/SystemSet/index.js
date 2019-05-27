/**
 * 系统设置
 */
import MailSet from './MailSet/index'

export default {
    path: 'systemset',
    name: 'SystemSet',
    component: () => import('@/page/Main/SystemSet/index'),
    children: [{ // 系统参数
            path: 'systemparameter',
            name: 'SystemParameter',
            component: () => import('@/page/Main/SystemSet/SystemParameter/index')
        },
        { // 账号设置
            path: 'accountSettings',
            name: 'accountSettings',
            component: () => import('@/page/Main/SystemSet/AccountSettings/index')
        },
        { // 应用中心
            path: 'applicationcenter',
            name: 'applicationcenter',
            component: () => import('@/page/Main/SystemSet/ApplicationCenter/index')
        },
        { // 组织架构
            path: 'groupstructure',
            name: 'GroupStructure',
            component: () => import('@/page/Main/SystemSet/GroupStructure/index')
        },
        { // 角色管理
            path: 'rolemanag',
            name: 'RoleManag',
            component: () => import('@/page/Main/SystemSet/RoleManag/index')
        },
        { // 日志与行为
            path: 'logaction',
            name: 'LogAction',
            component: () => import('@/page/Main/SystemSet/LogAction/index')
        },
        { // 业务字段配置
            path: 'bizfield',
            name: 'BizField',
            component: () => import('@/page/Main/SystemSet/BizField/index')
        },
        { // 业务字典
            path: 'bizdict',
            name: 'BizDict',
            component: () => import('@/page/Main/SystemSet/BizDict/index')
        },
        { // 商品类目配置
            path: 'goodsClass/:id?',
            name: 'GoodsClass',
            component: () => import('@/page/Main/SystemSet/GoodsClass/index')
        },
        { // 公海设置
            path: 'highseas',
            name: 'HighSeas',
            component: () => import('@/page/Main/SystemSet/HighSeas/index')
        },
        { // 日志与提醒
            path: 'scheduleremind',
            name: 'ScheduleRemind',
            component: () => import('@/page/Main/SystemSet/ScheduleRemind/index')
        },
        { // 我的反馈
            path: 'feedback',
            name: 'feedback',
            component: () => import('@/page/Main/SystemSet/Feedback/index')
        },
        { // 我的反馈-详情
            path: 'feedback/detail/:id?',
            name: 'feedbackDetail',
            component: () => import('@/page/Main/SystemSet/Feedback/detail/index')
        },
        { // 费用中心
            path: 'costCenter',
            name: 'CostCenter',
            component: () => import('@/page/Main/SystemSet/CostCenter/index')
        },
        { // 系统公告
            path: 'systembulletin',
            name: 'SystemBulletin',
            component: () => import('@/page/Main/SystemSet/SystemBulletin/index')
        },
        { // 标签管理
            path: 'labelsManage',
            name: 'labelsManage',
            component: () => import('@/page/Main/SystemSet/LabelsManage/index')
        },
        { // 打印模板管理
            path: 'printTemplate',
            name: 'printTemplate',
            component: () => import('@/page/Main/SystemSet/PrintTemplateManagement/index')
        },
        { // 跟单流程模板
            path: 'trackingTemplate',
            name: 'trackingTemplate',
            component: () => import('@/page/Main/SystemSet/TrackingProcedureTemplate/index')
        },
        { // 实时汇率
            path: 'exchangeRate',
            name: 'exchangeRate',
            component: () => import('@/page/Main/SystemSet/ExchangeRate/index')
        },
        MailSet
    ]
}
