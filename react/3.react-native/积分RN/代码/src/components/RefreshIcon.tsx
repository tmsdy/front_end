/**
 * Created by liuzhimeng.
 * @date 2019-04-07
 * @description 下拉刷新组件
 */

import React from 'react'
import {View, ActivityIndicator} from '@iqiyi/rn-ui'
import BaseStyleSheet from '../common/BaseStyleSheet'

interface RefreshIconProps {
  color: string;
}

export default function RefreshIcon({color = '#FF8A12'}: RefreshIconProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        autoAnimation={true}
        staticPlay={true}
        color={color}
      />
    </View>
  )
}

const styles = BaseStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: 'transparent',
  }
})
