/**
 * Create By liuzhimenng
 * 2018.07.05
 */

import './editAddress.less'

import { getFormData, isMobile, parseQueryString, goToApp } from 'Common/utils'
import { iqiyiMenu, iqiyiInit } from 'Common/iqiyiPlugin'
import { submitOrder } from '../apis'
import { Toast } from 'Components'
import * as compareVersions from 'compare-versions'
// 隐藏右上角分享按钮
iqiyiMenu(null, 'hide')

const query = parseQueryString()

function addSubmitListener() {
  $('#submit').click(() => {
    if (!query.productId || !query.orderId) {
      $.fn.toast({ content: '订单不存在', type: 'fail' })
      return
    }

    const { name, phone, address } = getFormData($('#receivingForm'))

    if (!name) {
      $.fn.toast({ content: '请填写收货人姓名' })
      return
    }
    if (!phone || !isMobile(phone)) {
      $.fn.toast({ content: '请填写正确的手机号码' })
      return
    }
    if (!address) {
      $.fn.toast({ content: '请填写正确的收货地址' })
      return
    }
    const submitLoading = new Toast({
      type: 'loading',
      content: '提交中...'
    })

    submitLoading.show()

    const data = {
      product_id: query.productId,
      order_id: query.orderId,
      phone: parseInt(phone),
      address,
      name
    }

    submitOrder(data)
      .then(data => {
        submitLoading.destroy()
        if (data.code === 'A00000') {
          $.fn.toast({
            type: 'success',
            content: '提交成功',
            time: 3,
            afterClose() {
              getAppVersion()
                .then(version => {
                  if (!version) {
                    location.href = '/integralh5/orderlist/index'
                    return
                  }
                  if (
                    compareVersions.default(version.toString(), '10.1.5') < 0
                  ) {
                    location.href = '/integralh5/orderlist/index'
                    return
                  }
                  // 10.1.5版本跳RN我的收获页面
                  goToApp({ type: 'pageName', value: 'MyGain' })
                })
                .catch(() => {
                  location.href = '/integralh5/orderlist/index'
                })
            }
          })
        } else {
          $.fn.toast({
            type: 'fail',
            content: '系统繁忙，请稍后重试',
            time: 3
          })
        }
      })
      .catch(() => {
        submitLoading.destroy()
        $.fn.toast({
          type: 'fail',
          content: '系统繁忙，请稍后重试',
          time: 3
        })
      })
  })
}
// 获取app版本号
function getAppVersion() {
  return new Promise((resolve, reject) => {
    {
      iqiyiInit(
        data => {
          resolve(data.version)
        },
        err => {
          reject(err)
        }
      )
    }
  })
}

$(document).ready(() => {
  addSubmitListener()
})
