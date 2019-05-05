/**
 * Created by lixiaoxi1.
 * @date 2019/4/1
 * @description
 */

import React from 'react'
import SafeView from '@iqiyi/rn-safe-view'
import {ViewStyle} from '../common/BaseStyleSheet'

type forceInsetValue = 'always' | 'never'

interface ForceInset {
  horizontal?: forceInsetValue;
  vertical?: forceInsetValue;
  top?: forceInsetValue;
  bottom?: forceInsetValue;
  left?: forceInsetValue;
  right?: forceInsetValue;
}

interface WithSafeViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  forceInset?: ForceInset;
}

export default function WithSafeView({
  children,
  style = {flex: 1, backgroundColor: '#ffffff'},
  forceInset = {
    bottom: 'always',
    top: 'never',
  },
}: WithSafeViewProps) {

  return (
    <SafeView style={style} forceInset={forceInset}>
      {children}
    </SafeView>
  )
}
