/**
 * Created by kerwinliu on 2018/6/28.
 */
import React, {Component} from 'react'
import {TouchableHighlight, View} from 'react-native'
import PropTypes from 'prop-types'
import {Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import {connect} from 'react-redux'
import {isCompleted, isDone, TaskItem} from '../TaskItem'
import {blockDownload} from '../../common/util'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle'
import DeepTaskList from '../DeepTask/DeepTaskList'
import ScoreCountdown, {SCORE_COUNTDOWN_RULE_TASK} from '../TaskList/ScoreCountdown'

import {sendClickPingback} from '../../common/pingback'

function filterBlockData(data) {
  const completed = data.filter(t => isCompleted(t) && !isDone(t) && t.channelCode !== 'Sign')
  const todo = data.filter(t => !isCompleted(t) && !isDone(t) && t.channelCode !== 'Sign')
  const done = data.filter(t => isDone(t))
  return [...completed, ...todo, ...done]
}

function getSortedTask(data) {
  return filterBlockData(blockDownload(data))
}

export default class extends Component {
  static propTypes = {
    title: PropTypes.string,
  }

  static defaultProps = {
    title: '今日任务',
  }

  static getDerivedStateFromProps(nextProps) {
    const {dailyTasks} = nextProps
    return {
      notDoneList: getSortedTask(dailyTasks), // 待领取->待完成->已完成
      notCompletedList: dailyTasks.filter(t => !isCompleted(t) && !isDone(t))
    }
  }

  constructor(props) {
    super(props)
    const {dailyTasks} = this.props
    this.state = {
      notDoneList: getSortedTask(dailyTasks), // 未领取 由于是自动签到，所以签到不会出现在首页
      notCompletedList: dailyTasks.filter(t => !isCompleted(t) && !isDone(t)), // ！任务已完成未领取的 && ！任务已完成且领取（这两者不重复，余下是未完成的任务）
    }
  }

  render() {
    const {touchRuleBtnClick, handleTaskClick, showSignModal, isVIP, signData, showDoubleCard, expireTime} = this.props
    // 已领取的渲染优先级最低
    const {notDoneList} = this.state
    const {signScore} = signData

    return (
      <View style={styles.taskContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 42.5, alignItems: 'center', width: Width - 24}}>
          <Text style={styles.subtitle}>{this.props.title}</Text>
          {!showDoubleCard
            ? (
              <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.dailytaskTitle} onPress={showSignModal}>
                <Text style={{fontSize: 12, color: '#999999'}}>明日签到可获<Text style={{color: '#FF7E00'}}>{signScore}</Text>积分</Text>
              </TouchableHighlight>
            )
            : <ScoreCountdown time={expireTime} onPress={this._showDoubleRuleModal}/>
          }
        </View>
        <DeepTaskList
          {...this.props}
          from="home"
          ref={(deepTaskRef) => {
            this.deepTaskRef = deepTaskRef
          }}
        />
        <View style={{paddingHorizontal: 12, width: '100%'}}>
          {notDoneList.slice(0, 5).map((task) => {
            return this.renderItem(task, touchRuleBtnClick, handleTaskClick, isVIP)
          })}
        </View>
        {this.getRestText()}
      </View>
    )
  }

  renderItem = (task, touchRuleBtnClick, handleTaskClick, isVIP) => {
    const {onRewardBack} = this.props
    const {channelGroup} = task
    if(channelGroup === 21) {
      // 挑战任务类型 vip 任务特殊处理
      const isvip = task.exts.filter(e => e.name === 'isvip')[0]
      if(isvip) {
        if(isVIP && isvip.value === '1') {
          return (
            <TaskItem
              key={task.channelCode}
              task={task}
              viplabel={true}
              touchClick={() => touchRuleBtnClick(task)}
              handleClick={() => handleTaskClick(task)}
              from="home"
              onRewardBack={onRewardBack}
            />
          )
        } else if((!isVIP && isvip.value === '0') || (isVIP && isvip.value === '0' && isCompleted(task))) {
          return (
            <TaskItem
              key={task.channelCode}
              task={task}
              handleClick={() => handleTaskClick(task)}
              touchClick={() => touchRuleBtnClick(task)}
              from="home"
              onRewardBack={onRewardBack}
            />
          )
        }
        return null
      }
    }
    return (
      <TaskItem
        key={task.channelCode}
        task={task}
        showDoubleCard={this.props.showDoubleCard}
        touchClick={() => touchRuleBtnClick(task)}
        handleClick={() => handleTaskClick(task)}
        onRewardBack={onRewardBack}
        from="home"
      />
    )
  }

  _showDoubleRuleModal = () => {
    sendClickPingback('homeRN', '', 'double_ex')
    this.props.touchRuleBtnClick(SCORE_COUNTDOWN_RULE_TASK)
  }

  getRestText = () => {
    const {openTaskList, signData} = this.props
    // 未完成的数量
    const {notCompletedList} = this.state
    const {lastScore} = signData
    // 有剩余积分未领取
    if(lastScore === 0) {
      // 全部完成
      return (
        <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.restScore} onPress={openTaskList}>
          <Text style={{fontSize: 14, color: '#FF7E00'}}>{'已完成今日任务，明天再来 >'}</Text>
        </TouchableHighlight>
      )
    }
    return <RestScore openTaskList={openTaskList} restScore={lastScore} notCompletedList={notCompletedList}/>
  }

  // 获取深度任务
  getDeepTask = () => {
    this.deepTaskRef && this.deepTaskRef.getListData()
  }

}

// 剩余可以领取的分数

@connect(({scoreInfo}) => {
  return {
    totalScore: scoreInfo.totalScore,
    additionalScore: scoreInfo.additionalScore,
  }
}, null)
class RestScore extends Component {
  constructor(props) {
    super(props)
    const {restScore} = this.props
    this.state = {
      restScore,
    }
  }

  // 今日还可以赚积分只包含未完成的任务
  render() {
    const {restScore} = this.state
    const {openTaskList} = this.props
    return (
      <React.Fragment>
        <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.restScore} onPress={openTaskList}>
          <Text style={{fontSize: 14, color: '#333'}}>{`今日还可赚${restScore}积分`}</Text>
        </TouchableHighlight>
      </React.Fragment>
    )
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.restScore !== this.props.restScore) {
      // 总分改变说明接口刷新了
      this.setState({
        restScore: nextProps.restScore
      })
    }
  }
}

const styles = BaseStyleSheet.create({
  taskContainer: {
    paddingBottom: 15,
    alignItems: 'center',
    width: Width,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8
  },
  restScore: {
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 10
  },
})
