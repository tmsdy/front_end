/**
 * Created by liuzhimeng.
 * @date 2018/10/17
 * @description 添加动画（飞入，放大缩小，淡入淡出）
 */

import React, {Component} from 'react'
import {Animated, Easing} from 'react-native'
import PropTypes from 'prop-types'
import {isOwnEmptyObj} from '../../common/util'

export const withAnimation = (WrappedComponent, options = {}) => {
  return class WithWrappedComponent extends Component {
    static propTypes = {
      play: PropTypes.bool,          // 是否播放动画（用于手动操作）
      animatedType: PropTypes.array, // 动画类型：fly 飞入；scale 放大缩小；opacity 淡入淡出
      duration: PropTypes.number,    // 持续时间
      delay: PropTypes.number,       // 延迟时间
      immediate: PropTypes.bool,     // 是否立即播放

      flyStart: PropTypes.object,    // 起始坐标
      flyEnd: PropTypes.object,      // 终点坐标
      flyInterpolate: PropTypes.object, // 自定义动画帧

      scaleStart: PropTypes.object,   // 起始大小
      scaleEnd: PropTypes.object,     // 终止大小
      scaleInterpolate: PropTypes.object,

      opacityStart: PropTypes.number, // 起始透明度
      opacityEnd: PropTypes.number,   // 终止透明度
      opacityInterpolate: PropTypes.object,
    }

    static defaultProps = {
      play: false,
      animatedType: [],
      duration: 1,
      delay: 0,
      immediate: true,

      flyStart: {x: 0, y: 0},
      flyEnd: {x: 0, y: 0},
      flyInterpolate: {},

      scaleStart: {x: 0, y: 0},
      scaleEnd: {x: 1, y: 1},
      scaleInterpolate: {},

      opacityStart: 0,
      opacityEnd: 1,
      opacityInterpolate: {},
    }

    constructor(props) {
      super(props)

      const {animatedType} = this.props

      this.state = {
        isUpdater: false,
        play: this.props.play,
        openFly: animatedType.includes('fly'),
        openScale: animatedType.includes('scale'),
        openOpacity: animatedType.includes('opacity'),
        flyPosition: new Animated.Value(0),
        scaleSize: new Animated.Value(0),
        opacity: new Animated.Value(0),
      }
    }

    timeouter = null

    componentDidMount() {
      // 是否立即播放动画
      if (this.props.immediate) {
        // 延迟播放
        this.timeouter = setTimeout(() => this.startAnimated(), this.props.delay * 1000)
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.play !== prevState.play) {
        return {
          play: nextProps.play,
          isUpdater: true,
        }
      }
      return {
        isUpdater: false
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.isUpdater && prevState.play) {
        this.startAnimated()
      }
    }

    componentWillUnmount() {
      clearTimeout(this.timeouter)
      this.timeouter = null
    }

    render() {
      const {
        play, animatedType, duration, delay, immediate,
        flyStart, flyEnd, flyInterpolate,
        scaleStart, scaleEnd, scaleInterpolate,
        opacityStart, opacityEnd, opacityInterpolate,
        ...left,
      } = this.props
      return !!animatedType.length
        ? (
          <Animated.View style={this._getAnimatedStyles()}>
            <WrappedComponent {...left}/>
          </Animated.View>
        )
        : <WrappedComponent {...left}/>
    }

    // 获取动画样式
    _getAnimatedStyles() {
      let fly = {}
      let scale = {}
      let opacity = {}
      // 飞入飞出样式
      if (this.state.openFly) {
        const flyInterpolate = k => this._getInterpolate(
          'flyPosition', 'flyStart', 'flyEnd', 'flyInterpolate', k
        )
        fly = {
          position: 'absolute',
          left: flyInterpolate('x'),
          top: flyInterpolate('y'),
        }
      }
      // 放大缩小样式
      if (this.state.openScale) {
        const scaleInterpolate = k => this._getInterpolate(
          'scaleSize', 'scaleStart', 'scaleEnd', 'scaleInterpolate', k
        )
        scale = {
          transform: [
            {scaleX: scaleInterpolate('x')},
            {scaleY: scaleInterpolate('y')},
          ]
        }
      }
      // 淡入淡出
      if (this.state.openOpacity) {
        opacity = {
          opacity: this._getInterpolate(
            'opacity', 'opacityStart', 'opacityEnd', 'opacityInterpolate', null
          )
        }
      }

      return {...fly, ...scale, ...opacity}
    }

    _getInterpolate = (stateName, propsStart, propsEnd, propsInterpolate, k) => {
      const start = k ? this.props[propsStart][k] : this.props[propsStart]
      const end = k ? this.props[propsEnd][k] : this.props[propsEnd]
      return this.state[stateName].interpolate(this._getInterpolateValue(propsInterpolate, k, [start, end]))
    }

    /**
     * 生成动画帧
     * @param name 自定义动画帧
     * @param k 坐标 x or y
     * @param outputRange 默认值
     * @returns {*}
     * @private
     */
    _getInterpolateValue(name, k, outputRange) {
      const interpolate = this.props[name]
      if (isOwnEmptyObj(interpolate)) {
        return {inputRange: [0, 1], outputRange}
      }
      if (k && interpolate.hasOwnProperty(k)) {
        return interpolate[k]
      }
      return interpolate
    }

    // 播放动画
    startAnimated() {
      const {openFly, openScale, openOpacity} = this.state
      let parallel = []

      if (openFly) {
        parallel.push((
          Animated.timing(this.state.flyPosition, {
            toValue: 1,
            duration: this.props.duration * 1000,
            easing: Easing.linear,
          })
        ))
      }

      if (openScale) {
        parallel.push((
          Animated.timing(this.state.scaleSize, {
            toValue: 1,
            duration: this.props.duration * 1000,
            easing: Easing.linear,
          })
        ))
      }

      if (openOpacity) {
        parallel.push((
          Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: this.props.duration * 1000,
            easing: Easing.linear,
          })
        ))
      }

      Animated.parallel(parallel).start()
    }
  }
}
