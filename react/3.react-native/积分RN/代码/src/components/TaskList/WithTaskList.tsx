/**
 * Created by liuzhimeng.
 * @date 2019-04-22
 * @description 任务列表
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {View} from '@iqiyi/rn-ui'

import BaseStyleSheet, {ViewStyle} from '../../common/BaseStyleSheet'

import ShowNextAnimation from '../Animation/ShowNextAnimation'
import WithTaskItem from './WithTaskItem'
import WithTaskItemButton from './WithTaskItemButton'
import DescriptionText from '../DescriptionText'

import ReduxUtil from '../../common/ReduxUtil'
import {isCompleted, formatTaskList} from '../../model/homePage/task'
import {changeTotalScore} from '../../actions/TotalScoreActions'
import {handleTaskItemClickAsync, getTaskRewardAsync} from '../../common/handleTaskClick'

type taskType = 'score' | 'flower'
interface TypeOptions {
  propName: string;
}

interface TaskItemOptions {
  task: any;
  image: string;
  title: string;
  description: string;
  isDrawedStatus: boolean;
  isDoneStatus: boolean;
  isCompletedStatus: boolean;
  buttonOptions: any;
}

interface BeforeTaskClick {
  isStopped?: boolean;
}

interface WithTaskListProps {
  list: any[];
  deepList?: any[];
  showDoubleCard?: boolean;
  height?: number;
  type: taskType;
  typeOptions?: TypeOptions;
  clickOptions?: object;
  taskItemStyle?: ViewStyle;
  getTaskItemOptions?(options: TaskItemOptions): void;
  beforeTaskClick?(item: any, index: number): Promise<BeforeTaskClick>;
  getTaskReward?(): void;
  onIconPress(item: any, index: number): void;
  openWeb(route: string): void;

  changeTotalScore?(score: number): void;
}

interface WithTaskListState {
  deepList: any[];
  list: any[];
  formatDeepList: any[];
  formatList: any[];
}

enum TASK_MODE {
  'Normal' = 'normal',
  'DeepTask' = 'deepTask',
}

@(connect(
  null,
  dispatch => bindActionCreators({changeTotalScore}, dispatch),
  null,
  {withRef: true}
) as any)
export default class WithTaskList extends PureComponent<WithTaskListProps, WithTaskListState> {
  private refTaskItems: any[];
  private refItemButtons: {
    [TASK_MODE.Normal]: any[];
    [TASK_MODE.DeepTask]: any[];
  };

  private refShowNext: {
    [TASK_MODE.Normal]: any;
    [TASK_MODE.DeepTask]: any;
  };

  static defaultProps = {
    clickOptions: {},
    taskItemStyle: {},
    showDoubleCard: false,
    beforeTaskClick: () => {
      return Promise.resolve()
    },
  }

  static getDerivedStateFromProps(nextProps: WithTaskListProps, prevState: WithTaskListState) {
    if(nextProps.deepList !== prevState.deepList || nextProps.list !== prevState.list) {
      return {
        deepList: nextProps.deepList,
        list: nextProps.list,
        formatDeepList: formatTaskList(nextProps.deepList, nextProps),
        formatList: formatTaskList(nextProps.list, nextProps),
      }
    }

    return null
  }

  constructor(props: WithTaskListProps) {
    super(props)

    const {deepList, list} = this.props

    this.state = {
      deepList,
      list,
      formatDeepList: formatTaskList(deepList, this.props),
      formatList: formatTaskList(list, this.props),
    }

    this.refTaskItems = []
    this.refItemButtons = {
      [TASK_MODE.Normal]: [],
      [TASK_MODE.DeepTask]: [],
    }

    this.refShowNext = {
      [TASK_MODE.Normal]: null,
      [TASK_MODE.DeepTask]: null,
    }

  }

  render() {
    const {height} = this.props
    const {formatDeepList, formatList} = this.state

    // eslint-disable-next-line no-return-assign
    return (
      <View style={[styles.container, {height}]}>
        {!!formatDeepList.length && (
          <ShowNextAnimation
            ref={this.refShowNext[TASK_MODE.DeepTask] || (this.refShowNext[TASK_MODE.DeepTask] = ReduxUtil.createRef())}
            listCount={formatDeepList.length}
            distance={65}
            duration={300}
            displayHeight={65}
            moveDistance={65}
            animatedDisappear={true}
            onAnimatedDisappeared={this.onDeepAnimatedDisappeared}
          >
            {formatDeepList.map((item, index) => {
              return this.renderItem({item, index}, TASK_MODE.DeepTask)
            })}
          </ShowNextAnimation>
        )}
        {!!formatList.length && (
          <ShowNextAnimation
            ref={this.refShowNext[TASK_MODE.Normal] || (this.refShowNext[TASK_MODE.Normal] = ReduxUtil.createRef())}
            listCount={formatList.length}
            distance={65}
            duration={300}
            moveDistance={-65}
            displayHeight={195}
          >
            {formatList.map((item, index) => {
              return this.renderItem({item, index}, TASK_MODE.Normal)
            })}
          </ShowNextAnimation>
        )}
      </View>
    )
  }

  private renderItem = ({item, index}, type: string) => {
    const {task, image, title, iconName, description, isDrawedStatus, isDoneStatus, isCompletedStatus, buttonOptions} = item
    const {channelCode, score, multiple} = task
    const isDouble = !!multiple && this.props.showDoubleCard
    const buttonScore = isDouble ? score * 2 : score

    // eslint-disable-next-line no-return-assign
    return (
      <WithTaskItem
        key={channelCode}
        ref={this.refTaskItems[index] || (this.refTaskItems[index] = ReduxUtil.createRef())}
        image={image}
        title={title}
        iconName={iconName}
        showTag={type === 'deepTask'}
        tagName="icon/tag-hot"
        onIconPress={() => this.props.onIconPress(item, index)}
        onItemPress={() => this.onTaskClickToDetail(item)}
        containerStyle={this.props.taskItemStyle}
        renderDescriptionComponent={<DescriptionText data={description} />}
        renderButtonComponent={(
          <WithTaskItemButton
            ref={this.refItemButtons[type][index] || (this.refItemButtons[type][index] = ReduxUtil.createRef())}
            task={task}
            score={buttonScore}
            isDrawedStatus={isDrawedStatus}
            isDoneStatus={isDoneStatus}
            isCompletedStatus={isCompletedStatus}
            onPress={() => this.onTaskClick(item, index, type)}
            {...buttonOptions}
          />
        )}
      />
    )
  }

  public getItemRef = (index: number): Promise<any> => {
    if(typeof index === 'number') {
      return this.refTaskItems[index].getInstance()
    }
    return null
  }

  public getItemIconRef = async (index: number) => {
    const refItem = await this.getItemRef(index)
    if(refItem) {
      return refItem.getIconRef()
    }
    return null
  }

  private showNextTask = async (taskType: string): Promise<number> => {
    return this.refShowNext[taskType].getInstance().then(ref => ref.showNext().then(({pageNum}) => {
      return pageNum
    }))
  }

  private onDeepAnimatedDisappeared = async () => {
    this.refShowNext[TASK_MODE.Normal].getInstance().then(ref => {
      ref.moveContainer()
    })
    return true
  }

  // 当前被点击的可领取积分任务前面没有待领取任务时，才会触发向上滚动任务
  private isShowNextTask = (index: number) => {
    const {list} = this.props
    const prevList = list.slice(0, index)

    for(const {isDrawedStatus, isCompletedStatus, isDoneStatus} of prevList) {
      if(!isDrawedStatus && isCompletedStatus && !isDoneStatus) {
        return false
      }
    }

    return true
  }

  private onRewardDone = (index: number, taskType: string) => {
    // 展示滚动到下一任务动效
    if(this.isShowNextTask(index)) {
      this.showNextTask(taskType)
    }
  }

  private onTaskClickToDetail = (item) => {
    handleTaskItemClickAsync(item.task, {
      ...this.props.clickOptions,
      type: this.props.type,
      openWeb: this.props.openWeb,
    })
  }

  private onTaskClick = (item: any, index: number, taskType: string) => {
    // 执行点击事件前的方法，返回false则阻止点击事件
    this.props.beforeTaskClick(item, index).then(({isStopped} = {}) => {
      if(!isStopped) {
        const {task} = item
        if(isCompleted(task)) {
          getTaskRewardAsync(task).then(({type}) => {
            // 默认为普通任务或深度任务
            if(type === 'default') {

              // 领取积分，显示获得积分动效
              if(this.refItemButtons[taskType][index]) {
                this.refItemButtons[taskType][index].getInstance().then(ref => {
                  ref.play().finally(() => {
                    this.onRewardDone(index, taskType)
                  })
                })
              } else {
                this.onRewardDone(index, taskType)
              }

              // 增加总积分
              const changeScore = this.props.showDoubleCard && !!task.multiple
                ? task.score * 2 : task.score
              this.props.changeTotalScore(changeScore)

              this.props.getTaskReward && this.props.getTaskReward()
            }
          })
        } else {
          this.onTaskClickToDetail(item)
        }
      }
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
})
