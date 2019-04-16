import 'core-js/features/promise/finally'

import {filterExts, goToUse, isURL, NOOP, parseQueryString} from 'Common/utils'
import {Dialog, Progress, SwitchMenu, Toast} from 'Components'

import SnatchButton from '../assets/snatchButton'
import {listRender} from '../assets/listRender'
import {MY_LIST_PB, MY_SUCCESS_PB, clickPingback, getDetailUrl, getMySuccessOptions, getProdOptions, pvPingback, updateEmpty, showPingback} from '../assets'
import {getMyList, getNewNotice, getOrderDetail, getOrderList, getUserInfo, PAGE_SIZE} from '../apis'
import {generateDialogOptions} from './getDialogOptions'

import './index.less'

const QUERY_STRING = parseQueryString() // url参数
const CURRENT_MENU_KEY = QUERY_STRING.tab && parseInt(QUERY_STRING.tab) === 1 ? 1 : 0
const PROGRESS_MAPS = [] // 进度条实例

let mySuccessListData = [] // 夺宝成功列表数据
let currentMenuId = CURRENT_MENU_KEY === 0 ? 'myList' : 'mySuccess' // 当前菜单栏

let searchedOrderId = null // 要滚动到的订单ID
let searchCounter = 0 // 第二次查询到订单时再执行滚动，保证滚动成功
let searchOrderLoading = false // 开启查询前loading

// 页面加载态
const pageLoading = new Toast({
  pageLoading: {
    wrapper: '#mescroll',
    content: '加载中...',
  },
  time: 0,
})

// 初始化弹窗
const orderDialog = new Dialog({
  id: 'orderDetail',
  removeHeader: true,
})

// 初始化滚动容器
const mescroll = new MeScroll('mescroll', {
  up: {
    use: true,
    auto: true,
    page: {
      num: 0, // 当前页码
      size: PAGE_SIZE, // 每页数据的数量
    },
    isBounce: true, // 是否允许ios的bounce回弹;默认true,允许回弹
    clearEmptyId: 'listContainer',
    htmlLoading: '<span class="upwarp-progress mescroll-rotate"></span><span class="mescroll-tips">加载中...</span>',
    htmlNodata: '<span class="mescroll-tips">没有更多了</span>',
    empty: {
      warpId: 'noRecord',
      icon: null,
      tip: `<div id="emptyState" class="no-image"></div><div id="emptyText" class="no-record-content">还没有参与积分夺宝活动~</div>`,
    },
    callback({num: page, size}, mescroll) {  //上拉加载的回调
      const hasCount = (page - 1) * size

      if(currentMenuId === 'myList') {
        myListRequest(page, size, hasCount, mescroll)
      } else {
        mySuccessRequest(page, size, hasCount, mescroll)
      }
    },
  },
})

// 初始化菜单栏
const switchMenu = new SwitchMenu({
  container: '#switchContainer',
  activeKey: CURRENT_MENU_KEY,
  list: [
    {id: 'myList', text: '我参与的'},
    {id: 'mySuccess', text: '我的奖品'},
  ],
  onClick(item) {
    pageLoading.show()
    if(item.id === 'mySuccess') {
      clickPingback({...MY_SUCCESS_PB, rseat: 'duobaoyes_btn'})
      // 已查看我的夺宝成功
      removeNotice()
    }
    currentMenuId = item.id
    mySuccessListData = []
    $('#listContainer').empty()
    mescroll.resetUpScroll(false) // false: 不显示上拉和下拉的进度
  },
})

// 初始化夺宝按钮
const snatchButton = new SnatchButton({
  clickback: ({totalScore}, key, $this) => {
    // 更新当前夺宝活动
    updateCurrentItem(key, $this)
  },
  clickPingback: (item, key) => {
    clickPingback({rseat: `my_dbgood_${key + 1}`})
  },
  clickToAward: ({orderId}) => {
    searchedOrderId = orderId
    searchOrderLoading = true
    switchMenu.triggerClick(1)
  },
})

