/**
 * Created by liuzhimeng.
 * @date 2019-03-15
 * @description 抽奖成功鲜花效果
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'
import {View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {AnimatedWebImage} from '../../WebImage'

export default class AnimFlower extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      opacity: 0,
    }

    this.animFLower = new Animated.Value(0)
  }

  componentWillUnmount() {
    this.animFLower.stopAnimation()
    this.animFLower = null
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="none">
        <AnimatedWebImage
          name="flower/success-flower"
          style={[styles.flowerImage, {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.animFLower.interpolate({
                  inputRange: [0, 360, 640, 880],
                  outputRange: [0, 1.1, 1.06, 1.08],
                }),
              },
            ],
          }]}
        />
      </View>
    )
  }

  play = () => {
    this.setState({opacity: 1}, () => {
      Animated.timing(this.animFLower, {
        toValue: 880,
        duration: 880,
        useNativeDriver: true,
      })
        .start()
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 280,
  },

  flowerImage: {
    width: 274,
    height: 252,
  }
})
