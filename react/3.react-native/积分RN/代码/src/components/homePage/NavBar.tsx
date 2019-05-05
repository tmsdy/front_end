/**
 * Created by liuzhimeng.
 * @date 2019-04-07
 * @description 积分中心顶部标题栏
 */

import React from 'react'
import {TouchableHighlight} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'

import BaseStyleSheet from '../../common/BaseStyleSheet'

import DefaultNavBar from '../DefaultNavBar'

function RightViewComponent({goTo}) {
  return (
    <View style={styles.rightView}>
      <TouchableHighlight style={styles.rightNavTextWrapper} activeOpacity={1} onPress={() => goTo('MyGain')}>
        <Text style={styles.rightNavText} numberOfLines={1}>我的收获</Text>
      </TouchableHighlight>
    </View>
  )
}

export default function NavBar({onBack, goTo}) {
  return (
    <DefaultNavBar
      title="积分中心"
      backPress={onBack}
      renderRightView={() => <RightViewComponent goTo={goTo}/>}
      rightViewWidth={90}
      backgroundColor="transparent"
      titleColor="#000000"
      type="black"
    />
  )
}

const styles = BaseStyleSheet.create({
  rightView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 44,
  },
  rightNavTextWrapper: {
    marginRight: 15,
  },
  rightNavText: {
    color: '#000000',
    fontSize: 13,
  }
})
