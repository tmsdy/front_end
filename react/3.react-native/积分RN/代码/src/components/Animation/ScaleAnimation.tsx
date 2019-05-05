/**
 * 抖动缩放动效
 *  */
import React, {PureComponent} from 'react'
import {
  Animated
} from 'react-native'

interface ScaleAnimationProps {
  duration?: number;
  style?: any;
}

export default class extends PureComponent<ScaleAnimationProps, {}> {
  static defaultProps = {
    duration: 800,
    style: {},
  }

  private animBtnScale = new Animated.Value(0);

  componentDidMount() {
    this.shakeBtn()
  }

  componentWillUnmount() {
    this.animBtnScale.stopAnimation()
  }

  render() {
    const {children, style} = this.props
    const transform = [{
      scale: this.animBtnScale.interpolate({
        inputRange: [0, 0.4, 0.6, 0.8, 1],
        outputRange: [1, 1.1, 1, 1.05, 1],
      }),
    }]
    return (
      <Animated.View style={[style, {transform}]}>
        {children}
      </Animated.View>
    )
  }

  // 展示动画
  shakeBtn = () => {
    const {duration} = this.props
    Animated.timing(this.animBtnScale, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(() => {
      this.animBtnScale.setValue(0);
      this.shakeBtn()
    });
  };
}
