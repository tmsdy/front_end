/**
 * Created by liuzhimeng.
 * @date 2018/10/29
 * @description
 */

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableHighlight} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {BG_COLOR_PRIMARY, BG_GRADIENT_END, BG_GRADIENT_START, BORDER_COLOR_PRIMARY_LIGHT, TEXT_COLOR_DISABLED, TEXT_COLOR_PRIMARY} from '../constants/baseStyles'
import {TOUCH_COLORFUL_MASK, TOUCH_LIGHT_MASK, TOUCH_NONE} from '../constants/touchableStyle'

export default class CommonButton extends PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf(['default', 'pure', 'gradient']),
    text: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,

    width: PropTypes.number,
    pureColor: PropTypes.string,
    containerStyle: PropTypes.object,
    buttonWrapperStyle: PropTypes.object,
    // buttonStyle: PropTypes.object,
  }

  static defaultProps = {
    mode: 'default',
    text: '',
    disabled: false,
    onPress: global.NOOP,
  }

  render() {
    const {
      mode,
      disabled,
      onPress,
      width,
      containerStyle,
    } = this.props

    let _wrapperStyle = styles.defaultWrapper
    let buttonState = TOUCH_LIGHT_MASK
    let buttonPress = onPress

    if(mode === 'pure') {
      _wrapperStyle = styles.buttonWrapper
      buttonState = TOUCH_COLORFUL_MASK
    }
    if(mode === 'gradient') {
      _wrapperStyle = styles.gradientWrapper
      buttonState = TOUCH_COLORFUL_MASK
    }
    if(disabled) {
      _wrapperStyle = styles.buttonDisabled
      buttonState = TOUCH_NONE
      buttonPress = null
    }

    const widthStyle = width ? {width} : {}
    const containerStyles = StyleSheet.flatten([styles.container, widthStyle, containerStyle])

    return (
      <TouchableHighlight {...buttonState} style={containerStyles} onPress={buttonPress}>
        {this._renderContent(_wrapperStyle)}
      </TouchableHighlight>
    )
  }

  _renderContent(_wrapperStyle) {
    const {mode, pureColor} = this.props
    const pureColorStyle = pureColor ? {backgroundColor: pureColor} : {}
    const buttonWrapperStyle = [_wrapperStyle, pureColorStyle, this.props.buttonWrapperStyle]

    if(mode === 'gradient') {
      return (
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          colors={[BG_GRADIENT_START, BG_GRADIENT_END]}
          style={buttonWrapperStyle}
        >
          {this._getTextChildren()}
        </LinearGradient>
      )
    }

    return (
      <View style={buttonWrapperStyle}>
        {this._getTextChildren()}
      </View>
    )
  }

  _getTextChildren = () => {
    const {mode, text, children} = this.props
    const buttonStyle = [styles.buttonText, this.props.buttonStyle]

    if(children) {
      return children
    }

    if(['pure', 'gradient'].includes(mode)) {
      return <Text style={buttonStyle}>{text}</Text>
    }

    return <Text style={[styles.buttonText, styles.defaultText, this.props.buttonStyle]}>{text}</Text>
  }

}

const CONTAINER_HEIGHT = 40
const CONTAINER_BORDER_RADIUS = CONTAINER_HEIGHT * 1.25
const styles = BaseStyleSheet.create({
  container: {
    width: 280,
    height: CONTAINER_HEIGHT,
    borderRadius: 50,
    overflow: 'hidden',
  },
  defaultWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CONTAINER_BORDER_RADIUS,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR_PRIMARY_LIGHT,
    backgroundColor: 'transparent',
  },
  gradientWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_COLOR_PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: TEXT_COLOR_DISABLED,
  },
  buttonText: {
    height: CONTAINER_HEIGHT,
    lineHeight: CONTAINER_HEIGHT,
    textAlign: 'center',
    borderRadius: CONTAINER_BORDER_RADIUS,
    color: '#ffffff',
    fontSize: 16,
  },
  defaultText: {
    height: CONTAINER_HEIGHT - 3,
    lineHeight: CONTAINER_HEIGHT - 3,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: CONTAINER_BORDER_RADIUS,
    color: TEXT_COLOR_PRIMARY,
  },
})
