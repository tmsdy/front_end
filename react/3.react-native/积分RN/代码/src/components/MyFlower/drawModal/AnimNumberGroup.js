/**
 * Created by liuzhimeng.
 * @date 2019-03-14
 * @description 抽奖数字
 */

import React, {PureComponent} from 'react'
import {Animated, Easing} from 'react-native'
import {View} from '@iqiyi/rn-ui'
import ReduxUtil from '../../../common/ReduxUtil'
import WebImage from '../../WebImage'

export default class AnimNumberGroup extends PureComponent {
  static defaultProps = {
    list: [],
    options: {},
  }

  constructor(props) {
    super(props)

    this.anmiNumberGroup = this.props.list.map(() => ReduxUtil.createRef())
  }


  render() {
    return (
      <WebImage style={styles.container} name="flower/number-bg">
        <View style={styles.innerContainer}>
          {this.props.list.map(({id, ...i}, index) => (
            <DrawNumber
              key={id}
              ref={this.anmiNumberGroup[index]}
              {...this.props.options}
              {...i}
            />
          ))}
        </View>
      </WebImage>
    )
  }

  play = () => {
    for(const anmiNumber of this.anmiNumberGroup) {
      anmiNumber.getInstance().then(ref => ref.play())
    }
  }
}

const NUMBER_SPACE = 2.5
const NUMBER_HEIGHT = 627.5 + NUMBER_SPACE
const NUMBER_COUNT = 4
const NUMBER_WIDTH = 49
const NUMBER_ITEM_HEIGHT = NUMBER_HEIGHT / 10

class DrawNumber extends PureComponent {
  static defaultProps = {
    result: 8,
    time: 3,
    delay: 0,
  }

  constructor(props) {
    super(props)

    this.imgList = Array.from({length: NUMBER_COUNT + 1}).map((_, k) => `img${k}`)

    this.animNumber = new Animated.Value(0)

    this.DISTANCE_MAP = {
      start: 0,
      highSpeed: NUMBER_COUNT * NUMBER_ITEM_HEIGHT, // 高速移动的起始位置
      slowDown: (10 * NUMBER_COUNT - 4 - (10 - this.props.result + 3)) * NUMBER_ITEM_HEIGHT, // 开始减速的位置
      end: (NUMBER_HEIGHT * NUMBER_COUNT + NUMBER_ITEM_HEIGHT * 2) - (10 - this.props.result) * NUMBER_ITEM_HEIGHT,
    }
  }

  componentWillUnmount() {
    this.animNumber.stopAnimation()
    this.animNumber = null
  }

  render() {
    const {start, end} = this.DISTANCE_MAP

    return (
      <View style={styles.numContainer}>
        <Animated.View
          style={[styles.scrollContainer, {
            transform: [{
              translateY: this.animNumber.interpolate({
                inputRange: [0, 1],
                outputRange: [start, 0 - end],
              }),
            }],
          }]}
        >
          {this.imgList.map(id => (
            <View style={styles.numImageContainer}>
              <WebImage key={id} name="flower/number" style={styles.numImage}/>
            </View>
          ))}
        </Animated.View>
      </View>
    )
  }

  play = () => {
    Animated.timing(this.animNumber, {
      toValue: 1,
      duration: this.props.time * 1000,
      delay: this.props.delay * 1000,
      easing: Easing.bezier(1, 0, 0, 1),
      useNativeDriver: true,
    })
      .start()
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 77,
    left: 39.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 167,
    height: 69.5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: NUMBER_WIDTH * 3 + 3 * 4,
    height: 62.8,
  },

  // 单个数字
  numContainer: {
    width: 49,
    height: 62.8,
    overflow: 'hidden',
    zIndex: 0,
  },
  scrollContainer: {
    alignItems: 'center',
    width: NUMBER_WIDTH,
    marginTop: 0 - NUMBER_ITEM_HEIGHT * 7,
  },
  numImageContainer: {
    width: NUMBER_WIDTH,
    height: NUMBER_HEIGHT,
    justifyContent: 'center',
  },
  numImage: {
    width: NUMBER_WIDTH,
    height: NUMBER_HEIGHT - NUMBER_SPACE,
  },
})
