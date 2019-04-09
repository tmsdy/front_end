/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description
 */

import {
  transferTimeTo,
} from "Common/utils"

import {
  clickPingback,
} from '../assets/pingback'

/**
 * 获奖名单弹窗内模板
 * @param content     弹窗内容
 * @param round       内容为当前轮还是上一轮 current/last 当前轮/上一轮
 * @returns {string}  html模板
 */
function wrapperTemplate(content, round) {
  const lastImage = round === 'current' ? '' : ' last-image'
  return (
    `<div class="dialog-list-wrapper">
        <div class="list-title">
            <span class="title-image${lastImage}"></span>
        </div>
        ${content}
    </div>`
  )
}

/**
 * 获奖名单弹窗内无数据模板
 * @param text        提示文字
 * @param round       内容为当前轮还是上一轮 current/last 当前轮/上一轮
 * @returns {string}  html模板
 */
function noneDataTemplate(text, round) {
  const nobody = (
    `<div class="nobody-wrapper">
        <div class="nobody-image"></div>
        <div class="nobody-content">哎哟，好可惜<br/>${text}</div>
    </div>`
  )
  return wrapperTemplate(nobody, round)
}

/**
 * 获奖名单弹窗内列表模板
 * @param lists       名单列表数据
 * @param round       内容为当前轮还是上一轮 current/last 当前轮/上一轮
 * @returns {string}  html模板
 */
function awardListTemplate(lists, round) {
  let listNode = ''
  lists.forEach(i => {
    const time = transferTimeTo('datetime', i.time)
    const imgUrl = i.avatar ? i.avatar : 'http://www.iqiyipic.com/common/fix/headicons/male-130.png'
    listNode += (
      `<li class="list-item">
          <div class="item-wrapper">
              <div class="item-left"><img class="user-protait" src="${imgUrl}"></div>
              <div class="item-right">
                  <h3 class="user-name">${i.nickname}</h3>
                  <div class="user-desc">${time}</div>
              </div>
              <div class="user-integral-wrapper"><span class="integral-text">${i.cost}</span><i class="integral-icon"></i></div>
          </div>
      </li>`
    )
  })

  const listTemp = (
    `<div class="list-container">
        <div class="list-inner-container">
            <ul class="list-wrapper">${listNode}</ul>
        </div>
    </div>`
  )

  return wrapperTemplate(listTemp, round)
}

/**
 * 获奖名单弹窗内按钮数据
 * @param text      按钮文字
 * @returns {*[]}   按钮数据（dialog参数格式）
 */
function buttonsOptions(text) {
  return [{
    className: 'btn-default w420',
    text,
    onClick() {
      if (text === '更多获奖名单' || text === '查看更多') {
        clickPingback({
          rseat: 'jingpai_more',
        })
      }
      location.href = '/integralh5/auction/list' + location.search
    },
  }]
}

/**
 * 生成获奖名单弹窗内容
 * @param round {string}              current/last 当前轮/上一轮
 * @param lists {array}               列表数据，空数组表示无数据
 * @param allNoneData {boolean}       整场活动获奖名单是否无数据
 * @returns {*}                       dialog 参数格式要求的 content, buttons
 */
export function awardListOptions({round = 'current', lists = [], allNoneData = false} = {}) {
  let content = ''
  let buttons = []

  if (allNoneData) {
    content = noneDataTemplate('还没有人竞拍成功哟', 'last')
    return {content, buttons}
  }

  // 不显示已获奖但发奖失败的用户
  lists = lists.filter(i => !i.errorMessage)

  if (lists.length) {
    content = awardListTemplate(lists, round)
    buttons = buttonsOptions('查看更多')
    return {content, buttons}
  } else {
    const text = round === 'current' ? '本轮没有人竞拍成功哟' : '还没有人竞拍成功哟'
    content = noneDataTemplate(text, round)
    buttons = buttonsOptions('更多获奖名单')
    return {content, buttons}
  }
}
