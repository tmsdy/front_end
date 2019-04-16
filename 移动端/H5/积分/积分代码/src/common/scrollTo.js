/**
 * Created by liuzhimeng.
 * @date 2018/9/10
 * @description ScrollTo 滚动到指定位置插件
 */
import {
  toNumber,
  isFunction,
  isZepto,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "Common/utils"

const ScrollTo = (($) => {
  /**
   * Constants
   */
  const NAME = 'scrollTo'
  const VERSION = '1.0.0-beta'

  const KEY_NAME = location.pathname.slice(1).toUpperCase().split('/').join('_')
  const LOCAL_DEFAULT_KEY = `SCROLL_TO_${KEY_NAME}`

  class ScrollTo {
    constructor(options = {}) {
      this.options = {
        scroller: '',                        // 滚动区域DOM ID
        updater: '',                         // 触发更新scroll值的事件DOM（目前只支持click事件）
        delay: 300,                          // 延迟滚动时间，单位为 ms（主要用于兼容iOS返回上一页时页面刷新两次问题）
        ...options,
      }

      this._onScroll()
      this._onLoaded()
      this._onUnload()
    }

    loadedTime = 0
    isScroll = false
    nextStop = false

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    _getDOM(name) {
      return isZepto(name) ? name : $(name)
    }

    _onScroll() {
      const {
        updater,
        scroller,
      } = this.options
      const $updater = this._getDOM(updater)
      $updater.on('click', () => {
        this.isScroll = true
        const top = this._getDOM(scroller).scrollTop()
        setLocalStorage(LOCAL_DEFAULT_KEY, top)
      })
    }

    _onLoaded() {
      $(document).ready(() => {
        this.loadedTime = Date.now()
      })
    }

    _onUnload() {
      $(window).on('unload', () => {
        const newTime = Date.now()
        const outDelay = newTime - this.loadedTime > this.options.delay

        if (outDelay && !this.isScroll) {
          removeLocalStorage(LOCAL_DEFAULT_KEY)
        }
      })
    }

    /**
     * 触发滚动
     * @param fn 触发回调，返回 false 则不执行滚动操作
     * @param nextStop 下一次是否停止触发滚动，值为false时，一般用于分页列表中保持仅首次页面初始化时触发滚动
     */
    trigger(fn, nextStop = true) {
      if (this.nextStop) return
      this.nextStop = nextStop

      const {scroller} = this.options
      const top = toNumber(getLocalStorage(LOCAL_DEFAULT_KEY))
      if (top) {
        const toScroll = isFunction(fn) ? fn(top) : true
        if (toScroll === false) return
        this._getDOM(scroller).scrollTop(top)
      }
    }

    /**
     * 获取当前滚动区域scrollTop值
     * @returns {*}
     */
    getTop() {
      return toNumber(getLocalStorage(LOCAL_DEFAULT_KEY))
    }
  }

  return ScrollTo
})(Zepto)

export default ScrollTo
