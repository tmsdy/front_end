/**
 * Create By liuzhimenng
 * 2018.07.05
 */

import './index.less'

import {
  iqiyiMenu,
} from 'Common/iqiyiPlugin'
import {
  createUrl,
  getUserId,
  goToApp,
  isIos,
} from 'Common/utils'
import {
  getUserInfo,
} from '../apis'

let USER_INFO = {
  totalScore: 0,
}

// 隐藏右上角分享按钮
iqiyiMenu(null, 'hide')

getUserInfo().then(data => {
  if (data && data.length) {
    USER_INFO = data[0]
  }
})

$('#goToCoupon').click(() => {
  if (isIos()) {
    goToApp({type: 'pageName', value: 'kaquan'})
  } else {
    // 安卓通过 router 跳转
    iqiyi.openPage({
      url: 'iqiyi://router/qy_coupons',
    }, data => {
      console.log(data)
    })
  }
})

$('#goToRecord').click(() => {
  const url = 'http://trade.m.duiba.com.cn/crecord/record'
  const params = {
    uid: getUserId(),
    credits: USER_INFO.totalScore,
    timestamp: Date.now(),
    appKey: 'basic_h5',
    dbredirect: url,
  }
  const exemptUrl = 'http://community.iqiyi.com/openApi/score/exemptLogin'
  const _url = createUrl(exemptUrl, params)
  location.href = _url
})
