import './index.less';
import {callOrDownloadApp} from '@iqiyi/callordownloadapp';
import {isIos, isWeixin} from 'Common/utils';
import * as wx from 'Common/wxShare/wxSDK';

let integralUrl = '';

const goToRNIntegral = function () {
  let url = 'iqiyi://mobile/register_business/qyclient?pluginParams='
  const initparams = JSON.stringify({"pageName": "IntegralMedal"})
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
}

const bind = function () {
  const defaultConfig = {
    SCHEME: integralUrl,
    FAILBACK: {
      IOS: 'https://itunes.apple.com/cn/app/id393765873?mt=8',
      ANDROID: '//mbdapp.iqiyi.com/j/ap/iqiyi_1845.apk'
    },
    TIMEOUT: 2000,
  }
  if (isIos()) {
    defaultConfig['COVER_IMG'] = 'http://www.iqiyipic.com/common/fix/browserOpen-img/browserOpen-img.png';
  } else if (isWeixin() && !isIos()) {
    defaultConfig['FAILBACK']['YYB'] = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.qiyi.video&android_schema=' + encodeURIComponent(integralUrl)
  }
  $('[data-node="goToIntegral"]').on('click', function () {
    callOrDownloadApp(defaultConfig)
  })
}
const wxShare = function () {
  if (isWeixin()) {
    wx.init();
    const messageOptions = {
      title: '恭喜获得爱奇艺勋章',
      imgUrl: window.sharePic,
      desc: '我获得了' + medalName + ',给你嘚瑟一下',
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareAppMessage', messageOptions);
    const timeLineOptions = {
      title: '恭喜获得爱奇艺勋章',
      imgUrl: window.sharePic,
      desc: '我获得了' + medalName + ',给你嘚瑟一下',
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareTimeline', timeLineOptions);
  }
}
const init = function () {
  goToRNIntegral();
  bind()
  wxShare()
}
init()
