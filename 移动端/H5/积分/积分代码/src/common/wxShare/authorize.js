//--------------------------------
//--Created  by  liqian  ---------
//--------------------------------
import 'core-js/features/object/assign'

var wx = require('./SDK');
import {jsSHA} from './sha'

var status = '';

/**
 * 签名算法
 */
let sha1 = function (str) {
  var s = new jsSHA(str, "TEXT");
  return s.getHash("SHA-1", "HEX");
};
/**
 * 生成时间戳
 */
let timeStamp = function () {
  return +new Date() / 1000 >> 0;
};
/**
 * 生成随机串
 */
let nonceStr = function (length) {
  length = length || 16;
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678+=-_';
  var maxPos = $chars.length;
  var result = '';
  for (let i = 0; i < length; i++) {
    result += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
};
/**
 * 获取ticket
 */

let getTicket = function () {
  return new Promise(function (resolve) {
    let url = '//bird.sns.iqiyi.com/wechat/jsapi_ticket';
    let params = {
      appid: 'wx85e5e7f44c7cc50e'
    };
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: 'callback',
      data: params,
      success: function (data) {
        resolve(data);
      }
    });
  });
};

let jsApiList = ['checkJsApi',//api 列表默认全选
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
  'openCard'];

let _ready = '';

export function init(param = {}) {
  /**
   * 状态不是 waiting 或者 success，则发出请求
   */
  if (status !== 'waiting' && status !== 'success') {
    status = 'waiting';
    _ready = new Promise(function (resolve, reject) {
      getTicket().then(data => {
        if (data.code === 'A0000') {
          let ticket = data.jsapi_ticket;
          let noncestr = nonceStr();
          let timestamp = timeStamp();
          let str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + location.href.split('#')[0];
          let signature = sha1(str);
          /**
           * 配置微信 jssdk
           */
          wx.config(Object.assign({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx85e5e7f44c7cc50e', // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: jsApiList // 必填，需要使用的JS接口列表
          }, param));
          wx.ready(function () {
            status = 'success';
            resolve(ticket);
          });
          wx.error(function () {
            status = 'fail';
            reject();
          });
        } else {
          status = 'fail';
          reject();
        }
      })
    });
  }
  return _ready;
};
