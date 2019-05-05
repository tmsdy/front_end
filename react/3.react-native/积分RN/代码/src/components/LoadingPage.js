import React, {Component} from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {
  Width,
  Height
} from '@iqiyi/rn-utils'
import {ActivityIndicator} from '@iqiyi/rn-ui';

export default class extends Component {
  render() {
    return (
      <View style={styles.unLinkBox}>
        <ActivityIndicator text="内容即将呈现..." />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  unLinkBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: Width,
    height: Height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 280
  },
})
