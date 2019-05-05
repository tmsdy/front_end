/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 积分中心种子弹窗
 */

import React, {PureComponent} from 'react'
import {Animated, Easing, TouchableOpacity} from 'react-native'
import {View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, Width as DEVICE_WIDTH, isIOS} from '@iqiyi/rn-utils'

import BaseStyleSheet from '../../../common/BaseStyleSheet'

import WebImage, {AnimatedWebImage} from '../../WebImage'

const TIMES = 2
const SEED_TITLE_IMAGE = isIOS ? 'flower_cash_replant_title_guide_ios' : 'flower_cash_replant_title_guide_android'

interface FlowerSeedProps {
  hideConfirmModal(): any;
  goTo(s: string): void;
}

interface FlowerSeedState {
  rotateValue: Animated.Value;
}

export default class FlowerSeed extends PureComponent<FlowerSeedProps, FlowerSeedState> {
  constructor(props: FlowerSeedProps) {
    super(props)
    this.state = {
      rotateValue: new Animated.Value(0),
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.animateBox}>
          <AnimatedWebImage
            name="flower_faguang"
            style={[styles.shineImage, {
              transform: [{
                rotate: this.state.rotateValue.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              }],
            }]}
          />
          <WebImage name="flower/flower_star_v2" style={styles.starImage} />
          <WebImage name="myflower_duzi_1" style={styles.duziImage} />
        </View>
        <WebImage name={SEED_TITLE_IMAGE} style={styles.titleImage} />
        <TouchableOpacity onPress={this.onPress} style={{marginTop: 52}}>
          <WebImage name="flower_zhongxia_btn" style={{width: 112, height: 46}} />
        </TouchableOpacity>
      </View>
    )
  }

  showActive = () => {
    this.state.rotateValue.setValue(0)
    Animated.timing(this.state.rotateValue, {
      toValue: 90 * TIMES,
      duration: 800 * TIMES,
      easing: Easing.linear,
      useNativeDriver: true,
    })
      .start(({finished}) => {
        if(finished) {
          this.showActive()
        }
      })
  }

  onPress = () => {
    this.props.hideConfirmModal().then(() => {
      this.props.goTo('MyFlower')
    })
  }
}

const styles = BaseStyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animateBox: {
    width: 204,
    height: 204,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  starImage: {
    width: 88,
    height: 73,
    position: 'absolute',
    top: 58,
    left: 66,
  },
  duziImage: {
    width: 59,
    height: 50,
    position: 'absolute',
  },
  titleImage: {
    position: 'absolute',
    top: 240,
    left: (DEVICE_WIDTH - 255) / 2,
    width: 255,
    height: 50,
  },
  shineImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 204,
    height: 204,
  },
})
