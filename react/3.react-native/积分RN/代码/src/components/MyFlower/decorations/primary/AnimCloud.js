/**
 * Created by liuzhimeng.
 * @date 2019-01-22
 * @description 云朵动效
 */
import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'

import {Image} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils';

const DEFAULT_ZOOM = 1.36
const CONTAINER_WIDTH = 450

const MOVE_WIDTH = Width * DEFAULT_ZOOM + CONTAINER_WIDTH

const TIME = 60

export default class AnimCloud extends PureComponent {
  constructor(props) {
    super(props)
    this.animTranslate = new Animated.Value(0)
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animTranslate.stopAnimation()
  }

  render() {
    return (
      <Animated.View
        style={[styles.container, {
          transform: [{
            translateX: this.animTranslate.interpolate({
              inputRange: [0, 1],
              outputRange: [0, MOVE_WIDTH],
            }),
          }],
        }]}
        pointerEvents="none"
      >
        <Image style={styles.bigCloud} source={{uri: 'integral_cloud_big'}}/>
        <Image style={styles.smallCloud} source={{uri: 'integral_cloud_small'}}/>
      </Animated.View>
    )
  }

  play = () => {
    if(!this.animTranslate) {
      return
    }

    this.animTranslate.setValue(0)
    Animated.timing(this.animTranslate, {
      toValue: 1,
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
    top: 65,
    left: 0 - CONTAINER_WIDTH,
    width: CONTAINER_WIDTH,
    height: 170,
  },
  bigCloud: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 230,
    height: 150,
    opacity: 0.6,
  },
  smallCloud: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 90,
    height: 55,
    opacity: 0.6,
  },
})