// 页面初始化
function initPage() {

  // 初始化加载态
  pageLoading.show()

  // 获取用户积分
  getUserInfo()
    .then(([data]) => {
      snatchButton.updateUserSocre(data)
    })
    .catch(NOOP)

  if(CURRENT_MENU_KEY === 0) {
    pvPingback(MY_LIST_PB)
    getNotice()
  } else {
    pvPingback(MY_SUCCESS_PB)
    removeNotice()
  }
}

// 获取我参与的列表数据
function myListRequest(page, size, hasCount, mescroll) {
  return getMyList({page, size})
    .then((data) => {
      const {list: contents, total} = data
      const list = contents.map((detail, key) => ({
        ...detail,
        _options: getProdOptions(detail, {key, hasCount, page, isWin: detail.is_current_user_win}),
      }))

      snatchButton.addList(list)
      mescroll.endBySize(list.length, total)
      listRender($('#listContainer'), 'append', list, 'history')
      progressRender(hasCount, page)
      updateEmpty('empty', '还没有参与积分夺宝活动~')
    })
    .catch((err) => {
      mescroll.endErr()
      if(!snatchButton.getList().length) {
        mescroll.showEmpty()
        if(err.code) {
          updateEmpty(err.code, err.message)
        }
      }
    })
    .finally(() => {
      pageLoading && pageLoading.hide()
    })
}

// 获取夺宝成功列表数据
function mySuccessRequest(page, size, hasCount, mescroll) {
  return getOrderList({limit: size, offset: hasCount})
    .then(({contents, total}) => {
      const list = contents.map((detail, key) => ({
        ...detail,
        _options: getMySuccessOptions(detail, {key, page, size, hasCount}),
      }))

      mySuccessListData = mySuccessListData.concat(list)

      mescroll.endBySize(list.length, total)

      listRender($('#listContainer'), 'append', list, 'success')
      updateEmpty('empty', '还没有夺宝成功的记录~')

      judgeScrollToOrder(mySuccessListData, total, mescroll)
    })
    .catch((err) => {
      mescroll.endErr()
      if(!mySuccessListData.length) {
        mescroll.showEmpty()
        if(err.code) {
          updateEmpty(err.code, err.message)
        }
      }

      searchOrderLoading = false
      pageLoading && pageLoading.hide()
    })
}

// 判断从我参与的列表调制至夺宝成功列表并滚动至指定奖品位置
function judgeScrollToOrder(list, total, mescroll) {
  if (searchOrderLoading) {
    const hasOrderItem = list.findIndex(i => i.orderCode === searchedOrderId) !== -1
    if(hasOrderItem) {
      if(searchCounter === 0) {
        searchCounter++
        mescroll.triggerUpScroll()
        return
      }
      const top = $('#listContainer').children(`[data-order-id="${searchedOrderId}"]`).offset().top
      mescroll.scrollTo(top - 95, 0)
      searchOrderLoading = false
      pageLoading && pageLoading.hide()
    } else if (list.length >= total) {
      searchOrderLoading = false
      pageLoading && pageLoading.hide()
    } else {
      mescroll.triggerUpScroll()
    }
  } else {
    pageLoading && pageLoading.hide()
  }
}

// 更新当前夺宝活动
function updateCurrentItem(key, $this) {
  const {
    total_num: totalNum,
    current_num: currentNum,
    current_user_num: currentUserNum,
  } = snatchButton.getList()[key]

  // 人数已满时更新按钮状态
  if(currentNum === totalNum) {
    $this.addClass('disabled')
  }
  // 更新进度条状态
  PROGRESS_MAPS[key].updateOptions({hasCount: currentNum})
  // 更新已夺宝次数
  $this.closest('[data-id=listItem]').find('[data-id=hasParticipated]').text(currentUserNum)
}

