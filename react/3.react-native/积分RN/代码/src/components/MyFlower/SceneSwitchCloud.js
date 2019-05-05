/**
 * 场景切换用的云层
 * Created by xushichao on 2019-01-10.
 */
import React, {PureComponent} from 'react';
import {View} from '@iqiyi/rn-ui';

import ReduxUtil from '../../common/ReduxUtil';

import LottieAnimation from '../LottieAnimation';

export default class SceneSwitchCloud extends PureComponent {
  constructor(props) {
    super(props);

    this.refCloud = ReduxUtil.createRef();
  }

  render() {
    return (
      <View pointerEvents="none" style={styles.cloud}>
        <LottieAnimation
          ref={this.refCloud}
          style={styles.cloud}
          hardwareAccelerationAndroid
          resizeMode="cover"
          name="cloud"
        />
      </View>
    );
  }

  play = () => {
    this.refCloud.getInstance().then((ref) => {
      ref.reset();
      ref.start();
    });
  }
}

const styles = BaseStyleSheet.create({
  cloud: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  }
});
