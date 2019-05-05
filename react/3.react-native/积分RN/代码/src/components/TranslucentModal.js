/**
 * Created by liuzhimeng.
 * @date 2019-01-04
 * @description 通用半透明背景弹窗
 */

import React, {PureComponent} from 'react'
import {Animated, Easing, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import CommonButton from './CommonButton'
import {getCDNUrl} from '../constants/configs'

export default class TranslucentModal extends PureComponent {
  static propTypes = {
    title: PropTypes.node, // 标题（可以为空）
    desc: PropTypes.string, // 描述（可以为空）
    animatedName: PropTypes.string, // 动画名称
    isTouch: PropTypes.bool, // 弹窗上是否可以点击关闭
    autoClose: PropTypes.bool, // 是否3s后自动关闭
    showButton: PropTypes.bool, // 是否显示底部按钮
    buttonText: PropTypes.string, // 按钮文字
    onPress: PropTypes.func, // 按钮事件
    hide: PropTypes.func, // 关闭事件
    FooterComponent: PropTypes.node, // 关闭事件

    titleWrapperStyle: PropTypes.object, // 标题样式
    boxStyle: PropTypes.object,
    animatedStyle: PropTypes.object, // 背景光圈样式
    contentStyle: PropTypes.object, // 背景光圈上方内容区域样式
    buttonWrapperStyle: PropTypes.object, // 按钮样式
    buttonStyle: PropTypes.object, // 按钮文字样式
  }

  static defaultProps = {
    title: '',
    desc: '',
    animatedName: 'bee_beam',
    isTouch: true,
    autoClose: true,
    showButton: true,
    buttonText: '',
    onPress: () => null,
    hide: () => null,

    FooterComponent: null,

    titleWrapperStyle: {},
    boxStyle: {},
    animatedStyle: {},
    contentStyle: {},
    buttonWrapperStyle: {},
    buttonStyle: {
      width: 120,
    },
  }

  constructor(props) {
    super(props)
    this.animRotate = new Animated.Value(0)
  }

  componentDidMount() {
    this.showActive()
    if(this.props.autoClose) {
      setTimeout(() => {
        if(this.animRotate) {
          this.animRotate.stopAnimation()
          this.props.hide()
        }
      }, 8000)
    }
  }

  componentWillUnmount() {
    this.animRotate.stopAnimation()
    this.animRotate = null
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.titleWrapper, this.props.titleWrapperStyle]}>
          {!!this.props.title && <Text style={styles.title}>{this.props.title}</Text>}
          {!!this.props.desc && <Text style={styles.desc}>{this.props.desc}</Text>}
        </View>
        <View style={[styles.animatedBox, this.props.boxStyle]}>
          <Animated.Image
            style={[styles.animatedBg, this.props.animatedStyle, {
              transform: [{
                rotate: this.animRotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              }],
            }]}
            source={{uri: getCDNUrl(this.props.animatedName)}}
          />
          <ModalWrapperComponent
            isTouch={this.props.isTouch}
            activeOpacity={1}
            onPress={() => this.props.hide()}
            style={[styles.animatedWrapper, this.props.contentStyle]}
          >
            {this.props.children}
          </ModalWrapperComponent>
        </View>
        {this.props.showButton && (
          <View style={[styles.buttonWrapper, this.props.buttonWrapperStyle]}>
            <CommonButton
              mode="default"
              text={this.props.buttonText}
              onPress={this.props.onPress}
              containerStyle={this.props.buttonStyle}
              buttonWrapperStyle={{borderColor: '#ffffff'}}
              buttonStyle={{color: '#ffffff'}}
            />
          </View>
        )}
        {this.props.FooterComponent}
      </View>
    )
  }

  showActive = () => {
    if(!this.animRotate) {
      return
    }
    this.animRotate.setValue(0)
    Animated.timing(this.animRotate, {
      toValue: 360,
      duration: 6400,
      easing: Easing.linear,
    })
      .start(() => {
        this.showActive()
      }) // 循环播放光束旋转的动画
  }
}

function ModalWrapperComponent({isTouch, children, style, ...left}) {
  return isTouch
    ? <TouchableOpacity style={style} {...left}>{children}</TouchableOpacity>
    : <View style={style}>{children}</View>
}

// 弹窗标题
export function CommonTitle({list, start, end, separate}) {
  const listLength = list.length
  return (
    <React.Fragment>
      {start}
      {list.map(({name, count = 1}, index) => {
        return (
          <React.Fragment key={name}>
            {name}
            <Text style={styles.strongText}> x{count}</Text>
            {(listLength === 1 || index === listLength - 1) ? '' : separate}
          </React.Fragment>
        )
      })}
      {end}
    </React.Fragment>
  )
}

CommonTitle.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    count: PropTypes.number,
  })),
  start: PropTypes.string,
  end: PropTypes.string,
  separate: PropTypes.string,
}
CommonTitle.defaultProps = {
  list: [],
  start: '获得',
  end: '',
  separate: '、',
}

const COLOR_PRAMIRY = '#FFE552'
const CONTAINER_WIDTH = 270
const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    width: DEVICE_WIDTH,
    paddingTop: 22,
    paddingBottom: 20,
  },
  titleWrapper: {
    position: 'absolute',
    top: 0,
    left: (DEVICE_WIDTH - CONTAINER_WIDTH) / 2,
    width: CONTAINER_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: COLOR_PRAMIRY,
  },
  desc: {
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#D7DEE0',
  },
  animatedBox: {
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH,
  },
  animatedWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH - 20,
  },
  animatedBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH,
  },
  buttonWrapper: {
    position: 'absolute',
    left: (DEVICE_WIDTH - CONTAINER_WIDTH) / 2,
    bottom: 0,
    alignItems: 'center',
    width: CONTAINER_WIDTH,
  },

  strongText: {
    height: 30,
    lineHeight: 30,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOR_PRAMIRY,
  },
})
