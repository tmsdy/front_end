/**
 * Created by liuzhimeng.
 * @date 2019-01-22
 * @description 左下方小草动效
 */

import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'

const TIME = 5

export default class AnimGass extends PureComponent {
  constructor(props) {
    super(props)
    this.animScale = new Animated.Value(0)
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animScale.stopAnimation()
  }

  render() {
    return (
      <Animated.Image
        style={[styles.gass, {
          transform: [
            {
              rotate: this.animScale.interpolate({
                inputRange: [0, TIME / 2, TIME],
                outputRange: ['-6deg', '6deg', '-6deg'],
              }),
            },
            {
              translateY: -49,
            },
          ],
        }]}
        source={{uri: 'integral_single_grass'}}
      />
    )
  }

  play = () => {
    if(!this.animScale) {
      return
    }

    this.animScale.setValue(0)
    Animated.timing(this.animScale, {
      toValue: TIME,
      duration: TIME * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
      .start(({finished}) => {
        // 循环播放
        if(finished) {
          this.play()
        }
      })
  }
}

const styles = BaseStyleSheet.create({
  gass: {
    position: 'absolute',
    bottom: -49,
    left: 28,
    width: 49,
    height: 98,
  },
})
