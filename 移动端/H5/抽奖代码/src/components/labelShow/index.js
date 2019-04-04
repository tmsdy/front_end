import {generateComponentId} from "../../common/utils/common"
import jQuery from 'jquery'
import './index.less'
import { callbackify } from "util";

const LabelShow = (($) => {

  /**
   * Constants
   */
  const NAME = 'LabelShow'
  const VERSION = '1.0.0-beta'

  class LabelShow {
    constructor(options) {
      this._id_ = generateComponentId()
      this.options = {
        container: '',
        list: [],
        period: 1.5,
        spacing: .8,
        ...options
      }
      this.state = {
        currentKey: 0,
      }

      this.init()
      window.onunload = this.destroy()
    }

    timeController = null

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    init() {
      $(this.options.container).html(this.render())
      if (this.options.list.length) {
        this.play()
      }
    }

    render() {
      return (`
          <div data-label-show-id="${this._id_}" class="label-show-container">
             <ul data-label-show-name="wrapper" class="label-show-wrapper">
                 ${this._getListRender()}
             </ul>
          </div>
      `)
    }

    _getListRender(list = this.options.list) {
      let listTemplate = ''
      list.forEach((item, key) => {
        listTemplate += this._labelRender(item, key)
      })
      return listTemplate
    }

    _labelRender(item) {
      if (!item) return ''
      const isWin = item.isWin ? '<i class="icon-crown"></i>' : ''
      return (`
          <li data-label-show-name="item" class="label-show-item">
              <span class="user-name">${item.text}</span>
          </li>
      `)
    }

    getComponent() {
      return $(`*[data-label-show-id="${this._id_}"]`)
    }

    getComponentChild(selector, key = null) {
      if (key !== null) {
        return $(`*[data-label-show-id="${this._id_}"] *[data-label-show-name="${selector}"][key="${key}"]`)
      }
      return $(`*[data-label-show-id="${this._id_}"] *[data-label-show-name="${selector}"]`)
    }
/**
 * 
 * @param {Array} newList 添加需要展示的列表
 * @param {Boolean} autoPlay 是否一开始就自动开始
 * @param {Function} callback 滚动完的回调函数
 */
    addList(newList, autoPlay = true,callback) { 
      this.options.list = this.options.list.concat(newList)
      this.getComponentChild('wrapper').append(this._getListRender(newList))
      if (autoPlay) {
        this.play(callback)
      }
    }

    play(callback) {
      if (this.timeController) {
        return
      }
      this.timeController = setInterval(() => {
        const {list, spacing} = this.options
        const {currentKey} = this.state
        if (this.state.currentKey < list.length - 1) {
          const move = (currentKey + 1) * -spacing + 'rem'
          this.getComponentChild('wrapper').css({'transform': `translateY(${move})`})
          this.state.currentKey = currentKey + 1
        } else {
          this.destroy()
          callback && callback()
        }
      }, this.options.period * 1000)
    }

    destroy() {
      clearInterval(this.timeController)
      this.timeController = null
    }
  }

  return LabelShow

})(jQuery)

export default LabelShow
