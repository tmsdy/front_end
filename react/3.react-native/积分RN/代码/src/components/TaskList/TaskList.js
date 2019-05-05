/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 任务列表
 */

import React, {PureComponent} from 'react'
import {FlatList} from 'react-native'
import PropTypes from 'prop-types'

import {View} from '@iqiyi/rn-ui'

import TaskItemUI from './TaskItemUI'
import TaskItemDescription from './TaskItemDescription'
import TaskItemButton from './TaskItemButton'

import ReduxUtil from '../../common/ReduxUtil'
import {isDone, isCompleted} from '../../model/wonderfulPark/options'
import {fetchTaskList} from '../../model/wonderfulPark'
import {handleTaskItemClickAsync} from '../../common/handleTaskClick'
import {filterExts} from '../../common/util'

export default class TaskList extends PureComponent {
  static propTypes = {
    height: PropTypes.number,
    type: PropTypes.oneOf(['score', 'flower']),
    typeOptions: PropTypes.oneOfType([
      PropTypes.shape({ // type = flower
        propName: PropTypes.string.isRequired, // 必须，用于任务奖励描述
      }),
    ]),
    rewardType: PropTypes.string,
    reward: PropTypes.string,
    getTaskItemOptions: PropTypes.func, // 参数{object}: task, image, title, description, isDrawedStatus, isDoneStatus, isCompletedStatus, buttonOptions
    clickOptions: PropTypes.object,
    beforeTaskClick: PropTypes.func,
  }

  static defaultProps = {
    height: 160,
    clickOptions: {},
    beforeTaskClick: () => {
      return Promise.resolve()
    },
  }

  constructor(props) {
    super(props)

    this.state = {
      list: [],
    }

    this.refTaskItems = []
  }

  componentDidMount() {
    this.getTaskList()
  }

  render() {
    const {height} = this.props
    const {list} = this.state

    return (
      <View style={[styles.container, {height}]}>
        {!!list.length && (
          <FlatList
            style={{flex: 1}}
            data={this.state.list}
            keyExtractor={({task}) => task.channelCode}
            renderItem={this.renderItem}
            bounces={false}
            alwaysBounceVertical={false}
          />
        )}
      </View>
    )
  }

  // todo: 任务中心积分翻倍的标志未添加
  renderItem = ({item, index}) => {
    const {task, image, title, iconName, description, isDrawedStatus, isDoneStatus, isCompletedStatus, buttonOptions} = item

    // eslint-disable-next-line no-return-assign
    return (
      <TaskItemUI
        ref={this.refTaskItems[index] || (this.refTaskItems[index] = ReduxUtil.createRef())}
        image={image}
        title={title}
        iconName={iconName}
        onIconPress={() => this.props.onIconPress(item, index)}
        containerStyle={{marginTop: index === 0 ? 0 : 10}}
        renderDescriptionComponent={<TaskItemDescription data={description}/>}
        renderButtonComponent={(
          <TaskItemButton
            task={task}
            isDrawedStatus={isDrawedStatus}
            isDoneStatus={isDoneStatus}
            isCompletedStatus={isCompletedStatus}
            onPress={() => this.onTaskClick(item, index)}
            {...buttonOptions}
          />
        )}
      />
    )
  }

  getItemRef = (index) => {
    if(typeof index === 'number') {
      return this.refTaskItems[index] || null
    }
    return this.refTaskItems
  }

  getItemIconRefAsync = async (index) => {
    const $refItem = this.getItemRef(index)
    if($refItem) {
      const refItem = await $refItem.getInstance()
      return refItem.getIconRef()
    }
    return null
  }

  getTaskList = async () => {
    const {taskList} = await fetchTaskList(this.props.channelGroup)
    const list = taskList.map((task) => {
      const {icon: image, channelName: title, exts = []} = task
      const extMaps = filterExts(exts)
      const iconName = extMaps.notes ? 'flower/icon-question' : ''

      // 自定义item配置，相同属性覆盖默认配置
      const taskOptions = this.props.getTaskItemOptions ? this.props.getTaskItemOptions(task) : {}

      return {
        task,
        extMaps,

        image,
        title,
        iconName,
        tip: extMaps.notes,
        description: this.getDesc(task.limitTotal),
        isDrawedStatus: false,
        isDoneStatus: isDone(task),
        isCompletedStatus: !!(isCompleted(task)),
        buttonOptions: {},

        ...taskOptions,
      }
    })

    this.setState({list})
  }

  getDesc = (limit = 0, count) => {
    const {type, typeOptions = {}} = this.props
    if(type === 'flower') {
      const {propName} = typeOptions
      let desc = [`可获得${propName}`, 'hl|x1']
      if(limit > 0 && limit <= 100) {
        // @柯慧士 大于100次默认不显示
        desc = [].concat(desc, ['，仅限', `hl|${limit}`, '次'])
      }
      return desc
    } else {
      return ['积分值', `hl|x${count}`]
    }
  }

  onTaskClick = (item, index) => {
    // 执行点击事件前的方法，返回false则阻止点击事件
    this.props.beforeTaskClick(item, index).then(({isStopped} = {}) => {
      if(!isStopped) {
        return handleTaskItemClickAsync(item.task, {
          ...this.props.clickOptions,
          type: this.props.type,
          openWeb: this.props.openWeb,
        })
      }
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
})
