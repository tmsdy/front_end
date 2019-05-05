/**
 * 培育成功动效
 */
import React, {PureComponent} from 'react';

import {View} from '@iqiyi/rn-ui'

import ReduxUtil from '../../../common/ReduxUtil';


import LottieAnimation from '../../LottieAnimation'

const SUCCESS_ACTIVE_NAME = 'success_active_v2'

export default class PlantSuccessActive extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.refSuccess = ReduxUtil.createRef()
  }

  componentDidMount() {
    this.refSuccess.getInstance().then(ref => ref.play())
    const {onPlantSuccessStart} = this.props
    // 金钱花培育弹框需要立即展示
    onPlantSuccessStart && onPlantSuccessStart()
  }

  render() {
    return (
      <View style={styles.activeBox} pointerEvents="none">
        <LottieAnimation
          ref={this.refSuccess}
          style={{width: 360, height: 260}}
          remote={true}
          name={SUCCESS_ACTIVE_NAME}
          onAnimationEnd={this.onAnimationEnd}
          loop={this.props.loop}
        />
      </View>
    );
  }

  onAnimationEnd = () => {
    this.props.onSuccessActiveEnd && this.props.onSuccessActiveEnd()
  }
}

const styles = BaseStyleSheet.create({
 activeBox: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
});
