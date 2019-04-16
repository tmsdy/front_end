/**
 * Carousel 轮播
 */
const Carousel = (($) => {

  /**
   * Constants
   */
  const NAME = 'carousel'
  const VERSION = '1.0.0-beta'

  class Carousel {
    constructor(options) {
      this._options = {
        stopped: false,
        width: 0,
      }
      this._timeController = null
      this.options = {
        id: null, // 必填，指定 data-carousel-id
        bodyData: [],
        loop: true, // 循环轮播
        ...options
      }
      this.init()
    }

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    init() {
      this._initBody()
      this.roll()
    }

    _wrapperNode() {
      return $(`*[data-carousel-id=${this.options.id}]`)
    }

    _elementBody() {
      return this._wrapperNode().children()
    }

    _listRender(data, isFirstRender = true) {
      const getItem = (image, name) => `<li class="buyer-item"><img class="item-left" src="${image}" />${name}</li>`
      const getItems = () => data.map(i => getItem(i.avatar, i.nickname)).join('')

      if (isFirstRender) {
        const $list = '<ul class="buyer-lists">' + getItems() + '</ul>'
        this._wrapperNode().html($list)
      } else {
        let $list = ''
        const width = this._elementBody().width()
        const left = this._elementBody().offset().left
        const documentWidth = $(document).width()
        // 增加占位节点
        if (width + left < documentWidth) {
          $list = `<li class="buyer-item-placeholder" style="width: ${documentWidth - left - width}px;"></li>`
        }
        $list += getItems()
        this._elementBody().append($list)
      }
    }

    _initBody() {
      const {bodyData} = this.options
      this._listRender(bodyData)

      const $body = this._elementBody()
      $body.css({
        position: 'absolute',
        top: 0,
        left: '100%'
      })
    }

    _timeout($body) {
      this._timeController = window.setTimeout(() => {
        let left = $body.offset().left - 4
        const width = $body.width()
        if (left < 0 && width + left < 0) {
          // 是否循环滚动
          if (!!this.options.loop) {
            left = '100%'
          } else {
            this.endCarousel()
            return
          }
        } else {
          left += 'px'
        }
        $body.css('left', left)

        // 停止轮播
        if (this._options.stopped) {
          this.endCarousel()
          return
        } else {
          this._timeout($body)
        }
      }, 1000 / 60)
    }

    roll() {
      const $body = this._elementBody()
      if ($body.children().length) {
        this._options.stopped = false
        this._timeout($body)
        return
      }
      this._options.stopped = true
    }

    // 添加列表
    addToList(lists) {
      this._listRender(lists, false)
      if (this._options.stopped) {
        this.roll()
      }
    }

    endCarousel() {
      this._options.stopped = true
      cancelAnimationFrame(this._timeController)
      clearTimeout(this._timeController)
      this._timeController = null
    }
  }

  return Carousel

})(Zepto)

export default Carousel
