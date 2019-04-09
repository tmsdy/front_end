import './index.less'

import 'core-js/features/array/includes'
import 'core-js/features/string/includes'

import * as SERVICE from '../service'
import {
  myPkPingback,
  failPingback,
  pvPingback,
  clickPingback,
} from '../pingback'
import * as Util from '../util'
import {
  generateCommonParams,
} from "Common/request"
import {
  getCookie,
  setUrlHashAndParam,
  parseQueryString,
  isIos,
} from 'Common/utils'
import {
  goToLogin,
  isLogin,
} from 'Common/iqiyiPlugin'

import 'Components/toast'
import {
  shareAppMessage,
  shareTimeline,
} from "Common/wxShare/wxSDK"

let PAGE = 0                                // 请求页码从0开始 接口详情见wiki
                                            // http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%96%B0%E6%8E%A5%E5%8F%A3WIKI-11.%E8%AF%9D%E9%A2%98%E5%88%97%E8%A1%A8%EF%BC%9A/openApi/topic/list
let PAGESIZE = 10
let unstart = 0                            // 是否渲染未开始标题
let ended = 0                              // 是否渲染已结束标题
let hasNext = true
let screenHeight = window.screen.height
let isLoading = false
let currentListId = parseQueryString(location.search, 'tab') || 'all' // 当前tab all、my
let countDownName = ['', '天', '小时', '分钟', '秒']
let MY_LIST_DATA = []
let HAS_COUNT = 0
let openTimers = []

let shareOptions = {
  title: '话题打call广场',
  desc: '话题打call为了谁，瓜分积分最完美',
  imgUrl: '',
  link: location.href,
  success: function () {
    console.log('分享成功')
  },
  fail: function () {
    console.log('分享失败')
  },
  cancel: function () {
    console.log('分享取消')
  }
}

shareAppMessage(shareOptions)
shareTimeline(shareOptions)

const renderNoLogin = (type = 'yes') => {
  if (type === 'yes') {
    $('html').css('background-color', '#ffffff')
    $('#list').hide()
    $('#noLogin').show()
  } else {
    $('html').css('background-color', '')
    $('#list').show()
    $('#noLogin').hide()
  }
}

const renderLoading = (type = 'yes') => {
  if (type === 'yes') {
    $('#loading').show()
    renderNoLogin('no')
    renderError('no')
    renderNoList('no')
  } else {
    $('#loading').hide()
  }
}

const renderError = function (type = 'yes') {
  if (type === 'yes') {
    $('html').css('background-color', '#ffffff');
    $('#list').hide();
    $('#netError').show();
  } else {
    $('html').css('background-color', '');
    $('#list').show();
    $('#netError').hide();
  }
}

const renderNoList = function (type = 'yes') {
  if (type === 'yes') {
    $('html').css('background-color', '#ffffff');
    $('#list').hide();
    $('#noList').show();
  } else {
    $('html').css('background-color', '');
    $('#list').show();
    $('#noList').hide();
  }
}

const haslogin = !!getCookie('P00001')

if (currentListId === 'my') {
  pvPingback({
    ...myPkPingback,
  })
} else {
  pvPingback()
}

