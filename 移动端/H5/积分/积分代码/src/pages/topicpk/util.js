/**
 * helper functions
 */
import {
  createSign,
  getUserId,
  getCookie,
  setCookie,
  isIos,
  isWeixin,
} from 'Common/utils'
import {
  iqiyiShare,
} from 'Common/iqiyiPlugin'
import {
  shareTimeline,
  shareAppMessage,
} from 'Common/wxShare/wxSDK'

export {
  createSign,
  getUserId,
  getCookie,
  setCookie,
  isIos,
  isWeixin,
}

export function formatParams(data) {
  return Object.keys(data).map(key => (`${key}=${encodeURIComponent(data[key])}`)).join('&');
}

export function GetQueryString(name) {
  function getAllParams() {
    var url = decodeURIComponent(location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }
  return getAllParams()[name] || null;
};

export function isNewUser() {
  let isNew = '0';
  if (!getCookie('QC006')) {
    isNew = '1';
  }
  return isNew;
}

export function createRNIntegral(pageName = "HomePage") {
  let integralUrl = '';
  let url = 'iqiyi://mobile/register_business/qyclient?pluginParams='
  const initparams = JSON.stringify({"pageName": pageName})
  const params = {
    biz_id: 100,
    biz_plugin: 'qiyibase',
    biz_params: {
      biz_sub_id: 106,
      biz_params: 'bizId=IntegralRN&componentName=RNIntegral',
      biz_dynamic_params: 'initParams=' + initparams,
    }
  }
  integralUrl = url + encodeURIComponent(encodeURIComponent(JSON.stringify(params)));
  return integralUrl;
}

export function createCallAppParam(pageName = "HomePage") {
  const defaultConfig = {
    SCHEME: createRNIntegral(pageName),
    FAILBACK: {
      IOS: 'https://itunes.apple.com/cn/app/id393765873?mt=8',
      ANDROID: '//mbdapp.iqiyi.com/j/ap/iqiyi_1845.apk'
    },
    TIMEOUT: 2000,
  }
  if (isIos()) {
    defaultConfig['COVER_IMG'] = 'http://www.qiyipic.com/common/fix/browserOpen-img/browserOpen-img.png';
  } else if (isWeixin() && !isIos()) {
    defaultConfig['FAILBACK']['YYB'] = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qiyi.video&android_schema=' + encodeURIComponent(createRNIntegral(pageName))
  }
  return defaultConfig;
}

export function calculatePercent(option1, option2) {
  if (option1 === 0 && option2 === 0) {
    return 0
  }
  let percent = Math.round(option1 * 100 / (option1 + option2))
  return percent
}

export function drawTime(time) {
  let now = new Date().getTime();
  let drawTime = {};
  if (time - now >= 24 * 60 * 60 * 1000) {
    drawTime.time = Math.trunc((time - now) / (24 * 60 * 60 * 1000));
    drawTime.countdown = 1;
  } else if (time - now < 24 * 60 * 60 * 1000 && time - now >= 1 * 60 * 60 * 1000) {
    drawTime.time = Math.trunc((time - now) / (60 * 60 * 1000));
    drawTime.countdown = 2;
  } else if (time - now < 1 * 60 * 60 * 1000 && time - now >= 60 * 1000) {
    drawTime.time = Math.trunc((time - now) / (60 * 1000));
    drawTime.countdown = 3;
  } else if (time - now < 60 * 1000 && time - now >= 1000) {
    drawTime.time = Math.trunc((time - now) / (1000));
    drawTime.countdown = 4;
  } else {
    drawTime.time = 0;
    drawTime.countdown = 4;
  }
  return drawTime;
}

export function registerShare(options) {
  if (isWeixin()) {
    shareTimeline({
      title: options.title,
      link: options.link,
      imgUrl: options.imgUrl,
      success: options.success,
      cancel: options.cancel,
    })
    shareAppMessage({
      title: options.title,
      link: options.link,
      desc: options.desc,
      imgUrl: options.imgUrl,
      success: options.success,
      cancel: options.cancel,
    })
  } else {
    iqiyiShare({
      title: options.title,
      link: options.link,
      desc: options.desc,
      imgUrl: options.imgUrl,
      success: options.success,
      fail: options.fail,
      cancel: options.cancel,
      shareType: options.shareType || 1,
    })
  }
}
