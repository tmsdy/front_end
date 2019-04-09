import {filterExts, getProductImage, goToUse, isURL, replaceContent, transferTimeTo} from 'Common/utils'
import {clickPingback, MY_SUCCESS_PB} from '../assets'

/**
 * 弹窗内容模板
 * @param order 当前订单信息
 * @param extra 额外行信息配置字段
 * @returns {string} 模板字符串
 */
function dialogContentTemplate(order, extra = {}) {
  // 如果为券码行信息，添加clipboard插件的id到DOM节点上
  const clipboardId = extra.id === 'code' ? ` id="clipboardText"` : ''
  const slot = extra.label
    ? `<div class="layout-group">
          <span class="layout-label">${extra.label}：</span>
          <div class="layout-content">
              <div${clipboardId}>${extra.text}</div>
          </div>
       </div>`
    : ''

  const rule = order.rules
    ? `<div class="layout-group">
            <span class="layout-label">兑换规则：</span>
            <div class="layout-content">
                <div>${replaceContent(order.rules, order.exts) || '无'}</div>
            </div>
        </div>`
    : ''

  return (
    `<div class="order-content">
        <div class="image-wrapper">
            <img class="order-image" src="${getProductImage(order.photoList)}" alt="">
        </div>
        <h3 class="order-title">${order.name}</h3>
        ${slot}
        <div class="layout-group"><span class="layout-label">下单日期：</span>${transferTimeTo('datetime', order.payTime)}</div>
        <div class="layout-group"><span class="layout-label">订单编号：</span>${order.orderCode}</div>
        ${rule}
    </div>`
  )
}

/**
 * 获取弹窗按钮配置信息
 * @param text 按钮文字
 * @param attrs 按钮自定义属性
 * @param clickable 是否可点击
 * @param onClick 注册点击事件
 * @returns {array}
 */
function getDialogButtons({text = null, attrs = {}, clickable = true, onClick = null}) {
  return text
    ? [{className: 'btn-orange-block w500', clickable, attrs, text, onClick}]
    : []
}

/**
 * 根据订单信息生成弹窗内容模板
 * @param order 当前订单信息
 * @returns {string} 返回最终弹窗内容模板字符串
 */
function generateContentByCode(order) {
  return dialogContentTemplate(order)
}

/**
 * 生成弹窗内按钮模板
 * @param order 订单信息
 * @param key 订单key
 * @param $dialog 当前弹窗
 * @returns {*} 返回最终弹窗按钮模板字符串
 */
function genetateBtnOptionsByCode(order, key, $dialog) {
  const {
    type, // 商品类型
    subType, // 商品子类型
    redeemCodes, // 券码
    exts, // 道具扩展信息
    status, // 订单状态，只有1是成功（0:待支付 1：支付完成 2：扣除积分成功  3：扣除积分失败  4:发放出错 5：卡券后台出错 6：会员直充出错 7：增加积分失败 8：道具库存不足 9：道具不在可售时间）
  } = order

  let btnOptions = {}   // 默认不展示按钮
  if(status === 1) {

    // type 商品类型，1:礼物，2:礼券，3:实物，4:卡券，5:虚拟商品，6:商品券，7:付费会员
    // subType 商品子类型，0:'常规', 1:'vip专属', 2:'隐藏礼物', 3:'抽奖礼物', 4:'免费礼物', 5:'卡券后台',
    //                   6:'会员直冲', 7:'虚拟积分', 8:'游戏礼包', 9:'黄金会员', 10:'会员直充-激活', 11:'链接发放'

    const extMap = filterExts(exts)

    if([4, 6].indexOf(type) !== -1 && subType === 11 && isURL(redeemCodes)) { // 卡券 + 链接发放
      btnOptions = {
        text: '去使用',
        onClick: () => {
          clickPingback({...MY_SUCCESS_PB, rseat: `duobao_touse_${key + 1}`})
          location.href = redeemCodes
        },
      }
    } else if(type === 5 && subType === 0 && extMap.touse) {
      btnOptions = {
        text: '去使用',
        onClick: () => {
          clickPingback({...MY_SUCCESS_PB, rseat: `duobao_touse_${key + 1}`})
          goToUse(extMap)
        },
      }
    }
  }

  return getDialogButtons(btnOptions)
}

/**
 * 生成dialog弹窗配置信息（内容+按钮）
 * @param order
 * @param $dialog
 * @returns {{buttons: array, content: string}}
 */
export const generateDialogOptions = (order, key, $dialog) => ({
  buttons: genetateBtnOptionsByCode(order, key, $dialog),
  content: generateContentByCode(order, $dialog),
})