function renderTocpicWithResult(item, dataKey) {
  let itemTopic = ''
  let result1 = ''
  let result2 = ''
  let pkIcon = 'pkIcon'
  let activeState = ''

  let doCallBtn = ''

  // 我参与的
  if (currentListId === 'my') {
    const doCallState = getDoCallState(item, dataKey)
    const showBtn = doCallState.text ? 'block' : 'none'

    let className = 'doCall'
    if (doCallState.disabled) {
      className += ' disabled'
    }

    doCallBtn = currentListId === 'my'
      ? `<div 
          class="${className}" 
          data-node="doCall" 
          data-id="doCall" 
          data-key="${dataKey}"
          data-disabled="${doCallState.disabled}"
          style="display: ${showBtn}"
      >${doCallState.text}</div>`
      : ''

    if (item.user_option_code && item.win_option_code) {
      pkIcon = item.user_option_code === item.win_option_code ? 'my-pk-victory' : 'my-pk-lose'
    }
    if (item.user_option_code) {
      activeState = item.user_option_code === item.options[0].option_code ? ' active-left' : ' active-right'
    }
  } else {

    if (ended < 1) {
      itemTopic = `<li class="title-wrapper"><div class="title-bg">往期揭晓</div></li>`
      ++ended
    }

    // 全部话题(与用户无关逻辑)
    if (item.win_option_code) {
      if (item.win_option_code === item.options[0].option_code) {
        result1 = `<div class="crown-left"></div>`
      } else {
        result2 = `<div class="crown-right"></div>`
      }
    }
  }

  const inProgress = item.win_option_code ? '' : ' in-progress'

  if (!item.options[0].picture || !item.options[1].picture) {
    itemTopic += `
          <li class="item">
               <div data-item='${item.code}'>
                    <p class="topicTitle">${item.name}</p>
                    <div class="boxWrap${activeState} unStart${inProgress}">
                        ${result1}
                        ${result2}
                        <div class="${pkIcon}"></div>
                        <div class="leftPart">
                           <div class="content"><div class="littile_box"></div>${item.options[0].content || ''}</div>
                        </div>
                        <div class="rightPart">
                           <div class="content"><div class="littile_box"></div>${item.options[1].content || ''}</div>
                        </div>
                        <div class="grey_wrap"></div>
                        <div class="item-mask"></div>
                        <div class="leftNum">${Util.calculatePercent(item.options[0].vote_number, item.options[1].vote_number)}%</div>
                        <div class="rightNum">${Util.calculatePercent(item.options[1].vote_number, item.options[0].vote_number)}%</div>
                    </div>
               </div>
              ${doCallBtn}
          </li>`
  } else {
    itemTopic += `
          <li class="item">
              <div data-item='${item.code}'>
                  <p class="topicTitle">${item.name}</p>
                  <div class="boxWrap${activeState}">
                      <div class="pic1">
                          <img class="pic left" src="${item.options[0].picture || ''}" alt="">
                          <div class="leftFloatWrap">
                              ${result1}
                              <div class="leftNum${inProgress}">${Util.calculatePercent(item.options[0].vote_number, item.options[1].vote_number)}%</div>
                          </div>
                          <div class="leftPart transparentBg">
                              <span class="leftName">${item.options[0].title || ''}</span>
                          </div>
                      </div>
                      <div class="pic2">
                          <img class="pic left" src="${item.options[1].picture || ''}" alt="">
                          <div class="rightFloatWrap">
                              ${result2}
                              <div class="rightNum${inProgress}">${Util.calculatePercent(item.options[1].vote_number, item.options[0].vote_number)}%</div>
                          </div> 
                          <div class="rightPart transparentBg">
                              <span class="rightName">${item.options[1].title || ''}</span>
                          </div>
                      </div>
                      <div class="detail_xiexian"></div>
                      <div class="${pkIcon}"></div>
                  </div>
              </div>
              ${doCallBtn}
          </li>`
  }

  return itemTopic
}

const renderTimer = function (from, to) {
  MY_LIST_DATA.slice(from, to).forEach((i, k) => {
    const dataKey = from + k
    let openTimer = openTimers[dataKey]
    if (openTimer) {
      if (openTimer.countdown === 1) { // 倒计时天
        return
      } else { // 倒计时小时
        openTimers[dataKey]['interval'] = setInterval(() => {
          let nowTime = new Date().getTime()
          let culculate = Util.drawTime(i.draw_time)
          updateDoCallState(null, dataKey, {
            text: '打Call成功，还有' + culculate.time + countDownName[culculate.countdown] + '揭晓答案',
            disabled: true,
          })
          if (i.draw_time - nowTime <= 0) {
            console.log('draw_time, nowTime', i.draw_time, new Date().getTime(), i.draw_time - new Date().getTime());
            clearInterval(openTimers[dataKey]['interval'])
            getTopicDetail(i.code, detail => {
              MY_LIST_DATA[dataKey] = detail
              const newItem = renderTocpicWithResult(detail, dataKey)
              const content = $(newItem).html()
              const $item = $(`#list > .item:nth-child(${dataKey + 1})`)
              $item.html(content)
              // const {
              //   user_option_code: userCode,
              //   win_option_code: winCode,
              // } = detail
              // if (userCode === winCode) {
              //   updateDoCallState(null, dataKey, {
              //     text: '领取' + detail.each_reward + '积分',
              //     disabled: false,
              //   })
              // } else {
              //   updateDoCallState(null, dataKey, {
              //     text: '好遗憾，未猜中',
              //     disabled: true,
              //   })
              // }
            })
          }
        }, 1000)
      }
    }
  })
}

