/**
 * 金钱花新手引导
 * */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import WebImage from '../../WebImage'

export default class extends PureComponent {
  render() {
    const {hide = () => null} = this.props
    return (
      <TouchableOpacity activeOpacity={1} onPress={hide} style={styles.container}>
        <WebImage name="flower/cash_guide_text" style={styles.guideText}/>
        <WebImage name="flower/new_guide_highlight" style={styles.guideImage}/>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 274,
    height: 220,
    position: 'absolute',
    bottom: 105,
    right: 12,
    justifyContent: 'space-between'
  },
  guideText: {
    width: 241,
    height: 145.5
  },
  guideImage: {
    width: 274,
    height: 53.5,
  }
})
