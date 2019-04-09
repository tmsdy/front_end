/**
 * Created by liuzhimeng.
 * @date 2018/8/27
 * @description
 */
import {getObjectValueSafely, getProductImage, isString, replaceContent} from 'Common/utils'
import {getNode} from '../assets/options'
import {winnerListRender} from '../assets/listRender'

function setDom(k, v) {
  $(`[data-id="${k}"]`).html(v)
}

function setState(state, value) {
  if(isString(state)) {
    setDom(state, value)
    return
  }
  for(let k in state) {
    setDom(k, state[k])
  }
}

/**
 * 显示顶部图片
 * @param photos
 */
function headerRender(photos = []) {
  const image = getProductImage(photos)
  if(image) {
    getNode('header').css('background-image', `url("${image}")`)
  }
}

/**
 * 显示规则列表
 * @param ruleStr
 */
function ruleRender(ruleStr) {
  if(!ruleStr) return
  const rules = ruleStr.split('\n')
  let listNode = ''
  for(let k = 0; k < rules.length; k++) {
    listNode += `<li class="rule-item">${k + 1}.${rules[k]}</li>`
  }
  getNode('rules').html(listNode)
}

/**
 * 显示底部按钮
 * @param detail
 */
export function buttonRender(options) {
  const {
    price,
    buttonOptions: {type, text},
    USER_INFO: {totalScore}
  } = options

  let content = ''
  if(['unlogin', 'notOrder'].indexOf(type) !== -1) {
    content = `<span id="submitButton" data-type="${type}" class="single-button">${text}</span>`
  }
  if(['isOrdered', 'onLimit', 'success', 'fail'].indexOf(type) !== -1) {
    content = `<span id="submitButton" data-type="${type}" class="single-button disabled">${text}</span>`
  }
  if(type === 'unlogin') {
    content = (`
      <div class="button-wrapper">
          <div class="item-left">
              <div class="left-single-line">登录查看你的积分</div>
          </div>
          <div class="item-right"><span id="submitButton" class="single-button">立即登录</span></div>
      </div>
    `)
  }
  if(type === 'beShortOf') {
    content = (`
      <div class="button-wrapper">
          <div class="item-left">
              <div class="left-top">
                  <span class="item-label">支付：</span><span class="item-text highlight">${price}积分/次</span>
              </div>
              <div class="left-bottom text-error">积分不足，还差${price - totalScore}积分</div>
          </div>
          <div class="item-right"><span id="submitButton" class="single-button">去赚积分</span></div>
      </div>
    `)
  }
  if(type === 'participate') {
    content = (`
      <div class="button-wrapper">
          <div class="item-left">
              <div class="left-top">
                  <span class="item-label">支付：</span><span id="currentPrice" class="item-text highlight">${price}积分/次</span>
              </div>
              <div id="leftScore" class="left-bottom">余额：${totalScore}积分</div>
          </div>
          <div class="item-right"><span id="submitButton" class="single-button">立即夺宝</span></div>
      </div>
    `)
  }

  $('#button').html(content)
}

/**
 * 显示详情文本内容
 * @param detail
 */
function textRender(item) {
  const textData = {
    title: item.name,
    detail: replaceContent(item.intro, item.exts),
    priceCount: item.price,
  }

  setState(textData)
}

function getProgressDescStyle(period, status) {
  if(period === 'after') {
    return status === 'COMPLETE_SUCCESSFULLY' ? 'success' : 'fail'
  }
  return ''
}

function progressRender(options, detail) {
  const {period, status, desc, price, currentUserNum, currentNum, totalNum} = options
  const {winner, rewardViews} = detail
  const $orderTop = getNode('orderTop')
  const descStyle = getProgressDescStyle(period, status)
  const priceDefault = period === 'after' ? ' price-default' : ''

  $orderTop.append(`
      <div class="snatch-info">
          <span class="price${priceDefault}">${price}积分/次</span>
          <span class="user-count">你已夺宝<span id="currentUserNum" class="color-primary">${currentUserNum}</span>次</span>
      </div>
      <div class="detail-progress">
          <div class="progress-info">
              <span class="desc ${descStyle}">${desc}</span>
              <span class="progress-count"><span id="currentNum" class="highlight">${currentNum}</span>/${totalNum}次</span>
          </div>
          <div data-id="progress" class="detail-pro-cont"></div>
      </div>
    `)

  if(status === 'COMPLETE_SUCCESSFULLY') {
    $orderTop.append(winnerListRender(rewardViews, winner))
  }
}

//夺宝优惠展示
function favorableRender(detail) {
  const $wrapper = $('[data-id="youhui"]')
  let dom = ''
  const {rewardViews} = detail
  if(rewardViews.length) {
    rewardViews.map((data, index) => {
      let rank = `item-${index + 1}`
      dom += (
        `<div class="item">
            <div class="item-default ${rank}">
                <div class="price"><span class="price-unit">￥</span>${data.price}</div>
                <p class="people">名额${data.remain}人</p>
            </div>
        </div>`
      )
    })
  } else {
    $wrapper.hide()
  }
  $wrapper.html(dom)
}

export function viewRender(detail) {
  const {_options, ..._detail} = detail

  $('#container').removeClass('default-state')

  headerRender(getObjectValueSafely(_detail, 'item.photos', []))
  ruleRender(getObjectValueSafely(_detail, 'item.rules', ''))
  textRender(_detail.item)
  buttonRender(_options)
  progressRender(_options, detail)
  favorableRender(_detail)
}
