/**
 * Create By liuzhimenng
 * 2018.07.05
 */

import './index.less'

import 'core-js/features/promise/finally'

import {Dialog, Toast} from 'Components'
import {iqiyiMenu, isLogin} from 'Common/iqiyiPlugin'
import {generateDialogOptions} from './assets/getDialogOptions'
import {orderRender} from './assets/orderRender'
import {initClipToboard} from './assets/helpers'
import {filterExts, goToApp, parseQueryString} from 'Common/utils'
import {getOrderDetail, getOrderList, PAGE_SIZE} from './apis'

let pageState = {
  ORDER_LIST: [],
  CURRENT_KEY: null,
}

isLogin()

const queryObj = parseQueryString()

let operateMenu = 'set'
let documentTitle = '我的收获'
// 来自七巧板则隐藏右上角菜单及帮助提示
if(queryObj.from === 'qiqiaoban') {
  operateMenu = 'hide'
  if(queryObj.title) {
    documentTitle = queryObj.title
  }
  // const btnStyles = {
  //   'color': queryObj.btncolor || '#ffffff',
  //   'background-color': queryObj.btnbgcolor || '#FF7E00',
  //   'border-color': queryObj.btnbordercolor || 'none',
  //   'background-image': 'none',
  // }
  // $('.btn-orange-block.w500').css(btnStyles)
  // $('#orderList li[data-order-item] .btn-orange').css(btnStyles)
  $('body').addClass('.qiqiaoban')
  $('#recordHelper').remove()
} else {
  $('#recordHelper').css('display', 'block')
}
// 设置app右上角菜单
iqiyiMenu({
  share: false, // true|false。true表示显示分享按钮，false表示隐藏。可空
  prizeRecord: false, // true|false。true表示显示获奖列表，false表示隐藏。可空
  customService: false, //true|false。true表示显示联系客服，false表示隐藏。可空
  menus: [{
    text: '反馈', // 显示文案
    link: 'https://h5.m.iqiyi.com/integral/feed', //点击后跳转url，支持iqiyi协议
  }],
}, operateMenu)
document.title = documentTitle

let clipboard = null
const orderDialog = new Dialog({
  id: 'orderDetail',
  removeHeader: true,
  afterOpen() {
    const $copyButton = $('#copyButton')
    if($copyButton && $copyButton.length) {
      const {
        ORDER_LIST,
        CURRENT_KEY,
      } = pageState
      const extMap = filterExts(ORDER_LIST[CURRENT_KEY]['exts'])
      clipboard = initClipToboard(extMap)
    }
  },
  afterClose() {
    clipboard && clipboard.destroy()
  },
})

const pageLoading = new Toast({
  pageLoading: true,
  time: 0,
})
pageLoading.show()

function addOrderClickListener() {
  $('#orderList').on('click', '[data-order-item]', function() {
    let key = $(this).attr('data-key')
    key = parseFloat(key)
    const order = pageState.ORDER_LIST[key] || null

    if(order) {
      pageState.CURRENT_KEY = key

      getOrderDetail({product_id: order.productId})
        .then(data => {
          console.log('getOrderDetail', data)
          if(data.code === 'A00000') {
            order.rules = data.data.rules
          }
          orderDialog
            .updateOptions(generateDialogOptions(order, orderDialog))
            .open()
        })
        .catch(() => {
          orderDialog
            .updateOptions(generateDialogOptions(order, orderDialog))
            .open()
        })
    }
  })
}

const mescroll = new MeScroll('mescroll', {
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
      tip: '<div class="no-image"></div><div class="no-record-content">还没有兑换记录哦，<br/>去看看可以兑换的商品吧~</div>',
      btntext: '去看看',
      supportTap: true,
      btnClick() {
        goToApp({type: 'pageName', value: 'ShoppingMall'})
      },
    },
    callback({num, size}, mescroll) {  //上拉加载的回调
      const data = {
        page: num,
        size,
      }
      getOrderList(data)
        .then(data => {
          if(data.code === 'A00000') {
            const {
              contents,
              total,
            } = data.data

            if(num === 1) {
              pageState.ORDER_LIST = contents
            } else {
              pageState.ORDER_LIST = pageState.ORDER_LIST.concat(contents)
            }

            const hasCount = (num - 1) * size
            mescroll.endBySize(contents.length, total)
            orderRender(contents, hasCount, 'append')
          } else {
            mescroll.endErr()
            if(!pageState.ORDER_LIST.length) {
              mescroll.showEmpty()
            }
          }
        })
        .catch(err => {
          mescroll.endErr()
          if(!pageState.ORDER_LIST.length) {
            mescroll.showEmpty()
          }
        })
        .finally(() => {
          pageLoading && pageLoading.destroy()
        })
    },
  },
})

$(document).ready(() => {
  addOrderClickListener()
})
