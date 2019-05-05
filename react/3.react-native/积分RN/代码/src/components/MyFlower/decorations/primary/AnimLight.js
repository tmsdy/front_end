/**
 * Created by liuzhimeng.
 * @date 2019-01-22
 * @description 光线动效
 */
import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'

import {View} from '@iqiyi/rn-ui'

const TIME = 6

export default class AnimLight extends PureComponent {
  constructor(props) {
    super(props)
    this.animOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animOpacity.stopAnimation()
  }

  render() {
    return (
      <View style={[styles.container, {transform: [{rotate: '30deg'}]}]} pointerEvents="box-none">
        <Animated.Image
          style={[styles.leftLight, {
            opacity: this.animOpacity.interpolate({
              inputRange: [0, 1.4, 2.8, 3.6, 4.4, TIME],
              outputRange: [0.5, 0.8, 0.3, 1, 0.8, 0.5],
            }),
          }]}
          source={{uri: 'integral_light_left'}}
        />
        <Animated.Image
          style={[styles.rightLight, {
            opacity: this.animOpacity.interpolate({
              inputRange: [0, 1.4, 2.2, 3, TIME],
              outputRange: [0.5, 0.8, 0.3, 0.8, 0.5],
            }),
          }]}
          source={{uri: 'integral_light_right'}}
        />
      </View>
    )
  }

  play = () => {
    if(!this.animOpacity) {
      return
    }

    this.animOpacity.setValue(0)
    Animated.timing(this.animOpacity, {
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
  container: {
    position: 'absolute',
    top: -45,
    right: 80,
    width: 90,
    height: 280,
  },
  light: {
    width: 230,
    height: 150,
  },
  leftLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 67,
    height: 280,
  },
  rightLight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 67,
    height: 280,
  },
})
