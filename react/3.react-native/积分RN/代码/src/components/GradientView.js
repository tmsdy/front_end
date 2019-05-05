/**
 * Created by kerwinliu on 2018/9/1.
 */
import React, {Component} from 'react'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {
  StyleSheet,
  View
} from 'react-native'

export default class extends Component {
  render() {
    const {startColor, endColor, style, children, rowDirection} = this.props
    let direction = {
      start: {x: 1, y: 1},
      end: {x: 0, y: 1}
    }
    // 默认是横轴  2 为竖轴方向
    if(rowDirection === 2) {
      direction = {
        start: {x: 1, y: 0},
        end: {x: 1, y: 1}
      }
    }
    return (
      <View style={[styles.view, style]}>
        <LinearGradient
          {...direction}
          colors={[startColor, endColor]}
          style={[styles.view, style, {borderRadius: 0, position: 'absolute', top: 0, left: 0}]}
        />
        { children }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})
