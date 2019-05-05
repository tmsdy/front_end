/**
 * Created by liuzhimeng.
 * @date 2018/10/30
 * @description 环形进度条（改造自开源组件: https://github.com/JackPu/react-native-percentage-circle）
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {View} from '@iqiyi/rn-ui'
import PercentageCircleRN from './PercentageCircleRN'
import WebImage from './WebImage'

export default class extends Component {
  static propTypes = {
    color: PropTypes.string, // the color of border
    bgcolor: PropTypes.string, // the background color of the circle
    innerColor: PropTypes.string, // the color of the inside of the circle
    percent: PropTypes.number, // the percent you need
    radius: PropTypes.number, // how large the circle is
    borderWidth: PropTypes.number, // the width of percentage progress bar
    textStyle: PropTypes.object, // define the style of the text which in the circle

    type: PropTypes.oneOf(['pure', 'custom']), // 进度条样式类型，pure：纯色，custom：自定义（通过设置图片背景实现）
    bgImage: PropTypes.string, // 自定义进度条样式图片（传入指定宽度的圆环，宽度与 borderWidth值保持一致）
    containerStyle: PropTypes.object,
  }

  static defaultProps = {
    color: '#FF6600',
    bgcolor: '#F7F8FA',
    innerColor: '#ffffff',
    percent: 0,
    radius: 70,
    borderWidth: 5,
    textStyle: {
      fontWeight: 'bold',
      fontSize: 13,
      color: '#333333',
    },

    type: 'pure',
    bgImage: 'integralmedal/percentage_bg',
    containerStyle: {},
  }

  render() {
    const {
      type, bgImage, color, radius, bgcolor, percent, children, containerStyle, ...leftProps
    } = this.props
    const _percent = percent >= 100 ? 100 : percent
    const imageStyle = {
      width: radius,
      height: radius
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {type === 'pure' && (
          <View style={styles.container}>
            <PercentageCircleRN color={color} bgcolor={bgcolor} percent={percent} radius={radius / 2} {...leftProps}>
              {children}
            </PercentageCircleRN>
          </View>
        )}
        {type === 'custom' && (
          <WebImage name={bgImage} style={[styles.wrapper, imageStyle]}>
            <PercentageCircleRN color={color || '#F7F8FA'} bgcolor={bgcolor || 'transparent'} percent={100 - _percent} radius={radius / 2} {...leftProps}>
              {children}
            </PercentageCircleRN>
          </WebImage>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
