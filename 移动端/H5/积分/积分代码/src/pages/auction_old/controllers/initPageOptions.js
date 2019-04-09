/**
 * Created by liuzhimeng.
 * @date 2018/9/5
 * @description 初始化页面配置信息
 */

import {
  addExtsListener,
  getShareLink,
} from "../assets/helpers"
import {
  filterExts,
  filterPic,
  isWeixin,
  replaceContent,
} from "Common/utils"
import {
  shareAppMessage,
  shareTimeline,
} from "Common/wxShare/wxSDK"
import {
  iqiyiShare,
} from "Common/iqiyiPlugin"
import {clickPingback} from "../assets/pingback";

const shareOptions = {
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

function ruleTemplateRender(contents) {
  const ul = $('*[data-rule-list]')
  let listNode = ''
  for (let i of contents) {
    listNode += (
      `<li class="rule-item">
          <span class="rule-circle"></span>
          <div class="rule-text">${i}</div>
      </li>`
    )
  }
  ul.html(listNode)
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

  let {
    IS_LOGIN,
    BARRAGE_DEFAULT,
  } = pageState

  const picMap = filterPic(photos)
  const extMap = filterExts(exts)

  // 初始化页面title
  document.title = name
  shareOptions.title = name

  // 生成页面规则列表
  if (intro) {
    const extsWithClick = addExtsListener(exts)
    const ruleList = replaceContent(intro, extsWithClick).split('\n')
    ruleTemplateRender(ruleList)
  }

  // 活动背景图
  if (picMap.largepic) {
    $('*[data-container]').css('background-image', `url("${picMap.largepic}")`)
  }

  // 活动分享icon
  if (picMap.sharepic) {
    shareOptions.imgUrl = picMap.sharepic
  }

  // 活动分享描述内容
  if (extMap.pageshare) {
    shareOptions.desc = extMap.pageshare
  }

  // 获奖成功弹窗提示内容
  if (extMap.Word) {
    const remindString = extMap.Word.replace(/[,|，]/g, '<br/>')
    $('*[data-reminder-content]').html(remindString)
  }

  // 默认弹幕内容
  if (extMap.danmu) {
    const barrageList = extMap.danmu.split(/[,|，]/)
    BARRAGE_DEFAULT = barrageList.map(text => ({
      avatar: shareOptions.imgUrl,
      nickname: text,
    }))
  }

  if (IS_LOGIN) {
    // 初始化抢拍成功提示商品
    $('*[data-dialog-success="name"]').text(name)

    // 注册分享
    if (isWeixin()) {
      shareTimeline(shareOptions)
      shareAppMessage(shareOptions)
    } else {
      iqiyiShare(shareOptions)
    }
  }

  // 更新 pageState
  return {
    ...pageState,
    BARRAGE_DEFAULT,
  }
}
