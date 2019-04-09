import './index.less';
import 'Res/css/common.less';
import { getDetail } from './api'
import {callOrDownloadApp} from '@iqiyi/callordownloadapp';
import {isIos, isWeixin} from 'Common/utils';
import * as wx from 'Common/wxShare/wxSDK';
import { GetQueryString, getUserId, getCookie } from './utils';

let integralUrl = '';
let RENDER_DATA = {
  total_num: 100000,
  current_num: 500,
  price: 10,
}
const goToRNIntegral = function () {
  let url = 'iqiyi://mobile/register_business/qyclient?pluginParams='
  const initparams = JSON.stringify({"pageName": "Home"})
  const params = {
    biz_id: 100,
    biz_plugin: 'qiyibase',
    biz_params: {
      biz_sub_id: 106,
      biz_params: 'bizId=benefit_plan&componentName=Charity',
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
  $('[data-btn]').on('click', function () {
    if(isWeixin() && isIos()){
      let register = {
        biz_id: 100,
        biz_plugin: 'qiyibase',
        biz_params: {
          biz_sub_id: 106,
          biz_params: 'bizId=benefit_plan&componentName=Charity',
          biz_dynamic_params: 'initParams={\"pageName\":\"Home\"}',
        }
      }
      location.href = `https://www.iqiyi.com/app/register_business/index.html?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(register)))}`
    } else {
      callOrDownloadApp(defaultConfig)
    }
  })
}
const wxShare = function () {
  if (isWeixin()) {
    wx.init();
    const messageOptions = {
      title: '【希望盒子】公益筹集',
      imgUrl: 'https://statics-web.iqiyi.com/integral_rn/assets/gongyi/share.png',
      desc: '和你一起，用VR科技助力教育扶贫 ❤',
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareAppMessage', messageOptions);
    const timeLineOptions = {
      title: '【希望盒子】公益筹集',
      imgUrl: 'https://statics-web.iqiyi.com/integral_rn/assets/gongyi/share.png',
      desc: '和你一起，用VR科技助力教育扶贫 ❤',
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareTimeline', timeLineOptions);
  }
}
const getData = function(){
  return new Promise((resolve,reject)=>{
    const param = {
      code: GetQueryString('code') || 'weal_002',
      // userId: getUserId(),
      // authCookie: getCookie('P00001') || '',
      ext: true,
    }
    getDetail(param).then((data) => {
      RENDER_DATA = data
      resolve(data)
    },()=>{
      resolve(null)
    }).catch(()=>{
      resolve(null)
    })
  })

}
const render = function(){
  const {total_num,current_num, price} = RENDER_DATA
  const videoInfo = RENDER_DATA.sections[0] && RENDER_DATA.sections[0].resources
  let videoPic = (videoInfo &&  videoInfo.filter(fv => fv.type === 'VIDEO')[0] && videoInfo.filter(fv => fv.type === 'VIDEO')[0].mainPic) || (videoInfo &&  videoInfo.filter(fv => fv.type === 'IMAGE')[0] && videoInfo.filter(fv => fv.type === 'IMAGE')[0].content)
  $('#videoPic').attr('src',videoPic)
  $('#title').html(RENDER_DATA.name)
  $('[data-node="currentNum"]').html((current_num * price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  $('[data-node="totalNum"]').html((total_num * price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  const rate = current_num / total_num
  $('#processBar').css('width', rate * 4.4 + 'rem')
  $('#price').html(RENDER_DATA.price)

}
const renderPage = function(){
  getData().then((data)=>{
    if(!data) {
      return
    }
    render()
  })
}
const init = function () {
  renderPage()
  goToRNIntegral();
  bind()
  wxShare()
}
init()
