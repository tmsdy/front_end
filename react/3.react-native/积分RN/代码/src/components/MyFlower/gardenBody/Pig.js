/**
 * 金钱花小猪
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

import ReduxUtil from '../../../common/ReduxUtil';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import WebImage from '../../WebImage';
import LottieAnimation from '../../LottieAnimation'

@connect(
  (state, props) => {
    let {flowerInfo} = getUserGardenDetail(state, props);
    return {
      flowerInfo,
    };
  },
  null,
  null,
  {withRef: true},
)
export default class Pig extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.refPig = ReduxUtil.createRef()
  }

  render() {
    const {flowerInfo} = this.props
    if(flowerInfo.type !== 'faded') {
      return (
        <TouchableOpacity activeOpacity={1} onPress={this._press} style={styles.container}>
          <LottieAnimation
            ref={this.refPig}
            style={styles.normalPig}
            name="integral_pig"
            onAnimationEnd={this.onAnimationEnd}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <WebImage name="flower/integral_sad_pig" style={[styles.container, styles.cryPig]}/>
      )
    }
  }
  _press = () => {
    this.refPig.getInstance().then(ref => ref.play())
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 17,
    alignSelf: 'center',
    transform: [{translateX: 25}],
    zIndex: 20,
  },
  normalPig: {
    width: 57,
    height: 65,
  },
  cryPig: {
    width: 57,
    height: 52,
  },
})
