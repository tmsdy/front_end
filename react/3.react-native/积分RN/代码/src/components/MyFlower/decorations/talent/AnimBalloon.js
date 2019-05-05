/**
 * Created by liuzhimeng.
 * @date 2019-03-19
 * @description 热气球，随机运动逻辑：气球移动到下一个节点的直线距离为5，下一个节点位置随机
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'

import {AnimatedWebImage} from '../../../WebImage'

const TIME = 50 // 循环周期（秒）
const NODE_LENGTH = 10 // 节点数，进而推出每个节点耗时：TIME / NODE_LENGTH 秒
const STEP_LENGTH = 25 // 每个节点基准移动距离

export default class AnimBalloon extends PureComponent {
  constructor(props) {
    super(props)
    this.animTranslate = new Animated.Value(0)

    const randomRange = this._randomRange()
    this.randomRangeX = randomRange[0] || []
    this.randomRangeY = randomRange[1] || []
  }

  componentDidMount() {
    this.play()
  }

  componentWillUnmount() {
    this.animTranslate.stopAnimation()
  }

  render() {
    return (
      <AnimatedWebImage
        name="hot_air_balloon"
        style={[styles.container, {
          transform: [
            {translateX: this._getInterpolate(this.randomRangeX)},
            {translateY: this._getInterpolate(this.randomRangeY)},
          ],
        }]}
      />
    )
  }

  // 横纵坐标均以上个节点为基准，上下随机浮动1到 STEP_LENGTH 个距离
  _randomRange = () => {
    let x = 0
    let y = 0
    const range = [[x], [y]]

    for(let k = 0; k < NODE_LENGTH; k++) {
      if(k === NODE_LENGTH - 1) {
        range[0].push(0)
        range[1].push(0)
        break
      }

      let offsetX = (STEP_LENGTH / 2) * (Math.random() / 0.5)

      if(offsetX > STEP_LENGTH) {
        offsetX = STEP_LENGTH
      } else if(offsetX < 1) {
        offsetX = 1
      }

      let offsetY = STEP_LENGTH - offsetX

      x += x <= 0 ? offsetX : 0 - offsetX
      y += y <= 0 ? offsetY : 0 - offsetY

      x = parseInt(x.toFixed(1))
      y = parseInt(y.toFixed(1))

      range[0].push(x)
      range[1].push(y)
    }

    return range
  }

  _getInterpolate = (randoms) => {
    const config = {inputRange: [], outputRange: []}

    for(let k = 0; k < NODE_LENGTH; k++) {
      config.inputRange[k] = k
    }

    config.inputRange.push(NODE_LENGTH)
    config.outputRange = randoms

    return this.animTranslate.interpolate(config)
  }

  play = () => {
    if(this.animTranslate) {
      this.animTranslate.setValue(0)
      Animated.timing(this.animTranslate, {
        toValue: NODE_LENGTH,
        duration: TIME * 1000,
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
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 300,
    right: 160,
    width: 84,
    height: 60,
  },
})
