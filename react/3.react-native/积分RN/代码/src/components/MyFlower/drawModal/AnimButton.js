/**
 * Created by liuzhimeng.
 * @date 2019-03-14
 * @description 按钮
 */

import React, {PureComponent} from 'react'
import {Animated, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import WebImage, {AnimatedWebImage} from '../../WebImage'
import {DRAW_ENUM} from '../../../constants/IntegralEnum'
import {DRAW_CONFIG} from '../../../common/MyFlowerConfig'
import {askToGetDrawReward} from '../../../model/MyFlower'
import {showToast} from '../../../common/QYNativeBridge'

export default class AnimButton extends PureComponent {
  static propTypes = {
    mode: PropTypes.string, // DRAW_ENUM.MODE, 开奖模式，积分 or vip
    time: PropTypes.number, // 进行中状态持续时间
    getReward: PropTypes.func, // 开奖后中奖按钮回调
    updatePeriod: PropTypes.func, // 更新抽奖周期
  }

  static defaultProps = {
    mode: DRAW_ENUM.MODE.Score, // DRAW_ENUM.MODE, 开奖模式，积分 or vip
    time: 3, // 进行中状态持续时间
    getReward: global.NOOP, // 开奖后中奖按钮回调
    updatePeriod: global.NOOP, // 更新抽奖周期
  }

  constructor(props) {
    super(props)

    this.state = {
      period: DRAW_ENUM.PERIOD.Before, // before, in, after
      hideBg: false,
      stopActive: false,
    }

    this.BUTTON_MAP = DRAW_CONFIG[this.props.mode].theme.button

    this.animButton = new Animated.Value(0)

    this.lockButton = false // 动画执行期间锁定按钮操作
  }

  componentWillUnmount() {
    this.animButton.stopAnimation()
    this.animButton = null
  }

  render() {
    const {period, hideBg} = this.state
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.play}>
        {!hideBg && <WebImage style={styles.buttonBg} name="flower/button-bg-red"/>}
        {/* 抽奖按钮 */}
        <AnimatedWebImage
          name={this.BUTTON_MAP[period].name}
          style={[styles.buttonImage, {
            transform: [{
              translateY: this._getInterpolate(),
            }],
          }]}
        />
        {/* 获奖奖励按钮高亮状态 */}
        {!this.state.stopActive && period === DRAW_ENUM.PERIOD.After && (
          <AnimatedWebImage
            name={this.BUTTON_MAP.activate.name}
            style={[styles.buttonImage, {
              zIndex: 2,
              transform: [{
                translateY: this._getInterpolate(),
              }],
              opacity: this.animButton.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
            }]}
          />
        )}
      </TouchableOpacity>
    )
  }

  _getInterpolate = () => {
    return this.animButton.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 3, 0],
    })
  }

  play = async () => {
    if(this.lockButton === true) {
      return
    }

    // 开始抽奖
    if(this.state.period === DRAW_ENUM.PERIOD.Before) {
      this.props.onBeforePingback()

      this.lockButton = true

      const {id, confirmable} = this.props.drawResult
      // 根据confirmable判断是否需要调取领取奖励接口，第21天时不会调用，也无需调用
      if(confirmable) {
        // 开始抽奖时，领取奖励
        try {
          await askToGetDrawReward(id)
          this.props.onBeginning()
        } catch(e) {
          showToast('网络异常，请稍后再试')
          return
        }
      }

      this.props.updatePeriod(this.state.period)

      // 执行抽奖动画
      this._play(() => {
        // 进入 进行中 状态， 显示进行中按钮
        this.setState({hideBg: true, period: DRAW_ENUM.PERIOD.In}, () => {
          this.props.updatePeriod(this.state.period)
          // 保持进行中按钮xxx秒
          setTimeout(() => {
            this.setState({hideBg: false, period: DRAW_ENUM.PERIOD.After}, () => {
              this.props.updatePeriod(this.state.period)
              this.lockButton = false
              this._afterPlay()
            })
          }, this.props.time * 1000)
        })
      })
    }

    // 抽奖结束，获得奖励
    if(this.state.period === DRAW_ENUM.PERIOD.After) {
      this.lockButton = true
      this.animButton && this.animButton.stopAnimation()
      this.setState({stopActive: true})
      this.props.getReward(this.props.mode, this.state.period)
    }
  }

  // 开始抽奖动画
  _play = (callback) => {
    if(this.animButton) {
      Animated.timing(this.animButton, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            callback && callback()
          }
        })
    }
  }

  // 获得奖励动画
  _afterPlay = () => {
    if(this.animButton) {
      this.animButton.setValue(0)
      Animated.timing(this.animButton, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            this._afterPlay()
          }
        })
    }
  }

}

const IMAGE_HEIGHT = 33.5
const OFFSET_TOP = 3
const CONTAINER_HEIGHT = IMAGE_HEIGHT + OFFSET_TOP
const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 45,
    left: 56,
    width: 132,
    height: CONTAINER_HEIGHT,
  },
  buttonBg: {
    position: 'absolute',
    top: OFFSET_TOP,
    left: 0,
    zIndex: 0,
    width: 132,
    height: IMAGE_HEIGHT,
  },
  buttonImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: 132,
    height: IMAGE_HEIGHT,
  }
})
