import 'core-js/features/promise/finally'

import NewMessage from 'Common/newMessage'
import {getEmptyPlugin, getLocalStorage, setLocalStorage} from 'Common/utils'
import {Dialog, Progress, Toast} from 'Components'
import {iqiyiInitAsync, iqiyiMenu, isLogin} from 'Common/iqiyiPlugin'

import {getNewNotice, getOrderState, getSnatchList, getUserInfo, PAGE_SIZE} from './apis'

import {clickPingback, getDetailUrl, getProdOptions, listRender, pvPingback, showPingback} from './assets'
import SnatchButton from './assets/snatchButton'

import './index.less'

let PROGRESS_MAPS = {}
let MY_LIST_TAB = 0
let $CURRENT_CLICKED_BUTTON = null // 当前被点击的按钮
let snatchCounter = 0

// 列表内按钮事件
const snatchButton = new SnatchButton({
  isOrdered: false,
  totalUserNum: 0,
  // 点击按钮回调
  clickback: ({totalScore, totalUserNum}, key, $this) => {
    // 第一次夺宝弹出弹窗
    judgeFirstSnatch($this)
    // 更新用户积分
    updateUserScore(totalScore)
    // 更新用户参与次数
    updateTotalUserCount(totalUserNum)
    // 更新当前夺宝活动
    updateCurrentItem(key, $this)
  },
  // 夺宝按钮pingback回调
  clickPingback: (item, key) => {
    const {
      _options: {
        buttonOptions: {
          type,
        },
      },
    } = item

    if(type === 'participate') {
      // 立即夺宝
      clickPingback({rseat: `dbgood${key + 1}`})
    } else if(type === 'detail') {
      // 往期夺宝
      clickPingback({rseat: `dbgoodex_${key - snatchCounter + 1}`})
    } else if(type === 'notOrder') {
      // 未预约
      clickPingback({rseat: 'duobao_open'})
    } else if(type === 'isOrdered') {
      // 已预约
      clickPingback({rseat: 'duobao_close'})
    }
  },
  // 预约提醒回调
  subcribeBack: (type, $this) => {
    if(type === 'subcribe') {
      $this.addClass('disabled').html('已预约')
    } else {
      $this.removeClass('disabled').html('开始提醒')
    }
  },
})

iqiyiMenu(null, 'hide')

// 初始化新消息提醒实例
const newMessage = new NewMessage('#successFloating')

const pageLoading = new Toast({
  pageLoading: {
    wrapper: '#snatchBody',
    time: 0,
  },
})

pageLoading.show()

const {
  stateId: emptyStateId,
  textId: emptyTextId,
  updateEmpty,
  addReloadListener,
} = getEmptyPlugin()

addReloadListener('snatchBody')

isLogin(() => {
  $('#snatchTop').css({'margin-bottom': 0})
  $('#snatchRecord').remove()
  return false
}, () => {
  setNewMessageState({view: false})
})

// 查看攻略弹窗
const ruleDialog = new Dialog({
  id: 'ruleDialog',
  content: '#ruleDialogContent',
  removeHeader: true,
  removeDefaultOptions: 'all',
  buttons: [{
    className: 'btn-default list-use rule-dialog-btn',
    text: '我知道了',
    onClick: () => {
      ruleDialog.close()
    },
  }],
})

// 首次夺宝弹窗
const firstTimeSnatchDialog = new Dialog({
  id: 'firstTimeSnatchDialog',
  content: '#firstTimeSnatchDialogContent',
  removeHeader: true,
  buttons: [{
    className: 'btn-orange gradient first-snatch',
    text: '再来一次',
    onClick: () => {
      if($CURRENT_CLICKED_BUTTON) {
        clickPingback({block: '120003', rseat: 'duobao_onemore'})
        $CURRENT_CLICKED_BUTTON.click()
        firstTimeSnatchDialog.close()
      }
    },
  }],
})

const mescroll = new MeScroll('mescroll', {
  down: {
    use: false,
  },
  up: {
    use: true,
    auto: true,
    page: {
      num: 0, // 当前页码
      size: PAGE_SIZE, // 每页数据的数量
    },
    isBounce: true, // 是否允许 iOS 的 bounce 回弹；默认 true，允许回弹
    clearEmptyId: 'listContainer',
    htmlLoading: '<span class="upwarp-progress mescroll-rotate"></span><span class="mescroll-tips">加载中...</span>',
    htmlNodata: '<span class="mescroll-tips">没有更多了</span>',
    empty: {
      warpId: 'noRecord',
      icon: null,
      tip: `<div id="${emptyStateId}" class="no-image"></div><div id="${emptyTextId}" class="no-record-content">还没有积分夺宝活动~</div>`,
    },
    callback: upCallback, // 上拉加载的回调
  },
})

