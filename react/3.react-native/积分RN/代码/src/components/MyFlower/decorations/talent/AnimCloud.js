/**
 * Created by liuzhimeng.
 * @date 2019-03-19
 * @description 云朵动效
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'

import {View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import {AnimatedWebImage} from '../../../WebImage'

const CLOUD_WIDTH = 380
const CLOUD_HEIGHT = 192
const CLOUD_MOVE = 60
const CONTAINER_WIDTH = DEVICE_WIDTH

const TIME = 9
const DELAY_TIME = 7

export default class AnimCloud extends PureComponent {
  constructor(props) {
    super(props)

    this.animCloud1 = new Animated.Value(0)
    this.animCloud2 = new Animated.Value(0)
    this.animCloud3 = new Animated.Value(0)
  }

  componentDidMount() {
    this.play()

    setTimeout(() => {
      this._playLoop(this.animCloud2)
    }, (8 - DELAY_TIME) * 1000)

    setTimeout(() => {
      this._playLoop(this.animCloud3)
    }, (16 - DELAY_TIME) * 1000)
  }

  componentWillUnmount() {
    this.animCloud1.stopAnimation()
    this.animCloud2.stopAnimation()
    this.animCloud3.stopAnimation()
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="none">
        <AnimatedWebImage
          style={[styles.staticCloud, {
            transform: [{
              translateX: this.animCloud1.interpolate({
                inputRange: [0, 9],
                outputRange: [0, 0 - CLOUD_MOVE],
              }),
            }],
            opacity: this.animCloud1.interpolate({
              inputRange: [0, 8, 9],
              outputRange: [1, 1, 0],
            }),
          }]}
          name="flower/talent_cloud"
        />
        <AnimatedWebImage style={[styles.staticCloud, this._getInterpolate(this.animCloud2)]} name="flower/talent_cloud"/>
        <AnimatedWebImage style={[styles.staticCloud, this._getInterpolate(this.animCloud3)]} name="flower/talent_cloud"/>
      </View>
    )
  }

  _getInterpolate = (animated) => {
    return {
      transform: [{
        translateX: animated.interpolate({
          inputRange: [0, 9],
          outputRange: [0, 0 - CLOUD_MOVE],
        }),
      }],
      opacity: animated.interpolate({
        inputRange: [0, 1, 8, 9],
        outputRange: [0, 1, 1, 0],
      }),
    }
  }

  _playLoop = (animated) => {
    if(animated) {
      animated.setValue(0)
      Animated.timing(animated, {
        toValue: 9,
        duration: TIME * 1000,
        delay: DELAY_TIME * 1000,
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            this._playLoop(animated)
          }
        })
    }
  }

  play = () => {
    Animated.timing(this.animCloud1, {
      toValue: 9,
      duration: TIME * 1000,
      useNativeDriver: true,
    })
      .start()
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    right: 0,
    width: CONTAINER_WIDTH,
    height: CLOUD_HEIGHT,
  },
  staticCloud: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CLOUD_WIDTH,
    height: CLOUD_HEIGHT,
  }
})
