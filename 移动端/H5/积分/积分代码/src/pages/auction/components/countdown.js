import {fixRequestAnimationFrame, fixCancelAnimationFrame} from 'Common/utils'

// 兼容RequestAnimFrame
fixRequestAnimationFrame()
fixCancelAnimationFrame()
/**
 * Countdown 倒计时 (基于countdown.js http://countdownjs.org)
 */
const CountdownComponent = (($, countdown) => {
  /**
   * Constants
   */
  const NAME = 'CountdownComponent'
  const VERSION = '1.0.0-beta'

  class CountdownComponent {
    constructor(options) {
      this.options = {
        id: null, // 初始化指定 data-countdown-id
        startTime: Date.now(), // 起始时间戳
        endTime: 0, // 结束时间戳
        clockBack: null,  // @param {stopped} (stopped: 倒计时是否结束)
        precision: 'second', // 倒计时精确度 second 秒，millisecond 毫秒
        ...options,
      }

      // 组件内数据
      this.state = {
        theFirst: '00',
        theSecond: '00',
        theThird: '00',
        secondSymbol: ':',
      }

      this._timespan = null
      this._requestID = null
      this._seconds = 0
      this._fixTimespan = true

      this.init()
      window.onunload = () => this.destroy()
    }

    static getName() {
      return NAME
    }

    static getVersion() {
      return VERSION
    }

    // 获取外层DOM
    getComponent() {
      return $(`*[data-countdown-id=${this.options.id}]`)
    }

    // 获取组件内DOM节点
    getComponentChild(key) {
      return this.getComponent().children(`*[data-countdown=${key}]`)
    }

    // 更新DOM
    _setState(newState = {}) {
      const state = this.state
      for (let k in newState) {
        if (newState[k] !== state[k]) {
          this.getComponentChild(k).html(newState[k])
        }
      }
      this.state = {
        ...state,
        ...newState
      }
    }

    // 初始化倒计时布局
    _initBody() {
      this.getComponent()
        .removeClass('disabled')
        .html(`
            <span data-countdown="theFirst" class="count-number">00</span>
            <span data-countdown="firstSymbol" class="count-symbol">:</span>
            <span data-countdown="theSecond" class="count-number">00</span>
            <span data-countdown="secondSymbol" class="count-symbol">:</span>
            <span data-countdown="theThird" class="count-number">00</span>
        `)
    }

    _getTimeString({hours, minutes, seconds, milliseconds}) {
      const {precision} = this.options
      if (precision === 'millisecond') {
        return [minutes, seconds, milliseconds, '.']
      }
      return [hours, minutes, seconds, ':']
    }

    _fixTime(time) {
      return time < 10 ? `0${time}` : time
    }

    // 倒计时
    _run(startTime = Date.now()) {
      const _timespan = countdown(startTime, this.options.endTime, countdown.ALL, 6, 0)
      const {value, hours, minutes, seconds, milliseconds} = _timespan
      const _fix = this._fixTimespan && value <= 0

      if (seconds !== this._seconds || _fix) {
        // console.log('1 seconds !== this._seconds', seconds !== this._seconds)
        // console.log('2 seconds', seconds, 'this._seconds', this._seconds)
        // console.log('3 _fix', _fix, 'this._fixTimespan', this._fixTimespan, 'value <= 0', value < 200)
        if (_fix) {
          this._fixTimespan = false
        }
        this._seconds = seconds
        this.options.clockBack({stopped: _fix}, this)
      }

      const [theFirst, theSecond, theThird, secondSymbol] = this._getTimeString({
        hours: this._fixTime(hours),
        minutes: this._fixTime(minutes),
        seconds: this._fixTime(seconds),
        milliseconds: this._fixTime(Math.floor(milliseconds / 10))
      })

      this._setState({theFirst, theSecond, theThird, secondSymbol})
      this._timespan = _timespan
      this._requestID = requestAnimationFrame(() => this._run())
    }

    init() {
      const {startTime, endTime} = this.options
      this._initBody()
      if (endTime >= startTime) {
        this._requestID = requestAnimationFrame(() => this._run(this.options.startTime))
      } else {
        this.getComponent().addClass('disabled')
      }
    }

    update(endTime, precision = this.options.precision) {
      // console.log('update', endTime)
      this.options.endTime = endTime
      this.options.precision = precision
      this._fixTimespan = true
      this.getComponent().removeClass('disabled')
    }

    destroy() {
      this.clearTimeController()
      this.clearTimespan()
    }

    // 清除定时器
    clearTimeController() {
      cancelAnimationFrame(this._requestID)
      this._requestID = null
    }

    // 清除倒计时
    clearTimespan() {
      clearInterval(this._timespan)
      this._timespan = null
    }

    stopClock(reset = true, destroy = true) {
      this.getComponent().addClass('disabled')
      if (reset) {
        this._setState({
          theFirst: '00',
          theSecond: '00',
          theThird: '00',
          secondSymbol: ':',
        })
      }
      if (destroy) {
        this.destroy()
      }
    }
  }

  return CountdownComponent

})(Zepto, countdown)

export default CountdownComponent
