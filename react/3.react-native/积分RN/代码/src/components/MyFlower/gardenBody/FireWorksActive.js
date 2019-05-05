/**
 * 培育成功礼花动效
 */
import React, {PureComponent} from 'react';

import {View} from '@iqiyi/rn-ui'

import ReduxUtil from '../../../common/ReduxUtil';


import LottieAnimation from '../../LottieAnimation'

const SUCCESS_ACTIVE_NAME = 'fireworks'

export default class FireworksActive extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.refSuccess = ReduxUtil.createRef()
  }

  componentDidMount() {
    this.refSuccess.getInstance().then(ref => ref.play())
  }

  render() {
    return (
      <View style={styles.activeBox} pointerEvents="none">
        <LottieAnimation
          ref={this.refSuccess}
          style={{width: 290, height: 325}}
          remote={true}
          name={SUCCESS_ACTIVE_NAME}
          onAnimationEnd={this.onAnimationEnd}
        />
      </View>
    );
  }

  onAnimationEnd = () => {

  }
}

const styles = BaseStyleSheet.create({
 activeBox: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
});
