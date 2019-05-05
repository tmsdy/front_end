/**
 * Created by liuzhimeng.
 * @date 2019-03-19
 * @description 左下方小草动效
 */

import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'
import WebImage, {AnimatedWebImage} from '../../../WebImage'

const CONTAINER_WIDTH = 40
const CONTAINER_HEIGHT = 72
export default class AnimGassLeft extends PureComponent {
  static TIME = 4.5

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
      <Animated.View
        style={[styles.grassLeftContainer, {
          transform: [
            {
              rotate: this.animScale.interpolate({
                inputRange: [0, 2, AnimGassLeft.TIME],
                outputRange: ['0deg', '7deg', '0deg'],
              }),
            },
            {
              translateY: 0 - (CONTAINER_HEIGHT / 2),
            },
          ],
        }]}
      >
        <WebImage style={styles.grassLeft} name="flower/talent_grass_left"/>
        <AnimatedWebImage
          style={[styles.flower, {
            transform: [
              {
                rotate: this.animScale.interpolate({
                  inputRange: [0, 2, AnimGassLeft.TIME],
                  outputRange: ['0deg', '-35deg', '0deg'],
                }),
              },
            ],
          }]}
          name="flower/talent_flower_left"
        />
      </Animated.View>
    )
  }

  play = () => {
    if(!this.animScale) {
      return
    }

    this.animScale.setValue(0)
    Animated.timing(this.animScale, {
      toValue: AnimGassLeft.TIME,
      duration: AnimGassLeft.TIME * 1000,
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

export class AnimGassRight extends PureComponent {
  static TIME = 5

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
      <AnimatedWebImage
        style={[styles.grassRight, {
          transform: [
            {
              rotate: this.animScale.interpolate({
                inputRange: [0, AnimGassRight.TIME / 2, AnimGassRight.TIME],
                outputRange: ['-7deg', '0deg', '-7deg'],
              }),
            },
            {
              translateY: -43,
            },
          ],
        }]}
        name="flower/talent_grass_right"
      />
    )
  }

  play = () => {
    if(!this.animScale) {
      return
    }

    this.animScale.setValue(0)
    Animated.timing(this.animScale, {
      toValue: AnimGassRight.TIME,
      duration: AnimGassRight.TIME * 1000,
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
  grassLeftContainer: {
    position: 'absolute',
    bottom: 12,
    left: -8,
    justifyContent: 'flex-end',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  grassLeft: {
    width: 33.5,
    height: 67,
  },
  flower: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
  },

  grassRight: {
    position: 'absolute',
    bottom: -40,
    right: -14,
    width: 54,
    height: 86,
  },
})
