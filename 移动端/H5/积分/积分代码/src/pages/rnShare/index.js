import 'Res/css/common.less';
import { getQiPuData } from './api'
import {callOrDownloadApp} from '@iqiyi/callordownloadapp';
import {isIos, isWeixin,parseQueryString} from 'Common/utils';
import * as wx from 'Common/wxShare/wxSDK';
import { pvPingBack, clickPingBack, showPingBack } from './pingback'
const query = parseQueryString()

let integralUrl = '';
let RENDER_DATA = {
  total_num: 100000,
  current_num: 500,
  price: 10,
}
const QI_PU_DATA = {}

const bind = function () {
  $('[data-btn]').on('click', function (e) {
    const key = $(e.target).attr('data-btn')
    clickPingBack({
      rpage:'h5_'+query.qipuid,
      block: null,
      rseat: 'h5_'+query.qipuid + '_'+$(e.target).attr('data-index')
    })
    if(!QI_PU_DATA[key]) return false
    integralUrl = QI_PU_DATA[key]
    if(isWeixin() && isIos()){
      location.href = `https://www.iqiyi.com/app/register_business/index.html?pluginParams=${integralUrl.split('pluginParams=')[1]}`
    } else {
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
      callOrDownloadApp(defaultConfig)
    }
  })
}
const wxShare = function () {
  if (isWeixin()) {
    wx.init();
    const messageOptions = {
      title: document.title,
      imgUrl: QI_PU_DATA['p1'],
      desc: QI_PU_DATA.des,
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareAppMessage', messageOptions);
    const timeLineOptions = {
      title: document.title,
      imgUrl: QI_PU_DATA['p1'],
      desc: QI_PU_DATA.des,
      link: location.href
    };
    wx.callFunctionOfWechat('onMenuShareTimeline', timeLineOptions);
  }
}
const getData = function(){
  const qipuid = query.qipuid
  return new Promise((resolve,reject)=>{
    const body = {
      "qipuFusionGetEntity": {
        "entity_id": qipuid,
        "specified_column_group": "RESOURCE_ELEMENTS_SUMMARY",
        "is_reverse_select": false
      }
    }
    const urlParams = {
      task_code: 'qipuFusionGetEntity',
      timestamp: Date.now(),
      appKey: 'basic_h5'
    }
    getQiPuData(body,urlParams).then((data) => {
      RENDER_DATA = data.elements_summary[0]
      resolve(data)
    },()=>{
      resolve(null)
    }).catch(()=>{
      resolve(null)
    })
  })

}
const render = function(){
  const extInfo = query.extInfo || null
  const { key_value_pair } = RENDER_DATA
  const title = filterArray(key_value_pair, 'title', 'value') || null
  const des = filterArray(key_value_pair, 'des', 'value') || null
  const name = filterArray(key_value_pair, 'name', 'value') || null
  QI_PU_DATA['title'] = title
  QI_PU_DATA['des'] = des
  if (name) {
    // 设置标题
    document.title = name
  }
  const p1 = filterArray(key_value_pair, 'p1', 'value')
  const p2 = filterArray(key_value_pair, 'p2', 'value')
  let p1_go = resetParams(filterArray(key_value_pair, 'p1_go', 'value'), extInfo)
  let p2_go = resetParams(filterArray(key_value_pair, 'p2_go', 'value'), extInfo)
  console.log(p1_go)
  QI_PU_DATA['p1_go'] = p1_go
  QI_PU_DATA['p2_go'] = p2_go
  if(p1){
    QI_PU_DATA['p1'] = p1
    $('#p1').attr('src',p1)
  }else{
    $('#p1').remove()
  }
  if(p2){
    $('#p2').attr('src',p2)
  }else{
    $('#p2').remove()
  }
  wxShare()
}
const filterArray = function(array = [], key, value) {
  let result = array.filter(kv => kv.name === key)
  result = result && result[0] && result[0][value]
  return result || null
}
// 把分享的参数 拼接到注册制参数 
const resetParams = function(urlString, extInfo) {
  if (!urlString) return null
  try {
    const url = JSON.parse(decodeURIComponent(decodeURIComponent(urlString.split('pluginParams=')[1])))
    const { biz_dynamic_params } = url.biz_params
    const initParams = JSON.parse(decodeURIComponent(biz_dynamic_params.split("=")[1]))
    const extInfoData = extInfo ? JSON.parse(decodeURIComponent(extInfo)) : {}
    const newInitParams = Object.assign(initParams, extInfoData)
    url.biz_params.biz_dynamic_params = 'initParams=' + encodeURIComponent(JSON.stringify(newInitParams))
    const newUrl = urlString.split('pluginParams=')[0] + 'pluginParams=' + encodeURIComponent(encodeURIComponent(JSON.stringify(url)))
    return newUrl
  } catch (e) {
    return urlString
  }
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
  pvPingBack({rpage:'h5_'+query.qipuid})
  renderPage()
  bind()
}
init()
