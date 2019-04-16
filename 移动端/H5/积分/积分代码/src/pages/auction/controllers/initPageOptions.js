/**
 * Created by liuzhimeng.
 * @date 2018/9/5
 * @description 初始化页面配置信息
 */

import 'Components/toast'
import {addExtsListener, getShareLink} from "../assets/helpers"
import {filterExts, filterPic, isIqiyi, isWeixin, replaceContent} from "Common/utils"
import {shareAppMessage, shareTimeline} from "Common/wxShare/wxSDK"
import {iqiyiShare} from "Common/iqiyiPlugin"
import {ruleListRender} from './ruleDialog'
import {clickPingback} from "../assets/pingback"
import {generateCommonParams} from "Common/request"

export const SHARE_OPTIONS = {
  title: '积分竞拍爱奇艺VIP卡',
  desc: '积分竞拍爱奇艺VIP卡',
  imgUrl: '',
  shareType: 1,
  link: getShareLink(),
  success: function () {
    clickPingback({
      rseat: 'jingpai_share',
    })
    console.log('分享成功')
  },
  fail: function () {
    clickPingback({
      rseat: 'jingpai_share',
    })
    console.log('分享失败')
  },
  cancel: function () {
    clickPingback({
      rseat: 'jingpai_share',
    })
    console.log('分享取消')
  }
}

function registerShare(options) {
  if (isWeixin()) {
    shareTimeline(options)
    shareAppMessage(options)
  } else if (isIqiyi()) {
    iqiyiShare(options)
  }
}

export function labelShowOptionGenerator(info) {
  return (item) => {
    return {
      portrait: item.avatar,
      text: `${item.nickname} ${info}`,
      isWin: item.isWin || false,
      _item: item,
    }
  }
}

// 去分享
export function goToShare(options) {
  console.log('isWeixin |', isWeixin())
  console.log('isIqiyi |', isIqiyi())
  if (isWeixin()) {
    $.fn.toast({content: '请点击右上角分享~', time: 1})
  } else if (isIqiyi()) {
    iqiyiShare(options, 'share')
  } else {
    $.fn.toast({content: '请在爱奇艺APP或微信内打开分享~', time: 1})
  }
}

export function initPageOptions(pageState, detailData) {
  const {
    item: {
      exts,
      photos,
      intro,
      name = '积分竞拍爱奇艺VIP卡',
    }
  } = detailData
  let {BARRAGE_DEFAULT} = pageState
  const picMap = filterPic(photos)
  const extMap = filterExts(exts)

  // 初始化页面title
  document.title = name
  SHARE_OPTIONS.title = name

  // 生成页面规则列表
  if (intro) {
    const extsWithClick = addExtsListener(exts)
    const ruleList = replaceContent(intro, extsWithClick).split('\n')
    ruleListRender(ruleList)
  }

  // 活动背景图
  if (picMap.largepic) {
    $('#topTitle').css('background-image', `url("${picMap.largepic}")`)
  }

  // 活动分享icon
  if (picMap.sharepic) {
    SHARE_OPTIONS.imgUrl = picMap.sharepic
  }

  // 活动分享描述内容
  if (extMap.pageshare) {
    SHARE_OPTIONS.desc = extMap.pageshare
  }

  // 获奖成功弹窗提示内容
  if (extMap.Word) {
    const remindString = extMap.Word.replace(/[,|，]/g, '<br/>')
    $('*[data-reminder-content]').html(remindString)
  }

  // 默认弹幕内容
  if (extMap.danmu) {
    const barrageList = extMap.danmu.split(/[,|，]/)
    BARRAGE_DEFAULT = barrageList.map((text) => ({
      portrait: SHARE_OPTIONS.imgUrl,
      text: text,
      isWin: false,
    }))
  }

  // 注册右上角分享
  registerShare(SHARE_OPTIONS)
  // 注册发起分享事件
  $('#toShare').click(() => {
    clickPingback({rseat: 'jingpai_share'})
    goToShare(SHARE_OPTIONS)
  })

  generateCommonParams()
    .then((baseParams) => {
      if (baseParams.authCookie) {
        // 初始化抢拍成功提示商品
        $('#bidSuccessName').text(name)
      }
    })

  // 更新 pageState
  return {
    ...pageState,
    BARRAGE_DEFAULT,
  }
}
