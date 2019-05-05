/**
 * 购物达人热抢动效
 */
import React, {PureComponent} from 'react';
import {View} from '@iqiyi/rn-ui';
import ReduxUtil from '../../common/ReduxUtil';
import LottieAnimation from '../LottieAnimation';
import {SHOPPING_MASTER_MEDAL_HOT_BLOCK, sendMainBlockPingback} from './pingback'

export default class MdealHotLottie extends PureComponent {
  constructor(props) {
    super(props);
    this.refSuccess = ReduxUtil.createRef();
  }

  componentDidMount() {
    sendMainBlockPingback(SHOPPING_MASTER_MEDAL_HOT_BLOCK)
    this.refSuccess.getInstance().then(ref => ref.play());
  }
  render() {
    return (
      <View style={styles.activeBox} pointerEvents="none">
        <LottieAnimation ref={this.refSuccess} style={{width: 40, height: 18}} remote={true} name="new_medal_hot" onAnimationEnd={this.onAnimationEnd} loop={true} />
      </View>
    );
  }

  onAnimationEnd = () => {
    this.props.onSuccessActiveEnd && this.props.onSuccessActiveEnd();
  };
}

const styles = BaseStyleSheet.create({
  activeBox: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99
  }
});
