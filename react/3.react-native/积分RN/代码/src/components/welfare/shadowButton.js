/**
 * 带阴影的button
*/
import React, {Component} from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native'
import {Text} from '@iqiyi/rn-ui'

export default class extends Component {
  render() {
    const { style, onPress, text} = this.props
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={[styles.buttonArea, style]}>
        <View style={[styles.rewardButton, styles.hideBg]}/>
        <View style={styles.rewardButton}>
          <Text style={styles.rewardButtonText}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  buttonArea: {
    height: 43,
    position: 'absolute',
    width: 180,
  },
  rewardButton: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3030B5',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    backgroundColor: '#FFE97D',
    position: 'absolute',
  },
  hideBg: {
    backgroundColor: '#3030B5',
    top: 3,
  },
  rewardButtonText: {
    color: '#3030B5',
    fontSize: 16,
    fontWeight: '600'
  }
})
