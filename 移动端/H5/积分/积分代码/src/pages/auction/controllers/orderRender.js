import {
  transferTimeTo,
} from 'Common/utils/index'

/**
 * 订单模板
 * @param item 当前订单信息
 * @param key 当前订单key
 * @param hasCount 已经加载的订单数
 * @returns {string}
 */
function orderTemplate(item, key, hasCount) {
  const isWillOverdue = item.offlineTime - Date.now() <= 3 * 24 * 3600 * 1000
  const timeStr = transferTimeTo('datetime', item.offlineTime)
  const time = timeStr
    ? timeStr.split(' ')[0]
    : ''
  const statusBtn = item.productStatus === 1 ? '' : ' disabled'
  const statusText = item.productStatus === 1 ? '激活' : '已激活'
  const stateContent = (item.active && parseFloat(item.status) === 1)
    ? `<span data-id="activeMember" class="btn-primary auction-active${statusBtn}">${statusText}</span>`
    : ''
  const stateText = item.active
    ? parseFloat(item.status) === 1
      ? isWillOverdue
        ? '<span class="state-text">即将过期</span>'
        : ''
      : '<span class="state-text state-disabled">兑换失败</span>'
    : '<span class="state-text state-disabled">已过期</span>'

  const isClickedId = item.active ? ' data-id="orderItem"' : ''

  return (
    `<li${isClickedId} class="record-item${item.active ? '' : ' disabled'}" data-key="${key + hasCount}">
        <div class="record-content">
            <div class="record-title">${stateText}${item.name}</div>
            <div class="record-text">出价积分：${item.orderScore}<i class="i-point vt"></i></div>
            <div class="record-text">有效期至：${time}</div>
        </div>
        <div class="record-state">
            <div class="state-box">${stateContent}</div>
        </div>
    </li>`
  )
}

/**
 * 生成订单列表模板
 * @param data {array} 当前订单列表信息
 * @param hasCount {number} 已经加载的订单数
 * @returns {string} 返回订单列表模板字符串
 */
function orderListTemplate(data, hasCount = 0) {
  const nowTime = Date.now()
  let template = ''
  data.forEach((i, k) => {
    i.active = nowTime < i.offlineTime
    template += orderTemplate(i, k, hasCount)
  })
  return template
}

/**
 * 渲染订单列表
 * @param data {array} 当前订单列表信息
 * @param hasCount {number} 已经加载的订单数
 * @param type {string} 操作类型 append: 在现有列表上添加；reset: 清空列表并添加
 */
export function orderRender(data, hasCount = 0, type = 'append') {
  const $wrapper = $('#orderList')
  const content = orderListTemplate(data, hasCount)
  if (type === 'reset') {
    $wrapper.html(content)
  } else {
    $wrapper.append(content)
  }
}
