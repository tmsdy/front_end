/**
 * Created by xushichao on 2018-12-06.
 * 消息气泡
 */
import React from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import WebImage from './WebImage';

const BUBBLE_TRIANGLE = {
  yellow: {
    icon: 'flower/icon-triangle-yellow',
    backgroundColor: 'rgba(255, 233, 100, 0.9)',
    textColor: '#B56C00',
  },
  blue: {
    icon: 'flower/icon-triangle-blue',
    backgroundColor: 'rgba(34, 167, 255, 0.9)',
    textColor: '#ffffff',
  },
  black: {
    icon: 'flower/icon-triangle-black',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#ffffff',
  },
}

export default ({color = 'yellow', tip, tipBodyOffsetX = 0}) => {
  if(BUBBLE_TRIANGLE[color]) {
    const {icon, textColor, backgroundColor} = BUBBLE_TRIANGLE[color]
    return (
      <View style={styles.container}>
        <View style={[styles.tip, {backgroundColor}]}>
          {tip.$$typeof ? tip : <Text style={[styles.tipText, {color: textColor}]}>{tip}</Text>}
        </View>
        {/* 气泡底部的三角 */}
        <WebImage name={icon} style={[styles.triangle, {transform: [{translateX: -1 * tipBodyOffsetX}]}]}/>
      </View>
    )
  }
  return null
}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tip: {
    backgroundColor: '#FFFBD8',
    borderRadius: 13,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tipText: {
    height: 25,
    lineHeight: 25,
    color: '#B56C00',
    fontSize: 12,
    textAlign: 'center',
  },
  triangle: {
    width: 11,
    height: 8.5,
  },
});
