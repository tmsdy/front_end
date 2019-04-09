import {transferTimeTo} from 'Common/utils'

/**
 * Countdown 倒计时
 */
const Countdown = (($) => {
  /**
   * Constants
   */
  const NAME = 'Countdown'
  const VERSION = '1.0.0-beta'

  class Countdown {
    constructor(options) {
      this.options = {
        id: null, // 初始化指定 data-countdown-id
        startTime: 0, // 起始时间戳
        endTime: 0, // 结束时间戳
        clockBack: null,  // @param {stopped} (stopped: 倒计时是否结束)
        precision: 'second', // 倒计时精确度 second 秒，millisecond 毫秒
        ...options,
      }

      // 组件内数据
      this.state = {
        hour: null,
        minute: null,
        second: null,
      }

      this._timeController = null

      this.init()
    }

    static get name() {
      return NAME
    }

    static get version() {
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
      this.state = {...state, ...newState}
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

    // 倒计时
    _countdownTime() {
      const {clockBack, precision, startTime, endTime} = this.options

      let period = endTime - startTime
      if (period < 0 || precision === 'second' && period < 1000) {
        period = 0
      }
      this.setTime(period, precision, false)

      const intervalTime = precision === 'millisecond' ? 10 : 1000
      let timeCount = Math.ceil((period % 1000) / 10)

      this._timeController = setInterval(() => {
        timeCount++
        const nowTime = Date.now()
        period = endTime - nowTime
        if (period < 10 || precision === 'second' && period < 1000) {
          period = 0
        }
        const stopped = period === 0
        if (stopped) {
          this.clearTimeController()
        }

        const isUpdate = stopped || timeCount >= 100
        let milli = true

        if ((precision === 'millisecond' && isUpdate) || precision === 'second') {
          console.log(timeCount, period)
          clockBack && clockBack({stopped}, this)
        }
        if (isUpdate) {
          timeCount = 0
          milli = false
        }

        this.setTime(period, precision, milli)
      }, intervalTime)
    }

    init() {
      this._initBody()
      this._countdownTime()
    }

    // 更新显示时间
    setTime(period, precision = 'second', milli = false) {
      if (precision === 'millisecond') {
        if (milli) {
          const secTime = Math.floor(period / 1000)
          const milliTime = Math.floor((period - secTime * 1000) / 10)
          const fixMilliTime = milliTime < 10 ? '0' + milliTime : milliTime
          this._setState({theThird: fixMilliTime})
        } else {
          const minute = Math.floor(period / (60 * 1000))
          const leftMinutePeriod = period - minute * 60 * 1000
          const second = Math.floor(leftMinutePeriod / 1000)
          const leftSecondPeriod = leftMinutePeriod - second * 1000
          const milliSecond = Math.floor(leftSecondPeriod / 10)

          const fixMinute = minute < 10 ? '0' + minute : minute
          const fixSecond = second < 10 ? '0' + second : second
          const fixMilliSecond = milliSecond < 10 ? '0' + milliSecond : milliSecond
          this._setState({
            theFirst: fixMinute,
            theSecond: fixSecond,
            theThird: fixMilliSecond,
            secondSymbol: '.',
          })
        }
      } else {
        period = period < 1000 ? 0 : period
        const hour = Math.floor(period / (1000 * 3600))
        const fixHour = hour < 10 ? '0' + hour : hour
        const dateStr = transferTimeTo('datetime', period)
        const timeData = dateStr.split(' ')[1].split(':')
        this._setState({
          theFirst: fixHour,
          theSecond: timeData[1],
          theThird: timeData[2],
          secondSymbol: ':',
        })
      }
    }

    // 清除定时器
    clearTimeController() {
      clearInterval(this._timeController)
      this._timeController = null
    }

    update(startTime, endTime, {precision = this.options.precision} = {}) {
      this.options.startTime = Number(startTime)
      this.options.endTime = Number(endTime)
      this.options.precision = precision
      this.getComponent().removeClass('disabled')
      this._countdownTime()
    }

    stopClock(reset = true, destroy = true) {
      this.getComponent().addClass('disabled')
      if (reset) {
        this._setState({
          hour: '00',
          minute: '00',
          second: '00',
        })
      }
      if (destroy) {
        this.destroy()
      }
    }

    destroy() {
      this.clearTimeController()
    }
  }

  return Countdown

})(Zepto)

export default Countdown
