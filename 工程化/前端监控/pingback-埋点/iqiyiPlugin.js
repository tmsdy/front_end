import {getCookie, isFunction, isIqiyi,} from 'Common/utils'
import {Toast} from 'Components'

let LOGIN_TOAST = null

/**
 * 去登陆操作
 * @param before 登录前回调
 * @param delay web端延迟去登陆时间
 */
export const goToLogin = (before = null, delay = 0) => {
  if(isIqiyi()) {
    iqiyi.ready(flag => {
      before && before()
      if(flag) { // 基线webview
        iqiyi.loadNativePage({
          page: 'login',
          returnUrl: location.href,
          param: {
            fc: '1',
            fv: '2'
          }
        })
      } else { // 外部浏览器
        location.href = '//m.iqiyi.com/user.html?redirect_url=' + encodeURIComponent(location.href)
      }
    })
  } else {
    setTimeout(() => {
      before && before()
      location.href = '//m.iqiyi.com/user.html?redirect_url=' + encodeURIComponent(location.href)
    }, delay * 1000)
  }
}

/**
 * 判断是否已登录
 * @param before    判断未登录时去登录前操作，返回false则取消去登录，默认返回true
 * @param after     判断已登录时回调
 */
export const isLogin = (before, after) => {
  const haslogin = !!getCookie('P00001')
  if(haslogin) {
    after && after()
    return
  }

  if(isFunction(before)) {
    const stop = before()
    // 返回false可禁止检查登陆
    if(stop === false) {
      return
    }
  }

  LOGIN_TOAST = new Toast({
    type: 'loading',
    content: '正在登录...',
    time: 0
  })
  LOGIN_TOAST.show()

  goToLogin(() => {
    LOGIN_TOAST && LOGIN_TOAST.destroy()
  }, .6)
}

export const iqiyiShare = (options, operate = 'register') => {
  if(isIqiyi()) {
    if(operate === 'register') {
      iqiyi.ready(() => {
        // 初始化分享数据（native右上角分享）
        iqiyi.onShare(options)
      })
    } else if(operate === 'share') {
      // js发起分享接口
      iqiyi.share(options)
    }
  }
}

export const iqiyiMenu = (
  options = {},
  operate = 'set'
) => {
  if(isIqiyi()) {
    if(operate === 'set') {
      iqiyi.ready(() => {
        // 显示右上角菜单
        iqiyi.showMenu(options)
      })
    } else if(operate === 'hide') {
      // 隐藏右上角菜单
      iqiyi.hideMenu({
        force: true // 是否强制隐藏(同时隐藏所有 native 设置的菜单)
      })
    }
  }
}

export const iqiyiInit = (success, fail) => {
  iqiyi.ready(() => {
    iqiyi.init(({result, data}) => {
      if(result === 0) {
        fail && fail('获取页面初始化数据失败')
      } else {
        success && success(data)
      }
    })
  })
}

/**
 * 初始化iqiyi sdk
 * @param onIqiyi 指定是否只在爱奇艺客户端初始化
 * @returns {Promise<any>}
 */
export const iqiyiInitAsync = ({onIqiyi = true} = {}) => {
  return new Promise((resolve, reject) => {
    if(onIqiyi && !isIqiyi()) {
      return resolve({})
    }

    iqiyi.ready(() => {
      iqiyi.init(({result, data}) => {
        if(result === 0) {
          reject(new Error('获取页面初始化数据失败'))
        } else {
          resolve(data)
        }
      })
    })
  })
}
