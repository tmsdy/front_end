import {generateComponentId, isFunction} from 'Common/utils'
import jQuery from 'jquery'
import './index.less'

/**
 * toast 提示框
 */
const Toast = (($) => {
  /**
   * Constants
   */
  const NAME = 'toast'
  const VERSION = '1.0.0'

  class Toast {
    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    constructor(options = {}) {
      this._id_ = generateComponentId(null, 8)
      this.options = {
        id: '',
        type: 'text', // text（纯文本）, loading（加载中），success（成功），fail（失败）
        content: '',
        time: 2, // time = 0 一直展示
        pageLoading: false,
        isMutex: false, // 只允许同时显示一条toast消息
        ...options,
      }
    }

    _pageLoading = {
      wrapper: 'body',
      height: '100%',
      iconName: 'loading-small',
      content: '内容即将呈现…',
      maskColor: '#ffffff',
    }

    statusMap = {
      loading: '加载中...',
      success: '加载完成',
      fail: '加载失败',
    }

    init() {
      this._render()
    }

    getComponent() {
      return $(`*[data-toast-id="${this._id_}"]`)
    }

    getComponentChild(selector) {
      return $(`*[data-toast-id="${this._id_}"] *[data-toast-name="${selector}"]`)
    }

    _pageLoadingTemplate({iconName, content, maskColor, height}) {
      return (
        `<div data-toast-id="${this._id_}" class="toast-page-loading" style="height: ${height}">
            <div data-toast-name="box" class="toast-box">
                <i class="${iconName} toast-icon"></i>
                <span class="toast-content">${content}</span>
            </div>
            <div class="toast-mask" style="background-color: ${maskColor}"></div>
        </div>`
      )
    }

    _toastTemplate({idAtrr, stateClass, state, content}) {
      return (
        `<div data-toast-id="${this._id_}"${idAtrr} class="toast-wrapper">
            <div data-toast-name="box" class="toast-box${stateClass}">
                ${state}
                <span class="toast-content">${content}</span>
            </div>
        </div>`
      )
    }

    _render() {
      let {id, type, time, content, pageLoading, isMutex} = this.options
      let state = ''
      let stateClass = ''
      let toaster = ''
      const idAtrr = id ? ` id="${id}"` : ''

      if(pageLoading) {
        if(pageLoading === true) {
          pageLoading = this._pageLoading
        } else {
          pageLoading = {
            ...this._pageLoading,
            ...pageLoading,
          }
        }

        const $wrapper = $(pageLoading.wrapper)
        toaster = this._pageLoadingTemplate(pageLoading)
        $wrapper
          .css('position', 'relative')
          .append(toaster)

      } else {

        // 设置状态框
        if(type !== 'text') {
          state = `<i class="toast-icon-${type}"></i>`
          stateClass = ' toast-state'
          if(type === 'loading') {
            stateClass += ' loading-wrapper'
          }
          if(!content) {
            content = this.statusMap[type]
          }
        }

        toaster = this._toastTemplate({
          idAtrr, stateClass, state, content,
        })

        const component = this.getComponent()
        if(component && component.length) {
          component.remove()
        }

        if(isMutex) {
          $('*[data-toast-id]').remove()
        }

        $('body').append(toaster)
      }

      this.getComponent().css('display', 'block')
      setTimeout(() => {
        this.getComponentChild('box').css({'opacity': 1})
      }, 0)

      if(time !== 0) {
        setTimeout(() => {
          this.destroy()
        }, time * 1000)
      }
    }

    show() {
      const {
        content,
        pageLoading,
        beforeOpen,
      } = this.options

      if(isFunction(beforeOpen)) {
        const isStop = beforeOpen(content)
        if(isStop === false) {
          return
        }
      }

      const component = this.getComponent()
      if(component && component.length) {
        if(pageLoading) {
          const wrapper = pageLoading.wrapper || this._pageLoading.wrapper
          $(wrapper).css('position', 'relative')
        }
        component.css('display', 'block')
      } else {
        this._render()
      }

      return this
    }

    hide() {
      const {
        pageLoading,
      } = this.options

      this.getComponent().css('display', 'none')

      if(pageLoading) {
        const wrapper = pageLoading.wrapper || this._pageLoading.wrapper
        $(wrapper).css('position', '')
      }

      if(isFunction(this.options.afterClose)) {
        this.options.afterClose(this.options.content)
      }

      return this
    }

    destroy() {
      const {
        pageLoading,
      } = this.options

      this.getComponent().remove()

      if(pageLoading) {
        const wrapper = pageLoading.wrapper || this._pageLoading.wrapper
        $(wrapper).css('position', '')
      }

      if(isFunction(this.options.afterClose)) {
        this.options.afterClose(this.options.content)
      }
    }
  }

  /**
   * Zepto plugin
   */
  $.extend($.fn, {
    [NAME]: options => new Toast(options).show(),
  })
  $.fn[NAME].Constructor = Toast

  return Toast
})(jQuery)

export default Toast
