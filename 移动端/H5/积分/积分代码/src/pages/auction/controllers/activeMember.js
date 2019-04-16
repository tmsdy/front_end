/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description 激活会员
 */

import {Toast} from 'Components'
import {activeMember} from '../apis'

const failReminder = (content = '系统繁忙，请稍后重试') => $.fn.toast({content, type: 'fail', time: 3})

/**
 * 激活会员
 * @param order 当前订单信息
 */
export function activeMemberFn(order) {
  const data = {
    order_code: order.orderCode,
    product_id: order.productId,
  }
  const activeLoading = new Toast({
    type: 'loading',
    content: '激活中...',
    time: 0,
  })
  activeLoading.show()

  return new Promise((resolve, reject) =>
    activeMember(data)
      .then(data => {
        if (data.code === 'A00000') {
          activeLoading.destroy()
          $.fn.toast({
            content: '激活成功',
            type: 'success',
            time: 3,
          })
          order.productStatus = 2
          return resolve(data)
        } else {
          activeLoading.destroy()
          failReminder(data.message)
          return reject(data)
        }
      })
      .catch(err => {
        activeLoading.destroy()
        failReminder(err.message)
        return reject(err)
      }))
}
