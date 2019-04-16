/**
 * Created by liuzhimeng.
 * @date 2018-12-05
 * @description
 */
import {generateComponentId} from "Common/utils"
import {renderAwardRecordItem} from "../templates/pageFragments"

const AnimatedShow = (($) => {
  /**
   * Constants
   */
  const NAME = 'animatedShow'
  const VERSION = '1.0.0-beta'

  class AnimatedShow {
    constructor(options) {
      this._id_ = generateComponentId()
      this.options = {
        id: '',
        height: '1.2rem', // 列表子项高度
        triggerCount: 5, // 触发滑出效果的列表数
        time: 400, // 动画时长
        list: [], // 列表
        ...options
      }

      this.startSlideOut = this.options.triggerCount <= this.options.list.length

      this.init()
    }

    getComponent() {
      return $(`*[data-animated-show-id="${this._id_}"]`)
    }

    getComponentChild(selector, key = null) {
      if (key !== null) {
        return $(`*[data-animated-show-id="${this._id_}"] *[data-animated-show-name="${selector}"][key="${key}"]`)
      }
      return $(`*[data-animated-show-id="${this._id_}"] *[data-animated-show-name="${selector}"]`)
    }

    render() {
      const {id, list} = this.options

      let children = `<ul data-animated-show-id="${this._id_}">`
      for (let i = 0; i < list.length; i++) {
        children += this.renderItem({
          item: list[i],
          index: i,
        })
      }
      children += '</ul>'

      $(`#${id}`).html(children)
    }

    renderItem({item, index, className = '', style = '', wrapperStyle = ''}) {
      return (`
          <li data-animated-show-name="child" key="${index}" class="animated-show ${className}" style="${style}">
              <div data-animated-show-name="wrapper" class="animated-show-wrapper" style="${wrapperStyle}">${renderAwardRecordItem(item, index)}</div>
          </li>
      `)
    }

    init(list = []) {
      if (list.length) {
        this.options.list = list
      }
      this.render()
    }

    update(list) {
      const {triggerCount} = this.options
      this.options.list = list.slice(0, triggerCount)

      this.getComponentChild('child').each(function(index) {
        $(this).attr('key', index + 1)
      })
      this.getComponent()
        .prepend(this.renderItem({
          item: list[0],
          index: 0,
          className: 'animated-none',
          wrapperStyle: 'opacity: 0; transform: translateY(-50%)'
        }))

      return this
    }

    slideIn(element) {
      const {height, time} = this.options
      const children = element.children()
      element.css({display: 'block'}).animate({height}, time, 'linear')
      children.animate({translateY: 0, opacity: 1}, time, 'linear')
    }

    slideOut(element) {
      const {time} = this.options
      const children = element.children()
      element.animate({height: 0}, time, 'linear', function () {
        element.remove()
      })
      children.animate({opacity: 0, translateY: '100%'}, time, 'linear')
    }

    play() {
      const firstItem = this.getComponentChild('child', 0)
      this.slideIn(firstItem)

      const {list, triggerCount} = this.options
      if (list.length >= triggerCount) {
        if (this.startSlideOut) {
          const lastItem = this.getComponentChild('child', list.length)
          this.slideOut(lastItem)
        } else {
          this.startSlideOut = true
        }
      }

      return this
    }
  }

  return AnimatedShow
})(Zepto)

export default AnimatedShow
