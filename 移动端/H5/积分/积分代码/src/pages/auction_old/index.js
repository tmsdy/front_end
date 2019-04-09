/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description 积分抢拍页
 */

import './index.less'

import 'Components/toast'
import {
  isLogin,
} from 'Common/iqiyiPlugin'
import {
  Dialog,
} from 'Components'
import {
  Carousel,
  Countdown,
} from './components'
import {
  goToApp,
  getUserId,
  getAuthCookies,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getCookie,
  parseQueryString,
  getObjectValueSafely,
  toNumber,
  isObject,
  filterExts,
} from "Common/utils"
import {
  bidAjax,
  getUserInfo,
  getCurrentWinnerList,
  getAuctionDetail,
  getAttenderList,
  getUserIntegral,
} from './apis'
import {
  LOCAL_REMINDER_NAME, // 本地缓存提醒状态
  reminedDialog,  // 出价成功提醒弹窗实例
  activeMemberFn,
  updateCountdown,
  updateBidButton,
  awardListOptions,
  addEntranceListener,
  initPageOptions,
} from './controllers'
import {
  getLifeCycle,
} from './assets'
import {
  checkBidValid,
  getRecordState,
  hakeAwardEntry,
  loadAwardEntry,
} from './assets/helpers'
import {
  pvPingback,
  showPingback,
  clickPingback,
} from './assets/pingback'

let pageState = {
  IS_LOGIN: !!getCookie('P00001'),
  USER_DATA: {}, // 用户个人资料
  EXTMAP: {
    daojishi: '',
  },
  DETAIL_DATA: {
    is_bid: false,
  },
  USER_INFO: {}, // 用户积分
  CURRENT_RESULT: {
    records: [],
    orderId: null,
  },
  CURRENT_STATE: {  // 用户当前抢拍状态
    currentBid: 0,
    isWin: false,
    userScore: null,
    userAward: null,
  },
  LIFE_CYCLE_STATE: {
    nowStatus: null
  },
  PARAMS: {
    userId: getUserId(),
    authCookie: getAuthCookies(),
  },
  LOADED_AWARD_ENTRY: false,
  HAVE_BARRAGE_COUNT: 0, // 已显示出价人数
  BARRAGE_DEFAULT: [],   // 默认弹幕
}

// 前端缓存出价信息
const LOCAL_BID_INFO_NAME = `integralBidCost_${pageState.PARAMS.userId}`

// url参数
const QUERY = parseQueryString()

// recommend 来源于首页；paradise 来源于我的积分页
const from = QUERY.from ? QUERY.from : ''
pvPingback({from})

if (!pageState.IS_LOGIN) {
  $('*[data-bid="button"]').text('登录抢VIP')
}

// 初始化轮播控件
let stopTimeout = []
const carousel = new Carousel({
  id: 'carousel',
  loop: false,
})
const carousel2 = new Carousel({
  id: 'carousel2',
  loop: false,
})
let bidDialog = null
let bidSuccessDialog = null
let awardListDialog = null

/**
 * 出价窗口
 */
bidDialog = new Dialog({
  title: '请出价',
  content: (
    `<div class="dialog-bid-wrapper">
          <div class="input-wrapper">
              <input data-bid-input class="bid-input" type="number" placeholder=" 本轮底价0积分">
          </div>
          <div class="tips-primary dialog">我的积分:<span data-score class="integral-number">0</span></div>
      </div>`
  ),
  buttons: [{
    id: 'bidSubmit',
    className: 'btn-primary w420',
    text: '确认出价',
    onClick: () => {
      clickPingback({
        rseat: 'offer',
      })

      let {
        USER_DATA,
        LIFE_CYCLE_STATE,
        DETAIL_DATA,
        CURRENT_STATE,
      } = pageState
      const bidCount = toNumber($('*[data-bid-input]').val())
      const {status, toast} = checkBidValid(bidCount, pageState)

      if (!status) {
        $.fn.toast({content: toast})
        return
      }

      $('#bidSubmit').text('出价中...')

      // 提交出价
      bidAjax({
        score: bidCount,
        userId: USER_DATA.uid,
        nickname: USER_DATA.nickname,
        avatar: USER_DATA.icon,
        authCookie: getAuthCookies(),
      })
        .then(data => {
          const userScore = CURRENT_STATE.userScore - data.score

          // 出价成功，前端暂存数据
          pageState.DETAIL_DATA = {
            ...DETAIL_DATA,
            is_bid: true,
          }
          pageState.CURRENT_STATE = {
            ...pageState.CURRENT_STATE,
            userScore,
            currentBid: data.score,
          }

          setLocalStorage(LOCAL_BID_INFO_NAME, {
            nowRound: LIFE_CYCLE_STATE.nowRound,
            score: data.score
          })
          // 更新页面数据
          updateCountdownAndButton(LIFE_CYCLE_STATE, pageState.DETAIL_DATA)
          // 关闭窗口
          bidDialog.close()

          // 出价成功后提醒弹窗是否自动打开
          const reminedMeOnbid = getLocalStorage(LOCAL_REMINDER_NAME) || 0
          if (toNumber(reminedMeOnbid) === 1) {
            reminedDialog.destroy()
          } else {
            reminedDialog.open()
          }
        })
        .catch(err => {
          if (err.message) {
            $.fn.toast({
              content: `${err.message} 2s后自动刷新页面重试~`,
              time: 2,
              afterClose() {
                location.reload()
              },
            })
          }
        })
    },
  }],
  afterOpen() {
    $('*[data-bid-input]').focus()
  },
  afterClose() {
    $('*[data-bid-input]').val('')
    $('#bidSubmit').text('确认出价')
  }
})

