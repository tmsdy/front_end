/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 半屏弹窗组件
 */

import React, {PureComponent} from 'react'
import {Animated, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'

import {View, Text} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, isLikeX} from '@iqiyi/rn-utils'

import ReduxUtil from '../../common/ReduxUtil'
import WebImage from '../WebImage'
import CommonButton from '../CommonButton'
import TipBubbleSingleton from '../TipBubbleSingleton'

// modal高度
const DIFF_HEIGHT = isLikeX() ? 24 : 0
const MODAL_HEIGHT = 325
const MODAL_TOP_HEIGHT = 33

export default class HalfScreenModal extends PureComponent {
  static propTypes = {
    showHeader: PropTypes.bool,
    headerIcon: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    description: PropTypes.string,
    showButton: PropTypes.bool,
    buttonOptions: PropTypes.shape(CommonButton.propTypes),
    onButtonPress: PropTypes.func,

    renderTitleComponent: PropTypes.node,
    renderDescriptionComponent: PropTypes.node,

    size: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
    animContainerStyle: PropTypes.object,
  }

  static defaultProps = {
    showHeader: false,
    headerIcon: '',
    title: '',
    count: null,
    description: '',
    showButton: false,
    buttonOptions: {},

    size: {
      height: MODAL_HEIGHT + MODAL_TOP_HEIGHT,
    },
    animContainerStyle: {},
  }

  constructor(props) {
    super(props)

    this.refTipBubbleSingleton = ReduxUtil.createRef()
    this.refPagetrunref = ReduxUtil.createRef()
    this.animHalfScreen = new Animated.Value(0)
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animHalfScreen.stopAnimation()
    this.animHalfScreen = null
  }

  render() {
    const {size, count, description, showButton, buttonOptions, onButtonPress, animContainerStyle} = this.props
    const countStyle = count === 0 ? {color: '#999999'} : {}

    const deviceSize = {
      ...size,
      height: size.height + DIFF_HEIGHT
    }

    return (
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[styles.animContainer, deviceSize, animContainerStyle, {
            transform: [{
              translateY: this.animHalfScreen.interpolate({
                inputRange: [0, 1],
                outputRange: [deviceSize.height, 0],
              }),
            }],
            opacity: this.animHalfScreen.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }]}
        >
          {/* 主要内容 */}
          <View style={[styles.mainWrapper, {paddingBottom: DIFF_HEIGHT}]}>
            {!this.props.renderTitleComponent
              ? (
                <View style={styles.titleWrapper}>
                  <Text style={styles.titleName}>{this.props.title}</Text>
                  {count !== null && (
                    <View style={styles.titleCountWrapper}>
                      <Text style={[styles.titleCountLeft, countStyle]}>x</Text>
                      <Text style={[styles.titleCount, countStyle]}>{count}</Text>
                    </View>
                  )}
                </View>
              )
              : this.props.renderTitleComponent
            }
            {(!this.props.renderDescriptionComponent && !!description)
              ? <Text style={styles.descText}>{description}</Text>
              : this.props.renderDescriptionComponent
            }
            {showButton && (
              <View style={{alignItems: 'center', marginBottom: 25}}>
                <CommonButton
                  mode="pure"
                  width={130}
                  onPress={onButtonPress}
                  {...buttonOptions}
                />
              </View>
            )}
            {this.props.children}
          </View>
          {/* 头部Icon */}
          {this.props.showHeader && (
            <View style={styles.headerWrapper}>
              <View style={styles.headerIconWrapper}>
                <WebImage name={this.props.headerIcon} style={styles.headerIcon} />
              </View>
            </View>
          )}
          {/* 关闭按钮 */}
          <TouchableOpacity style={styles.closeWrapper} activeOpacity={1} onPress={this.onClose}>
            <WebImage name="flower/icon-close-modal" style={styles.closeIcon}/>
          </TouchableOpacity>
        </Animated.View>
        <TipBubbleSingleton ref={this.refTipBubbleSingleton} />
      </View>
    )
  }

  play = () => {
    if(this.animHalfScreen) {
      Animated.timing(this.animHalfScreen, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
        .start()
    }
  }

  onClose = () => {
    if(this.animHalfScreen) {
      Animated.timing(this.animHalfScreen, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            this.props.hideConfirmModal()
          }
        })
    } else {
      this.props.hideConfirmModal()
    }
  }

  showTipBubble = async (config) => {
    const ref = await this.refTipBubbleSingleton.getInstance()
    return ref.show(config)
  }

  hideTipBubble = async (target) => {
    const ref = await this.refTipBubbleSingleton.getInstance()
    return ref.hide(target)
  }

}

const HEADER_HEIGHT = 66
const HEADER_IMAGE_HEIGHT = 66
const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  animContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: DEVICE_WIDTH,
    height: MODAL_HEIGHT + MODAL_TOP_HEIGHT,
    paddingTop: HEADER_HEIGHT / 2,
  },

  closeWrapper: {
    position: 'absolute',
    top: HEADER_HEIGHT / 2 + 12,
    right: 12,
  },
  closeIcon: {
    width: 25,
    height: 25,
  },

  headerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    width: '100%',
    height: HEADER_HEIGHT,
  },
  headerIconWrapper: {
    width: HEADER_IMAGE_HEIGHT,
    height: HEADER_IMAGE_HEIGHT,
    borderRadius: HEADER_IMAGE_HEIGHT / 2,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  headerIcon: {
    width: HEADER_IMAGE_HEIGHT,
    height: HEADER_IMAGE_HEIGHT,
  },

  mainWrapper: {
    width: '100%',
    height: '100%',
    paddingTop: HEADER_HEIGHT / 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#ffffff',
  },

  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 22.5,
    marginTop: 2,
    marginBottom: 5,
  },
  titleName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
  },
  titleCountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  titleCountLeft: {
    fontSize: 14,
    color: '#FF8A1F',
  },
  titleCount: {
    height: '100%',
    fontSize: 18,
    color: '#FF8A1F'
  },

  descText: {
    width: '100%',
    height: 16.5,
    lineHeight: 16.5,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 12,
    fontSize: 12,
    color: '#666666',
  }
})
