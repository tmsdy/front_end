/**
 * Created by liuzhimeng.
 * @date 2019-04-22
 * @description 积分中心任务列表
 */

import React, {PureComponent} from 'react'
import {View, Text} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import BaseStyleSheet from '../../common/BaseStyleSheet'

import {setTaskDataInfo} from '../../actions/HomePageActions'

import TabTitle from '../wonderfulPark/TabTitle'
import ScoreCountdown from '../TaskList/ScoreCountdown'
import WithTaskList from '../TaskList/WithTaskList'

import SignRule from './modal/SignRule'
import TaskRule from './modal/TaskRule'

import {fetchTaskList, fetchDeepTaskList} from '../../model/homePage'
import {FetchTaskList} from '../../typings/apis/homePage'
import {filterExts} from '../../common/util'
import {sendClickPingback} from '../../common/pingback'

// 翻倍卡规则文字
const DOUBLE_RULE_CONTENT = '1、为什么会有翻倍奖励？\n领取回血包、抽奖中奖或其他活动都有可能获得哦\n2、翻倍奖励如何使用？\n完成标有“积分X2”标识的任务，积分值自动翻倍！多次领取有效期将累加，多多益善~'

interface TaskSectionProps {
  taskList?: any[];
  deepList?: any[];
  signData?: FetchTaskList['signData'];
  showDoubleCard?: boolean;
  expireTime?: number;
  setTaskDataInfo?(p: any): void;

  goTo(pageName: string, options: any): void;
  openWeb(pageName: string): void;
  showConfirmModal(config: any): any;
  hideConfirmModal(): any;
}

@(connect(
  (state) => {
    const {taskList, showDoubleCard, signData, expireTime, deepList} = state.homePage.homePageTaskData
    return {
      deepList,
      taskList,
      showDoubleCard,
      signData,
      expireTime,
    }
  },
  dispatch => bindActionCreators({setTaskDataInfo}, dispatch),
  null,
  {withRef: true}
) as any)
export default class TaskListSection extends PureComponent<TaskSectionProps, {}> {
  componentDidMount() {
    this.getTaskdata()
  }

  render() {
    const {deepList, taskList, expireTime, showDoubleCard, signData: {signScore}} = this.props

    return (
      <View style={styles.container}>
        <TabTitle
          title="每日任务"
          showLookMore={true}
          renderDescription={<ScoreCountdown time={expireTime} onPress={this.onDoubleIconPress} />}
          renderLookMoreComponent={<Text style={styles.moreText}> 领{signScore}积分</Text>}
          onPress={this.onTitlePress}
        />
        <WithTaskList
          type="score"
          deepList={deepList}
          list={taskList}
          showDoubleCard={showDoubleCard}
          height={65 * 3}
          taskItemStyle={{
            height: 65,
            borderRadius: 0,
            backgroundColor: '#ffffff',
          }}
          onIconPress={this.onIconPress}
          openWeb={this.props.openWeb}
          getTaskReward={this.getTaskdata}
        />
      </View>
    )
  }

  getTaskdata = async () => {
    const [deepList, {taskList, hasDoubleCard, signData, expireTime}] = await Promise.all([
      fetchDeepTaskList(),
      fetchTaskList([20, 21], 6)
    ])

    this.props.setTaskDataInfo({
      taskList,
      showDoubleCard: !!hasDoubleCard,
      signData,
      expireTime,
      deepList,
    })
  }

  onIconPress = ({signRule = false, exts = []}) => {
    let content: React.ReactNode = null

    if(signRule) {
      content = <SignRule hideConfirmModal={this.props.hideConfirmModal} />
    } else {
      const ruleText = filterExts(exts, 'notes', '')
      content = <TaskRule content={ruleText} hideConfirmModal={this.props.hideConfirmModal} />
    }

    this.props.showConfirmModal({
      showCloseButton: false,
      content,
    })
  }

  onDoubleIconPress = () => {
    this.props.showConfirmModal({
      showCloseButton: false,
      content: <TaskRule content={DOUBLE_RULE_CONTENT} hideConfirmModal={this.props.hideConfirmModal} />
    })
  }

  onTitlePress = () => {
    sendClickPingback('pointcenter', '', 'morebtn')
    this.props.goTo('TaskList', {
      refreshDailyTask: this.getTaskdata,
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  moreText: {
    color: '#222222',
    fontSize: 12,
    lineHeight: 19,
  },
})