/**
 * 出价成功弹窗
 */
bidSuccessDialog = new Dialog({
  removeHeader: true,
  closeClass: 'dialog-bottom-close',
  content: (
    `<div class="dialog-success">
        <div class="modal-modification"><span class="hammer-bg"></span></div>
        <div class="success-title">抢拍成功</div>
        <div class="success-content">
            恭喜您花 <span data-dialog-success="score" class="success-count">0</span> 积分<br/>
            拍得<span data-dialog-success="name">爱奇艺VIP天卡</span>，已发放至账户<br/>请去“兑换记录页”查看
        </div>
    </div>`
  ),
  buttons: [
    {
      className: 'btn-default',
      text: '我的抢拍',
      onClick: () => {
        clickPingback({
          rseat: 'jingpai_go',
        })

        location.href = '/integralh5/auction/mylist'
      },
    }, {
      id: 'activeMemberBtn',
      className: 'btn-primary',
      text: '激活',
      onClick: () => {
        clickPingback({
          rseat: 'jingpai_show',
        })

        const {
          CURRENT_RESULT: {
            orderId,
          },
          DETAIL_DATA,
        } = pageState
        const productId = getObjectValueSafely(DETAIL_DATA, 'item.item_id')

        if (productId && orderId) {
          activeMemberFn({orderCode: orderId, productId}).then(() => {
            $('#activeMemberBtn').addClass('disabled').text('已激活').off('click')
          })
        }
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
 * 获奖名单窗口
 */
awardListDialog = new Dialog({
  removeHeader: true,
  removeDefaultOptions: ['confirm', 'cancel'],
  content: '',
  closeClass: 'dialog-bottom-close',
})

/**
 * 获取本轮实时出价人数与昵称列表（每次只返回最新的20条数据）
 * @param time 轮询周期
 */

function attenderListRender(stopKey = 0, time = 5) {
  getAttenderList().then(data => {
    if (stopTimeout[stopKey]) {
      return
    }

    const {
      total = 0,
      attended_users = []
    } = data
    $('*[data-bid=count]').text(total)
    const {
      BARRAGE_DEFAULT,  // 默认弹幕
      HAVE_BARRAGE_COUNT, // 已显示的弹幕数
    } = pageState

    let bidlist = []
    let bidlist2 = []

    // 没有最新数据时显示默认数据
    if (total === HAVE_BARRAGE_COUNT) {
      BARRAGE_DEFAULT.forEach((i, k) =>
        k % 2 === 0 ? bidlist.push(i) : bidlist2.push(i)
      )
    } else {
      const userLength = attended_users.length
      const start = total > userLength      // 总数据大于20条时
        ? total - HAVE_BARRAGE_COUNT > 20
          ? 0                                 // 新数据大于20条时
          : total - HAVE_BARRAGE_COUNT        // 新数据小于20条时
        : HAVE_BARRAGE_COUNT                // 总数据小于20条时
      const currentList = attended_users.reverse().slice(start)

      currentList.forEach((i, k) => {
        k % 2 === 0 ? bidlist.push(i) : bidlist2.push(i)
      })

      pageState.HAVE_BARRAGE_COUNT += currentList.length
    }

    if (bidlist.length) {
      carousel.addToList(bidlist)
    }
    if (bidlist2.length) {
      carousel2.addToList(bidlist2)
    }

    // 轮询
    setTimeout(() => {
      if (stopTimeout[stopKey]) {
        return
      }
      attenderListRender(stopKey, time)
    }, time * 1000)
  })
}

// 启动弹幕轮播
function startBarrage() {
  const stopKey = stopTimeout.length
  stopTimeout.push(false)
  if (stopKey > 0) {
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
  const data = {
    ...detailData,
    ...pageState.CURRENT_STATE,
  }
  pageState.LIFE_CYCLE_STATE = lifeCycleState
  updateCountdown(lifeCycleState)
  updateBidButton(lifeCycleState, data)
}

/**
 * 初始化竞拍详情
 */
function init() {
  const {DETAIL_DATA, LIFE_CYCLE_STATE, EXTMAP} = pageState
  // 生成当前状态
  let lifeCycleState = LIFE_CYCLE_STATE
  let {nowTime, nextTime, nowStatus} = lifeCycleState

  pageState = initPageOptions(pageState, DETAIL_DATA)

  // 是否显示弹幕
  if (['beforeAuction', 'afterAuction'].indexOf(nowStatus) === -1) {
    startBarrage()
  }

  // 更新底价信息
  const tipText = `本轮底价${DETAIL_DATA.bottom_price || 0}积分`
  $('*[data-bottom-price]').text(tipText)
  // 更新弹窗内输入框底价信息
  $('input[data-bid-input]').attr('placeholder', tipText)

  const precision = ['beforeAuction', 'afterAuction'].indexOf(nowStatus) !== -1
    ? 'second'
    : EXTMAP['daojishi'] && EXTMAP['daojishi'] === 'ss'
      ? 'millisecond'
      : 'second'

  // 初始化倒计时
  const countdown = new Countdown({
    id: 'countdown',
    startTime: nowStatus === 'afterAuction' ? 0 : nowTime,
    endTime: nowStatus === 'afterAuction' ? 0 : nextTime,
    precision: precision,
    clockBack: ({stopped}, $this) => {
      // 整场活动第一轮结果公布后动画滑入获奖名单入口
      loadAwardEntry(pageState, lifeCycleState)

      // 活动结束后
      if (nowStatus === 'afterAuction') {
        $this.stopClock()
        return
      }

      // 获取下一秒状态
      lifeCycleState = getLifeCycle(pageState.DETAIL_DATA)
      pageState.LIFE_CYCLE_STATE = lifeCycleState

      // 当前状态结束后进入下一状态，stopped为当前状态结束标识符
      if (stopped) {
        const {nowStatus, nextTime, nowTime} = lifeCycleState

        if (nowStatus === 'onBidding') {
          startBarrage() // 更新弹幕
          getData() // 更新数据
          // 更新倒计时
          return $this.update(nowTime, nextTime)
        }
        if (nowStatus === 'onPublishing') {
          // 每轮结果公布后抖动入口
          hakeAwardEntry()
          // 用户参与了抢拍
          if (pageState.DETAIL_DATA.is_bid) {
            // 删除本地存储的出价数据
            removeLocalStorage(LOCAL_BID_INFO_NAME)
            // 获取最新数据（用户当前轮出价了才会从服务器端获取数据）
            getData(() => {
              // 已获奖则弹出获奖成窗口
              const {CURRENT_STATE: {isWin, userAward}} = pageState
              // 用户中奖打开获奖弹窗
              if (isWin) {
                $('*[data-dialog-success="score"]').text(userAward.cost)
                bidSuccessDialog.open()
              }
            }, null, {isBid: true})
            // 更新倒计时
            return $this.update(nowTime, nextTime)
          }
        }

        // 更新倒计时&&按钮
        updateCountdownAndButton(lifeCycleState, pageState.DETAIL_DATA)

        // 更新倒计时
        return $this.update(nowTime, nextTime)
      }
    }
  })
}

// 获取用户资料信息
getUserIntegral().then(data => {
  const userInfo = getObjectValueSafely(data, 'data.userinfo')
  pageState.USER_DATA = userInfo ? userInfo : JSON.parse(getCookie('P00002'))
})

// 获取用户积分信息
const getUserData = () => getUserInfo()
  .then(userInfo => {
    console.log('userInfo', userInfo[0])
    // 获取用户总积分
    if (userInfo && userInfo.length) {
      userInfo = userInfo[0]
      pageState.USER_INFO = userInfo
      return userInfo
    }
    return null
  })

// 获取活动详情
const getDetailData = callback =>
  getAuctionDetail()
    .then(detailData => {
      console.log('detailData', detailData)
      const lifeCycleState = getLifeCycle(detailData)
      pageState.EXTMAP = filterExts(detailData.item.exts || [])
      pageState.DETAIL_DATA = detailData
      pageState.LIFE_CYCLE_STATE = lifeCycleState
      updateCountdown(lifeCycleState) // 更新倒计时状态
      callback && callback()

      return detailData
    })

const getPageState = detailBack =>
  Promise.all([
    getCurrentWinnerList(),     // 获取已出价列表数据、用户出价金额
    getDetailData(detailBack),  // 获取活动详情
  ])
    .then(([currentResult, detailData]) => {
      console.log('currentResult', currentResult)
      const {records = [], orderId = null} = currentResult
      const recordState = getRecordState(records, pageState)
      const {fixRecords} = recordState

      pageState.CURRENT_RESULT = {records: fixRecords, orderId}

      return [recordState, detailData]
    })

/**
 * 获取页面数据 获取用户积分信息\获取本轮次结果\获取竞价详情
 * @param detailBack 活动详情回调
 */
function getData(callback, detailBack, options = {}) {
  return Promise.all([
    getUserData(),
    getPageState(detailBack),
  ])
    .then(([userInfo, [recordState, detailData]]) => {
      // 公布结果阶段，若用户当前轮已出价，接口数据 is_bid 值为false，手动改成true，用于判断未获奖时是否提示‘未中奖’
      if (options.hasOwnProperty('isBid')) {
        detailData.is_bid = options.isBid
      }

      const {totalScore} = userInfo
      const {LIFE_CYCLE_STATE} = pageState
      const {nowStatus, nowRound} = LIFE_CYCLE_STATE
      let {fixWin, userAward} = recordState
      let currentBid = 0
      let userScore = toNumber(totalScore)

      const localData = getLocalStorage(LOCAL_BID_INFO_NAME) || {}
      if (detailData.is_bid && nowStatus !== 'onPublishing' && toNumber(localData.nowRound) === nowRound) {
        currentBid = toNumber(localData.score)
        userScore -= currentBid
      } else {
        removeLocalStorage(LOCAL_BID_INFO_NAME)
      }

      const currentState = {
        currentBid,
        isWin: fixWin,
        userScore,
        userAward,
      }
      // 更新用户积分
      $('[data-score]').text(userScore)
      // 更新出价按钮
      updateBidButton(LIFE_CYCLE_STATE, {...detailData, ...currentState})
      pageState.CURRENT_STATE = currentState

      callback && callback()

      return [userInfo, recordState, detailData]
    })
    .catch(err => {
      if (isObject(err) && err.code && err.code !== 'A0002') {
        $.fn.toast({content: err.message})
      }
      return err
    })
}

// 订阅打开出价弹窗事件
function addBidButtonListener() {
  $('*[data-bid="button"]').on('click', () => {
    isLogin(null, () => {
      const {
        LIFE_CYCLE_STATE: {
          nowStatus,
        },
        DETAIL_DATA: {
          is_limit: isLimit,
          is_bid: isBid,
          bottom_price,
        },
        CURRENT_STATE: {
          userScore,
        }
      } = pageState

      if (userScore === null) {
        $.fn.toast({content: '好像有点问题，请刷新页面重试', time: 2})
        return
      }

      // 积分不足，去赚积分，跳转到积分首页
      if (
        nowStatus !== 'beforeAuction'
        && nowStatus !== 'afterAuction'
        && userScore < bottom_price
        && !isBid
      ) {
        clickPingback({
          rseat: 'sub_offer',
        })
        goToApp({type: 'pageName', value: 'HomePage'})
        return
      }

      // 未达到上限、处于出价周期并且未出价时
      if (!isLimit && nowStatus === 'onBidding' && !isBid) {
        bidDialog.open()
      }
    })
  })
}

// 打开获奖名单弹窗, state 与 awardListOptions方法参数一致
function openAwardDialog(state) {
  const options = awardListOptions(state)
  awardListDialog
    .updateOptions(options)
    .open()
}

// 订阅打开获奖名单事件
function addOpenAwardEntryListener() {
  $('*[data-award-entry]').on('click', (e) => {
    clickPingback({
      rseat: 'jingpai_list',
    })

    const {
      LIFE_CYCLE_STATE: {
        nowStatus,
        hasRound,
      }
    } = pageState

    // 显示还未有人获奖
    if (nowStatus !== 'onPublishing' && hasRound === 0) {
      openAwardDialog({allNoneData: true})
    } else {
      // 判断是当前轮还是上一轮
      const round = nowStatus === 'onPublishing' ? 'current' : 'last'

      // 获取服务器端名单列表
      getCurrentWinnerList().then(({records}) => {
        openAwardDialog({round, lists: records})
      })
    }
  })
}

$(document).ready(() => {
  // 显示本轮出价DOM
  $('*[data-bid="count-wrapper"]').css('left', '0')

  addBidButtonListener()
  addOpenAwardEntryListener()
  addEntranceListener()
  getData(null, init)
})
