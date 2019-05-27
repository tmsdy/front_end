
import otEdit from './otEdit/index'
import otNew from './otNew/index'
import otReminder from './otReminder/index'
import otComment from './otComment/index'
import otTag from './otTag/index.vue'
import otTransfer from './otTransfer/index'
import otTransferWork from './otTransferWork/index'
import otCloseWork from './otCloseWork/index'
import otAddShare from './otAddShare/index'
import otSendEmail from './otSendEmail/index'
import otMarketing from './otMarketing/index'
import otAddaddressbook from './otAddaddressbook/index'
import otDistribution from './otDistribution/index'
import otAddLowerCust from './otAddLowerCust/index'
import otReceive from './otReceive/index'
import otPrint from './otPrint/index'
import otReopen from './otReopen/index'
import otEvaluate from './otEvaluate/index'
import otEmpty from './otEmpty/index'
import otBatchModify from './otBatchModify/index.vue'
import otMergeCustomer from './otMergeCustomer/index'
import otExport from './otExport/index'
import otListSetting from './otListSetting/index'
import otView from './otView/index'
import otTransform from './otTransform/index'
import otImport from './otImport/index'
import otMergeLabel from './otMergeLabel/index'
import otLabelsDelete from './otLabelsDelete/index'
import otPushdown from './otPushdown/index'
import otCopy from './otCopy/index'

import batchMsg from './batchMsg/index' // 批量操作弹窗
import customSearch from './customSearch/index' // 快捷搜索操作弹窗

// import batchMsg from './batchMsg/index'
export default {
  'otEdit': otEdit, // 编辑
  'otNew': otNew, // 新增
  'otReminder': otReminder, // 提醒
  'otComment': otComment, // 批注
  'otTag': otTag, // 标签
  'otTransfer': otTransfer, // 移交
  'otTransferWork': otTransferWork, // 工单移交
  'otCloseWork': otCloseWork, // 关闭工单
  'otAddShare': otAddShare, // 新增共享
  'otSendEmail': otSendEmail, // 发邮件
  'otMarketing': otMarketing, // 一键营销
  'otAddaddressbook': otAddaddressbook, // 加入地址簿
  'otDistribution': otDistribution, // 分配
  'otAddLowerCust': otAddLowerCust, // 新增下级客户
  'otReceive': otReceive, // 领取
  'otPrint': otPrint, // 报表
  'otReopen': otReopen, // 重新开启工单
  'otEvaluate': otEvaluate, // 评分
  'otFocus': otEmpty, // 关注/取消关注
  'otPutSeas': otEmpty, // 放入公海
  'otDelete': otEmpty, // 放入回收站
  'otAddAttach': otEmpty, // 上传附件
  'otRecovery': otEmpty, // 恢复
  'otThoroughDelete': otEmpty, // 彻底删除
  'otBatchModify': otBatchModify, // 批量编辑
  'otMergeCustomer': otMergeCustomer, // 合并
  'otExport': otExport, // 导出
  'otListSetting': otListSetting, // 列表设置
  'otView': otView, // 查看
  'otTransform': otTransform, // 转化客户
  'otImport': otImport, // 导入
  'offShelves': otEmpty, // 批量下架
  'recommend': otEmpty, // 批量推荐
  'onShelves': otEmpty, // 批量上架
  'cancelRecommend': otEmpty, // 批量取消推荐
  'otMergeLabel': otMergeLabel, // 批量合并标签
  'otLabelsDelete': otLabelsDelete, // 标签删除
  otPushdown,
  otCopy,
  'otSaleDelete': otEmpty, // 报价彻底删除
  'batchMsg': batchMsg, // 批量操作结果弹窗
  'customSearch': customSearch // 批量操作结果弹窗
}
