/**
 * Created by liuzhimeng.
 * @date 2018-12-10
 * @description 手势响应系统
 */
import React, {Component} from 'react'
import {Animated, PanResponder, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, isIOS, isLikeX, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
// import BaseConfirmModal from '../../BaseConfirmModal'
import {sendClickPingback} from '../../../common/pingback'
import {GO_FLOWER_CLICK_CLICK, GO_FLOWER_MOVE_CLICK, PARK_PAGE} from '../pingback'

const _height = isIOS ? 65 : 51
const NAV_BAR_HEIGHT = isLikeX() ? 95 : _height // 顶部导航栏高度

// 花儿页面初始高度
const FLOWER_INIT_HEIGHT = isLikeX() ? 300 : 250

export const withPanResponder = (WrappedComponent, {
  moveSpeed = 0.5, // 滑动手势跟随速度（底部[0, 1]区域）
  topMoveSpeed = 0.7, // 滑动手势跟随速度（顶部[-1, 0]区域）
  toTopValue = -0.3, // 自动吸顶临界值
  toEndValue = 0.2, // 自动置底临界值
  zoom = 1.36, // 放大倍率
} = {}) => {

  const PARK_HEIGHT = DEVICE_HEIGHT - FLOWER_INIT_HEIGHT // 乐园页面初始高度
  const INIT_SCALE = 1 / zoom // 缩放比
  const FLOWER_SOIL_HEIGHT = 115 + (isLikeX() ? 130 : 93) // 花儿页面泥土高度
  // 花儿页面上移高度
  const FLOWER_MOVE_TOP_HEIGHT = (DEVICE_HEIGHT - DEVICE_HEIGHT / zoom) / 2 + (DEVICE_HEIGHT - FLOWER_SOIL_HEIGHT) / zoom - FLOWER_INIT_HEIGHT
  // 计算后的乐园页面高度
  const CONTENT_HEIGHT = DEVICE_HEIGHT - PARK_HEIGHT - NAV_BAR_HEIGHT
  // 下层花儿容器样式

  // 关于长度的计算，向上取整，向下取整会出现覆盖不了全屏幕的问题
  const OFFSET_LEFT = Math.ceil(DEVICE_WIDTH * (zoom - 1) / 2)
  const Z_DOWN_STYLE = {
    flex: 1,
    width: Math.ceil(DEVICE_WIDTH * zoom),
    paddingLeft: OFFSET_LEFT,
    marginLeft: 0 - OFFSET_LEFT,
  }

  const STATUS_MAP = {
    start: {
      id: 'start',
      toValue: 0,
      duration: 300,
      parkTopOffsetY: FLOWER_INIT_HEIGHT,
      toTop: 'topEnd',
      toDown: 'bottomEnd',
    },
    bottomEnd: {
      id: 'bottomEnd',
      toValue: 1,
      duration: 500,
      parkTopOffsetY: DEVICE_HEIGHT,
      toTop: 'start',
      toDown: '',
    },
    topEnd: {
      id: 'topEnd',
      toValue: -1,
      duration: 200,
      parkTopOffsetY: NAV_BAR_HEIGHT,
      toTop: '',
      toDown: 'start',
    },
  }

  return class WithWrappedComponent extends Component {
    static propTypes = {
      handleStartShouldSetPanResponder: PropTypes.func,
      handleMoveShouldSetPanResponder: PropTypes.func,
      handlePanResponderMove: PropTypes.func,
      handlePanResponderEnd: PropTypes.func,

      setScrollEnabled: PropTypes.func,
      responderChange: PropTypes.func,

      renderNavbarComponent: PropTypes.element,
    }

    static defaultProps = {
      handleStartShouldSetPanResponder: global.NOOP,
      handleMoveShouldSetPanResponder: global.NOOP,
      handlePanResponderMove: global.NOOP,
      handlePanResponderEnd: global.NOOP,

      setScrollEnabled: global.NOOP,

      renderNavbarComponent: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        status: 'start',
        showZTop: true, // 是否显示乐园页面，当显示全部花儿页面时，通过减小zIndex隐藏乐园页面
      }

      this.isDisabled = false // 是否禁用手势
      this.scrollEnabled = false // 是否禁止内部ScrollView滚动
      this.moveStatus = 'start' // 移动位置，顶部为topEnd，中间位置为in，起始位置为start，底部位置为end
      this.pageY = 0 // 移动手势的纵坐标
      this.percentage = 0 // 移动时的数值百分比，顶部为-1，起始位置未0，底部为1
      this.isPlusVY = true // 记录上次移动方向
      this.scrollInnerOffsetTop = 0 // 内部ScrollView上滑距离
      this.parkTopOffsetY = FLOWER_INIT_HEIGHT // 乐园模块顶部纵坐标，用于判断滑动手势可触发范围，即只能在乐园模块上触发手势
      this.lockMoveCount = 0 // 用于上滑自动复位时锁定手势动画，0：正常手势；1：处于上滑自动复位动画中；2：上滑复位动画停止，自动重置为0

      this.touchAnimated = new Animated.Value(0) // Y轴移动动画

      this._panResponder = PanResponder.create({
        // return true: 防止子视图在触摸开始时成为响应器
        onStartShouldSetPanResponderCapture: this._handleStartShouldSetPanResponderCapture,
        // 是否在触摸开始时想成为响应器
        onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
        // return true: 防止子视图在移动开始时成为响应器
        onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture,
        // 是否在移动时想成为响应器
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        // 正在移动手势
        onPanResponderMove: this._handlePanResponderMove,
        // 结束移动，抬起手指
        onPanResponderRelease: this._handlePanResponderEnd,
        // 响应器已经从该视图抽离
        onPanResponderTerminate: this._handlePanResponderTerminate,
        // 其他视图想成为响应器，视图应该释放应答吗？return true：允许释放
        onPanResponderTerminationRequest: () => false,
      })
    }

    render() {
      return (
        <View
          style={StyleSheet.flatten([styles.container, this.props.style])}
          {...this._panResponder.panHandlers}
        >
          <View style={styles.zDown}>
            <Animated.View
              style={[Z_DOWN_STYLE, {
                transform: [
                  {
                    translateY: this.touchAnimated.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-FLOWER_MOVE_TOP_HEIGHT, -FLOWER_MOVE_TOP_HEIGHT, 0],
                    }),
                  },
                  {
                    scale: this.touchAnimated.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [INIT_SCALE, INIT_SCALE, 1],
                    }),
                  },
                  {perspective: 1000},
                ],
              }]}
            >
              {this.props.children}
            </Animated.View>
          </View>
          <View style={[styles.zTop, {zIndex: this.state.showZTop ? 2 : 0}]}>
            <View style={styles.navBarWrapper}>
              <Animated.View
                style={[styles.navBarBackground, {
                  opacity: this.touchAnimated.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 0, 0],
                  }),
                }]}
              />
              <Animated.View
                style={[styles.navBar, {
                  opacity: this.touchAnimated.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 1, 0],
                  }),
                }]}
              >
                {this.props.renderNavbarComponent}
              </Animated.View>
            </View>
            {/* 乐园页面覆盖花儿容器的透明遮罩层，用于点击自动显示完整花儿页面 */}
            <TouchableOpacity activeOpacity={1} style={styles.topClick} onPress={() => this._onTopClick()}/>
            <Animated.View
              style={[styles.zTopContent, {
                transform: [
                  {
                    translateY: this.touchAnimated.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0, CONTENT_HEIGHT, DEVICE_HEIGHT],
                    }),
                  },
                  {perspective: 1000},
                ],
                opacity: this.touchAnimated.interpolate({
                  inputRange: [-1, 0, 0.5, 1],
                  outputRange: [1, 1, 1, 0],
                }),
              }]}
            >
              <WrappedComponent
                {...this.props}
                ref={this.props.wrapperdRef}
                screenStatus={this.state.status}
                updateOffsetTop={this._saveScrollInnerOffsetTop}
                handlePanResponderChange={this.handlePanResponderChange}
                disablePanResponder={this._disablePanResponder}
              />
            </Animated.View>
          </View>
        </View>
      )
    }

    _isDisabledPanResponder = () => {
      // console.log(this.isDisabled, BaseConfirmModal.current.visible)
      return this.isDisabled
    }

    _disablePanResponder = (value) => {
      this.isDisabled = value
    }

    // 根据速度正负属性判断移动方向
    _getMoveDirection = (vy) => {
      if(vy > 0) {
        this.isPlusVY = true
        return 'toDown'
      }
      if(vy < 0) {
        this.isPlusVY = false
        return 'toTop'
      }
      if(vy === 0) {
        return this.isPlusVY ? 'toDown' : 'toTop'
      }
    }

    // 是否为有效手势
    _isValidPanResponder = (pageY, {dx, dy, vx, vy, numberActiveTouches}) => {
      // 单只触控，方向和速度都偏向于Y轴，才认定为拖曳过程
      const singleTouch = numberActiveTouches === 1 && Math.abs(dy) > Math.abs(dx) && Math.abs(vy) > Math.abs(vx) + 0.1
      const toTop = this._getMoveDirection(vy) === 'toTop'
      const _moveStatus = this.moveStatus
      const validMove = ['start', 'in'].includes(_moveStatus) // 从初始点或中间位置移动可以向上下移动
        || (_moveStatus === 'topEnd' && !toTop) // 从顶部只能向下移动
        || (_moveStatus === 'bottomEnd' && toTop) // 从底部只能向上移动
      const isTouchable = _moveStatus === 'bottomEnd'
        || (_moveStatus !== 'bottomEnd' && pageY >= this.parkTopOffsetY) // 可滑动区域为乐园模块区域

      return singleTouch && validMove && isTouchable
    }

    // 是否禁用手势，开启动画执行切换效果
    _isAnimatedMove = (vy) => {
      const _moveStatus = this.moveStatus
      const toTop = this._getMoveDirection(vy) === 'toTop'
      // 是否启用动画
      const result = (_moveStatus === 'bottomEnd' && toTop) // 底部上滑
        || (_moveStatus === 'start' && toTop) // 初始位置上滑
        || (_moveStatus === 'topEnd' && !toTop) // 顶部下滑

      if(result) {
        const statusMap = STATUS_MAP[_moveStatus]
        // 滑动后的目标位置
        const toMoveStatus = toTop ? statusMap.toTop : statusMap.toDown
        return {toMoveStatus, result}
      }
      return {toMoveStatus: '', result: false}
    }

    _handleResponderCapture = (pageY) => {
      // console.log('_handleResponderCapture')
      // 乐园模块处于非全屏模式时
      const isValidByStatus = this.moveStatus !== 'topEnd'
      // 点击处位于乐园模块区域
      const isTouchable = pageY >= this.parkTopOffsetY

      return isValidByStatus && isTouchable
    }

    _handleStartShouldSetPanResponderCapture = () => {
      // console.log('0, _handleStartShouldSetPanResponderCapture')
      // 不捕获点击事件的控制权
      return false
    }

    // 返回true 则触发 onPanResponderStart，并且不再询问 onMoveShouldSetPanResponder，因此要返回false
    // 原因是：控制权 = onStartShouldSetPanResponder => true || onMoveShouldSetPanResponder => true
    _handleStartShouldSetPanResponder = () => {
      // console.log('1. _handleStartShouldSetPanResponder')
      return false
    }

    // 只有在乐园模块上发生长按移动且处于非全屏模式时，才会捕获控制权
    _handleMoveShouldSetPanResponderCapture = ({nativeEvent: {pageY}}, gestureState) => {
      // console.log('2, _handleMoveShouldSetPanResponderCapture')
      if(this._isDisabledPanResponder()) {
        return false
      }

      if(this.scrollInnerOffsetTop > 0) {
        return false
      }

      const handleResult = this._handleResponderCapture(pageY)
      if(handleResult) {
        const shouldMove = this._isValidPanResponder(pageY, gestureState)
        this.pageY = pageY
        const result = handleResult && shouldMove
        return result
      }
      return false
    }

    _handleMoveShouldSetPanResponder = ({nativeEvent: {pageY}}, gestureState) => {
      // console.log('3. _handleMoveShouldSetPanResponder')
      if(this._isDisabledPanResponder()) {
        return false
      }

      if(this.scrollInnerOffsetTop > 0) {
        this._setScrollEnabled(true)
        return false
      }

      if(this._isValidPanResponder(pageY, gestureState)) {
        // console.log('2.1 move')
        this.pageY = pageY
        this.props.handleMoveShouldSetPanResponder()
        return true
      }
      return false
    }

    _handlePanResponderMove = ({nativeEvent: {pageY}}, {vy}) => {
      // console.log('4. _handlePanResponderMove')
      if(this.lockMoveCount === 0) {
        const {toMoveStatus, result} = this._isAnimatedMove(vy)
        if(result) {
          // console.log('3.1 reset')
          if(toMoveStatus === 'start') {
            this._setScrollEnabled(false)
          }
          this.lockMoveCount += 1
          this.setState({showZTop: true}, () => {
            setTimeout(() => {
              this.handlePanResponderChange(toMoveStatus, () => {
                this._checkLock(true)
                if(toMoveStatus !== 'start') {
                  this._setScrollEnabled(toMoveStatus === 'topEnd')
                }
              })
            }, 0)
          })
        } else {
          // console.log('3.2 move', pageY)
          this._move(pageY)
        }
      }
    }

    _handlePanResponderEnd = ({nativeEvent: {pageY}}) => {
      // console.log('5. _handlePanResponderEnd')
      this._moveEnd(pageY)
    }

    _handlePanResponderTerminate = ({nativeEvent: {pageY}}) => {
      // console.log('6. _handlePanResponderTerminate')
      this._moveEnd(pageY)
    }

    // 是否禁止手势响应
    _checkLock = (reset = false) => {
      // console.log('_checkLock', this.lockMoveCount)
      const currentLock = this.lockMoveCount
      if(currentLock === 2) {
        this.lockMoveCount = 0
      }
      if(!reset && currentLock === 1) {
        this.lockMoveCount = currentLock + 1
      }
      return currentLock
    }

    _move = (pageY) => {
      // console.log('_move', _vy)
      const per = this._calcPer(pageY)
      // 移动中
      this._handleMove('in', per)
    }

    _moveEnd = (pageY) => {
      const currentLock = this._checkLock()
      if(currentLock !== 0) {
        return
      }
      const per = this._calcPer(pageY)

      // console.log(dy, per)
      if(per <= toEndValue && per > toTopValue) { // 距离初始位置较近时，自动复位
        return this._handleMove('start', 0, 200, () => {
          this._setScrollEnabled(false)
          this.scrollInnerOffsetTop = 0
          this.props.responderChange('start')
        })
      }
      if(per > toEndValue) { // 距离底部较近时自动吸底
        return this._handleMove('bottomEnd', 1, 200, () => {
          sendClickPingback(PARK_PAGE, '', GO_FLOWER_MOVE_CLICK)
          this.setState({showZTop: false})
          this._setScrollEnabled(false)
          this.scrollInnerOffsetTop = 0
          this.props.responderChange('bottomEnd')
        })
      }
      if(per <= toTopValue) { // 距离顶部较近时，自动吸顶
        return this._handleMove('topEnd', -1, 200, () => {
          this._setScrollEnabled(true)
          this.scrollInnerOffsetTop = 0
          this.props.responderChange('topEnd')
        })
      }
      // 移动中
      return this._handleMove('in', per)
    }

    // 启用内部ScrollView滚动
    _setScrollEnabled = (value) => {
      // console.log('_setScrollEnabled', value, this.scrollEnabled)
      if(this.scrollEnabled !== value) {
        this.scrollEnabled = value
        this.props.setScrollEnabled(value)
      }
    }

    _saveScrollInnerOffsetTop = (top) => {
      // console.log('_saveScrollInnerOffsetTop', top)
      this.scrollInnerOffsetTop = top
    }


    // 控制移动百分比在 -1 到 1 之间
    _calcPer = (pageY = 0) => {
      const speed = this.percentage >= 0 ? moveSpeed : topMoveSpeed
      // console.log(this.percentage, speed)
      const _per = this.percentage + (((pageY - this.pageY) * speed) / PARK_HEIGHT)
      this.pageY = pageY
      if(_per > 1) return 1
      if(_per < -1) return -1
      return _per
    }

    _calcOffsetY = (status, toValue) => {
      if(status === 'in') {
        if(toValue < 0) {
          return NAV_BAR_HEIGHT + CONTENT_HEIGHT * (1 + toValue)
        }
        return NAV_BAR_HEIGHT + CONTENT_HEIGHT + (DEVICE_HEIGHT - CONTENT_HEIGHT) * toValue
      }
      return STATUS_MAP[status].parkTopOffsetY
    }

    // 手势移动中时，页面即时响应，其他情况执行Animated动画
    _handleMove = (status, toValue = 0, duration = 300, callback = () => null) => {
      if(status === 'in') { // 移动中
        this.moveStatus = status
        this.percentage = toValue
        this.parkTopOffsetY = this._calcOffsetY(status, toValue)
        // console.log('parkTopOffsetY', this.parkTopOffsetY)
        this.touchAnimated.setValue(toValue)
      } else { // start, bottomEnd, topEnd, 自动吸附至复位、底部、顶部，并更新状态
        Animated.timing(this.touchAnimated, {
          toValue,
          duration,
          useNativeDriver: true,
        })
          .start(() => {
            this.moveStatus = status
            this.percentage = toValue
            this.parkTopOffsetY = this._calcOffsetY(status, toValue)
            // console.log('parkTopOffsetY', this.parkTopOffsetY)
            callback()
          })
      }
    }

    _onTopClick = () => {
      if(!this.isDisabled) {
        sendClickPingback(PARK_PAGE, '', GO_FLOWER_CLICK_CLICK)
        this.handlePanResponderChange('bottomEnd')
      }
    }

    handlePanResponderChange = (status, afterMove) => {
      const statusMap = STATUS_MAP[status]
      if(statusMap) {
        const {toValue, duration} = statusMap
        const showZTop = status !== 'bottomEnd'
        this.setState({status})
        if(status === 'bottomEnd') {
          this._handleMove(status, toValue, duration, () => {
            this.setState({showZTop})
            afterMove && afterMove()
            this.props.responderChange(status)
          })
        } else {
          const callback = () => {
            this.props.responderChange(status)
            this._handleMove(status, toValue, duration, () => {
              afterMove && afterMove()
            })
          }
          if(!this.state.showZTop) {
            this.setState({showZTop}, callback)
          } else {
            callback()
          }
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    overflow: 'hidden',
  },
  zTop: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  zDown: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  navBarWrapper: {
    position: 'relative',
    zIndex: 3,
    width: DEVICE_WIDTH,
    height: NAV_BAR_HEIGHT,
  },
  navBarBackground: {
    position: 'absolute',
    zIndex: 0,
    width: DEVICE_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: '#ffffff',
  },
  navBar: {
    position: 'absolute',
    zIndex: 1,
  },
  topClick: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: DEVICE_WIDTH,
    height: FLOWER_INIT_HEIGHT,
  },
  zTopContent: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
})
