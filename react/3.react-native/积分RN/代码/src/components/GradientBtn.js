/**
 * 渐变按钮
 */
import React, {Component} from 'react'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'

export default class extends Component {
  render() {
    const {
        startColor, endColor, btnStyle, children, press, wrapStyle
    } = this.props
    return (
        <TouchableOpacity onPress={press} style={[styles.btnBox, wrapStyle]} activeOpacity={1}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}
              colors={[startColor, endColor]}
              style={[styles.shareModalBtnBox, btnStyle]}
            >
            { children }
            </LinearGradient>
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    btnBox: {
        overflow: 'hidden',
        // backgroundColor: '#FF751B',
        justifyContent: 'center',
        alignItems: 'center',
    },
      shareModalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      },
})
