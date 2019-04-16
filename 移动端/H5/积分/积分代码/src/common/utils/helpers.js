import 'core-js/features/array/find-index'

import {generateComponentId} from './src/common'
import {getCookie} from './src/cookies'
import {toString, toNumber} from './src/transfer'
import {isURL} from './src/url'
import {isFunction} from './src/verify'
import {goToApp, ROUTER_MAP} from './callApp'

// 获取用户签名
export const getAuthCookies = () => getCookie('P00001') ? getCookie('P00001') : null
// 获取用户ID
export const getUserId = () => getCookie('P00003') ? parseFloat(getCookie('P00003')) : null

/**
 * 道具后台数据 helper
 * Create By liuzhimenng
 * 2018.07.11
 * ============== start ===================
 */
/**
 * 过滤指定的picture
 * @param lists       picture列表
 * @param photoKey    photoKey关键字
 * @returns {string}  返回picture map，指定photoKey关键字则图片或默认图片
 */
export function filterPic(lists = [], photoKey, defaultpic = 'http://pic2.iqiyipic.com/common/lego/20180619/2a669dbc741a48629ea118b247fbf30b.png') {
  let picMap = {defaultpic}
  for (let {photoKey, url} of lists) {
    picMap[photoKey] = url
  }

  return photoKey === undefined
    ? picMap
    : picMap[photoKey]
      ? picMap[photoKey]
      : picMap.defaultpic
}

/**
 * 过滤指定的道具参数
 * @param lists     道具列表
 * @param name      关键字
 * @returns {*}     返回道具map或指定关键字的value值
 */
export function filterExts(lists = [], name) {
  let extMap = {}
  for (let {name, value} of lists) {
    extMap[name] = value
  }
  return name === undefined
    ? extMap
    : extMap[name]
      ? extMap[name]
      : ''
}

// 获取商品图
export function getProductImage(picList) {
  const listMap = filterPic(picList)
  return listMap.movepic || listMap.smallpic || listMap.defaultpic
}


/***
 * 替换文字为a链接
 * @param replacer 原始文字
 * @param replace 要替换的字符串
 * @param link 要跳转的地址
 * @returns {string} 替换后的文字
 */
export function replaceWithLink(replacer, {replace, link}) {
  const replaceValue = `<a class="color-primary" href="${link}">${replace}</a>`
  return toString(replacer).replace(new RegExp(replace, 'g'), replaceValue)
}

/**
 * 替换文字为注册制跳转
 * @param replacer 原始文字
 * @param replace 要替换的字符串
 * @param pageName 要跳转的注册制地址
 * @param contentId 当前
 * @returns {string} 替换后的文字
 */
export function replaceWithClick(replacer, replace, {key, contentId}) {
  const replaceValue = `<span class="color-primary cp" data-id="${contentId}" data-key="${key}">${replace}</span>`
  return toString(replacer).replace(new RegExp(replace, 'g'), replaceValue)
}

/**
 * 根据扩展信息字段替换对应文字为跳转链接 扩展字段标识符为: replace_xxxxxx，xxxxxx为原内容中匹配的字段
 * @param replacer {String} 要替换的原内容
 * @param exts {Array} 扩展信息
 * @returns {string}
 */
export function replaceContent(replacer, exts = []) {
  replacer = toString(replacer)
  const contentId = generateComponentId('replaceContent-id-', 8)

  for (let key = 0; key < exts.length; key++) {
    const {name} = exts[key]
    if (!!name.match(/^replace_/g)) {
      replacer = replaceWithClick(
        replacer,
        name.slice(8),
        {key, contentId}
      )
    }
  }

  $(document).on('click', `[data-id="${contentId}"]`, function (e) {
    console.log('document click from data-id:', contentId)
    const $this = $(e.target)
    if ($this.attr('data-id') === contentId) {
      const k = toNumber($this.attr('data-key'))
      const {
        value,
        onClick = null,
      } = exts[k]

      if (isFunction(onClick)) {
        onClick()
      }

      if (isURL(value)) {
        location.href = value
      } else {
        const isRouter = ROUTER_MAP.findIndex(i => i.name === value)
        if (isRouter !== -1) {
          goToApp({value})
        }
      }
    }
  })

  return replacer
}

/**
 * 根据道具后台指定跳转方法和地址
 * @param touse
 */
export function goToUse({touse = null} = {}) {
  console.log('goToUse')
  if (!touse) {
    return
  }
  if (isURL(touse)) {
    location.href = touse // 匹配为链接则表示跳转h5
  } else {
    goToApp({type: 'pageName', value: touse}) // 跳转native
  }
}

/* =============== end ================== */

/**
 * 空态页插件
 * @param stateId 空态页id
 * @param textId 空态页文字
 * @returns {
 *  stateId: string,
 *  textId: string,
 *  updateEmpty: function,
 *  addReloadListener: function,
 * }
 */
export function getEmptyPlugin(stateId = 'emptyState', textId = 'emptyText') {
  return {
    stateId,
    textId,
    updateEmpty: (type, text) => {
      const $state = $(`#${stateId}`)

      $(`#${textId}`).text(text)
      if (type === 'empty') {
        $state.removeClass('image-network').attr('data-type', 'empty')
      } else {
        $state.addClass('image-network').attr('data-type', 'network')
      }
    },
    addReloadListener: (parentId) => {
      $(`#${parentId}`).click(function () {
        const $child = $(this).find(`#${stateId}`)
        if ($child.length && $child.attr('data-type') === 'network') {
          location.href = location.href
        }
      })
    }
  }
}

export const fixRequestAnimationFrame = () => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
    })()
  }
}

export const fixCancelAnimationFrame = () => {
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (function () {
      return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function (requestID) {
          window.clearTimeout(requestID)
        }
    })()
  }
}

export const NOOP = () => {}
