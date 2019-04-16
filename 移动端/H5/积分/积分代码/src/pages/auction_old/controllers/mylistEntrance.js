/**
 * Created by liuzhimeng.
 * @date 2018/8/10
 * @description 监听我的抢拍入口点击事件；通过对我的抢拍列表首条数据支付时间戳比较，增加入口未读消息提醒
 */
import {
  clickPingback,
} from '../assets/pingback'

import {
  getOrderList,
} from "../apis"
import {
  setLocalStorage,
  getLocalStorage,
  getUserId,
} from "Common/utils"
import {
  isLogin,
} from "Common/iqiyiPlugin"

const LOCALSTORAGE_KEY = `auctionEntranceCode_${getUserId()}`
const CODE = getLocalStorage(LOCALSTORAGE_KEY) || null
const $newMessage = $('#newMessageInMylist')

// 更新消息提醒状态
const setNewMessageState = (operate = 'show', code = null) => {
  if (code) {
    setLocalStorage(LOCALSTORAGE_KEY, code)
  }
  if (operate === 'hide') {
    $newMessage.hide()
  } else {
    $newMessage.show()
  }
}

const clickToSetCode = code => {
  const localCode = $newMessage.attr('data-code')
  console.log('localCode',localCode)
  const setCode = localCode ? localCode : code
  setNewMessageState('hide', setCode)
}

// 入口点击事件
export const entranceClick = code => {
  const $mylistEntrance = $('#mylistEntrance')
  $mylistEntrance.css('right', '0')
  $mylistEntrance.click(() => {
    clickPingback({
      rseat: 'jingpai_order',
    })
    isLogin(null, () => {
      clickToSetCode(code)
      location.href = '/integralh5/auction/mylist' + location.search
    })
  })
}

// 获取新数据信息
export const getNewMessageState = () => {
  const data = {
    page: 1,
    size: 1,
  }
  return new Promise((resolve, reject) => {
    return getOrderList(data)
      .then(data => {
        if (data.code === 'A00000' && data.data.contents.length) {
          const newCode = data.data.contents[0]['orderCode']
          console.log('newCode, code', newCode, CODE)
          if (newCode !== CODE) {
            setNewMessageState('show', CODE)
            return resolve(newCode)
          }
        }
        return reject()
      })
      .catch(() => {
        return reject()
      })
  })
}

// 绑定入口点击事件
export const addEntranceListener = () => {
  entranceClick()
  // getNewMessageState()
  //   .then((code) => {
  //     entranceClick(code)
  //   })
  //   .catch(() => {
  //     entranceClick()
  //   })
}
