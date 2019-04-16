/**
 * Created by liuzhimeng.
 * @date 2018/11/15
 * @description 积分抢拍页重构版
 */

import './index.less'

import 'Components/toast'
import {isLogin} from 'Common/iqiyiPlugin'
import {Dialog, LabelShow} from 'Components'
import {generateCommonParams} from 'Common/request'
import {
  goToApp,
  getUserId,
  getAuthCookies,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  parseQueryString,
  getObjectValueSafely,
  toNumber,
  isObject,
  filterExts,
  isNumber,
} from 'Common/utils'
import {Countdown as CountdownComponent, AnimatedShow} from './components'
import {
  bidAjax,
  getUserInfo,
  getCurrentWinnerList,
  getAuctionDetail,
  getAttenderList,
  getUserIntegral,
  getProductList,
  getWinnerList,
  getTodayPeak,
} from './apis'
import {
  SHARE_OPTIONS,
  LOCAL_REMINDER_NAME, // 本地缓存提醒状态
  reminedDialog, // 出价成功提醒弹窗实例
  ruleDialog, // 规则弹窗
  activeMemberFn,
  updateCountdown,
  updateBidButton,
  addEntranceListener, // 我的抢拍入口消息提醒
  initPageOptions,
  goToShare,
  labelShowOptionGenerator,
} from './controllers'
import {getLifeCycle} from './assets'
import {checkBidValid, getRecordState} from './assets/helpers'
import {pvPingback, showPingback, clickPingback} from './assets/pingback'

import {bidDialogContent, bidSuccessDialogContent} from './templates/modal'
import {renderProductItem, renderIntegralPark} from './templates/pageFragments'

let pageState = {
  USER_DATA: {}, // 用户个人资料
  EXT_MAP: { // 扩展信息
    daojishi: '',
  },
  DETAIL_DATA: { // 抢拍详情
    is_bid: false,
  },
  USER_INFO: {}, // 用户积分信息
  CURRENT_RESULT: { // 当前出价结果
    records: [],
    orderId: null,
  },
  CURRENT_STATE: { // 用户当前抢拍状态
    currentBid: 0,
    isWin: false,
    userScore: null,
    userAward: null,
  },
  LIFE_CYCLE_STATE: { // 当前抢拍周期
    nowStatus: null
  },
  PARAMS: {
    userId: getUserId(),
    authCookie: getAuthCookies(),
  },
  HAVE_BARRAGE_COUNT: 0, // 已显示出价人数
  BARRAGE_DEFAULT: [], // 默认弹幕
}

// 抢拍英雄榜列表
let winnerList = []
// 前端缓存出价信息
const LOCAL_BID_INFO_NAME = `integralBidCost_${pageState.PARAMS.userId}`
// url参数
const QUERY = parseQueryString()

let appState = {
  version: ''
}

// 未登录跳转登录页
generateCommonParams()
  .then((baseParams) => {
    if(!baseParams.authCookie) {
      $('#openBidDialog > *[data-content]').text('登录抢VIP')
      $('#openBidDialog > *[data-repeat]').text('登录抢VIP')
    }
    const versionStr = getObjectValueSafely(baseParams, 'global.version')
    if(versionStr) {
      appState.version = Number(versionStr.split('.').join(''))
    }
  })
  .catch()

// 初始化轮播控件
let stopTimeout = []
let animatedShow = null
let bidDialog = null
let bidSuccessDialog = null

const labelShow = new LabelShow({
  container: '#lableShow',
  list: [],
})

/**
 * 出价窗口
 */
