/**
 * 奖励气泡
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {View} from '@iqiyi/rn-ui';

import LottieAnimation from '../../LottieAnimation';
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback';
import PingbackConfig from '../../../common/PingbackConfig';

const TYPE_MAPPING = {
  vipCard: 'reward_vipcard',
  gift: 'reward_gift',
};

const OFFSET_TOP_RELATIVE_FLOWER = 4; // 相对于当前花朵的顶部偏移量
const BUBBLE_SIZE = 60; // 气泡尺寸

export default class RewardBubble extends PureComponent {
  componentDidMount() {
    try {
      const {page, block, rseat} = PingbackConfig[this.props.gardenMode].rewardBubble
      sendBlockPingback(page, block, {rseat})
    } catch(e) {} // eslint-disable-line
  }

  render() {
    const {flowerInfo, rewardType, theme} = this.props
    let lottieName = TYPE_MAPPING[rewardType]
    const {giftBubbleLottie} = theme
    const leftStyle = giftBubbleLottie.left ? {left: giftBubbleLottie.left} : {}
    return !!lottieName && (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container, leftStyle, {bottom: flowerInfo.height + OFFSET_TOP_RELATIVE_FLOWER + giftBubbleLottie.bottom}]}
        onPress={this._onPress}
      >
        <View>
          <LottieAnimation
            ref={el => el && el.play()}
            style={styles.bubble}
            name={giftBubbleLottie.name}
            loop={true}
          />
        </View>
      </TouchableOpacity>
    )
  }

  _onPress = () => {
    try {
      const {page, block, rseat} = PingbackConfig[this.props.gardenMode].rewardBubble
      sendClickPingback(page, block, rseat)
    } catch(e) {} // eslint-disable-line
    this.props.pickupReward && this.props.pickupReward()
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
  },
});
