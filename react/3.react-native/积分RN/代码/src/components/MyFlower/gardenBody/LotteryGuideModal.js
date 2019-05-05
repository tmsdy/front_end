/**
 * 新玩法引导弹框
 * Created by linny on 2019-3-18.
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity
} from 'react-native';
import {isLikeX, isIOS} from '@iqiyi/rn-utils';

import WebImage from '../../WebImage';

const BOTTOM_HEIGHT = isLikeX() ? 160 : 123

export default class LotteryGuideModal extends PureComponent {
  render() {
    const picName = isIOS ? 'flower/ios_lottery_text' : 'flower/android_lottery_text'
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.hide} activeOpacity={1}>
        <WebImage name={picName} style={styles.textPic}/>
        <WebImage name="flower/lottery_vip" style={styles.guidePic}/>
      </TouchableOpacity>
    );
  }
}

const styles = BaseStyleSheet.create({
  textPic: {
    width: 241,
    height: 145,
    position: 'absolute',
    bottom: BOTTOM_HEIGHT + 73,
    alignSelf: 'center'
  },
  guidePic: {
    width: 280,
    height: 53,
    position: 'absolute',
    bottom: BOTTOM_HEIGHT,
    right: 20
  },
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
});

