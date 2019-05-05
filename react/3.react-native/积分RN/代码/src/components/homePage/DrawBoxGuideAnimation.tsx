/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 宝箱引导动画
 * @Date: 2019-04-19 20:47:31
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Animated, Easing} from 'react-native';
import ReduxUtil from '../../common/ReduxUtil';
import WebImage from '../WebImage';

interface DrawBoxGuideAnimationProps {
  showGuideAnimation: boolean;
}
export default class DrawBoxGuideAnimation extends PureComponent<DrawBoxGuideAnimationProps, {}> {
  guideRef = ReduxUtil.createRef();
  animatedValue = new Animated.Value(0);
  componentDidUpdate() {
    // this.animate执行动画方法不能放在componentDidMount中调用，因为componentDidMount中调用组件有可能没有展示
    this.guideRef.getInstance().then(() => this.animate());
  }

  render() {
    const translateX = this.animatedValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -19, 0, -19, 0]
    });
    return (
      this.props.showGuideAnimation && (
        <Animated.View ref={this.guideRef} style={[styles.treasureboxGuideWrap, {transform: [{translateX}]}]}>
          <WebImage style={styles.treasureboxGuide} name="treasurebox/treasure-guide" />
        </Animated.View>
      )
    );
  }

  // 执行动画
  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      delay: 440
    }).start(() => this.animate());
  }
}
const styles = StyleSheet.create({
  treasureboxGuideWrap: {
    width: 118.5,
    height: 32,
    position: 'absolute',
    right: 15.5,
    top: -16,
    zIndex: 10
  },
  treasureboxGuide: {
    width: 118.5,
    height: 32
  }
});
