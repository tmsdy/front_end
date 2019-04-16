import {
  transferTimeTo,
  isURL,
  setLocalStorage,
  getProductImage,
  filterExts,
  replaceContent,
  goToUse,
} from 'Common/utils/index'

import {
  activeMemberFn,
} from './activeMember'

import {
  myListPingback,
  clickPingback,
} from '../assets/pingback'

const clipboardAttrs = {
  'id': 'copyButton',
  'data-clipboard-target': '#clipboardText',
}

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
  return text ? [{
    className: 'btn-primary-block w500',
    clickable,
    attrs,
    text,
    onClick,
  }] : []
}

/**
 * 根据订单信息生成弹窗内容模板
 * @param order 当前订单信息
 * @returns {string} 返回最终弹窗内容模板字符串
 */
function generateContentByCode(order) {
  const {
    type, // 商品类型
    subType, // 商品子类型
    redeemCodes, // 券码
  } = order

  console.log(type, subType, redeemCodes)

  let extra = {}
  if (type === 3 && subType === 0) { // 实物 + 常规
    const {
      addressInfo,
    } = order
    if (addressInfo && addressInfo.hasOwnProperty('address')) {
      const {
        name,
        phone,
        address,
      } = addressInfo
      extra = {
        id: 'address',
        label: '收货信息',
        text: `${name} ${phone} ${address}`,
      }
    }
  } else if ([4, 6].indexOf(type) !== -1 && subType === 0 && redeemCodes && !isURL(redeemCodes)) {
    extra = {
      id: 'code',
      label: '商品券码',
      text: redeemCodes,
    }
  }

  return dialogContentTemplate(order, extra)
}

/**
 * 生成弹窗内按钮模板
 * @param order 订单信息
 * @param $dialog 当前弹窗
 * @returns {*} 返回最终弹窗按钮模板字符串
 */
function genetateBtnOptionsByCode(order, $dialog) {
  const {
    type, // 商品类型
    subType, // 商品子类型
    productStatus, // 商品状态，1:未激活，2:已激活（该字段仅当type=5,subType=10时才有意义）
    redeemCodes, // 券码
    exts, // 道具扩展信息
    addressInfo, // 收货地址（实物道具才会有此信息）
    status, // 订单状态，只有1是成功（0:待支付 1：支付完成 2：扣除积分成功  3：扣除积分失败  4:发放出错 5：卡券后台出错 6：会员直充出错 7：增加积分失败 8：道具库存不足 9：道具不在可售时间）
  } = order

  let btnOptions = {}   // 默认不展示按钮
  if (status === 1) {

    // type 商品类型，1:礼物，2:礼券，3:实物，4:卡券，5:虚拟商品，6:商品券，7:付费会员
    // subType 商品子类型，0:'常规', 1:'vip专属', 2:'隐藏礼物', 3:'抽奖礼物', 4:'免费礼物', 5:'卡券后台',
    //                   6:'会员直冲', 7:'虚拟积分', 8:'游戏礼包', 9:'黄金会员', 10:'会员直充-激活', 11:'链接发放'

    const extMap = filterExts(exts)

    if (type === 4 && subType === 11 && isURL(redeemCodes)) { // 卡券 + 链接发放
      btnOptions = {
        text: '去使用',
        onClick: () => location.href = redeemCodes
      }
    } else if ([4, 6].indexOf(type) !== -1 && subType === 0) { // 卡券&商品券 + 常规
      if (extMap.hasOwnProperty('touse')) {
        btnOptions = {
          text: redeemCodes ? '复制券码并使用' : '去使用',
          attrs: redeemCodes ? clipboardAttrs : {},
          onClick: redeemCodes ? null : () => goToUse(extMap)
        }
      } else if (redeemCodes) {
        btnOptions = {
          text: '复制券码',
          attrs: clipboardAttrs,
        }
      }
    } else if (type === 5 && subType === 10) { // 虚拟商品 + 会员激活
      btnOptions = {
        text: productStatus === 1 ? '激活' : '已激活',
        clickable: productStatus === 1,
        onClick: productStatus === 1
          ? () => {
            clickPingback({
              ...myListPingback,
              rseat: 'myjingpai_live',
            })
            $dialog.close()
            const dialogData = $dialog.getData()
            activeMemberFn(order).then(() => {
              // 更新列表激活按钮状态
              $(`[data-id="orderItem"][data-key="${dialogData.key}"] [data-id="activeMember"]`)
                .addClass('disabled')
                .text('已激活')
            })
          }
          : null,
      }
    } else if (type === 3 && subType === 0 && (!addressInfo || !addressInfo.address)) { // 实物 + 常规
      btnOptions = {
        text: '填写收货信息',
        onClick: () => {
          setLocalStorage('integralOrderDetail', order)
          location.href = '/integralh5/orderlist/edit_address'
        }
      }
    } else if (extMap.hasOwnProperty('touse')) {
      btnOptions = {
        text: '去使用',
        onClick: () => goToUse(extMap)
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
export const generateDialogOptions = (order, $dialog) => ({
  buttons: genetateBtnOptionsByCode(order, $dialog),
  content: generateContentByCode(order, $dialog),
})
