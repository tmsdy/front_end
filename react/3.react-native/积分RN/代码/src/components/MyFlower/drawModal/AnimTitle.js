/**
 * Created by liuzhimeng.
 * @date 2019-03-14
 * @description 抽奖标题
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'

import {Text, View} from '@iqiyi/rn-ui'

import {DRAW_ENUM} from '../../../constants/IntegralEnum'
import {DRAW_CONFIG} from '../../../common/MyFlowerConfig'

import WebImage from '../../WebImage'

const TITLE_TEXT_MAP = {
  [DRAW_ENUM.MODE.Score]: '积分',
  [DRAW_ENUM.MODE.Vip]: '天VIP',
}
const CONTAINER_HEIGHT = 30

export default class AnimTitle extends PureComponent {
  static defaultProps = {
    mode: DRAW_ENUM.MODE.Score,
    count: 0,
  }

  constructor(props) {
    super(props)

    this.titleImageName = DRAW_CONFIG[this.props.mode].theme.title.name
    this.titleText = TITLE_TEXT_MAP[this.props.mode]

    this.animTitle = new Animated.Value(0)
  }

  componentWillUnmount() {
    this.animTitle.stopAnimation()
    this.animTitle = null
  }


  render() {
    const {count} = this.props
    return (
      <WebImage style={styles.container} name="flower/notice-bg">
        <Animated.View
          style={[styles.animTitle, {
            transform: [{
              translateY: this.animTitle.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0 - CONTAINER_HEIGHT],
              }),
            }],
          }]}
        >
          <View style={styles.titleImageWrapper}>
            <WebImage style={styles.scoreTitleBefore} name={this.titleImageName}/>
          </View>
          <Text style={styles.titleWin}>
            恭喜你获得 <Text style={styles.titleCount}>{count}</Text> {this.titleText}
          </Text>
        </Animated.View>
      </WebImage>
    )
  }

  play = () => {
    Animated.timing(this.animTitle, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    })
      .start()
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 9,
    left: 18,
    width: 209.5,
    height: CONTAINER_HEIGHT,
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  animTitle: {
    width: 209.5,
    height: CONTAINER_HEIGHT * 2,
  },
  titleImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 209.5,
    height: CONTAINER_HEIGHT,
  },
  scoreTitleBefore: {
    width: 141,
    height: 21.5,
  },
  vipTitleBefore: {
    width: 157,
    height: 31,
  },
  titleWin: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FDF2C9',
    shadowOpacity: .3,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  titleCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  }
})
