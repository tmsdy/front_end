import {generateComponentId, isZepto,} from "Common/utils"

/**
 * Progress 进度条
 */
const Progress = (($) => {
  /**
   * Constants
   */
  const NAME = 'progress'
  const VERSION = '1.0.0'

  class Progress {
    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    constructor(options = {}) {
      this._id_ = generateComponentId(null, 8)
      this.options = {
        container: 'body',
        hasCount: 0,
        total: 0,
        tips: '',
        showContent: false,
        position: 'top',
        showCount: true,
        description: '',
        style: 'primary', // default、primary
        ...options
      }

      this.init()
    }

    _getComponent() {
      return $(`*[data-progress-id="${this._id_}"]`)
    }

    _getComponentChild(selector) {
      return $(`*[data-progress-id="${this._id_}"] [data-progress-name="${selector}"]`)
    }

    _getContainer() {
      const {container} = this.options
      return isZepto(container) ? container : $(container)
    }

    _render() {
      const $container = this._getContainer()
      const {contentTop, contentBottom} = this._getContent()
      const style = this.options.style === 'default' ? ' default-state' : ''

      const progresser = (
        `<div data-progress-id="${this._id_}" class="progress-wrapper">
          ${contentTop}
          <div data-progress-name="proTotal" class="progress-total">
            <div data-progress-name="proHas" class="progress-has${style}"></div>
          </div>
          ${contentBottom}
        </div>`
      )

      if($container) {
        $container.append(progresser)
      }

      setTimeout(() => {
        this._setProgress()
      }, 300)
    }

    _getContent() {
      const {hasCount, total, tips, position, showContent, showCount, description} = this.options
      if(!showContent) {
        return {contentTop: '', contentBottom: ''}
      }

      let countTemp = ''
      if(showCount) {
        countTemp = `<span data-progress-name="hasCount" class="has-count">${hasCount}</span>/<span data-progress-name="totalCount">${total}次</span>`
      } else if(content) {
        countTemp = description
      }
      const content = (`
         <div data-progress-name="info" class="progress-info">
            <div class="progress-count">${countTemp}</div>
            <div data-progress-name="tips" class="progress-tips">${tips}</div>
         </div>
      `)
      const contentTop = position === 'top' ? content : ''
      const contentBottom = position === 'bottom' ? content : ''

      return {contentTop, contentBottom}
    }

    _setProgress(hasCount = this.options.hasCount, total = this.options.total) {
      const percentage = hasCount * 100 / total
      const progressNode = this._getComponentChild('proHas')
      progressNode.css('width', percentage + '%')
      this._getComponentChild('hasCount').text(hasCount)
      this._getComponentChild('totalCount').text(`${total}次`)
    }

    init() {
      this._render()
    }

    updateOptions(options) {
      const {
        hasCount = this.options.hasCount,
        total = this.options.total,
      } = options

      this.options = {
        ...this.options,
        hasCount,
        total,
      }

      if(options.hasOwnProperty('tips')) {
        this._getComponentChild('tips').html(options.tips)
        this.options.tips = options.tips
      }

      if(options.hasOwnProperty('hasCount') || options.hasOwnProperty('total')) {
        this._setProgress()
      }
    }

    destroy() {
      this._getComponent().remove()
    }
  }

  return Progress
})(Zepto)

export default Progress
