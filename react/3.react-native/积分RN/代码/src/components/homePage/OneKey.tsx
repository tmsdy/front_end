/*
 * 一键领取
 * 回调方式更新
 * */
import React, {PureComponent} from 'react'
import {
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Text
} from '@iqiyi/rn-ui'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {ViewStyle} from '../../common/BaseStyleSheet'
import OneKeyStyle from './OneKeyStyle'
import GradientView from '../GradientView'
import {getAllTaskRewardAsync} from '../../common/handleTaskClick'
import {setTaskDataInfo} from '../../actions/HomePageActions'
import {fetchTaskList, fetchDeepTaskList} from '../../model/homePage'
import {changeTotalScore} from '../../actions/TotalScoreActions'
import {sendClickPingback} from '../../common/pingback'


interface OneKeyProps {
  completedList: any[];
  _getTaskReward?: Function;
  showDoubleCard?: boolean;
  allReceived?: boolean;
  style?: ViewStyle;
  expireTime?: string | number;
  showNext(cb: Function): void;
  setTaskDataInfo?: Function;
  changeTotalScore?: Function;
}

interface OneKeyState {
  title: string;
  score: number;
}

@(connect(({homePage}) => {
  const {completedList, showDoubleCard, expireTime} = homePage.homePageTaskData
  return {
    completedList,
    showDoubleCard,
    expireTime
  }
}, dispatch => bindActionCreators({setTaskDataInfo, changeTotalScore}, dispatch), null, {withRef: true}) as any)
export default class extends PureComponent<OneKeyProps, OneKeyState> {
  private isRequesting: boolean;

  static getDerivedStateFromProps(nextProps) {
    const {showDoubleCard, completedList} = nextProps
    const score = completedList.reduce((prev, curr) => {
      const isDouble = !!curr.multiple && !!showDoubleCard
      const currScore = isDouble ? parseInt(curr.score) * 2 : parseInt(curr.score)
      return parseInt(prev) + currScore
    }, 0)
    return {score};
  }

  static defaultProps = {
    completedList: [],
    _getTaskReward: () => null,
    showDoubleCard: false,
    style: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      title: '一键领取',
      score: 0
    }
  }

  render() {
    const {completedList} = this.props
    return (
      <React.Fragment>
        {
          completedList.length > 0
          ? this._renderTodo() : null
        }
      </React.Fragment>
    )
  }

  // 首页单个任务领取时候需要减少一键领取的数量
  filterList = (channelCode) => {
    const {completedList} = this.props
    return completedList.filter(t => t.channelCode !== channelCode)
  }

  // 一键领取积分
  _renderTodo = () => {
    const {completedList} = this.props

    return (
      <View style={OneKeyStyle.outer}>
        <Text style={OneKeyStyle.noticeText}>完成{completedList.length}个任务，{this.state.score}积分待领取</Text>
        <TouchableOpacity
          activeOpacity={1}
          style={OneKeyStyle.noticeButton}
          onPress={this._clickGetAllReward}
        >
          <GradientView
            style={OneKeyStyle.noticeButton}
            startColor="#FF6100"
            endColor="#FF410F"
          >
            <Text style={OneKeyStyle.buttonText}>{this.state.title}</Text>
          </GradientView>
        </TouchableOpacity>
      </View>
    )
  }

  _clickGetAllReward = () => {
    if(this.isRequesting) return false
    this.isRequesting = true
    sendClickPingback('pointcenter', '2101', 'check_1')
    getAllTaskRewardAsync(this.props.completedList).then(() => {
      this.isRequesting = false
      this.props.changeTotalScore(this.state.score)
      // 滚动动效结束后再执行刷新数据
      this.props.showNext(this.refreshTask)
    })
  }

  refreshTask = async () => {
    const deepList = await this.getDeepList()
    const taskListData = await this.getTaskList()
    this.mergeReduxTaskList(taskListData, deepList)
  }

  getDeepList = async () => {
    const deepList = await fetchDeepTaskList()
    return deepList
  }

  getTaskList = async () => {
    const {taskList, hasDoubleCard, signData, expireTime} = await fetchTaskList([20, 21])
    return {
      taskList,
      signData,
      expireTime,
      showDoubleCard: !!hasDoubleCard,
    }
  }

  mergeReduxTaskList = (taskListData, deepList) => {
    const {
      taskList,
      signData,
      expireTime,
      showDoubleCard
    } = taskListData
    const homePageTaskData = {
      taskList,
      showDoubleCard,
      signData,
      expireTime,
      deepList
    }
    this.props.setTaskDataInfo(homePageTaskData)
  }

}
