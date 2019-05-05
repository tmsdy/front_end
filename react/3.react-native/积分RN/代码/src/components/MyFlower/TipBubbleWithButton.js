/**
 * 客态页面tip提醒
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text} from '@iqiyi/rn-ui';
import {GARDEN_ENUM} from '../../constants/IntegralEnum';

export default class TipBubbleWithButton extends PureComponent {
  render() {
    const {tip, btnText} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.tip}>{tip}</Text>
        <TouchableOpacity style={styles.pushBtn} onPress={this.gotoSetPush} activeOpacity={1}>
          <Text style={styles.pushBtnText}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  gotoSetPush = () => {
    this.props.hideTipBubble()
    if(this.props.type === 'dead') {
      const keyName = this.props.channelCode === GARDEN_ENUM.CHANNEL_CODE.Money ? 'cashRevive' : 'friendsDead'
      this.props.shareToFriends(keyName)
    }
  }
}
const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip: {
    color: '#B56C00',
    fontSize: 12,
  },
  pushBtn: {
    backgroundColor: '#21A0FF',
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pushBtnText: {
    fontSize: 12,
    color: '#FFF',
  },
});
