/**
 * Created by liuzhimeng.
 * @date 2019-04-22
 * @description
 */

import React, {PureComponent} from 'react'
import {TouchableHighlight} from 'react-native'

import {Text} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'

import BaseStyleSheet, {ViewStyle, TextStyle} from '../common/BaseStyleSheet'

const DISABLED_STYLE = {
  textColors: {
    color: '#cccccc'
  },
  wrapperColors: ['#f4f4f4', '#f4f4f4'],
}

export interface BaseButtonProps {
  text: string;
  disabled?: boolean;
  linearColor?: string | string[];
  textColor?: string;
  containerStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress(): void;
}

export default class BaseButton extends PureComponent<BaseButtonProps, object> {
  static defaultProps = {
    text: '',
    disabled: false,
    linearColor: ['#FF410F', '#FF6100'],
    textColor: '#FF410F',
  }

  render() {
    const {text, disabled, linearColor, textColor, onPress, containerStyle, wrapperStyle, textStyle} = this.props
    let buttonPress = null
    let colors = []
    let textColorStyle: any = {}

    if(disabled) {
      buttonPress = null
      colors = DISABLED_STYLE.wrapperColors
      textColorStyle = DISABLED_STYLE.textColors
    } else {
      buttonPress = onPress
      colors = typeof linearColor === 'string' ? [linearColor, linearColor] : linearColor
      textColorStyle.color = textColor
    }

    return (
      <TouchableHighlight
        style={[styles.container, containerStyle]}
        activeOpacity={1}
        underlayColor="transparent"
        onPress={buttonPress}
      >
        <LinearGradient
          style={[styles.defaultWrapper, wrapperStyle]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          colors={colors}
        >
          <Text style={[styles.defaultText, textStyle, textColorStyle]}>{text}</Text>
        </LinearGradient>
      </TouchableHighlight>
    )
  }

}

const CONTAINER_HEIGHT = 28
const styles = BaseStyleSheet.create({
  container: {
    width: 80,
    height: CONTAINER_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
  },
  defaultWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#f4f4f4',
  },
  defaultText: {
    height: CONTAINER_HEIGHT - 3,
    lineHeight: CONTAINER_HEIGHT - 3,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
  },

})