bidDialog = new Dialog({
  id: 'bidDialog',
  content: bidDialogContent(),
  removeHeader: true,
  buttons: [{
    id: 'bidSubmit',
    className: 'bid-button',
    text: '确认出价',
    onClick: (item, key, $button, $dialog) => {
      clickPingback({rseat: 'offer'})
      if($button.hasClass('disabled')) {
        return
      }
      const {USER_DATA, LIFE_CYCLE_STATE, DETAIL_DATA, CURRENT_STATE} = pageState
      const bidCount = toNumber($('#bidInput').val())
      const {status, toast} = checkBidValid(bidCount, pageState)

      if(!status) {
        $.fn.toast({content: toast})
        return
      }

      // 提交出价
      bidAjax(bidCount, USER_DATA.nickname, USER_DATA.icon)
        .then(({score}) => {
          const userScore = CURRENT_STATE.userScore - score

          // 出价成功，前端暂存数据
          pageState.DETAIL_DATA = {
            ...DETAIL_DATA,
            is_bid: true,
          }
          pageState.CURRENT_STATE = {
            ...CURRENT_STATE,
            userScore,
            currentBid: score,
          }

          // 暂存出价数据
          setLocalStorage(LOCAL_BID_INFO_NAME, {score, nowRound: LIFE_CYCLE_STATE.nowRound})
          // 更新页面数据
          updateCountdownAndButton(LIFE_CYCLE_STATE, pageState.DETAIL_DATA)
          // 关闭窗口
          $dialog.close()

          // 出价成功后提醒弹窗是否自动打开，记录1表示不再提醒
          toNumber(getLocalStorage(LOCAL_REMINDER_NAME)) === 1
            ? reminedDialog.destroy()
            : reminedDialog.open()
        })
        .catch((err) => {
          if(err.message) {
            $.fn.toast({
              content: `${err.message} 2s后自动刷新页面重试~`,
              time: 2,
              afterClose() {
                window.location.reload()
              },
            })
          }
        })
    },
  }],
  afterOpen() {
    $('#bidSubmit').addClass('disabled')
    $('#bidInput').focus()
    // 获取当日成交价范围
    getTodayPeak()
      .then(({max, min}) => {
        $('#maxPeak').text(max)
        $('#minPeak').text(min)
      })
  },
  afterClose() {
    $('#bidInput').val('')
    $('#bidScore').show()
    $('#bidTip').hide()
  }
})

/**
 * 成功获奖弹窗
 */
bidSuccessDialog = new Dialog({
  id: 'bidSuccessDialog',
  removeHeader: true,
  closeClass: 'dialog-bottom-close',
  content: bidSuccessDialogContent(),
  buttons: [
    {
      id: 'activeMemberBtn',
      className: 'success-button activate-button',
      onClick: () => {
        clickPingback({rseat: 'jingpai_jihuo'})

        const {CURRENT_RESULT: {orderId}, DETAIL_DATA} = pageState
        const productId = getObjectValueSafely(DETAIL_DATA, 'item.item_id')

        if(productId && orderId) {
          return activeMemberFn({orderCode: orderId, productId})
            .then(() => {
              $('#activeMemberBtn').addClass('disabled').off('click')
            })
            .catch()
        }
        $.fn.toast({content: '无效订单，请至我的抢拍页尝试', time: 2})
      },
    },
    {
      className: 'success-button show-button',
      onClick: () => {
        clickPingback({rseat: 'jingpai_show'})
        goToShare({
          ...SHARE_OPTIONS,
          desc: '美滋滋，我已经抢到爱奇艺VIP卡，你呢？'
        })
      },
    },
  ],
  afterOpen() {
    showPingback({
      rseat: 'winner_show',
    })
  }
})

/**
 * 获取本轮实时出价人数与昵称列表（每次只返回最新的20条数据）
 * @param time 轮询周期
 */

function attenderListRender(stopKey = 0) {
  getAttenderList()
    .then((data) => {
      if(stopTimeout[stopKey]) {
        return
      }

      const {total = 0, attended_users: attendedUsers = []} = data
      const {BARRAGE_DEFAULT, HAVE_BARRAGE_COUNT} = pageState

      // 本轮出价人数
      $('#peopleCount').text(total)
      // 没有最新数据时显示默认数据
      if(total === HAVE_BARRAGE_COUNT) {
        labelShow.addList(BARRAGE_DEFAULT)
      } else {
        const userLength = attendedUsers.length
        const start = total > userLength // 总数据大于20条时
          ? total - HAVE_BARRAGE_COUNT > 20
            ? 0 // 新数据大于20条时
            : total - HAVE_BARRAGE_COUNT // 新数据小于20条时
          : HAVE_BARRAGE_COUNT // 总数据小于20条时
        const currentList = attendedUsers.reverse().slice(start)

        pageState.HAVE_BARRAGE_COUNT += currentList.length
        labelShow.addList(currentList.map(labelShowOptionGenerator('已出价')))
      }

      // 轮询
      setTimeout(() => {
        if(stopTimeout[stopKey]) {
          return
        }
        attenderListRender(stopKey)
      }, 5000)
    })
    .catch()
}

// 启动弹幕轮播
function startBarrage() {
  const stopKey = stopTimeout.length
  stopTimeout.push(false)
  if(stopKey > 0) {
    stopTimeout[stopKey - 1] = true
  }
  pageState.HAVE_BARRAGE_COUNT = 0
  attenderListRender(stopKey)
}

