import {generateComponentId, isArray, isFunction, isNumber, isObject, isString, isZepto} from 'Common/utils'

/**
 * Dialog 模态框
 */
const Dialog = (($) => {
  /**
   * Constants
   */
  const NAME = 'Dialog'
  const VERSION = '1.0.0-beta'

  class Dialog {
    constructor(options = {}, confirm, cancel) {
      const name = options.name ? options.name : ''
      this._id_ = generateComponentId(name, 8)

      // 用于携带数据
      this.data = {
        ...options.data,
      }
      delete options.data

      this.options = {
        title: '标题',
        content: '内容',
        ...options,
      }
      this.confirm = confirm
      this.cancel = cancel

      this.init()
    }

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    init() {
      this._initDOM()
      return this
    }

    _initDOM() {
      let defaultConfirmText = '确定'
      let defaultCancelText = '取消'

      // 添加组件id
      const idAttr = this.options.hasOwnProperty('id')
        ? ` id=${this.options.id}`
        : ''

      // 添加组件class
      const className = this.options.hasOwnProperty('className')
        ? `dialog-component ${this.options.className}`
        : 'dialog-component'

      // 选择close icon 样式
      const closeClass = this.options.hasOwnProperty('closeClass')
        ? this.options.closeClass
        : 'dialog-close'

      const innerClass = this.options.hasOwnProperty('innerClass')
        ? this.options.innerClass
        : ''

      const modalClass = this.options.hasOwnProperty('modalClass')
        ? this.options.modalClass
        : ''
      // 添加组件style
      const styleObj = this.options.hasOwnProperty('styleObj')
        ? ` style=${this.options.styleObj}`
        : ''

      // 添加默认按钮文字
      if(this.options.hasOwnProperty('defaultBtnTextObj')) {
        const defaultBtnTextObj = this.options.defaultBtnTextObj
        if(defaultBtnTextObj.confirm) defaultConfirmText = defaultBtnTextObj.confirm
        if(defaultBtnTextObj.cancel) defaultConfirmText = defaultBtnTextObj.cancel
      }

      // 是否居中（header && footer）
      let tcHeader = ' tc', tcFooter = ' tc'
      if(this.options.hasOwnProperty('isCenterObj')) {
        const isCenterObj = this.options.isCenterObj
        if(isCenterObj.header === false) tcHeader = ''
        if(isCenterObj.footer === false) tcFooter = ''
      }

      // 生成弹框主体
      const dialogNode = (
        `<div data-dialog-id="${this._id_}" class="${className}"${idAttr}${styleObj}>
          <div data-dialog-name="modal" class="dialog-modal ${modalClass}">
            <div class="dialog-modal-inner ${innerClass}">
              <i data-dialog-name="dialog-close-icon" class="${closeClass}"></i>
              <div data-dialog-name="modal-header" class="modal-header${tcHeader}"></div>
              <div class="modal-body">
                <div data-dialog-name="body-inner" class="body-inner"></div>
              </div>
              <div data-dialog-name="modal-footer" class="modal-footer${tcHeader}">
                <div data-dialog-name="button-wrap" class="button-wrap${tcFooter}">
                  <span data-dialog-name="button-confirm" class="btn-primary">${defaultConfirmText}</span>
                  <span data-dialog-name="button-cancel" class="btn-default">${defaultCancelText}</span>
                </div>
              </div>
            </div>
          </div>
          <div data-dialog-name="mask" class="dialog-mask"></div>
        </div>`
      )
      $('body').append(dialogNode)

      // 添加标题
      const title = this._getHTML(this.options.title)
      this.getComponentChild('modal-header').html(title)

      // 添加内容
      this._setContent(this.options.content)

      // 移除头部
      if(this.options.removeHeader === true) {
        this._remmoveDOM('modal-header')
      }

      // 移除默认操作（关闭、确定、取消）
      if(this.options.hasOwnProperty('removeDefaultOptions')) {
        if(this.options.removeDefaultOptions === 'all') {
          this._remmoveDOM(['dialog-close-icon', 'button-confirm', 'button-cancel'])
        } else if(isArray(this.options.removeDefaultOptions)) {
          const keyMap = {
            close: 'dialog-close-icon',
            confirm: 'button-confirm',
            cancel: 'button-cancel',
          }
          this.options.removeDefaultOptions.forEach(k => {
            this._remmoveDOM(keyMap[k])
          })
        }
      }

      // 添加按钮（自动移除默认按钮）
      if(isArray(this.options.buttons)) {
        this._addButtons(this.options.buttons)
      }

      if(!this.options.buttons) {
        // 注册确定按钮事件（自定义事件）
        if(isFunction(this.confirm)) {
          this.getComponentChild('button-confirm').on('click', () => {
            const beforeConfirmStatus = isFunction(this.options.beforeConfirm)
              ? this.options.beforeConfirm()
              : true

            if(beforeConfirmStatus === false) {
              return
            }

            this.confirm()
          })
        }

        // 注册取消按钮事件
        if(isFunction(this.cancel)) {
          this.getComponentChild('button-cancel').click(() => {
            const beforeCancelStatus = isFunction(this.options.beforeCancel)
              ? this.options.beforeCancel()
              : true

            if(beforeCancelStatus === false) {
              return
            }

            this.cancel()
          })
        }
      }

      // 注销取消按钮的关闭事件
      if(this.options.offDefaultCancel !== false) {
        // 默认关闭事件
        this.getComponentChild('button-cancel').on('click', () => {
          this.close()
        })
        this.getComponentChild('dialog-close-icon').on('click', () => {
          this.close()
        })
      }

      // 点击遮罩层关闭事件
      if(this.options.offMaskClick !== false) {
        this.getComponentChild('mask').on('click', () => {
          this.close()
        })
      }

      return this
    }

    _getHTML(s) {
      return isZepto(s)
        ? s
        : isString(s) && /^[\.\#].*$/.test(s)
          ? $(s)
          : s
    }

    _remmoveDOM(name) {
      if(isArray(name)) {
        name.forEach(i => this.getComponentChild(i).remove())
      } else if(name) {
        this.getComponentChild(name).remove()
      }
    }

    _setContent(content) {
      const $content = this._getHTML(content)
      this.getComponentChild('body-inner')
        .html($content)
        .children()
        .css('display', 'block')
    }

    _buttonRender(item, key) {
      let $button = this.getComponentChild('button', key)

      // 添加按钮内容
      if(item.text) {
        $button.text(item.text)
      }

      // 添加按钮id
      if(item.id) {
        $button.attr('id', item.id)
      }

      // 添加自定义按钮样式
      if(item.className) {
        $button.removeAttr('class').addClass(item.className)
      }

      // 添加自定义属性
      if(isObject(item.attrs)) {
        $button.attr(item.attrs)
      }

      // 注册按钮事件
      if(item.clickable === false) {
        $button.addClass('disabled')
        $button.off('click')
      } else {
        $button.removeClass('disabled')
        $button.on('click', () => {
          if(isFunction(item.onClick)) item.onClick(item, key, $button, this)
        })
      }
    }

    _addButtons(buttons) {
      const buttonWrapper = this.getComponentChild('button-wrap')
      const footer = this.getComponentChild('modal-footer')
      const style = buttons.length ? 'block' : 'none'
      footer.css('display', style)
      buttonWrapper.empty()
      for(let k = 0; k < buttons.length; k++) {
        buttonWrapper.append(
          `<span class="btn-primary" data-dialog-name="button" data-dialog-key="${k}"></span>`,
        )
        this._buttonRender(buttons[k], k)
      }
    }

    _show() {
      const $component = this.getComponent()
      $component.css('display', 'block')
      setTimeout(() => {
        $component.addClass('fade')
      }, 0)
    }

    _hide($component, cb) {
      $component.removeClass('fade')
      setTimeout(() => {
        $component.css('display', 'none')
        cb && cb()
      }, 200)
    }

    // 获取组件选择器
    getComponent() {
      return $(`*[data-dialog-id="${this._id_}"]`)
    }

    getComponentChild(selector, key = null) {
      let childSelector = `*[data-dialog-id="${this._id_}"] *[data-dialog-name="${selector}"]`
      if(isNumber(key)) {
        childSelector += `[data-dialog-key="${key}"]`
      }
      return $(childSelector)
    }

    //打开默认dialog
    open(type = 'default', afterOpen) {
      const {
        beforeOpen,
        afterOpen: optionsAfterOpen,
      } = this.options
      const beforeOpenStatus = isFunction(beforeOpen)
        ? beforeOpen()
        : true

      if(beforeOpenStatus === false) return

      //打开提示窗
      if(type === 'prompt') {
        this.getComponentChild('modal-footer').remove()
      }

      this._show()

      if(isFunction(afterOpen)) {
        afterOpen()
      } else if(isFunction(optionsAfterOpen)) {
        optionsAfterOpen()
      }

      return this
    }

    //打开提示窗
    openPrompt() {
      this.open('prompt')
      return this
    }

    // 隐藏dialog
    close(type = 'default', afterClose) {
      const $component = this.getComponent()
      const {
        beforeClose,
        afterClose: optionsAfterClose,
      } = this.options
      const beforeCloseStatus = isFunction(beforeClose)
        ? beforeClose()
        : true

      if(beforeCloseStatus === false) return

      if(type === 'default') {         // 隐藏dialog
        this._hide($component)
      } else if(type === 'destroy') {  // 移除dialog
        this._hide($component, () => {
          $component.remove()
        })
      }

      if(isFunction(afterClose)) {
        setTimeout(() => {
          afterClose()
        }, 200)
      } else if(isFunction(optionsAfterClose)) {
        setTimeout(() => {
          optionsAfterClose()
        }, 200)
      }

      return this
    }

    // 移除dialog
    destroy() {
      this.close('destroy')
      return this
    }

    prompt(type = 'success', text, callback) {
      this.getComponentChild('body-inner').children().css({'display': 'none'})
      this.getComponentChild('body-inner').append(`
        <div data-dialog-name="dialog-prompt" class="dialog-prompt">
          <p class="prompt-text"><i class="status-icon opt-${type} mr10"></i>${text}</p>
        </div>
      `)
      if(this.getComponentChild('modal-footer').length) {
        this.handleFooter('hide')
      }
      setTimeout(() => {
        this.close('default', () => {
          this.getComponentChild('dialog-prompt').remove()
          this.getComponentChild('body-inner').children().css({'display': 'block'})
          if(this.getComponentChild('modal-footer').length) {
            this.handleFooter('show')
          }
          isFunction(callback) && callback()
        })
      }, 2000)
    }

    // 默认成功提示
    success(text = '操作成功!', callback) {
      this.prompt('success', text, callback)
      return this
    }

    // 默认失败提示
    fail(text = '操作失败!', callback) {
      this.prompt('fail', text, callback)
      return this
    }

    // 操作弹框底部是否显示，默认为隐藏
    handleFooter(option = 'hide') {
      const status = option === 'show' ? 'block' : 'none'
      this.getComponentChild('modal-footer').css('display', status)
    }

    getData() {
      return this.data
    }

    updateData(data) {
      this.data = {
        ...this.data,
        ...data,
      }

      return this
    }

    updateOptions({buttons, content}) {
      if(isArray(buttons)) {
        this._addButtons(buttons)
      }
      if(content) {
        this._setContent(content)
      }
      return this
    }

    bindOpen({selector = null, type = 'default'} = {}) {
      if(!selector) return
      const $selector = this._getHTML(selector)
      $selector.on('click', () => {
        this.open(type)
      })
      return this
    }
  }

  return Dialog
})(Zepto)

export default Dialog
