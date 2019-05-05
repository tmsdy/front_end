/**
 * Created by liuzhimeng.
 * @date 2019-01-09
 * @description 改种金钱花弹窗
 */
import React, {PureComponent} from 'react'
import {Animated, Easing, TouchableOpacity} from 'react-native'

import {View, Text} from '@iqiyi/rn-ui'

import {getCDNUrl} from '../../../constants/configs'

import WebImage from '../../WebImage'
import {sendClickPingback} from '../../../common/pingback';

const TIMES = 2


export default class ReplantBox extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rotateValue: new Animated.Value(0),
      boxVisible: true
    }
  }

  componentDidMount() {
    this.showActive()
  }

  render() {
    const {boxVisible} = this.state
    if(!boxVisible) {
      return null
    }
    return (
      <View style={styles.animateBox}>
        <Animated.Image
          source={{uri: getCDNUrl('flower_faguang')}}
          style={[styles.shineImage, {
            transform: [{
              rotate: this.state.rotateValue.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          }]}
        />
        <WebImage name="flower_star" style={styles.starImage}/>
        <WebImage name="myflower_duzi_1" style={styles.duziImage}/>
        <TouchableOpacity activeOpacity={1} style={styles.plantBtn} onPress={this.replant}>
          <Text style={styles.replantText}>继续种植</Text>
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
      .start(() => {
        if(this.props.isVisible) {
          this.showActive()
        }
      })
  }

  replant = () => {
    sendClickPingback('flower_page', 'result_rose', 'goplant_rose')
    this.setState({
      boxVisible: false
    }, () => {
      this.props.showSelectSeedBox()
      // this.props.replant()
    })
  }
}

const styles = BaseStyleSheet.create({
  animateBox: {
    width: 204,
    height: 204,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 110,
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
  shineImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 204,
    height: 204,
  },
  plantBtn: {
    width: 120,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  replantText: {
    color: '#FF7803',
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: BaseStyleSheet.FontWeight.Medium
  }
})