/**
 * 统一更新倒计时及按钮
 * @param lifeCycleState  当前生命周期数据
 * @param detailData      竞拍详情
 */
function updateCountdownAndButton(lifeCycleState, detailData) {
  pageState.LIFE_CYCLE_STATE = lifeCycleState
  updateCountdown(lifeCycleState)
  updateBidButton(lifeCycleState, {
    ...detailData,
    ...pageState.CURRENT_STATE
  })
}

/**
 * 初始化竞拍详情
 */
function init() {
  const {DETAIL_DATA, LIFE_CYCLE_STATE, EXT_MAP} = pageState
  // 生成当前状态
  let lifeCycleState = LIFE_CYCLE_STATE
  let {nowTime, nextTime, nowStatus} = lifeCycleState

  pageState = initPageOptions(pageState, DETAIL_DATA)

  // 是否显示弹幕
  if(['beforeAuction', 'afterAuction'].indexOf(nowStatus) === -1) {
    startBarrage()
  }

  // 更新底价
  $('#basePrice').text(DETAIL_DATA.bottom_price)
  // 更新出价弹框底价信息
  $('#bidInput').attr('placeholder', ` 本轮底价${DETAIL_DATA.bottom_price || 0}积分`)

  const precision = ['beforeAuction', 'afterAuction'].indexOf(nowStatus) !== -1
    ? 'second'
    : EXT_MAP.daojishi && EXT_MAP.daojishi === 'ss'
      ? 'millisecond'
      : 'second'

  // 初始化倒计时
  const countdownComponent = new CountdownComponent({ // eslint-disable-line
    id: 'countdown',
    startTime: nowTime,
    endTime: nextTime,
    precision,
    clockBack: ({stopped}, $this) => {
      // 活动结束后
      if(nowStatus === 'afterAuction') {
        $this.stopClock()
        return
      }

      // 获取下一秒状态
      lifeCycleState = getLifeCycle(pageState.DETAIL_DATA)
      pageState.LIFE_CYCLE_STATE = lifeCycleState

      // 当前状态结束后进入下一状态，stopped为当前状态结束标识符
      if(stopped) {
        const {nowStatus: nextNowStatus, nextTime: nextNextTime} = lifeCycleState

        if(nextNowStatus === 'onBidding') {
          startBarrage() // 更新弹幕
          getData() // 更新数据
          return $this.update(nextNextTime) // 更新倒计时
        }

        if(nextNowStatus === 'onPublishing') {
          // 每轮结果公布后更新抢拍英雄榜
          renderWinnerList('update')
          // 用户参与了抢拍
          if(pageState.DETAIL_DATA.is_bid) {
            // 删除本地存储的出价数据
            removeLocalStorage(LOCAL_BID_INFO_NAME)
            // 获取最新数据（用户当前轮出价了才会从服务器端获取数据）
            getData({isBid: true})
              .then(() => {
                // 已获奖则弹出获奖成窗口
                const {CURRENT_STATE: {isWin, userAward}} = pageState
                // 用户中奖打开获奖弹窗
                if(isWin) {
                  $('#successScore').text(userAward.cost)
                  bidSuccessDialog.open()
                }
              })
            // 更新倒计时
            return $this.update(nextNextTime)
          }
        }

        // 更新倒计时&&按钮
        updateCountdownAndButton(lifeCycleState, pageState.DETAIL_DATA)
        // 更新倒计时
        return $this.update(nextNextTime, nextNowStatus === 'afterAuction' ? 'second' : 'millisecond')
      }
    }
  })
}

// 获取用户资料信息
getUserIntegral().then((data) => {
  pageState.USER_DATA = data
})

// 获取用户积分信息
const getUserData = () => {
  return new Promise((resolve, reject) => {
    getUserInfo()
      .then((_userInfo) => {
        // 获取用户总积分
        if(_userInfo && _userInfo.length) {
          const userInfo = _userInfo[0]
          if(!userInfo.hasOwnProperty('totalScore')) {
            pvPingback()
            return reject(new Error('获取我的积分失败，请稍后重试'))
          }
          pvPingback({score: userInfo.totalScore})
          pageState.USER_INFO = userInfo
          return resolve(userInfo)
        }
        pvPingback()
        return reject(new Error('获取我的积分失败，请稍后重试'))
      })
      .catch((err) => {
        pvPingback()
        reject(err)
      })
  })
}

