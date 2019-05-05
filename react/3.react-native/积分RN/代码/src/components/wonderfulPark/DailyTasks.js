/**
 * Created by liuzhimeng.
 * @date 2018-12-17
 * @description 今日任务
 */

import React, {Component, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {HomePageRuleModal, HomePageRuleSignModal} from '../MedalModalBox'
import DailyTaskComponent from './DailyTaskComponent'
import {isCompleted} from '../TaskItem'
import {getGuestTaskList, getUserTaskList} from '../../model/wonderfulPark'
import {handleTaskItemClick} from '../../common/handleTaskClick'
import {filterExts} from '../../common/util'
import {sendClickPingback} from '../../common/pingback'
import {GO_TASK_LIST_CLICK, PARK_PAGE} from './pingback'

export default class DailyTask extends Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    isVIP: PropTypes.bool,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    goTo: PropTypes.func,
    showRule: PropTypes.func,
  }

  static defaultProps = {
    isLogin: false,
    isVIP: false,
    userId: '',
    goTo: () => null,
    showRule: () => null,
  }

  constructor(props) {
    super(props)
    this.state = {
      signData: {},
      dailyTasks: [],
      showDoubleCard: false,
      expireTime: 0,
    }
  }

  componentDidMount() {
    this.getTaskData(true)
  }

  render() {
    return !!this.state.dailyTasks.length && (
      <DailyTaskComponent
        isVIP={this.props.isVIP}
        goTo={this.props.goTo}
        dailyTasks={this.state.dailyTasks}
        signData={this.state.signData}
        showDoubleCard={this.state.showDoubleCard}
        expireTime={this.state.expireTime}
        handleTaskClick={this.handleTaskClick}
        openTaskList={this.openTaskList}
        touchRuleBtnClick={this.touchRuleBtnClick}
        refreshDailyTask={this.props.refreshDailyTask}
      />
    )
  }

  getTaskData = async (isInit = false) => {
    if(this.props.isLogin) {
      const {taskList, hasDoubleCard, expireTime} = await getUserTaskList(this.props.userId)
      this.setTaskData(taskList)
      if(hasDoubleCard) {
        this.setState({expireTime, showDoubleCard: true})
      }
    } else {
      const taskList = await getGuestTaskList()
      this.setTaskData(taskList)
    }
    // 非初次加载更新数据时，更新首页任务列表
    if(!isInit) {
      this.props.refreshDailyTask()
    }
  }

  // 任务列表数据
  setTaskData = (data) => {
    const {taskList = []} = data
    const dailyTasks = this._filterDailyTask(taskList.filter(t => t.exts && [20, 21].includes(t.channelGroup)))
    this.setState({signData: data, dailyTasks})
  }

  // 过滤每日任务，会员任务有特殊逻辑不展示
  _filterDailyTask = (list) => {
    const {isVIP} = this.props
    return list.filter((task) => {
      const {channelGroup} = task
      if(channelGroup === 21) {
        // 挑战任务
        const isvip = task.exts.filter(e => e.name === 'isvip')[0]
        if(isvip) {
          if((isVIP && isvip.value === '1')
            || (!isVIP && isvip.value === '0')
            || (isVIP && isvip.value === '0' && isCompleted(task))
          ) {
            return true
          }
          return false
        }
        return true
      }
      return true
    })
  }

  // 展示任务规则
  touchRuleBtnClick = (task) => {
    const {exts = []} = task
    const mode = filterExts(exts, 'tasklistType') === 'sign' ? 'sign' : 'default'
    this.props.showRule(mode, task)
  }

  // 做任务赚积分
  handleTaskClick = (task) => {
    handleTaskItemClick(task, this.props.isLogin, this.props.openWeb, this.props.screenProps.uniqueID, {rpage: PARK_PAGE})
  }

  // 打开任务列表页面
  openTaskList = () => {
    sendClickPingback(PARK_PAGE, '', GO_TASK_LIST_CLICK)
    this.props.goTo('TaskList', {
      // 任务列表页面回退到乐园页面需要更新乐园的任务列表
      refreshDailyTask: () => {
        this.getTaskData(false)
      },
    })
  }
}

const RuleComponent = ({mode, ...left}) => {
  return mode === 'sign' ? <HomePageRuleSignModal {...left}/> : <HomePageRuleModal {...left}/>
}

export class RuleModal extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    isVisible: PropTypes.bool,
    content: PropTypes.object,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    mode: 'default',
    isVisible: false,
    content: {},
    onPress: () => null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.mode !== prevState.mode) {
      return {
        mode: nextProps.mode,
      }
    }
    return null
  }


  constructor(props) {
    super(props)
    this.state = {
      mode: this.props.mode,
    }
  }

  render() {
    return (
      <RuleComponent
        mode={this.state.mode}
        homePageRuleVisble={this.props.isVisible}
        _hideRuleModal={this.props.onPress}
        ruleTask={this.props.content}
      />
    )
  }
}
