/**
 * Created by liuzhimeng.
 * @date 2018/9/25
 * @description 话题pk分享页
 */

import 'core-js/features/promise/finally'

import {goToApp, parseQueryString} from 'Common/utils'
import {shareAppMessage, shareTimeline} from 'Common/wxShare/wxSDK'
import {Toast} from 'Components'
import {setState, getDayTime} from './helpers'
import {getDetail} from './apis'
import {pagePingback, clickPingback, TOPIC_LIST_RPAGE} from './pingback'

import './index.less'

pagePingback(TOPIC_LIST_RPAGE)

const ID = parseQueryString(location.search, 'id')

const shareOptions = {
  title: '话题PK广场',
  desc: '话题PK广场',
  imgUrl: '',
  shareType: 1,
  link: location.href,
  shareArray: ['wechat', 'wechatpyq', 'xlwb', 'qq', 'qqsp'],
}

const pageLoading = new Toast({pageLoading: true, time: 0})
pageLoading.show()

getDetail({topicCode: ID})
  .then((detail) => {
    const {
      name,
      price,
      draw_time: drawTime,
      total_reward: totalReward,
      options = [],
    } = detail
    const [
      {title: titleA, picture},
      {title: titleB},
    ] = options
    const shareOptions = {
      ...shareOptions,
      title: `${titleA} VS ${titleB}`,
      desc: name,
      imgUrl: picture,
      shareArray: ['wechat', 'wechatpyq', 'xlwb', 'qq', 'qqsp'],
    }
    shareTimeline(shareOptions)
    shareAppMessage(shareOptions)
    iqiyi.share({
      ...shareOptions
    });
    $('.top-tip .highlight').html(getDayTime(drawTime))

    $('.topic-tips .highlight').eq(0).html(price)
    $('.topic-tips .highlight').eq(1).html(totalReward)
    $('.topic-title').html(name)
    options.forEach((i, k) => {
      setState({[`viewTitle_${k}`]: i.title})
      $(`[data-bg-id="viewBg_${k}"]`).css('background-image', `url("${i.picture}")`)
    })

  })
  .finally(() => {
    pageLoading.destroy()
  })

$(document).ready(() => {
  $('[data-click="callApp"]').click(() => {
    clickPingback(TOPIC_LIST_RPAGE, '', TOPIC_LIST_RPAGE)
    goToApp({
      type: 'pageName',
      value: 'TopicPk',
      integralPrams: {
        from: 'share',
      },
    })
  })
})
