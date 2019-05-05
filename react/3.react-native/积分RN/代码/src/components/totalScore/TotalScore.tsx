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
import BaseStyleSheet from '../../common/BaseStyleSheet';

interface TotalScoreProps {
  updateScore?: Function;
  gotoHomePage?: Function;
  from?: string;
  totalScore?: number | string;
  textStyle?: any;
  style?: any;
  IconStyle?: any;
}

@(connect(({scoreInfo}) => {
  return {
    totalScore: scoreInfo.totalScore || 0,
  }
}, null, null, {withRef: true}) as any)
export default class extends Component<TotalScoreProps, {}> {
  static defaultProps = {
    updateScore: () => null,
    from: 'list', // 默认是列表页
  }

  private animCoinJump = new Animated.Value(0);

  componentWillReceiveProps(nextProps) { // eslint-disable-line
    if(nextProps.totalScore !== this.props.totalScore) {
      this.props.updateScore(nextProps.totalScore)
    }
  }

  render() {
    const {from, gotoHomePage, totalScore} = this.props
    if(from === 'flower') {
      return (
        <TouchableOpacity activeOpacity={1} onPress={() => gotoHomePage()} style={styles.container}>
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
          <View style={styles.rightButton}>
            <Text style={styles.earnText}>赚取</Text>
          </View>
        </TouchableOpacity>
      )
    }
    // 新版积分中心首页
    if(from === 'homePage') {
      return (
        <View style={homePageStyles.content}>
          <Text style={homePageStyles.score} numberOfLines={1}>{totalScore} </Text>
          <View style={homePageStyles.scoreDesp}>
            <WebImage name="myflower_score" style={{width: 14, height: 14}}/>
            <Text style={homePageStyles.scoreText}>积分</Text>
            <WebImage name="homepage/gray_more" style={{width: 5, height: 8, marginLeft: 2, marginTop: 1}}/>
          </View>
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
    minWidth: 89,
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4.5,
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  bgColor: {
    flex: 1,
    height: 30.5,
    backgroundColor: 'rgba(255,255,255, 0.8)',
  },
  scoreIcon: {
    width: 22,
    height: 23,
  },
  scoreText: {
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 1
  },
  plusIcon: {
    width: 20,
    height: 20,
  },
  rightButton: {
    width: 43,
    height: 23,
    backgroundColor: '#ff7529',
    borderRadius: 11.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  earnText: {
    fontSize: 12,
    color: '#fff'
  }
});

const homePageStyles = BaseStyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  score: {
    fontSize: 30,
    color: '#222222',
    lineHeight: 36,
    fontWeight: BaseStyleSheet.FontWeight.Bold
  },
  scoreDesp: {
    marginLeft: 2,
    height: 16.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scoreText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 3
  }
})
