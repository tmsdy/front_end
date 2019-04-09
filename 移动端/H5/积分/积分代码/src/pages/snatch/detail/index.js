import 'core-js/features/promise/finally'

import {Dialog, Progress, Toast} from 'Components'
import {iqiyiShare, isLogin} from 'Common/iqiyiPlugin'
import {shareAppMessage, shareTimeline} from 'Common/wxShare/wxSDK'
import {filterExts, filterPic, getAuthCookies, goToApp, isIqiyi, isWeixin, NOOP, parseQueryString} from 'Common/utils'
import {askSubscribeSnatch, askUnsubscribeSnatch, getOrderState, getSnatchDetail, getUserInfo, participate} from '../apis'
import {buttonRender, viewRender} from './viewRender'
import {updateDetailOptions} from './options'
import {clickPingback, DETAIL_PB, pvPingback} from '../assets'

import './index.less'

const IS_LOGIN = getAuthCookies() ? true : false
const QUERY = parseQueryString()
const MODAL_DETAIL_DUOBAO_SUCCESS = 'MODAL_DETAIL_DUOBAO_SUCCESS'

let DUOBAO_RESULT_TEMPLATE_SUCCESS = null
let DUOBAO_RESULT_TEMPLATE_ERROR = null
let USER_INFO = {}
let IS_ORDERED = false
let DETAIL_DATA = {}
let PROGRESS = null
let shareOptions = {
  title: '',
  desc: '',
  imgUrl: '',
  shareType: 1,
  link: location.href,
  success: NOOP,
  fail: NOOP,
  cancel: NOOP,
}

// 隐藏右上角菜单
iqiyi.hideMenu({force: true})

const pageLoading = new Toast({pageLoading: true, time: 0})
pageLoading.show()

// 生成进度条
function progressRender(detail) {
  const $progress = $('[data-id="progress"]')
  if($progress && $progress.length) {
    PROGRESS = new Progress({
      container: $progress,
      hasCount: parseFloat(detail.current_num),
      total: parseFloat(detail.total_num),
      style: detail._options.progressBarStyle,
      tips: detail.current_user_num > 0 ? `<span>您已参与<span class="color-primary">${detail.current_user_num}</span>次</span>` : '',
    })
  }
}

DUOBAO_RESULT_TEMPLATE_SUCCESS = new Dialog({
  removeHeader: true,
  removeDefaultOptions: ['confirm', 'cancel'],
  closeClass: 'dialog-bottom-close',
  content: (
    `<div class="duobao-success">
      <div class="duobao-text-content">
        <p>恭喜</p>
        <p>中奖啦</p>
        <p class="view">奖品可在夺奖记录中查看</p>
        <div class="view-button" id="duobaoViewbutton">查看收获</div>
      </div>
    </div>`
  ),
  modalClass: 'duobao-modalClass',
  innerClass: 'duobao-innerClass',
})

DUOBAO_RESULT_TEMPLATE_ERROR = new Dialog({
  removeHeader: true,
  removeDefaultOptions: ['confirm', 'cancel'],
  closeClass: 'dialog-bottom-close',
  content: (
    `<div class="duobao-success">
      <div class="duobao-text-content pt218">
        <p>还未中奖哦</p>
        <p>再接再厉吧</p>
      </div>
    </div>`
  ),
  modalClass: 'duobao-modalClass',
  innerClass: 'duobao-innerClass',
  buttons: [],
})

function updateDetail(data = {}) {
  DETAIL_DATA = updateDetailOptions(DETAIL_DATA, data, {
    USER_INFO,
    isLogin: IS_LOGIN,
    isOrdered: IS_ORDERED,
  })
}

function updateSubcribe(type) {
  if(type === 'subcribe') {
    $('#submitButton').addClass('disabled').html('已预约')
  } else {
    $('#submitButton').removeClass('disabled').html('开始提醒')
  }
}

// 更新当前夺宝活动
function updateCurrentItem(data) {
  updateDetail(data)
  const {_options} = DETAIL_DATA
  const {
    price, totalNum, currentNum, currentUserNum, permitStatus,
    USER_INFO: {totalScore},
  } = _options

  // 人数已满时 || 积分不足时 || 已达上限 更新按钮状态
  if(currentNum === totalNum || totalScore < price || permitStatus) {
    buttonRender(_options)
    addSubmitButtonListener()
  } else {
    $('#currentPrice').html(`${price}积分/次`)
    $('#leftScore').html(`余额：${totalScore}积分`)
  }
  // 更新进度条状态
  PROGRESS.updateOptions({hasCount: currentNum})
  // 更新进度
  $('#currentNum').html(currentNum)
  // 更新当前用户进度
  $('#currentUserNum').html(currentUserNum)
}

function addDuobaoModalClickListener() {
  $('#duobaoViewbutton').click(() => {
    location.href = '/integralh5/snatch/record?tab=1'
  })
}