const updateDoCallState = (data, key, btnState = null) => {
  if (data && btnState === null) {
    btnState = getDoCallState(data, key)
  }

  let className = 'doCall'
  if (btnState.disabled) {
    className += ' disabled'
  }

  const $thisBtn = $(`[data-id="doCall"][data-key="${key}"]`)
  $thisBtn
    .removeClass()
    .addClass(className)
    .html(btnState.text)
    .attr('data-disabled', btnState.disabled)
}

const getAward = function (key) {
  let TOPIC_DETAIL = MY_LIST_DATA[key]
  clickPingback({
    ...myPkPingback,
    rseat: 'topic_my_call',
  })
  updateDoCallState(null, key, {
    text: '领取奖励中...',
    disabled: true,
  })
  generateCommonParams()
    .then(baseParams => {
      const params = {
        topicCode: TOPIC_DETAIL.code || '',
        userId: baseParams.userId,
        authCookie: baseParams.authCookie,
      }
      SERVICE.getReward(params)
        .then(data => {
          console.log('getReward', data)
          if (data.getRewardSuccessfully) {
            $.fn.toast({content: '领取奖励成功', time: 3})
            TOPIC_DETAIL.user_reward_given = true
          } else {
            $.fn.toast({content: '领取奖励失败请稍候再试', time: 3})
          }
          updateDoCallState(TOPIC_DETAIL, key)
        })
        .catch(err => {
          console.log('err', err)
          $.fn.toast({content: '领取奖励失败请稍候再试', time: 3})
          updateDoCallState(TOPIC_DETAIL, key)
        })
    })
    .catch(() => {
      $.fn.toast({content: '领取奖励失败请稍候再试', time: 3})
      updateDoCallState(TOPIC_DETAIL, key)
    })
}

const getDoCallState = function (data, key) {
  data = SERVICE.formatData(data)
  let doCallState = {
    text: '',
    disabled: true,
  }
  let openTimer = null
  let status = data.status
  if ([0, 2].includes(status)) {                                // 话题开始之后
    const nowTime = Date.now()

    if (nowTime < data.draw_time) {                             // 未开奖
      openTimer = Util.drawTime(data.draw_time)
      doCallState = {
        text: '打Call成功，还有' + openTimer.time + countDownName[openTimer.countdown] + '揭晓答案',
        disabled: true,
      }
    } else {
      if (data.user_option_code === data.win_option_code) {
        if (data.user_reward_given) {                            // 已开奖已中奖已领取
          doCallState = {
            text: '已领取' + data.each_reward + '积分',
            disabled: true,
          }
        } else {                                                 // 已开奖已中奖未领取，且未过领取有效期
          if (nowTime < data.reward_valid_time) {
            doCallState = {
              text: '领取' + data.each_reward + '积分',
              disabled: false,
            }
          } else {
            doCallState = {
              text: '打Call已结束',
              disabled: true,
            }
          }
        }
      } else {                                                    // 已开奖未中奖
        doCallState = {
          text: '好遗憾，未猜中',
          disabled: true,
        }
      }
    }
  }

  openTimers[key] = openTimer
  return doCallState
}

