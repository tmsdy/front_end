/**
 * Created by liuzhimeng.
 * @date 2019-03-22
 * @description 背景光晕
 */

import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'
import {View} from '@iqiyi/rn-ui'

import {AnimatedWebImage} from '../../WebImage'

export default class AnimGlow extends PureComponent {
  constructor(props) {
    super(props)

    this.animRotate = new Animated.Value(0)
    this.animScale = new Animated.Value(0)
  }

  componentWillUnmount() {
    this.animRotate.stopAnimation()
    this.animRotate = null

    this.animScale.stopAnimation()
    this.animScale = null
  }


  render() {
    return (
      <View style={styles.container}>
        <AnimatedWebImage
          name="bee_beam"
          style={[styles.growImage, {
            transform: [
              {
                rotate: this.animRotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
              {
                scale: this.animScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }]}
        />
      </View>
    )
  }

  play = () => {
    if(this.animRotate && this.animScale) {
      this.animRotate.setValue(0)
      Animated.parallel([
        Animated.timing(this.animRotate, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.animScale, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        })
      ])
        .start(({finished}) => {
          if(finished) {
            this.play()
          }
        })
    }
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growImage: {
    width: 290,
    height: 290,
  }
})