// 获取活动详情
const getDetailData = (initFunc = null) => {
  return getAuctionDetail().then((detailData) => {
    const lifeCycleState = getLifeCycle(detailData)

    pageState.EXT_MAP = filterExts(detailData.item.exts)
    pageState.DETAIL_DATA = detailData
    pageState.LIFE_CYCLE_STATE = lifeCycleState

    updateCountdown(lifeCycleState) // 更新倒计时状态

    initFunc && initFunc(detailData)

    return detailData
  })
}

const getPageState = (initFunc) => {
  return Promise
    .all([
      getCurrentWinnerList(), // 获取已出价列表数据、用户出价金额
      getDetailData(initFunc), // 获取活动详情
    ])
    .then(([currentResult, detailData]) => {
      const {records = [], orderId = null} = currentResult || {}
      const recordState = getRecordState(records, pageState)
      const {fixRecords} = recordState

      pageState.CURRENT_RESULT = {records: fixRecords, orderId}
      labelShow.addList(fixRecords.map(labelShowOptionGenerator('抢拍成功')))
      return {recordState, detailData}
    })
    .catch(() => {
      // $.toast({content: ''})
    })
}

/**
 * 获取页面数据 获取用户积分信息\获取本轮次结果\获取竞价详情
 * @param detailBack 活动详情回调
 */
function getData({isBid = null, init: initFunc} = {}) {
  return Promise.all([
    getUserData(),
    getPageState(initFunc),
  ])
    .then(([userInfo, {recordState, detailData: _detailData}]) => {
      let detailData = _detailData
      // 公布结果阶段，若用户当前轮已出价，接口数据 is_bid 值为false，手动改成true，用于判断未获奖时是否提示‘未中奖’
      if(isBid !== null) {
        detailData.is_bid = isBid
      }

      const {totalScore} = userInfo
      const {LIFE_CYCLE_STATE, DETAIL_DATA} = pageState
      const {nowStatus, nowRound} = LIFE_CYCLE_STATE
      let {fixWin, userAward} = recordState
      let currentBid = 0
      let userScore = toNumber(totalScore)

      const localData = getLocalStorage(LOCAL_BID_INFO_NAME) || {}
      if(detailData.is_bid && nowStatus !== 'onPublishing' && toNumber(localData.nowRound) === nowRound) {
        currentBid = toNumber(localData.score)
        userScore -= currentBid
      } else {
        removeLocalStorage(LOCAL_BID_INFO_NAME)
      }

      const currentState = {currentBid, userScore, userAward, isWin: fixWin}
      const {bottom_price: bottomPrice} = DETAIL_DATA
      if(bottomPrice >= userScore) {
        // 更新用户积分
        $('[data-score]').text(`我的积分: ${userScore}`)
        $('[data-score-modal]').text(userScore)
      } else {
        // 更新用户积分
        $('[data-score]').html(`<span style="color:#FF00B7">还差${bottomPrice - userScore}积分</span>`)
      }
      // 更新出价按钮
      updateBidButton(LIFE_CYCLE_STATE, {...detailData, ...currentState})
      pageState.CURRENT_STATE = currentState

      return {userInfo, recordState, detailData}
    })
    .catch((err) => {
      if(isObject(err) && err.code && err.code !== 'A0002') {
        $.fn.toast({content: err.message})
      }
      return err
    })
}

// 订阅打开出价弹窗事件
function addBidButtonListener() {
  $('#openBidDialog').on('click', () => {
    const {
      LIFE_CYCLE_STATE: {
        nowStatus,
      },
      DETAIL_DATA: {
        is_limit: isLimit,
        is_bid: isBid,
        bottom_price: bottomPrice,
      },
      CURRENT_STATE: {
        userScore,
      }
    } = pageState

    // 已结束
    if(nowStatus === 'afterAuction') {
      return
    }

    isLogin(null, () => {
      if(userScore === null) {
        $.fn.toast({content: '我的积分获取失败，请刷新页面重试', time: 2})
        return
      }

      // 积分不足，去赚积分，跳转到积分首页
      if(userScore < bottomPrice && !isBid) {
        clickPingback({rseat: 'sub_offer'})
        goToApp({type: 'pageName', value: 'TaskList'})
        return
      }

      // 未达到上限、处于出价周期并且未出价时
      if(!isLimit && nowStatus === 'onBidding' && !isBid) {
        bidDialog.open()
      }

    })
  })
}

