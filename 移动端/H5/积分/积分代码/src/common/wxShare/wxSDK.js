//--------------------------------
//--Created  by  liqian  ---------
//--------------------------------

const wx = require('./SDK')
const authorize = require('./authorize')

//api 列表默认全选
const jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]

export function init(param = {}) {
  authorize.init(param)
}

/**
 * @method shareTimeline
 * 分享到朋友圈
 * @param {Object} opts 要分享的内容
 * @param {String} opts.title 分享标题
 * @param {String} opts.link 分享链接
 * @param {String} opts.imgUrl 分享图标
 * @param {Function} opts.success 确认分享后执行的回调函数
 * @param {Function} opts.cancel 取消分享后执行的回调函数
 * @param {Function} opts.trigger 点击分享按钮触发的事件，不能有异步操作
 */
export function shareTimeline(opts, param = {}) {
  //调用其他方法前手动调用init方法
  authorize.init(param).then(() => {
    wx.onMenuShareTimeline(opts)
  })
}

/**
 * @method shareAppMessage
 * 分享给朋友
 * @param {Object} opts 要分享的内容
 * @param {String} opts.title 分享的标题
 * @param {String} opts.link 分享链接
 * @param {String} opts.imgUrl 分享图标
 * @param {Function} opts.success 确认分享后执行的回调函数
 * @param {Function} opts.cancel 取消分享后执行的回调函数
 * @param {Function} opts.trigger 点击分享按钮触发的事件，不能有异步操作
 * @param {String} opts.desc 分享的描述
 * @param {String} opts.type 分享类型,music、video或link，不填默认为link
 * @param {String} opts.dataUrl 如果type是music或video，则要提供数据链接，默认为空
 */
export function shareAppMessage(opts, param = {}) {
  authorize.init(param).then(() => {
    wx.onMenuShareAppMessage(opts)
  })
}

export function callFunctionOfWechat(funName, opts) {
  if (jsApiList.indexOf(funName) != -1) {
    authorize.init().then(() => {
      wx[`${funName}`](opts)
    })
  }
}