// 生成进度条
function progressRender(hasCount, page) {
  const listData = snatchButton.getList()
  const lists = $('#listContainer').children(`[data-id="listItem"][data-page="${page}"]`)

  lists.each(function(k, i) {
    const hasProgress = $(this).has('[data-id="progress"]') || null
    if(hasProgress && hasProgress.length) {
      const key = hasCount + k
      const detail = listData[key]
      const {
        _options: {
          progressBarStyle,
        },
      } = detail
      const $container = $(this).find('[data-id="progress"]')

      PROGRESS_MAPS[key] = new Progress({
        container: $container,
        hasCount: parseFloat(detail.current_num),
        total: parseFloat(detail.total_num),
        style: progressBarStyle,
      })
    }
  })
}

// 列表子项点击事件
function addItemClickListener() {
  $('#listContainer').on('click', '[data-id="listItem"]', function(e) {
    const $this = $(this) // e.currentTarget 冒泡
    const $own = $(e.target)
    const ownAttr = $own.attr('data-id')
    if($this.attr('data-id') === 'listItem' && ownAttr !== 'submit' && ownAttr !== 'view-price') {
      const key = parseFloat($this.attr('data-key'))
      const item = snatchButton.getList()[key] || {}
      location.href = getDetailUrl(item.code || '')
    }
  })
}

// 夺宝成功列表点击
function addOrderClickListener() {
  $('#listContainer').on('click', '[data-id="mySuccess"]', function(e) {
    const $this = $(this) // e.currentTarget 冒泡
    const $own = $(e.target)
    const ownAttr = $own.attr('data-id')
    if(ownAttr !== 'toUse') {
      const key = parseFloat($this.attr('data-key'))
      const order = mySuccessListData[key] || null

      if(order._options.isExpried) return // 已过期

      if(order) {
        getOrderDetail(order.productId)
          .then((data) => {
            if(data.code === 'A00000') {
              order.rules = data.data.rules
            }
            orderDialog.updateOptions(generateDialogOptions(order, key, orderDialog)).open()
          })
          .catch(() => {
            orderDialog.updateOptions(generateDialogOptions(order, key, orderDialog)).open()
          })
      }
    }
  })
}

// 点击去使用
function addToUseListener() {
  $('#listContainer').on('click', '[data-id="toUse"]', function(e) {
    const $this = $(e.target)
    const thisAttr = $this.attr('data-id')
    if(thisAttr === 'toUse') {
      const key = parseFloat($this.closest('[data-id="mySuccess"]').attr('data-key'))
      if(mySuccessListData[key]) {
        const {
          type, // 商品类型
          subType, // 商品子类型
          redeemCodes, // 券码
          exts, // 道具扩展信息
          _options: {
            isExpried,
          },
        } = mySuccessListData[key]

        clickPingback({...MY_SUCCESS_PB, rseat: `duobao_touse_${key + 1}`})

        if(isExpried) return // 已过期

        const extMap = filterExts(exts)

        if([4, 6].indexOf(type) !== -1 && subType === 11 && isURL(redeemCodes)) { // 卡券/商品券 + 链接发放
          location.href = redeemCodes
        } else if(type === 5 && subType === 0 && extMap.touse) { // 虚拟商品+常规
          goToUse(extMap)
        }
      }
    }
  })
}

function addViewPriceListener() {
  $('#listContainer').on('click', '[data-id="view-price"]', function(e) {
    const $this = $(e.target)
    const thisAttr = $this.attr('data-id')
    if(thisAttr === 'view-price') {
      $('#mySuccess').trigger('click')
    }
  })
}

//红点逻辑
function getNotice() {
  getNewNotice({view: false}).then((data) => {
    if(data) {
      $('#mySuccess .switch-menu-text').append(`<span class="red-icon"></span>`)
    }
  }).catch()
}

// 去掉红点
function removeNotice() {
  // 已查看我的夺宝成功
  getNewNotice({view: true}).catch()
  $('#mySuccess .switch-menu-text .red-icon').remove()
}

$(document).ready(() => {
  initPage()
  snatchButton.register() // 注册点击参与夺宝事件
  addOrderClickListener()
  addToUseListener()
  addItemClickListener()
  addViewPriceListener()
})