// 注册打开抢拍英雄榜事件
function addGoToAwardListener() {
  $('#awardEntry').on('click', () => {
    clickPingback({rseat: 'jingpai_list'})
    const codeString = QUERY.code ? `?code=${QUERY.code}` : ''
    window.location.href = `/integralh5/auction/list${codeString}`
  })
}

function updateBidButtonState(count) {
  const {status, type} = checkBidValid(count, pageState)

  if(status) {
    $('#bidSubmit').removeClass('disabled')
  } else {
    $('#bidSubmit').addClass('disabled')
  }
  // 提示超额
  if(type === 'lackOfScore') {
    $('#bidScore').hide()
    $('#bidTip').show()
  } else {
    $('#bidScore').show()
    $('#bidTip').hide()
  }
}

// 监听出价数额
function addBidInputListener() {
  $('#bidInput').on('input', function () {
    updateBidButtonState(toNumber($(this).val()))
  })
}

// 注册押入全部积分事件
function addBidAllListener() {
  $('#bidAll').click(() => {
    clickPingback({rseat: 'offer_all'})
    const count = toNumber($('#myScoreInDialog').text())
    $('#bidInput').val(count)
    updateBidButtonState(count)
  })
}

// 去积分相关页面
function addIntegralEntranceListener() {
  // 去任务列表
  $('#goToTaskList').click(() => {
    clickPingback({rseat: 'jingpai_task'})
    goToApp({type: 'pageName', value: 'TaskList'})
  })
  // 去积分乐园 paradise 来源于我的积分页
  if(QUERY.from !== 'paradise') {
    $('#entranceList').append(renderIntegralPark())
    $('#goToIntegralPark').click(() => {
      clickPingback({rseat: 'more_huodong'})
      goToApp({type: 'pageName', value: 'IntegralPark'})
    })
  }
}

// 抢拍英雄榜
function renderWinnerList(operate = 'init') {
  return getWinnerList(5)
    .then(({list}) => {
      if(!list.length) {
        $('#awardList').hide()
        $('#awardEmptyContent').text('还没有人抢拍成功哦~')
        $('#awardEmptyPage').show()
        return []
      }
      $('#awardEmptyPage').hide()
      $('#awardList').show()
      if(operate === 'update') {
        if(!winnerList.length) {
          !!animatedShow && animatedShow.init(list)
        } else if(winnerList[0].orderId !== list[0].orderId) {
          !!animatedShow && animatedShow.update(list).play()
        }
      } else {
        animatedShow = new AnimatedShow({list, id: 'awardList'})
      }

      winnerList = list
      return list
    })
    .catch(() => {
      $('#awardList').hide()
      $('#awardEmptyContent').text('获取抢拍英雄榜失败，请刷新页面重试~')
      $('#awardEmptyPage').show()
    })
}

// 注册商品点击事件
function addProductListener(list) {
  // 查看更多，跳转至积分商城列表页
  $('#goToShoppingMall').click(() => {
    clickPingback({rseat: 'jingpai_moregoods'})
    goToApp({type: 'pageName', value: 'ShoppingMall'})
  })
  // 点击商品，跳转至商品详情页
  $('#productList').on('click', '[data-id="productItem"]', function () {
    const key = parseFloat($(this).attr('data-key'))
    if(isNumber(key) && list[key]) {
      clickPingback({rseat: `jingpai_goods${key + 1}`})
      if(appState.version && appState.version >= 9110) {
        const {_item} = list[key]
        return goToApp({
          type: 'pageName',
          value: 'GoodsDetail',
          integralPrams: {
            productId: _item.itemId,
            type: 'exchangeList',
          }
        })
      }
      return goToApp({type: 'pageName', value: 'ShoppingMall'})
    }
  })
}

// 获取商品列表
function getProduct() {
  return getProductList()
    .then((list) => {
      let children = ''
      for(let k = 0; k < list.length; k++) {
        children += renderProductItem(list[k], k)
      }
      $('#productList').append(children)
      // 注册商品点击事件
      addProductListener(list)
    })
    .catch(() => {
      $('#productList').hide()
      $('#emptyPage').show()
    })
}

// 注册打开规则弹窗事件
function addOpenRuleListener() {
  $('#openRuleDialog').click(() => {
    ruleDialog.open()
  })
}

$(document).ready(() => {
  getData({init})
  renderWinnerList()
  getProduct()
  addBidButtonListener()
  addGoToAwardListener()
  addIntegralEntranceListener()
  addEntranceListener()
  addBidInputListener()
  addBidAllListener()
  addOpenRuleListener()
})
