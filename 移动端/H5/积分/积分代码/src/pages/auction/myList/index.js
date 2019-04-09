/**
 * Created by liuzhimeng.
 * @date 2018/8/10
 * @description 我的抢拍页
 */

import './index.less'

import 'core-js/features/promise/finally'

import {
  Toast,
  Dialog,
} from 'Components'
import {
  isLogin,
} from 'Common/iqiyiPlugin'
import {
  orderRender,
  generateDialogOptions,
} from '../controllers'
import {
  activeMemberFn,
} from '../controllers'
import {
  PAGE_SIZE,
  getOrderList,
  getOrderDetail,
} from '../apis'

import {
  myListPingback,
  pvPingback,
  clickPingback,
} from '../assets/pingback'


let pageState = {
  ORDER_LIST: [],
}

pvPingback({
  rpage: myListPingback.rpage,
})

isLogin()

const orderDialog = new Dialog({
  id: 'orderDetail',
  removeHeader: true,
})

// 页面加载态
const pageLoading = new Toast({
  pageLoading: {
    wrapper: '#mescroll',
    content : '加载中...',
  },
  time: 0,
})

// 初始化加载态
pageLoading.show()


const openDialog = (order, data) => {
  orderDialog
    .updateData(data)
    .updateOptions(generateDialogOptions(order, orderDialog))
    .open()
}

function addOrderClickListener() {
  $('#orderList').on('click', '[data-id="orderItem"]', function (e) {
    const {
      ORDER_LIST,
    } = pageState

    const $this = $(this) // e.currentTarget 冒泡
    const $own = $(e.target)
    const ownAttr = $own.attr('data-id')
    if (ownAttr !== 'activeMember') {
      const key = parseFloat($this.attr('data-key'))
      const order = ORDER_LIST[key] || null
      const dialogData = {
        key,
      }

      console.log(order)

      if (order) {
        getOrderDetail({product_id: order.productId})
          .then(data => {
            console.log('getOrderDetail', data)
            if (data.code === 'A00000') {
              order.rules = data.data.rules
            }
            openDialog(order, dialogData)
          })
          .catch(() => {
            openDialog(order, dialogData)
          })
      }
    }
  })
}

function addActiveMemberListener() {
  $('#orderList').on('click', '[data-id="activeMember"]', function (e) {
    const {
      ORDER_LIST,
    } = pageState

    const $this = $(e.target)
    const thisAttr = $this.attr('data-id')
    if (thisAttr === 'activeMember') {
      const key = parseFloat($this.closest('[data-id="orderItem"]').attr('data-key'))
      const order = ORDER_LIST[key] || null

      console.log('ActiveMember', order)

      if (order && order.productStatus === 1) {
        clickPingback({
          ...myListPingback,
          rseat: 'myjingpai_live',
        })
        activeMemberFn(order).then(() => {
          // 更新激活按钮状态
          $this.addClass('disabled').text('已激活')
        })
      }
    }
  })
}

function updateEmpty(type, text) {
  if (type === 'empty') {
    $('#emptyState').addClass('image-network')
    $('#emptyText').text(text)
  } else if (type === 'networkError') {
    $('#emptyState').removeClass('image-network')
    $('#emptyText').text(text)
  } else if (type === 'timeout') {
    $('#emptyState').addClass('image-network')
    $('#emptyText').text(text)
  }
}

const mescroll = new MeScroll("mescroll", {
  up: {
    use: true,
    auto: true,
    page: {
      num: 0, // 当前页码
      size: PAGE_SIZE, // 每页数据的数量
    },
    clearEmptyId: 'orderList', // 加载第一页时需清空数据的列表id
    isBounce: false, // 是否允许ios的bounce回弹;默认true,允许回弹
    htmlLoading: '<span class="upwarp-progress mescroll-rotate"></span><span class="mescroll-tips">加载中...</span>',
    htmlNodata: '<span class="mescroll-tips">没有更多了</span>',
    empty: {
      warpId: 'noRecord',
      icon: null,
      tip: `<div id="emptyState" class="no-image"></div><div id="emptyText" class="no-record-content">还没有抢拍成功哦</div>`,
      supportTap: true,
    },
    callback({num, size}, mescroll) {  //上拉加载的回调
      const data = {
        page: num,
        size,
      }
      getOrderList(data)
        .then(data => {
          if (data.code === 'A00000') {
            const {
              contents,
              total,
            } = data.data

            if (num === 1) {
              pageState.ORDER_LIST = contents
            } else {
              pageState.ORDER_LIST = pageState.ORDER_LIST.concat(contents)
            }

            const hasCount = (num - 1) * size
            mescroll.endBySize(contents.length, total)
            orderRender(contents, hasCount, 'append')
          } else {
            mescroll.endErr()
            if (!pageState.ORDER_LIST.length) {
              mescroll.showEmpty()
              updateEmpty('empty', '还没有抢拍成功哦')
            }
          }
        })
        .catch(err => {
          mescroll.endErr()
          if (!pageState.ORDER_LIST.length) {
            mescroll.showEmpty()
            if (err.code) {
              updateEmpty(err.code, err.message)
            }
          }
        })
        .finally(() => {
          pageLoading && pageLoading.hide()
        })
    },
  }
})

$(document).ready(() => {
  addOrderClickListener()
  addActiveMemberListener()
})
