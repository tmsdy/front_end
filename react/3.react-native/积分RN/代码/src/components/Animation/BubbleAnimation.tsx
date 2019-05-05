/**
 * 气泡出现 --- 上下位移 --- 消失动效
 *  */
import React, {PureComponent} from 'react'
import {
  Animated,
  Easing,
} from 'react-native'

interface BubbleAnimationState {
  opacity: any;
  translateY: any;
  visiable: boolean;
}

interface BubbleAnimationProps {
  visiableTime?: number;
  speed?: number;
  duration?: number;
  style?: any;
  needHide?: boolean;
}

export default class extends PureComponent<BubbleAnimationProps, BubbleAnimationState> {
  static defaultProps = {
    visiableTime: 200,
    speed: 1000,
    duration: 5000,
    style: {},
    needHide: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-5),
      visiable: true
    }
  }

  componentDidMount() {
    this.showAnimation()
  }

  render() {
    const {children, style} = this.props
    const {translateY, opacity, visiable} = this.state
    if(!visiable) return null
    const transform = [
      {translateY}
    ]
    return (
      <Animated.View style={[style, {opacity, transform}]}>
        {children}
      </Animated.View>
    )
  }

  // 展示动画
  showAnimation = () => {
    const {opacity} = this.state
    const {visiableTime, duration, needHide} = this.props
    Animated.timing(opacity, {
      toValue: 1,
      duration: visiableTime,
      easing: Easing.inOut(Easing.ease)
    }).start(({finished}) => {
      if(finished) {
        this.translateAnimation()
        if(needHide) {
          setTimeout(this.hideAnimation, duration)
        }
      }
    });
  }

  // 动画定时关闭
  hideAnimation = () => {
    const {opacity} = this.state
    const {visiableTime} = this.props
    Animated.timing(opacity, {
      toValue: 0,
      duration: visiableTime,
      easing: Easing.inOut(Easing.ease)
    }).start(({finished}) => {
      if(finished) {
        this.setState({visiable: false})
      }
    });
  }

  // 位移动画
  translateAnimation = () => {
    const {translateY} = this.state
    const {speed} = this.props
    const animationBubble = Animated.sequence([
      Animated.timing(translateY, {
        toValue: 5,
        duration: speed,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(translateY, {
        toValue: -5,
        duration: speed,
        easing: Easing.inOut(Easing.ease)
      }),
      // Animated.timing(translateY, {
      //   toValue: -5,
      //   duration: speed,
      //   // easing: Easing.inOut(Easing.ease)
      // }),
      // Animated.timing(translateY, {
      //   toValue: 0,
      //   duration: speed,
      //   // easing: Easing.inOut(Easing.ease)
      // })
    ])
    Animated.loop(animationBubble).start();
  }
}
