import {generateComponentId, isFunction, isObject, isString, isZepto,} from "Common/utils"

/**
 * switchMenu 切换菜单
 */
const SwitchMenu = (($) => {
  /**
   * Constants
   */
  const NAME = 'switchMenu'
  const VERSION = '1.0.0'

  class SwitchMenu {
    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    constructor(options = {}) {
      this._id_ = generateComponentId()
      this.options = {
        container: 'body', // 加载容器
        activeKey: 0, // 初始tab项的key（初始tab）
        disabledKey: null, // 禁止点击tab项的key
        list: [],
        // minScrollCount: null, // 产生横向滚动的最小列表条目数，默认不滚动
        horizontalScroll: false, // 是否产生横向滚动
        ...options,
      }

      this.init()
    }

    init() {
      this._render()
    }

    getComponent() {
      return $(`*[data-switch-menu-id="${this._id_}"]`)
    }

    getComponentChild(selector) {
      return $(`*[data-switch-menu-id="${this._id_}"] *[data-switch-menu-name="${selector}"]`)
    }

    _itemTemplate(i, k) {
      const {horizontalScroll, list} = this.options
      const length = list.length
      const id = i.hasOwnProperty('id') ? ` id="${i.id}"` : ''
      const className = i.className ? i.className : 'switch-menu-item'
      const active = i.active ? ' active' : ''
      const disabled = i.disabled ? ' disabled' : ''
      const cliabled = i.cliabled ? i.cliabled : !i.disabled

      const styleBase = horizontalScroll ? {} : {width: `${100 / length}%`}
      const styleObj = isObject(i.style) ? {...styleBase, ...i.style} : styleBase
      const style = this._joinToStyle(styleObj)

      return `
        <li 
            data-switch-menu-name="item" 
            data-key="${k}" 
            class="${className}${active}${disabled}"${id} 
            data-cliabled="${cliabled}"
            style="${style}"
        >
            <span class="switch-menu-text">${i.text}</span>
            <span class="switch-menu-line"></span>
        </li>
      `
    }

    _componentTemplate(list = []) {
      const {activeKey, disabledKey, horizontalScroll} = this.options
      let itemsTemp = ''
      list.forEach((i, k) => {
        i.active = k === activeKey
        i.disabled = k === disabledKey
        itemsTemp += this._itemTemplate(i, k)
      })

      const horizontal = horizontalScroll ? ' horizontal-scroll' : ''

      return (`
        <div data-switch-menu-id="${this._id_}" class="switch-menu">
            <div class="switch-menu-inner">
                <ul data-switch-menu-name="listWrapper" class="switch-menu-box${horizontal}">${itemsTemp}</ul>
            </div>
        </div>
      `)
    }

    _getContainer() {
      const {container} = this.options
      return isZepto(container) ? container : $(container)
    }

    _listRender(list) {
      const $container = this._getContainer()
      $container.html(this._componentTemplate(list))
      const $wrapper = this.getComponentChild('listWrapper')
      const that = this

      $wrapper.on('click', '[data-switch-menu-name="item"][data-cliabled="true"]', function() {
        const {onClick} = that.options
        const $this = $(this)
        const key = parseFloat($this.attr('data-key'))

        $wrapper.children().removeClass('active')
        $this.addClass('active')
        list = list.map((i, k) => ({
          ...i,
          active: k === key
        }))
        isFunction(onClick) && onClick(list[key], key, $this, that)
      })
    }

    _joinToStyle(...args) {
      if(isObject(args[0])) {
        return Object.keys(args[0]).map(k => `${k}: ${args[0][k]};`).join('')
      } else if(isString(args[0]) && isString(args[1])) {
        return `${args[0]}: ${args[1]};`
      }
      return ''
    }

    _render() {
      this._listRender(this.options.list)
    }

    triggerClick(key) {
      $(`[data-switch-menu-name="item"][data-cliabled="true"][data-key="${key}"]`).click()
    }
  }

  return SwitchMenu
})(Zepto)

export default SwitchMenu
