/**
 * Created by liuzhimeng.
 * @date 2018-12-10
 * @description 手势响应系统
 */
import React, {Component} from 'react'
import {Animated, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, isLikeX, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {TOUCH_NONE} from '../../../constants/touchableStyle'
import {sendClickPingback} from '../../../common/pingback'
import {GO_FLOWER_CLICK_CLICK, PARK_PAGE} from '../pingback'
import {NAV_BAR_ENUM} from '../../../constants/IntegralEnum'

export const withPanResponder = (WrappedComponent, {
  flowerHeight = 250, // 花儿页面初始高度
  zoom = 1.36, // 放大倍率
} = {}) => {

  const INIT_SCALE = 1 / zoom // 缩放比
  const FLOWER_SOIL_HEIGHT = 115 + (isLikeX() ? 130 : 93) // 花儿页面泥土高度
  const NAV_BAR_BG_SCROPE = flowerHeight - NAV_BAR_ENUM.HEIGHT
  // 下层花儿容器样式
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
    },
    bottomEnd: {
      id: 'bottomEnd',
      toValue: 1,
      duration: 500,
    },
    topEnd: {
      id: 'topEnd',
      toValue: -1,
      duration: 300,
    },
  }

  return class WithWrappedComponent extends Component {
    static propTypes = {
      handlePanResponderEnd: PropTypes.func,

      setScrollEnabled: PropTypes.func,
      responderChange: PropTypes.func,

      renderNavbarComponent: PropTypes.element,
    }

    static defaultProps = {
      handlePanResponderEnd: () => null,

      setScrollEnabled: () => null,
      responderChange: () => null,

      renderNavbarComponent: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        status: 'start',
        showZTop: true, // 是否显示乐园页面，当显示全部花儿页面时，隐藏乐园页面
        scrollEnabled: true,
        screenMode: 'start',
        screenHeight: DEVICE_HEIGHT,
      }

      this.isDisabled = false
      this.moveStatus = 'start' // 移动位置，顶部为topEnd，中间位置为in，起始位置为start，底部位置为end

      this.touchAnimated = new Animated.Value(0) // Y轴移动动画
      this.animNavbarBg = new Animated.Value(0)
      this.animNavbarBgValue = 0
    }

    render() {
      const {screenHeight} = this.state,
        flowerMoveTopHeight = (screenHeight - screenHeight / zoom) / 2 + (screenHeight - FLOWER_SOIL_HEIGHT) / zoom - flowerHeight; // 花儿页面上移高度
      return (
        <View style={[styles.container, this.props.style]} onLayout={this._onContainerLayout}>
          {this.state.showZTop && (
            <View style={styles.navBarWrapper}>
              <Animated.View
                style={[styles.navBarBackground, {
                  opacity: this.animNavbarBg.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
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
          )}
          <ScrollView
            style={{flex: 1}}
            scrollEnabled={this.state.scrollEnabled}
            contentContainerStyle={styles.scrollViewContainer}
            showsVerticalScrollIndicator={false}
            onScroll={this._onScroll}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
          >
            <View style={[styles.zDown, {height: this.state.screenHeight}]}>
              <Animated.View
                style={[Z_DOWN_STYLE, {
                  transform: [
                    {
                      translateY: this.touchAnimated.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [-flowerMoveTopHeight, -flowerMoveTopHeight, 0],
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
            <Animated.View style={[styles.zTop, {
              transform: [
                {
                  translateY: this.touchAnimated.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0, 0, screenHeight],
                  }),
                },
                {perspective: 1000},
              ],
            }]}
            >
              {/* 乐园页面覆盖花儿容器的透明遮罩层，用于点击自动显示完整花儿页面 */}
              <TouchableOpacity
                {...TOUCH_NONE}
                style={[{width: DEVICE_WIDTH, height: flowerHeight}]}
                onPress={() => this._onTopClick()}
              />
              <Animated.View
                style={{
                  opacity: this.touchAnimated.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 1, 0],
                  }),
                }}
              >
                <WrappedComponent
                  {...this.props}
                  ref={this.props.wrapperdRef}
                  screenStatus={this.state.status}
                  handlePanResponderChange={this.handlePanResponderChange}
                  screenMode={this.state.screenMode}
                  setAndroidScrollEnabled={this.setAndroidScrollEnabled}
                  disablePanResponder={this._disablePanResponder}
                />
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </View>
      )
    }

    setAndroidScrollEnabled = (scrollEnabled) => {
      this.setState({scrollEnabled})
    }

    _disablePanResponder = (value) => {
      this.isDisabled = value
    }

    _onScroll = ({nativeEvent: {contentOffset: {y}}}) => {
      if(y >= 0 && y <= NAV_BAR_BG_SCROPE) {
        const value = y / NAV_BAR_BG_SCROPE
        this.animNavbarBgValue = value
        this.animNavbarBg.setValue(value)
      }
    }

    _onMomentumScrollEnd = ({nativeEvent: {contentOffset: {y}}}) => {
      if(y <= 0 && this.animNavbarBgValue !== 0) {
        this.animNavbarBgValue = 0
        this.animNavbarBg.setValue(0)
      }
      if(y >= NAV_BAR_BG_SCROPE && this.animNavbarBgValue !== 1) {
        this.animNavbarBgValue = 1
        this.animNavbarBg.setValue(1)
      }
    }

    _onContainerLayout = ({nativeEvent}) => {
      let {height} = nativeEvent.layout;
      if(height !== DEVICE_HEIGHT) {
        this.setState({screenHeight: height});
      }
    }

    _onTopClick = () => {
      if(!this.isDisabled) {
        sendClickPingback(PARK_PAGE, '', GO_FLOWER_CLICK_CLICK)
        this.handlePanResponderChange('bottomEnd')
      }
    }

    // 手势移动中时，页面即时响应，其他情况执行Animated动画
    _handleMove = (status, toValue = 0, duration = 300, callback = () => null) => {
      Animated.timing(this.touchAnimated, {
        toValue,
        duration,
        useNativeDriver: true,
      })
        .start(() => {
          this.moveStatus = status
          callback()
        })
    }

    handlePanResponderChange = (status, afterMove) => {
      const statusMap = STATUS_MAP[status]
      if(statusMap) {
        const {toValue, duration} = statusMap
        const showZTop = status !== 'bottomEnd'
        this.setState({status})
        if(status === 'bottomEnd') {
          this.setState({scrollEnabled: showZTop}, () => {
            this._handleMove(status, toValue, duration, () => {
              this.setState({showZTop})
              afterMove && afterMove()
              this.props.responderChange(status)
            })
          })
        } else {
          this.setState({showZTop, scrollEnabled: showZTop}, () => {
            this._handleMove(status, toValue, duration, () => {
              afterMove && afterMove()
              this.props.responderChange(status)
            })
          })
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  navBarWrapper: {
    position: 'absolute',
    zIndex: 2,
    width: DEVICE_WIDTH,
    height: NAV_BAR_ENUM.HEIGHT,
  },
  navBarBackground: {
    position: 'absolute',
    zIndex: 0,
    width: DEVICE_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
  },
  navBar: {
    position: 'absolute',
    zIndex: 1,
  },
  scrollViewContainer: {
    width: DEVICE_WIDTH,
    minHeight: DEVICE_HEIGHT,
  },
  zDown: {
    position: 'absolute',
    zIndex: 1,
    width: DEVICE_WIDTH,
  },
  zTop: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
    width: DEVICE_WIDTH,
  },
})
