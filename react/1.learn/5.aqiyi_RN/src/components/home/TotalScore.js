/**
 * Created by kerwinliu on 2018/6/30.
 */
/*
* 用户总的积分
* */
import React, {Component} from 'react'
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import WebImage from '../WebImage'


@connect(({scoreInfo}) => {
  return {
    totalScore: scoreInfo.totalScore || 0,
  }
}, null, null, {withRef: true})
export default class extends Component {
  static defaultProps = {
    updateScore: () => null,
    from: 'list', // 默认是列表页
  }

  constructor(props) {
    super(props)

    this.animCoinJump = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line
    if(nextProps.totalScore !== this.props.totalScore) {
      this.props.updateScore(nextProps.totalScore)
    }
  }

  render() {
    const {from, gotoHomePage, totalScore} = this.props
    if(from === 'flower') {
      return (
        <View style={styles.container}>
          {/* 分成两层是为了修复bug: 半边圆角的矩形在ios上背景无法cover整个View */}
          <View style={styles.bg}>
            <View style={styles.bgColor}/>
          </View>
          <Animated.View
            style={{
              transform: [{
                translateY: this.animCoinJump.interpolate({
                  inputRange: [0, .25, .5, .75, 1],
                  outputRange: [0, -12, 0, -5, 0],
                }),
              }],
            }}
          >
            <WebImage name="myflower_score" style={styles.scoreIcon}/>
          </Animated.View>
          <Text style={styles.scoreText}>{totalScore}</Text>
          <TouchableOpacity onPress={gotoHomePage}>
            <WebImage name="plus_icon_cash" style={styles.plusIcon}/>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={[styles.center, this.props.style]}>
        <Text style={StyleSheet.flatten([styles.points, this.props.textStyle])}>{totalScore}</Text>
        {from === 'home' && <WebImage name="home_numi" style={{width: 25, height: 25, marginLeft: 1}}/>}
        {from === 'list' && <WebImage name="home_numi" style={StyleSheet.flatten([{width: 18, height: 18, marginLeft: 2}, this.props.IconStyle])}/>}
      </View>
    )
  }

  playCoinJumpAnimated = () => { // 播放金币弹跳动画
    this.animCoinJump.setValue(0);
    Animated.timing(this.animCoinJump, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    })
      .start();
  };
}
const styles = StyleSheet.create({
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  points: {
    backgroundColor: 'transparent',
    color: '#FF8317',
    fontSize: 15,
  },
  container: {
    width: 89,
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 33,
    borderBottomLeftRadius: 33,
  },
  bgColor: {
    flex: 1,
    height: 33,
    backgroundColor: '#FFF',
  },
  scoreIcon: {
    width: 22,
    height: 23,
  },
  scoreText: {
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
});
