/**
 * Created by liuzhimeng.
 * @date 2018/8/22
 * @description NewMessage 新消息提示插件
 */

import {getUserId, isFunction, isString, isZepto, setLocalStorage} from 'Common/utils'

const NewMessage = (($) => {
  /**
   * Constants
   */
  const NAME = 'newMessage'
  const VERSION = '1.0.0'

  const USER_ID = getUserId()
  const KEY_NAME = location.pathname.split('/').join('_').toUpperCase()
  const LOCAL_DEFAULT_KEY = `NEW_MESSAGE_${KEY_NAME}_${USER_ID}`

  class NewMessage {
    constructor(opts = {}) {
      const _opts = isString(opts) ? {messager: opts} : opts

      this.options = {
        messager: '', // 提示消息DOM，支持zepto实例，如：#msg1, .msg2, $('#msg3')
        ..._opts
      }
    }

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    _getDOM(name) {
      return isZepto(name) ? name : $(name)
    }

    _changeDOMState(operate = 'show') {
      const $newMessage = this._getDOM(this.options.messager)

      if(operate === 'hide') {
        $newMessage.hide()
      } else {
        $newMessage.show()
      }
    }

    init(newCode) {
      const $newMessage = this._getDOM(this.options.messager)

      $newMessage.attr('data-code', newCode)
      this._changeDOMState('show')
    }

    setMsgState(opts = null, fn) {
      if(opts) {
        const $newMessage = this._getDOM(this.options.messager)
        if(opts.operate === 'show') {
          if(opts.code) {
            $newMessage.attr('data-code', opts.code)
          }
        } else {
          const code = $newMessage.attr('data-code')
          if(code) {
            setLocalStorage(LOCAL_DEFAULT_KEY, code)
          }
        }

        this._changeDOMState(opts.operate)
      }
      return isFunction(fn) ? fn() : null
    }
  }

  return NewMessage
})(Zepto)

export default NewMessage
