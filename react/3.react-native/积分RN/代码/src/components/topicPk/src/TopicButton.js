/**
 * Created by liuzhimeng.
 * @date 2018/9/14
 * @description 话题PK按钮 / 勋章v2页弹窗按钮
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {
  TEXT_COLOR_PRIMARY,
  TEXT_COLOR_DISABLED,
  BORDER_COLOR_PRIMARY_LIGHT,
  BG_COLOR_PRIMARY,
  BG_GRADIENT_START,
  BG_GRADIENT_END,
} from '../../../constants/baseStyles'
import {
  TOUCH_NONE,
  TOUCH_COLORFUL_MASK,
  TOUCH_LIGHT_MASK,
} from '../../../constants/touchableStyle'

export default class TopicButton extends Component {
  render() {
    const {
      mode,
      disabled,
      onPress,
      buttonStyles,
    } = this.props

    let _style = styles.defaultWrapper
    let buttonState = TOUCH_LIGHT_MASK
    let buttonPress = onPress

    if(mode === 'pure') {
      _style = styles.buttonWrapper
      buttonState = TOUCH_COLORFUL_MASK
    }
    if(mode === 'gradient') {
      _style = styles.gradientWrapper
      buttonState = TOUCH_COLORFUL_MASK
    }
    if(disabled) {
      _style = styles.buttonDisabled
      buttonState = TOUCH_NONE
      buttonPress = null
    }

    const containerStyles = StyleSheet.flatten([styles.container, buttonStyles])

    return (
      <TouchableHighlight {...buttonState} style={containerStyles} onPress={buttonPress}>
        {this._renderContent(_style)}
      </TouchableHighlight>
    )
  }

  _renderContent(_style) {
    const {mode, text} = this.props

    if(mode === 'pure') {
      return (
        <View style={_style}>
          <Text style={styles.buttonText}>{text}</Text>
        </View>
      )
    }

    if(mode === 'gradient') {
      return (
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          colors={[BG_GRADIENT_START, BG_GRADIENT_END]}
          style={_style}
        >
          <Text style={styles.buttonText}>{text}</Text>
        </LinearGradient>
      )
    }

    return (
      <View style={_style}>
        <Text style={[styles.buttonText, styles.defaultText]}>{text}</Text>
      </View>
    )
  }
}

TopicButton.propTypes = {
  mode: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  buttonStyles: PropTypes.object,
}

TopicButton.defaultProps = {
  mode: 'default',
  text: '',
  disabled: false,
  onPress: () => {},
  buttonStyles: {},
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
  },
  defaultWrapper: {
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR_PRIMARY_LIGHT,
    backgroundColor: 'transparent',
  },
  gradientWrapper: {},
  buttonWrapper: {
    backgroundColor: BG_COLOR_PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: TEXT_COLOR_DISABLED,
  },
  buttonText: {
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    borderRadius: 50,
    color: '#ffffff',
    fontSize: 16,
  },
  defaultText: {
    height: 37,
    lineHeight: 16,
    paddingVertical: 11,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 50,
    color: TEXT_COLOR_PRIMARY,
  },
})
