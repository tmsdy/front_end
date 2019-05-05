/**
 * Created by xushichao on 2018-12-06.
 * 消息气泡单例, 用于在页面上互斥的显示
 */
import React, {PureComponent} from 'react';
import {Animated, UIManager} from 'react-native';

import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils';

import TipBubble from './TipBubble';

// 气泡靠近屏幕的边界极限
const SCREEN_BOUNCE = 5;

// 气泡靠近屏幕并发生偏移后的偏移极限(相对于气泡半宽度的偏移量), 该偏移量是为了保证箭头三角不会出现在气泡边缘的圆角部分
const BUBBLE_MAX_OFFSET = 17;

export default class TipBubbleSingleton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tip: null,
      tipView: null,
      tipColor: 'yellow',
      position: null,
      bubbleWidth: 0,
      bubbleHeight: 0,
      tipBodyOffsetX: 0, // 提示气泡体的偏移量, 用于气泡超出屏幕的case
      style: null,
      visible: false, // 气泡可见性, 在布局完成后设置为true, 以便获取更好的显示体验
    };

    this.currTarget = null; // 当前显示气泡的目标组件的targetId
    this.hiddenTipTimer = null;

    this.animTipOpacity = new Animated.Value(0);
    this.animTipOffsetY = new Animated.Value(0);
  }

  componentWillUnmount() {
    clearTimeout(this.hiddenTipTimer);

    this.animTipOpacity.stopAnimation();
    this.animTipOffsetY.stopAnimation();
  }

  render() {
    let {tip, tipView, tipColor, position, bubbleWidth, bubbleHeight, tipBodyOffsetX, style, visible} = this.state;
    return !!(tip || tipView) && (
      <Animated.View
        onLayout={this.onLayout}
        style={[
          styles.container,
          visible && {left: parseInt(position.left - bubbleWidth / 2), top: parseInt(position.top - bubbleHeight)},
          {opacity: this.animTipOpacity, transform: [{translateX: tipBodyOffsetX}, {translateY: this.animTipOffsetY}]},
          style,
        ]}
      >
        {tipView || <TipBubble tip={tip} color={tipColor} tipBodyOffsetX={tipBodyOffsetX}/>}
      </Animated.View>
    );
  }

  show = ({target, tip, tipView, tipColor, offsetX = 0, offsetY = -10, opacityAnimConfig, offsetYAnimConfig, style, duration = 0, onShow}) => {
    if(target) {
      return new Promise((resolve) => {
        this.currTarget = target;
        UIManager.measure(target, (x, y, w, h, pageX, pageY) => {
          this.setState({
            tip,
            tipView,
            tipColor,
            position: {left: pageX + w / 2 + offsetX, top: pageY + offsetY},
            style,
          }, () => {
            this.playAppearAnimated(opacityAnimConfig, offsetYAnimConfig, onShow);
          });

          clearTimeout(this.hiddenTipTimer);
          // 如果设置了显示时间, 超时后隐藏
          if(duration > 0) {
            this.hiddenTipTimer = setTimeout(() => {
              this.playDisappearAnimated(opacityAnimConfig, offsetYAnimConfig, () => {
                this.hide().then(resolve);
              });
            }, duration);
          }
        });
      });
    }
    return Promise.reject();
  };

  hide = (target) => {
    if(!target || target === this.currTarget) { // 可以传入target, 以指定当前要隐藏的气泡; 不传则隐藏当前显示的气泡
      clearTimeout(this.hiddenTipTimer);
      return new Promise((resolve) => {
        this.currTarget = null;
        this.setState({tip: null, tipView: null, tipColor: 'yellow', visible: false}, resolve);
      });
    }
    return Promise.reject();
  };

  playAppearAnimated = (opacityAnimConfig, offsetYAnimConfig, callback) => {
    let animatedList = [];
    // 初始化动画量
    this.animTipOpacity.setValue(0);
    this.animTipOffsetY.setValue(0);
    // 配置动画
    if(opacityAnimConfig) {
      let {from = 1, to = 1, duration = 0} = opacityAnimConfig;
      animatedList.push(this.createAnimatedInstance(this.animTipOpacity, from, to, duration));
    }
    if(offsetYAnimConfig) {
      let {from = 0, to = 0, duration = 0} = offsetYAnimConfig;
      animatedList.push(this.createAnimatedInstance(this.animTipOffsetY, from, to, duration));
    }
    if(animatedList.length) { // 播放提示气泡出现动画
      Animated.parallel(animatedList).start(({finished}) => {
        finished && callback && callback();
      });
    } else { // 没有配置出现动画, 直接回调
      this.animTipOpacity.setValue(1); // 如果没有配置出现动画, 需手动把透明度调整为1, 以保证气泡显示
      callback && callback();
    }
  };

  playDisappearAnimated = (opacityAnimConfig, offsetYAnimConfig, callback) => {
    let animatedList = [];
    if(opacityAnimConfig && opacityAnimConfig.loop) { // loop 表示是否需要在消失的时候反向执行显示动画
      let {from = 1, to = 1, duration = 0} = opacityAnimConfig;
      animatedList.push(this.createAnimatedInstance(this.animTipOpacity, to, from, duration)); // 消失动画就是from/to换位
    }
    if(offsetYAnimConfig && opacityAnimConfig.loop) {
      let {from = 0, to = 0, duration = 0} = offsetYAnimConfig;
      animatedList.push(this.createAnimatedInstance(this.animTipOffsetY, to, from, duration));
    }
    if(animatedList.length) { // 播放提示气泡出现动画
      Animated.parallel(animatedList).start(({finished}) => {
        finished && callback && callback();
      });
    } else { // 没有配置出现动画, 直接回调
      callback && callback();
    }
  };

  createAnimatedInstance = (anim, fromValue, toValue, duration, useNativeDriver = true) => {
    anim.setValue(fromValue);
    return Animated.timing(anim, {toValue, duration, useNativeDriver});
  };

  onLayout = ({nativeEvent}) => {
    const {position, bubbleWidth} = this.state
    let {width, height} = nativeEvent.layout
    let tipBodyOffsetX = 0

    // 消除容器宽度带有小于1px的尾数导致的抖动问题
    width = parseInt(width)
    height = parseInt(height)
    if(Math.abs(bubbleWidth - width) <= 1) {
      width = bubbleWidth
    }

    if(position.left + width / 2 > DEVICE_WIDTH - SCREEN_BOUNCE) { // 气泡超出右屏幕外
      tipBodyOffsetX = DEVICE_WIDTH - SCREEN_BOUNCE - (position.left + width / 2);
      tipBodyOffsetX = Math.max(tipBodyOffsetX, BUBBLE_MAX_OFFSET - width / 2); // 偏移量修正, 保证箭头三角不要出现在气泡圆角区域
    } else if(position.left - width / 2 < SCREEN_BOUNCE) { // 气泡超出左屏幕外
      tipBodyOffsetX = SCREEN_BOUNCE - (position.left - width / 2);
      tipBodyOffsetX = Math.min(tipBodyOffsetX, width / 2 - BUBBLE_MAX_OFFSET);
    }

    this.setState({
      bubbleWidth: width,
      bubbleHeight: height,
      tipBodyOffsetX: parseInt(tipBodyOffsetX),
    }, () => {
      setTimeout(() => { // 延迟到布局完成后显示
        this.setState({visible: true});
      }, 0);
    });
  };
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    left: -1000,
  },
});
