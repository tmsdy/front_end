import React, {Component} from 'react'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import px2dp from '../../common/px2dp'

export default class extends Component {
  render() {
    const {onPress, style = null, textColor = null, text = '记录脑洞，获得积分(＾－＾)V', outStyle = null} = this.props
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={[{alignItems: 'center', paddingBottom: px2dp(35)}, outStyle]}>
        <View style={[styles.content, style]}>
          <Text style={[styles.titleTex, textColor]}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    width: px2dp(340),
    height: px2dp(100),
    borderRadius: px2dp(5),
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderStyle: 'dashed'
  },
  titleText: {
    fontSize: 14,
    color: '#999'
  }
})
