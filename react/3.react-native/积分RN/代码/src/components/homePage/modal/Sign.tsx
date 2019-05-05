/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 签到弹窗
 */

/*
*积分连续签到弹框模块  使用注意，只在constructor接收参数，所以必须在有数据的情况下渲染，避免空数据渲染
* */
import React, {PureComponent} from 'react'
import {Animated, Easing, View} from 'react-native'

import {Text} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'

import BaseStyleSheet from '../../../common/BaseStyleSheet'
import WebImage from '../../WebImage'
import SignAnimation from './SignAnimation'

import SignScoreList from '../../../constants/signScoreList'
import px2dp from '../../../common/px2dp'

interface SignProps {
  continuousValue: number; // 已经连续签到多少天
}

interface SignState {
  animationValue: {
    translateY: Animated.Value;
    opacity: Animated.Value;
  };
}

interface DateItem {
  continuousValue: number;
  score: number;
}

export default class Sign extends PureComponent<SignProps, SignState> {
  private listener: any;

  static defaultProps = {
    continuousValue: 0, // 已经连续签到多少天
  }

  constructor(props: SignProps) {
    super(props)

    this.state = {
      animationValue: {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
      },
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {continuousValue} = this.props
    const dateList = this.getDateList(continuousValue)

    return continuousValue > 0 && (
      <View style={styles.outerView}>
        <WebImage name="101_sign_bg" style={styles.container}>
          <View style={styles.titleContent}>
            <Text style={styles.title}>签到成功</Text>
          </View>
          <View style={styles.todayScore}>
            <Text style={styles.todayScoreText}>+{this.getTodayScore(dateList)}积分</Text>
          </View>
          <View style={styles.continuous}>
            {dateList.map((item) => (
              <ContinuousItem
                key={item.continuousValue}
                item={item}
                continuousValue={continuousValue}
              />
            ))}
          </View>
        </WebImage>
        <SignAnimation />
      </View>
    )
  }

  startAnimation = (value: number) => {
    Animated.sequence([
      Animated.timing(this.state.animationValue.translateY, {
        toValue: value,
        duration: 500,
        easing: Easing.out(Easing.back(0)),
      }),
    ]).start()
  }

  getTodayScore = (dateList: DateItem[]) => {
    const {continuousValue} = this.props
    let todayScore = 0

    if(dateList && dateList.length) {
      for(const {score, continuousValue: value} of dateList) {
        if(value === continuousValue) {
          todayScore = score
          break
        }
      }
    }

    return todayScore
  }

  getDateList = (continuousValue: number): DateItem[] => {
    // 需要显示五条数据，
    const index = continuousValue - 1
    // 连续签到不满3天
    if(index <= 2) {
      return SignScoreList.slice(0, 5)
    }
    // 连续签到大于3天 小于等于 31天 ，需要显示 30天，29天的数据
    if(index > 2 && index <= 30) {
      return SignScoreList.slice(index - 2, index + 3)
    }
    // 连续签到 32 天之后，全部显示30分即可
    if(index > 30) {
      return [-1, 0, 1, 2, 3].map((item) => {
        return {
          continuousValue: index + item,
          score: 30,
        }
      })
    }
  }
}

interface ContinuousItemProps {
  item: DateItem;
  continuousValue: number;
}
// 连续icon
class ContinuousItem extends PureComponent<ContinuousItemProps, {}> {
  render() {
    const {item, continuousValue} = this.props
    const isCurrent = continuousValue === item.continuousValue
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          {
            isCurrent
              ? (
                <React.Fragment>
                  <View style={styles.radiusContent}>
                    <LinearGradient
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 1}}
                      colors={['#FF6143', '#FF38E8']}
                      style={styles.radiusContent}
                    >
                      <Text style={{fontSize: px2dp(16), color: '#fff'}}>+{item.score}</Text>
                    </LinearGradient>
                  </View>
                </React.Fragment>
              )
              : (
                <View style={styles.radiusContent}>
                  <Text style={{fontSize: px2dp(16), color: '#FEAC01'}}>+{item.score}</Text>
                </View>
              )
          }
        </View>
        <View style={styles.dayText}>
          <Text style={{fontSize: 12, color: isCurrent ? '#FF4EA1' : '#999999'}}>{item.continuousValue}天</Text>
        </View>
      </View>
    )
  }
}

const styles = BaseStyleSheet.create({
  container: {
    width: px2dp(300),
    height: px2dp(260),
    paddingTop: px2dp(80),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  outerView: {
    width: px2dp(300),
    height: px2dp(360),
    paddingTop: px2dp(100),
    alignItems: 'center',
  },
  titleContent: {
    height: px2dp(35),
    justifyContent: 'center',
  },
  title: {
    color: '#333333',
    fontSize: px2dp(22.5),
  },
  todayScore: {
    height: px2dp(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayScoreText: {
    color: '#FF7E00',
    fontSize: px2dp(17.5),
  },
  continuous: {
    height: px2dp(56),
    marginTop: px2dp(34.5),
    width: px2dp(255),
    flexDirection: 'row',
  },
  item: {
    height: px2dp(56),
    width: px2dp(36),
    marginHorizontal: px2dp(7.5),
    alignItems: 'center',
  },
  itemContent: {
    height: px2dp(40),
    width: px2dp(36),
  },
  radiusContent: {
    height: px2dp(36),
    width: px2dp(36),
    borderRadius: px2dp(18),
    backgroundColor: 'rgba(254,194,1,0.2)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    height: px2dp(17),
    marginTop: px2dp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