const renderTopicList = function (item, key) {
  let itemTopic = ''
  if (item.options.length < 2) {
    return itemTopic
  }

  if (item.status === 0) { // 进行中的话题

    // 我参与的
    if (currentListId === 'my') {
      itemTopic = renderTocpicWithResult(item, key)
    } else {
      if (!item.options[0].picture || !item.options[1].picture) {
        itemTopic += `
        <li class="item">
            <div data-item='${item.code}'>
                <p class="topicTitle">${item.name}</p>
                <div class="boxWrap unStart">
                   <div class="pkIcon"></div>
                   <div class="leftPart">
                      <div class="content"><div class="littile_box"></div>${item.options[0].content || ''}</div>
                   </div>
                   <div class="rightPart">
                      <div class="content"><div class="littile_box"></div>${item.options[1].content || ''}</div>
                   </div>
                </div>
            </div>
        </li>`
      } else {
        itemTopic = `
        <li class="item">
            <div data-item='${item.code}'>
                <p class="topicTitle">${item.name}</p>
                <div class="boxWrap">
                    <div class="pic1">
                        <img class="pic left" src="${item.options[0].picture || ''}" alt="">
                        <div class="leftPart">
                            <span class="leftName">${item.options[0].title || ''}</span>
                        </div>
                    </div>
                    <div class="pic2">
                        <img class="pic left" src="${item.options[1].picture || ''}" alt="">
                        <div class="rightPart">
                            <span class="rightName">${item.options[1].title || ''}</span>
                        </div>
                    </div>
                    <div class="detail_xiexian"></div>
                    <div class="pkIcon"></div>
                </div>
            </div>
        </li>`
      }
    }
  } else if (item.status === 1) { // 未开始的话题
    if (unstart < 1) {
      itemTopic = `<li class="title-wrapper"><div class="title-bg">即将开始</div></li>`
      ++unstart
    }
    if (!item.options[0].picture || !item.options[1].picture) {
      itemTopic += `
          <li class="item">
               <div data-item='${item.code}'>
                   <p class="topicTitle">${item.name}</p>
                   <div class="boxWrap unStart">
                       <div class="pkIcon"></div>
                       <div class="leftPart">
                          <div class="content"><div class="littile_box"></div>${item.options[0].content || ''}</div>
                       </div>
                       <div class="rightPart">
                          <div class="content"><div class="littile_box"></div>${item.options[1].content || ''}</div>
                       </div>
                   </div>
               </div>
          </li>`
    } else {
      itemTopic += `
          <li class="item">
              <div data-item='${item.code}'>
                  <p class="topicTitle">${item.name}</p>
                  <div class="boxWrap">
                      <div class="pic1">
                          <img class="pic left" src="${item.options[0].picture || ''}" alt="">
                          <div class="leftPart">
                              <span class="leftName">${item.options[0].title || ''}</span>
                          </div>
                      </div>
                      <div class="pic2">
                          <img class="pic left" src="${item.options[1].picture || ''}" alt="">
                          <div class="rightPart">
                              <span class="rightName">${item.options[1].title || ''}</span>
                          </div>
                      </div>
                      <div class="detail_xiexian"></div>
                      <div class="pkIcon"></div>
                  </div>
              </div>
          </li>`
    }
  } else if (item.status === 2) {// 已结束的话题
    itemTopic = renderTocpicWithResult(item, key)
  }
  return itemTopic
}

const formatList = list => {
  let newList = []
  list.forEach((i, k) => {
    const nowTime = Date.now()
    if (nowTime >= i.draw_time
      && i.user_option_code === i.win_option_code
      && !i.user_reward_given
    ) {
      newList.push(list.splice(k, 1)[0])
    }
  })
  return newList.concat(list)
}

const getTopicDetail = (topicCode, callback) =>
  generateCommonParams()
    .then(baseParams => {
      const params = {
        topicCode,
        userId: baseParams.userId,
        authCookie: baseParams.authCookie,
        typeCode: 'point',
      }
      return SERVICE.getTopicDetail(params).then((data) => {
        console.log('getTopicDetail', data)
        callback && callback(data)
      })
    })

