import React, {Component} from 'react'
import {Image, Text, View} from '@iqiyi/rn-ui'
import {isIphone5} from '@iqiyi/rn-utils'
import {Animated, TouchableHighlight, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import WebImage from './WebImage'
import {lessText} from '../common/util'
import {sendClickPingback} from '../common/pingback'
import {getReward as getRewardFn, getVipRewards} from '../api'

import {showToast} from '../common/QYNativeBridge'
import {changeTotalScore} from '../actions/TotalScoreActions'
import {TOUCH_COLORFUL_MASK, TOUCH_LIGHT_MASK} from '../constants/touchableStyle'
import GradientView from '../components/GradientView'

const VIP_TASK_MAP = {
  vip_sixcharge: '8a2186bb5f7bedd4',
  vip_wechatmp: '843376c6b3e2bf00',
  vip_autocharge: 'acf8adbb5870eb29',
  vip_memberclub: 'b6e688905d4e7184',
}


// 任务已完成且领取奖励
export function isDone(task) {
  if(task.limitTotal === 1) {
    // 一次性任务  总共完成次数 小于等于 总共领取次数
    return task.limitTotal <= task.getRewardTotalCount
  } else {
    // 每日性任务 每日限制次数 === 完成次数，并且 每日限制次数 <= 每日领取次数
    return (task.limitPerDay <= task.processCount) && (task.limitPerDay === task.getRewardDayCount)
  }
}

// 任务已完成未领取奖励
export function isCompleted(task) {
  if(task.limitTotal === 1) {
    // 一次性任务  总共完成次数 大于 总共领取次数
    return task.processTotalCount && task.processTotalCount > task.getRewardTotalCount
  } else {
    // 每日性任务
    return (task.processCount && task.processCount > task.getRewardDayCount) || (task.status === 0)
  }
}

function CustomButton({task, area, button, handleClick, getReward}) {
  let title = ''

  if(task.channelCode === 'Sign') {
    title = area ? '簽到' : '签到'
  } else if(task.channelCode === 'View') {
    title = area ? '去觀看' : '去观看'
  } else if(button) {
    title = button
  } else {
    title = '去完成'
  }

  return (
    isCompleted(task)
      ? (
        <TouchableHighlight {...TOUCH_COLORFUL_MASK} onPress={getReward} style={[styles.task_button, {borderRadius: 24, backgroundColor: '#FF7E00'}]}>
          <Text style={[styles.task_button_text, {color: '#ffffff', backgroundColor: '#FF7E00'}]}>领取</Text>
        </TouchableHighlight>
      )
      : (
        <TouchableHighlight{...TOUCH_LIGHT_MASK} onPress={handleClick} style={[styles.task_button, {borderRadius: 24}]}>
          <Text style={[styles.task_button_text, {color: '#ff6600', backgroundColor: 'transparent'}]}>{title}</Text>
        </TouchableHighlight>
      )
  )
}

function filterTaskName(task) {
  switch (task.channelCode) {
    case 'Sign':
      return '每日簽到';
    case 'View':
      return '觀看視頻30分鐘';
    case 'Share':
      return '分享視頻';
    default:
      break;
  }
}

function getTaskName(name) {
  return (isIphone5() ? lessText(name) : name)
}

@connect(null, dispatch => bindActionCreators({changeTotalScore}, dispatch))
export class TaskItem extends Component {

  static defaultProps = {
    getData: () => null, // 列表页获取后需要刷新 TODO 改成redux 刷新方式，本期时间不够，下次再改
    from: 'list' //  列表页领取后需要刷新首页数据，首页领取后不需要刷新
  }

  // 有新的参数 则需要修改掉一次性状态
  static getDerivedStateFromProps(nextProps) {
    const {task} = nextProps
    // 只有未领取的情况下，一次性的 已领取 状态才会出现
    return {
      isDoneStatus: isDone(task)
    }
  }

  constructor(props) {
    super(props)
    const {task} = this.props
    this.state = {
      isGetScore: false, // 默认都是未领取的动作 ,一次性状态
      animatedValue: {
        top: new Animated.Value(0),
        opacity: new Animated.Value(0)
      },
      isDoneStatus: isDone(task) // 专门针对当前item是否已领取
    }
  }

  render() {
    // area 台湾和大陆区分
    const {task, viplabel, area, handleClick, touchClick, showDoubleCard} = this.props
    const {exts, multiple, icon, button} = task
    const notes = exts.filter(e => e.name === 'notes')[0]
    const {animatedValue, isGetScore, isDoneStatus} = this.state
    const isDouble = !!multiple && !!showDoubleCard

    return (
      <View style={[styles.rowContainer, styles.taskRow]}>
        <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Image source={{uri: icon}} style={{width: 35, height: 35}}/>
            {viplabel && <WebImage name="vip_label" style={{width: 36, height: 20, marginTop: -10}}/>}
          </View>
          <View style={styles.task_wrap}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.task_title}>{area ? getTaskName(filterTaskName(task)) : getTaskName(task.channelName)}</Text>
              {!!notes &&
              <TouchableOpacity onPress={touchClick} activeOpacity={1}>
                <WebImage name="ic_wenhao_home" style={{width: 15, height: 15, marginHorizontal: 3}}/>
              </TouchableOpacity>
              }
            </View>
            <View style={styles.description}>
              {isDouble && (
                <GradientView style={styles.scoreLabel} startColor="#FF3B30" endColor="#FD6540">
                  <Text style={styles.scoreDoubleText} numberOfLines={1}>积分x2</Text>
                </GradientView>
              )}
              <Text style={styles.task_desc}>
                积分值+{task.score}
                {task.channelGroup === 20 && (
                  <Text style={styles.task_desc}>
                    ，完成<Text style={{color: '#FF7E00'}}>{task.processCount}</Text>/{task.limitPerDay}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>
        <View style={{width: 82, justifyContent: 'center', alignItems: 'flex-end'}}>
          {(isGetScore && !isDoneStatus)
            ? (
              <React.Fragment>
                <View style={[styles.task_button, {borderColor: 'transparent', backgroundColor: '#D8D8D8'}]}>
                  <Text style={{fontSize: 14, color: '#ffffff'}}>已领取</Text>
                </View>
                <Animated.View style={[styles.animatedScore, {opacity: animatedValue.opacity, top: animatedValue.top}]}>
                  <Text style={{color: '#FF7E00'}}>{this._setScoreRewardText(task.score, isDouble)}</Text>
                  <WebImage name="home_numi" style={{width: 15, height: 15, marginLeft: 2}}/>
                </Animated.View>
              </React.Fragment>
            )
            : isDoneStatus
              ? (
                <View style={[styles.task_button, {borderColor: 'transparent', backgroundColor: '#D8D8D8'}]}>
                  <Text style={{fontSize: 14, color: '#ffffff'}}>已完成</Text>
                </View>
              )
              : <CustomButton task={task} area={area} button={button} handleClick={handleClick} getReward={this.getReward}/>
          }
        </View>
      </View>
    )
  }

  _setScoreRewardText = (score, isDouble) => {
    return isDouble ? `${score} x2` : `+${score}`
  }

  getReward = () => {
    const {task, from, getData, showDoubleCard, onRewardBack} = this.props
    const {channelCode, score, multiple} = task;
    const isDouble = !!multiple && !!showDoubleCard

    sendClickPingback('homeRN', 200400, `getreward_${channelCode}`);

    if(channelCode && VIP_TASK_MAP[channelCode]) {
      getVipRewards({taskCode: VIP_TASK_MAP[channelCode]}).catch((err) => {
        showToast(err.message)
      })
    }

    getRewardFn({channelCode})
      .then(() => {
        this.setState({isGetScore: true}, () => {
          this._startAnimation()
          if(from === 'home') {
            const changeScore = isDouble ? score * 2 : score
            this.props.changeTotalScore(changeScore)
            onRewardBack && onRewardBack(task)
          } else {
            setTimeout(() => {
              getData && getData()
            }, 700)
          }
        })
      })
      .catch(() => {
        showToast('系统繁忙，请稍后再试')
      })
  }

  _startAnimation = () => {
    const animDuration = 700;
    const commonConfig = {
      duration: animDuration,
    }
    const {animatedValue} = this.state
    animatedValue.opacity.setValue(1)
    Animated.parallel([
      Animated.timing(animatedValue.top, {
        toValue: -40,
        ...commonConfig,
      }),
      Animated.timing(animatedValue.opacity, {
        toValue: 0,
        ...commonConfig,
      })
    ])
      .start();
  }
}


const styles = BaseStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskRow: {
    height: 70,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 1
  },
  task_wrap: {
    marginLeft: 11,
    flex: 1,
  },
  task_title: {
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  scoreLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 39,
    height: 14,
    marginRight: 4,
    paddingHorizontal: 4,
    borderRadius: 7,
  },
  scoreDoubleText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  task_desc: {
    fontSize: 12,
    color: '#999999',
    backgroundColor: 'transparent',
  },
  task_button: {
    padding: 0,
    width: 80,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 1.5,
    borderColor: '#FF7E00',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  task_button_text: {
    flex: 1,
    width: 77,
    lineHeight: 27,
    fontSize: 14,
    textAlign: 'center',
  },
  animatedScore: {
    position: 'absolute',
    width: 82,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    left: 0,
    backgroundColor: 'transparent',
    height: 30,
    flexDirection: 'row'
  }
})
