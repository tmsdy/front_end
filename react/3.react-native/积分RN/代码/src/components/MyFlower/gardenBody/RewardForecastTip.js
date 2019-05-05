/**
 * 奖励预告提示
 */
import React from 'react';

import {View, Text, Image} from '@iqiyi/rn-ui';

export default ({wateringInfo}) => {
  let {waterDays, waterDaysBeforeNextGift} = wateringInfo;

  return (
    <View style={styles.container}>
      <Text style={styles.tip}>
        连续
        <Text style={styles.tipActive}>{waterDays}</Text>
        天，
        <Text style={styles.tipActive}>{waterDaysBeforeNextGift}</Text>
        天后有
      </Text>
      <Image source={{uri: 'integral_flower_enter_gift'}} style={styles.giftIcon}/>
    </View>
  );
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
  tipActive: {
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    color: '#FF5900',
  },
  giftIcon: {
    width: 20,
    height: 21,
    marginLeft: 6,
    top: -2,
  },
});