const showModal = ({code, is_current_user_win}) => {
  const item = `${MODAL_DETAIL_DUOBAO_SUCCESS}_${code}`
  if(!localStorage.getItem(item)) {
    localStorage.setItem(item, true)
    if(is_current_user_win) {
      DUOBAO_RESULT_TEMPLATE_SUCCESS.open()
      addDuobaoModalClickListener()
    } else {
      DUOBAO_RESULT_TEMPLATE_ERROR.open()
    }
  }
}

function addSubmitButtonListener() {
  $('#submitButton').on('click', function() {
    const {
      _options: {
        buttonOptions: {
          type,
        },
      },
      code,
    } = DETAIL_DATA

    console.log('submitButton type:', type)

    // 开奖成功、开奖失败
    if(['success', 'fail'].indexOf(type) !== -1) {
      return
    }

    isLogin(null, () => {
      //  已达上限
      if(type === 'onLimit') {
        $.fn.toast({content: '给别人留点夺宝机会吧'})
        return
      }

      // 开启 开始提醒
      if(type === 'notOrder') {
        askSubscribeSnatch([code])
          .then(({result}) => {
            if(result) {
              $.fn.toast({content: '预约成功，请注意打开APP提示', isMutex: true})
              IS_ORDERED = true
              updateDetail()
              updateSubcribe('subcribe')
            }
          })
          .catch(() => {
            $.fn.toast({content: '网络异常，稍后再试', isMutex: true})
          })
        return
      }

      // 取消预约提醒
      if(type === 'isOrdered') {
        askUnsubscribeSnatch([code])
          .then(({result}) => {
            if(result) {
              $.fn.toast({content: '已取消夺宝提醒', isMutex: true})
              IS_ORDERED = false
              updateDetail()
              updateSubcribe('unsubcribe')
            }
          })
          .catch(() => {
            $.fn.toast({content: '网络异常，稍后再试', isMutex: true})
          })
        return
      }

      // 积分不足，去任务中心
      if(type === 'beShortOf') {
        clickPingback({...DETAIL_PB, rseat: 'duobaodetail_gorich'})
        goToApp({value: 'HomePage'})
        return
      }

      // 参与夺宝
      if(type === 'participate') {
        clickPingback({...DETAIL_PB, rseat: 'duobaodetail_goduobao'})

        $(this).attr('data-forbidden', 'true')
        participate(code)
          .then((data) => {
            const {totalScore, totalParticipates, userParticipates} = data

            $.fn.toast({content: '参与成功，在“我的夺宝记录”查看'})

            USER_INFO = {...USER_INFO, totalScore}
            // 更新当前夺宝活动
            updateCurrentItem({current_num: totalParticipates, current_user_num: userParticipates})
          })
          .catch((err) => {
            const content = err && err.code ? err.message : '参与失败，请稍后重试'
            $.fn.toast({content})
          })
          .finally(() => {
            $(this).removeAttr('data-forbidden')
          })

        return
      }
    })
  })
}

const getUserData = () => {
  return getUserInfo()
    .then(([userInfo]) => {
      USER_INFO = userInfo || {}
      return userInfo
    })
    .catch(NOOP)
}

const getDetail = () => {
  return getSnatchDetail(QUERY.id)
    .then((detail) => {
      console.log('getSnatchDetail', detail)
      const {
        item: {photos, exts, name},
        price,
        code,
        is_current_user_win,
        current_user_num,
        complete_status,
      } = detail
      const photoMap = filterPic(photos)

      shareOptions = {
        ...shareOptions,
        title: `悄悄告诉你，【${name}】可以${price}积分抢到`,
        desc: filterExts(exts, 'pageshare'),
        imgUrl: photoMap.sharepic,
      }
      // 用户已登录 && 用户已参与 && 非进行中的夺宝 需要提示开奖结果
      if(IS_LOGIN && current_user_num && complete_status !== 'IN_PROGRESS') {
        showModal({code, is_current_user_win})
      }
      if(isIqiyi()) {
        iqiyiShare(shareOptions)
      } else if(isWeixin()) {
        shareTimeline(shareOptions)
        shareAppMessage(shareOptions)
      }

      return detail
    })
    .finally(() => {
      pageLoading.destroy()
    })
}

function initPage() {
  pvPingback(DETAIL_PB)

  Promise.all([getUserData(), getDetail()]).then(([userInfo, detail]) => {
    getOrderState([detail]).then((orderedMaps) => {
      IS_ORDERED = orderedMaps[detail.code]
      updateDetail(detail)
      viewRender(DETAIL_DATA)
      progressRender(DETAIL_DATA)

      addSubmitButtonListener()
    })
  })
}

$(document).ready(() => {
  if(!QUERY.id) {
    $.fn.toast({content: '订单号错误，暂无商品信息'})
    return
  }
  initPage()
})