function upCallback({num: page, size}) {
  const offset = (page - 1) * size
  getSnatchList(offset, size)
    .then((data) => {
      const {
        list: {contents, total},
        totalUserNum = 0,
      } = data
      const hasCount = (page - 1) * size

      if(page === 1) {
        snatchButton.resetList()
      }

      // 查询预约提醒状态
      getOrderState(contents).then((orderedMaps) => {
        snatchButton.updateOrderedState(orderedMaps)

        const list = contents.map((detail, key) => {
          const _options = getProdOptions(detail, {
            key,
            page,
            hasCount,
            isOrdered: orderedMaps[detail.code],
            lastPeriod: getLastPeriod(hasCount),
          })

          if(_options.period !== 'after') {
            snatchCounter++
          }

          return {...detail, _options}
        })

        snatchButton.addList(list).updateTotalNum(totalUserNum)

        mescroll.endBySize(list.length, total)

        updateTotalUserCount(totalUserNum)
        listRender($('#listContainer'), 'append', list)
        progressRender(hasCount, page)
        updateEmpty('empty', '还没有积分夺宝活动~')
      })
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
      pageLoading.destroy()
    })
}

function setNewMessageState({view}) {
  getNewNotice({view})
    .then((data) => {
      if(data) {
        newMessage.init()
        MY_LIST_TAB = 1
      }
    })
    .catch()
}

// 生成进度条
function progressRender(hasCount, page) {
  const listData = snatchButton.getList()
  const lists = $('#listContainer').children(`[data-id="listItem"][data-page="${page}"]`)
  lists.each(function (k) {
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

      $container.empty()
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
  $('#listContainer').on('click', '[data-id="listItem"]', function (e) {
    const $this = $(this) // e.currentTarget 冒泡
    const $own = $(e.target)
    const $thisAttr = $this.attr('data-id')
    const ownAttr = $own.attr('data-id')
    if($thisAttr === 'listItem' && ownAttr !== 'submit') {
      const key = parseFloat($this.attr('data-key'))
      const item = snatchButton.getList()[key] || {}
      clickPingback({rseat: `dbgoods${key + 1}`})
      window.location.href = getDetailUrl(item.code || '')
    }
  })
}

// 判断是否为第一次夺宝
function judgeFirstSnatch($this) {
  $CURRENT_CLICKED_BUTTON = $this
  iqiyiInitAsync()
    .then(({deviceId = ''}) => {
      if(deviceId) {
        const HAS_PARTICIPATED_SNATCH = `HAS_PARTICIPATED_SNATCH_${deviceId}`
        const hasParticapatedSnatch = getLocalStorage(HAS_PARTICIPATED_SNATCH) || false
        if(!hasParticapatedSnatch) {
          showPingback({block: '120003'})
          setLocalStorage(HAS_PARTICIPATED_SNATCH, true)
          firstTimeSnatchDialog.open()
        }
      }
    })
    .catch()
}

// 获取上个数据所在的周期
function getLastPeriod(hasCount) {
  if(hasCount < 1) return ''
  const {_options: {period}} = snatchButton.getList()[hasCount - 1]
  return period
}

// 更新用户总积分数
function updateUserScore(score) {
  $('#userTotalScore').text(score)
}

// 更新用户总参与次数
function updateTotalUserCount(totalUserNum) {
  $('#totalParticipates').text(totalUserNum)
}

// 更新当前夺宝活动
function updateCurrentItem(key, $this) {
  const {
    _options: {
      permitStatus, totalNum, currentNum, currentUserNum,
    },
  } = snatchButton.getList()[key]
  // 人数已满时更新按钮状态
  if(currentNum === totalNum) {
    $this.addClass('disabled')
  }
  // 已达上限
  if(permitStatus) {
    $this.addClass('disabled').html('已达上限')
  }
  // 更新进度条状态
  PROGRESS_MAPS[key].updateOptions({hasCount: currentNum})
  // 更新已夺宝次数
  $this.closest('[data-id=listItem]').find('[data-id=hasParticipated]').text(currentUserNum)
}

function addVisitClickListener() {
  $('#visitRecord').click(() => {
    if(MY_LIST_TAB === 1) {
      clickPingback({rseat: 'myduobao_btn_red'})
    } else {
      clickPingback({rseat: 'myduobao_btn'})
    }
    newMessage.setMsgState({operate: 'hide'}, () => {
      window.location.href = `/integralh5/snatch/record?tab=${MY_LIST_TAB}`
    })
  })
}

function addShowRuleDialogListener() {
  $('#showRuleDialog').click(() => {
    clickPingback({rseat: 'duobao_rule'})
    ruleDialog.open()
  })
}

function initUserInfo() {
  // 获取用户积分
  getUserInfo()
    .then(([data]) => {
      pvPingback({score: data.totalScore})
      snatchButton.updateUserSocre(data)
      $('#userTotalScore').text(data.totalScore)
    })
    .catch(() => {
      pvPingback()
    })
}

$(document).ready(() => {
  initUserInfo()
  addItemClickListener()
  snatchButton.register()
  addVisitClickListener()
  addShowRuleDialogListener()
})