const getTopicList = function (type = 'all') {
  if (isLoading) {
    return
  }

  if (currentListId === 'my') {
    // 未登录
    if (!haslogin) {
      renderLoading('no')
      renderNoLogin()
      return
    }
  }

  renderLoading('yes')
  // 查询我参与的PK
  const isMy = type === 'my' || currentListId === 'my'
  generateCommonParams({isAsync: isMy})
    .then(baseParams => {
      isLoading = true
      let renderData = ''
      let params = {
        offset: PAGE * PAGESIZE,        // 请求页码
        limit: PAGESIZE,                // 每页请求数量
        getVoteNumberAtRunTime: true,   // 是否需要实时返回各选项投票人数
      }
      if (isMy) {
        params.userId = baseParams.userId
        params.authCookie = baseParams.authCookie
      }
      const serviceRequest = currentListId === 'my'
        ? SERVICE.getMyList
        : SERVICE.getTopicList
      serviceRequest(params)
        .then((data) => {
          console.log(currentListId === 'my' ? 'getMyList' : 'getTopicList', data)
          renderError('no')
          renderLoading('no')
          isLoading = false

          let list = data.contents

          if (!data.total) {
            renderNoList()
            hasNext = false
            return
          } else if (PAGE === 0) {
            renderNoList('no')
            // 配置右上角分享
            const imgUrl = list.length && list[0]['options'] && list[0]['options'].length
              ? list[0]['options'][0]['picture']
              : ''
            shareOptions.imgUrl = imgUrl
            const queryString = `tab=${currentListId}`
            shareOptions.link = location.href.includes('?') ? location.href + queryString : `${location.href}?${queryString}`
            shareTimeline(shareOptions)
            shareAppMessage(shareOptions)
          }

          if (currentListId === 'my') {
            list = formatList(list)
            HAS_COUNT += MY_LIST_DATA.length
            MY_LIST_DATA = MY_LIST_DATA.concat(list)
          } else {
            HAS_COUNT = 0
            MY_LIST_DATA = []
          }

          if ((PAGE + 1) * PAGESIZE >= data.total) {
            hasNext = false
          }
          ++PAGE
          if (!list || !list.length) {
            return
          } else {
            for (let i = 0; i < list.length; i++) {
              renderData = renderData + renderTopicList(list[i], i + HAS_COUNT)
            }
            $('.topicBox').append(renderData)

            // 增加倒计时
            const from = HAS_COUNT
            const to = HAS_COUNT + list.length
            renderTimer(from, to)
          }
        })
        .catch(() => {
          renderLoading('no')
          renderError('yes')
          pvPingback({...failPingback})
        })
    })
}

// 注册tab菜单切换事件
const $topBox = $('#topSectionBox')
$topBox.children(`.top-section-item[data-id="${currentListId}"]`).addClass('active')
$topBox.on('click', '.top-section-item', function () {
  const $this = $(this)
  if (!$this.hasClass('active')) {
    const id = $this.attr('data-id')
    $topBox.children().removeClass('active')
    $this.addClass('active')
    currentListId = id

    // reset
    PAGE = 0
    PAGESIZE = 10
    unstart = 0
    ended = 0
    hasNext = true
    screenHeight = window.screen.height
    isLoading = false

    $('#list').empty()
    // setUrlHashAndParam('tab', currentListId)
    getTopicList()
  }
})

const scrollLoadMore = function () {
  if (!isLoading && !hasNext) {
    return
  }
  let yDistance = window.scrollY
  let docHeight = document.getElementById('list').offsetHeight
  if ((screenHeight + yDistance >= docHeight)) {
    $('#loading').show()
    getTopicList()
  }
}

const bindEventListener = function () {
  // 注册列表点击事件
  $('#list').on('click', '[data-item]', function (event) {
    let topicCode = $(event.currentTarget).attr('data-item')
    clickPingback({
      rseat: topicCode,
    })
    location.href = '/integralh5/topicpk/detail/index?' + encodeURIComponent('code=' + topicCode)
  })
  window.addEventListener('scroll', () => scrollLoadMore())

  $('#list').on('click', '[data-id="doCall"][data-disabled="false"]', function () {
    const $this = $(this)
    let isDisabled = $this.attr('data-disabled')
    if (isDisabled === 'false') {
      const dataKey = Number($this.attr('data-key'))
      // 领取积分
      isLogin(null, () => {
        getAward(dataKey)
      })
    }
  })

  $('#goToLogin').click(() => {
    goToLogin()
  })
}

// 页面初始化方法
const init = function () {
  bindEventListener()
  getTopicList()
}

init()

// iOS在前两次后退会读取缓存，强制刷新页面
if (isIos()) {
  window.onpageshow = event => {
    // 判断页面是否从缓存（Backforward Cache）中加载
    // https://developer.mozilla.org/zh-CN/docs/Web/API/PageTransitionEvent
    if (event.persisted) {
      window.location.reload()
    }
  }
}
