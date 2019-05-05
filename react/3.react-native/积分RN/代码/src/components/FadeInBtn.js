/**
 * 渐显按钮
 * Created by xushichao on 2019-01-15.
 */
import React, {PureComponent} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

export default class FadeInBtn extends PureComponent {
  constructor(props) {
    super(props);

    this.animBtnDisplay = new Animated.Value(0); // 按钮组件显示动画
  }

  componentWillUnmount() {
    this.animBtnDisplay.stopAnimation();
  }

  render() {
    const {style, onPress = NOOP, children} = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress} onLayout={this.onContainerLayout}>
        <Animated.View style={[style, {opacity: this.animBtnDisplay}]} onLayout={this.onContainerLayout}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  onContainerLayout = () => {
    Animated.timing(this.animBtnDisplay, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
}
