/**
 * Created by kerwinliu on 2018/9/14.
 */
/*
 * 翻页动画
 * */
import React, {Component} from 'react'
import {
  View,
} from '@iqiyi/rn-ui'
import {
  Animated,
  Easing
} from 'react-native'

export default class extends Component {
  constructor(props) {
    super(props)
    const {size} = this.props
    this.state = {
      duration: 400,
      frontViewValue: {
        opacity: new Animated.Value(1),
        width: new Animated.Value(size.width),
        height: new Animated.Value(size.height)
      },
      backViewValue: {
        opacity: new Animated.Value(0),
        width: new Animated.Value(0),
        height: new Animated.Value(0),
      },
      rotateY: new Animated.Value(0),
      isFront: true
    }
  }
  render() {
    const {width, height} = this.props.size
    const rotateEnd = {
      transform: [
        {scaleX: -1},
      ]
    }
    const rotate = {
      width,
      height,
      transform: [
        {
          // rotateY: this.state.rotateY.interpolate({
          //   inputRange: [0, 1], // 动画value输入范围
          //   outputRange: ['0deg', '180deg'] // 对应的输出范围
          // })
          // rotateY 会导致背面字体模糊
          scaleX: this.state.rotateY.interpolate({
            inputRange: [0, 1], // 动画value输入范围
            outputRange: [1, -1] // 对应的输出范围
          })
        },
        // {
        //   skewY: this.state.rotateY.interpolate({
        //     inputRange: [0, 0.5, 1],  //动画value输入范围
        //     outputRange: ['0deg', '-5deg', '0deg']  //对应的输出范围
        //   })
        // }
      ]
    }
    const {frontViewValue, backViewValue} = this.state
    const front = {
      opacity: frontViewValue.opacity,
      width: frontViewValue.width,
      height: frontViewValue.height,
      overflow: 'hidden'
    }
    const end = {
      position: 'absolute',
      opacity: backViewValue.opacity,
      width: backViewValue.width,
      height: backViewValue.height,
      overflow: 'hidden'
    }
    const {renderFront, renderBehind, size} = this.props
    return (
      <View style={{height: size.height, width: size.width}}>
        <Animated.View style={[rotate]}>
          <Animated.View style={front}>
            {renderFront()}
          </Animated.View>
          <Animated.View style={[rotateEnd, end]}>
            {renderBehind()}
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
  // 执行翻转动画，在执行到90度垂直时候，修改 前后 view 的透明度，视觉上制造翻页的效果
  start = (cb = null) => {
    const {frontViewValue, backViewValue, rotateY} = this.state
    const {width, height} = this.props.size
    if(frontViewValue.opacity._value === 1 || frontViewValue.opacity._value === '1') {
      Animated.sequence([
        Animated.timing(this.state.rotateY, {
          toValue: 0.5,
          duration: this.state.duration,
          easing: Easing.inOut(Easing.quad)
        }),
        Animated.timing(frontViewValue.opacity, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(frontViewValue.width, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(frontViewValue.height, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(backViewValue.opacity, {
          toValue: 1,
          duration: 0
        }),
        Animated.timing(backViewValue.width, {
          toValue: width,
          duration: 0
        }),
        Animated.timing(backViewValue.height, {
          toValue: height,
          duration: 0
        }),
        Animated.timing(rotateY, {
          toValue: 1,
          duration: this.state.duration,
          easing: Easing.out(Easing.back())
        }),
      ])
        .start(() => {
          this.setState({isFront: false})
          cb && cb({isFront: false})
        })
    } else {
      Animated.sequence([
        Animated.timing(rotateY, {
          toValue: 0.5,
          duration: this.state.duration,
          easing: Easing.inOut(Easing.quad)
        }),
        Animated.timing(frontViewValue.opacity, {
          toValue: 1,
          duration: 0
        }),
        Animated.timing(frontViewValue.width, {
          toValue: width,
          duration: 0
        }),
        Animated.timing(frontViewValue.height, {
          toValue: height,
          duration: 0
        }),
        Animated.timing(backViewValue.opacity, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(backViewValue.width, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(backViewValue.height, {
          toValue: 0,
          duration: 0
        }),
        Animated.timing(rotateY, {
          toValue: 0,
          duration: this.state.duration,
          easing: Easing.out(Easing.back())
        }),
      ])
        .start(() => {
          this.setState({isFront: true})
          cb && cb({isFront: true})
        })
    }
  }
  getCurrentStatus = () => {
    const {isFront} = this.state
    return {isFront}
  }
}
