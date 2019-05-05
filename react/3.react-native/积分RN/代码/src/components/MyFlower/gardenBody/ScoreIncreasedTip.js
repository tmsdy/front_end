/**
 * 积分增加提示
 */
import React from 'react';

import {View, Text, Image} from '@iqiyi/rn-ui';

export default ({scoreNum}) => {
  return scoreNum > 0 && (
    <View style={[styles.container]}>
      <Image source={{uri: 'integral_flower_big_score'}} style={styles.scoreIcon}/>
      <Text style={styles.scoreText}>+{scoreNum}</Text>
    </View>
  );
}

const styles = BaseStyleSheet.create({
  container: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreIcon: {
    height: 35,
    width: 35,
  },
  scoreText: {
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    color: '#FFFFFF',
    fontSize: 26,
  },
});
