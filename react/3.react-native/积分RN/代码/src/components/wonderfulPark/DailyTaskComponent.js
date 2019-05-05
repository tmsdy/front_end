/**
 * Created by liuzhimeng.
 * @date 2018-12-27
 * @description 奇妙乐园任务列表，大部分复制自任务中心，维护两套代码，心累
 */
import React, {PureComponent} from 'react'
import {View} from 'react-native'
import PropTypes from 'prop-types'

import {Text} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import {isCompleted, isDone, TaskItem} from './TaskItem'
import {blockDownload} from '../../common/util'
import WebImage from '../../components/WebImage'
import TabTitle from './TabTitle'

import {COLOR_PRIMARY} from '../../constants/baseStyles'
import {CONTENT_PADDING_HORIZONTAL} from './constants'

function filterBlockData(data) {
  const completed = data.filter(t => isCompleted(t) && !isDone(t) && t.channelCode !== 'Sign')
  const todo = data.filter(t => !isCompleted(t) && !isDone(t) && t.channelCode !== 'Sign')
  const done = data.filter(t => isDone(t))
  return [...completed, ...todo, ...done]
}

function getSortedTask(data) {
  return filterBlockData(blockDownload(data))
}

export default class extends PureComponent {
  static propTypes = {
    signData: PropTypes.object,
  }

  static defaultProps = {
    signData: {},
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      notDoneList: getSortedTask(nextProps.dailyTasks), // 待领取->待完成->已完成
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      notDoneList: getSortedTask(this.props.dailyTasks), // 未领取 由于是自动签到，所以签到不会出现在首页
    }
  }

  render() {
    const {signData: {lastScore = 0}} = this.props
    return (
      <View style={styles.taskContainer}>
        <View style={styles.titleWrapper}>
          <TabTitle
            title="今日任务"
            showLookMore={true}
            renderLookMoreComponent={(
              <View style={styles.restScoreContainer}>
                <Text style={styles.restScore}>还可领取<Text style={styles.restScoreNumber}>{lastScore}</Text></Text>
                <WebImage name="home_numi" style={styles.scoreIcon}/>
              </View>
            )}
            onPress={this.props.openTaskList}
          />
        </View>
        <View style={{width: '100%'}}>
          {this.state.notDoneList.map(this.renderItem)}
        </View>
      </View>
    )
  }

  renderItem = (task) => {
    const {
      touchRuleBtnClick: touchClick,
      handleTaskClick: handleClick,
      isVIP,
      refreshDailyTask,
    } = this.props
    const {channelCode: key, channelGroup} = task
    const taskItemProps = {
      key,
      task,
      touchClick,
      handleClick,
      refreshDailyTask,
      from: 'home',
    }
    if(channelGroup === 21) {
      // 挑战任务类型 vip 任务特殊处理
      const isvip = task.exts.filter(e => e.name === 'isvip')[0]
      if(isvip) {
        if(isVIP && isvip.value === '1') {
          return <TaskItem {...taskItemProps} viplabel={true}/>
        } else if(!isVIP && isvip.value === '0') {
          return <TaskItem {...taskItemProps}/>
        } else if(isVIP && isvip.value === '0' && isCompleted(task)) {
          return <TaskItem {...taskItemProps}/>
        }
        return null
      }
      return <TaskItem {...taskItemProps}/>
    }
    return (
      <TaskItem {...taskItemProps} showDoubleCard={this.props.showDoubleCard}/>
    )
  }
}

const styles = BaseStyleSheet.create({
  taskContainer: {
    alignItems: 'center',
    width: DEVICE_WIDTH,
    marginBottom: 10,
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
  },
  titleWrapper: {
    width: '100%',
  },
  dailytaskTitle: {
    width: 151.5,
    height: 29,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -12,
    flexDirection: 'row',
  },
  dailytaskTitleWrapper: {
    fontSize: 12,
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  restScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restScore: {
    fontSize: 12,
    color: '#333333',
  },
  restScoreNumber: {
    fontSize: 12,
    color: COLOR_PRIMARY,
  },
  scoreIcon: {
    width: 15,
    height: 15,
    marginLeft: 4.5,
  },
})
