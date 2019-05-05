/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 水平方向文字循环滚动 TODO: 1.支持竖直方向轮播 2.发布到iqiyi@rn组件库
 * @Date: 2019-04-20 11:26:51
 */

import React, {PureComponent} from 'react';
import {View, Animated, Easing, Text, TouchableOpacity} from 'react-native';
import {Width} from '@iqiyi/rn-utils';
import BaseStyleSheet from '../../common/BaseStyleSheet';

interface MarqueeProps {
  textList: any[];
  [key: string]: any;
}

export default class Marquee extends PureComponent<MarqueeProps, {}> {
  static defaultProps = {
    duration: 10000, // 执行完成整个动画所需要的时间(ms)
    speed: 0, // 平均的滚动速度
    textList: [], // 滚动的文字数组
    width: Width, // 宽度，默认整个屏幕的宽度 不能使用flex
    height: 50, // 高度，不能使用flex
    direction: 'left', // 动画方向(向左向右滚动)left or right
    reverse: false, // 是否将整个文本数据倒叙显示
    separator: 20, // 两个item之间的间隙
    onTextClick: () => null, // 点击事件回调：(item) => void
    bgContainerStyle: {}, // 背景样式
    textStyle: {} // 文本样式
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let newText = nextProps.textList || [];
    let oldText = prevState.textList || [];
    if(JSON.stringify(newText) !== JSON.stringify(oldText)) {
      // prevState.animation && prevState.animation.stop();
      return {
        textList: newText,
        // animation: null
      };
    }
    return null
  }

  state = {
    animation: null,
    textList: [],
    textWidth: 0,
    viewWidth: 0
  };

  animatedTransformX = new Animated.Value(0);

  componentDidUpdate() {
    this._excuteAnimation();
  }

  componentWillUnmount() {
    this.state.animation && this.state.animation.stop();
  }

  render() {
    let {width, height, bgContainerStyle} = this.props;
    let {textList} = this.state;
    return (
      <View
        style={[
          styles.bgContainerStyle,
          {
            width,
            height,
            ...bgContainerStyle,
            opacity: this.state.animation ? 1 : 0
          }
        ]}
      >
        {this.textView(textList)}
        {this.textLengthView(textList)}
      </View>
    );
  }

  textOnLayout = e => {
    let {nativeEvent: {layout: {width = 0} = {}} = {}} = e || {};
    let {textList, separator} = this.props;
    this.setState({
      textWidth: width + (textList.length - 1) * separator
    });
  };

  viewOnLayout = e => {
    let {nativeEvent: {layout: {width = 0} = {}} = {}} = e || {};
    this.setState({
      viewWidth: width
    });
  };

  textView(list) {
    let {textStyle, onTextClick, reverse, separator} = this.props;
    let itemView = [];
    for(let i = 0; i < list.length; i++) {
      let item = list[i];
      if(reverse) {
        item.value = item.value
          .split('')
          .reverse()
          .join('');
      }
      itemView.push(
        <TouchableOpacity
          key={`${i}`}
          activeOpacity={0.9}
          onPress={() => {
            onTextClick(item);
          }}
        >
          <View style={{flexDirection: 'row', marginRight: i < list.length - 1 ? separator : 0}}>
            <Text
              style={[
                styles.textStyle,
                {
                  ...textStyle
                }
              ]}
              numberOfLines={1}
            >
              {item.value}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Animated.View style={{flexDirection: 'row', width: this.state.textWidth, transform: [{translateX: this.animatedTransformX}]}} onLayout={event => this.viewOnLayout(event)}>
        {itemView}
      </Animated.View>
    );
  }

  textLengthView(list) {
    let {textStyle} = this.props;
    let text = '';
    for(let i = 0; i < list.length; i++) {
      text += list[i].value;
    }
    return (
      <View
        style={[
          styles.textMeasuringViewStyle,
          {
            width: list.length * 1024
          }
        ]}
      >
        <Text
          style={[
            styles.textMeasuringTextStyle,
            {
              ...textStyle
            }
          ]}
          onLayout={event => this.textOnLayout(event)}
          numberOfLines={1}
        >
          {text}
        </Text>
      </View>
    );
  }

  _excuteAnimation() {
    let {textWidth, viewWidth} = this.state;
    let {duration, speed, width, direction} = this.props;
    let mDuration = duration;
    if(speed && speed > 0) {
      mDuration = ((width + textWidth) / speed) * 1000;
    }
    if(!this.state.animation && textWidth && viewWidth) {
      /* eslint no-nested-ternary: off */
      this.animatedTransformX.setValue(direction === 'left' ? width : direction === 'right' ? -textWidth : width);
      this.setState(
        {
          animation: Animated.timing(this.animatedTransformX, {
            toValue: direction === 'left' ? -textWidth : direction === 'right' ? width : -textWidth,
            duration: mDuration,
            useNativeDriver: true,
            easing: Easing.linear
          })
        },
        () => {
          this.state.animation
            && this.state.animation.start(() => {
              this.setState({
                animation: null
              });
            });
        }
      );
    }
  }
}

const styles = BaseStyleSheet.create({
  bgContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  },
  textMeasuringViewStyle: {
    flexDirection: 'row',
    opacity: 0
  },
  textMeasuringTextStyle: {
    fontSize: 16
  },
  textStyle: {
    fontSize: 16,
    color: '#000000'
  }
});
