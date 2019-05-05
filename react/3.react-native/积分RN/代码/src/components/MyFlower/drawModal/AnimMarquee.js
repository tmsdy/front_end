/**
 * Created by liuzhimeng.
 * @date 2019-03-14
 * @description 跑马灯
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'

import {View} from '@iqiyi/rn-ui'

import {DRAW_ENUM} from '../../../constants/IntegralEnum'

import {AnimatedWebImage} from '../../WebImage'

const {PERIOD} = DRAW_ENUM

const TIME_MAP = {
  [PERIOD.Before]: 360,
  [PERIOD.In]: 200,
  [PERIOD.After]: 80,
}

export default class AnimMarquee extends PureComponent {
  static defaultProps = {
    period: PERIOD.Before,
  }

  constructor(props) {
    super(props)

    this.animMarquee = new Animated.Value(0)
    this.animOpacity = new Animated.Value(0)
    this.timeouter = null
    this.animValue = 0
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animMarquee.stopAnimation()
    this.animMarquee = null
    this.animOpacity.stopAnimation()
    this.animOpacity = null

    clearTimeout(this.timeouter)
    this.timeouter = null
  }

  render() {
    return (
      <View style={styles.container}>
        <AnimatedWebImage
          name="flower/light-purple"
          style={[styles.light, {
            transform: [
              {
                scaleX: this.animMarquee.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, -1],
                }),
              },
              {perspective: 1000},
            ],
            opacity: this.animOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.2],
            }),
          }]}
        />
        <AnimatedWebImage
          name="flower/light-white"
          style={[styles.light, {
            transform: [{
              scaleX: this.animMarquee.interpolate({
                inputRange: [0, 1],
                outputRange: [1, -1],
              }),
            }],
            opacity: this.animOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1],
            }),
          }]}
        />
      </View>
    )
  }

  play = () => {
    const {period} = this.props
    const time = TIME_MAP[period]
    const delay = period === PERIOD.After ? 0 : 40

    this.animValue++

    this._opacityPlay(time, delay)

    this.timeouter = setTimeout(() => {
      if(this.animMarquee) {
        this.animMarquee.setValue(this.animValue % 2)
        if(this.timeouter) {
          this.play()
        }
      }
    }, time)
  }

  _opacityPlay = (time, delay) => {
    if(this.animOpacity) {
      this.animOpacity.setValue(0)
      Animated.timing(this.animOpacity, {
        toValue: 1,
        duration: time - delay,
        delay,
        useNativeDriver: true,
      })
        .start()
    }
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 65.5,
    left: 27.5,
    width: 191.5,
    height: 96.5,
  },
  light: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 191.5,
    height: 96.5,
  }
})
