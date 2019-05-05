/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 任务列表内子项按钮
 */

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import CommonButton from '../CommonButton'

export const TASK_BUTTON_STATUS = {
  Undo: 'undo',
  Done: 'done',
  Draw: 'draw',
  Drawed: 'drawed',
}

const TASK_BUTTON_CONFIG = {
  [TASK_BUTTON_STATUS.Undo]: {
    options: {mode: 'default', text: '去完成', disabled: false},
  },
  [TASK_BUTTON_STATUS.Draw]: {
    options: {mode: 'pure', text: '领取', disabled: false},
  },
  [TASK_BUTTON_STATUS.Drawed]: {
    options: {mode: 'pure', text: '已领取', disabled: true},
  },
  [TASK_BUTTON_STATUS.Done]: {
    options: {mode: 'pure', text: '已完成', disabled: true},
  },
}

export default class TaskItemButton extends PureComponent {
  static propTypes = {
    ...CommonButton.propTypes,
    task: PropTypes.object,
    area: PropTypes.string,
    isDrawedStatus: PropTypes.bool,
    isDoneStatus: PropTypes.bool,
    isCompletedStatus: PropTypes.bool,
  }

  static defaultProps = {
    area: '',
    isDrawedStatus: false,
    isDoneStatus: false,
    isCompletedStatus: false,
  }

  render() {
    if(!this.props.task) {
      return null
    }

    const status = this.getTaskStatus()

    return (
      <CommonButton
        containerStyle={{width: 69, height: 29}}
        buttonWrapperStyle={{borderRadius: 14.5}}
        buttonStyle={{height: 26, lineHeight: 26, fontSize: 14}}
        {...TASK_BUTTON_CONFIG[status].options}
        {...this.getTextOptions(status)}
        {...this.props}
      />
    )
  }

  getTaskStatus = () => {
    const {isDrawedStatus, isDoneStatus, isCompletedStatus} = this.props

    if(isDrawedStatus && !isDoneStatus) {
      return TASK_BUTTON_STATUS.Drawed
    } else if(isDoneStatus) {
      return TASK_BUTTON_STATUS.Done
    } else if(isCompletedStatus) {
      return TASK_BUTTON_STATUS.Draw
    } else {
      return TASK_BUTTON_STATUS.Undo
    }
  }

  getTextOptions = (status) => {
    const {task: {channelCode, button}, area} = this.props

    if(status === TASK_BUTTON_STATUS.Undo) {
      let text = ''
      if(channelCode === 'Sign') {
        text = area ? '簽到' : '签到'
      } else if(channelCode === 'View') {
        text = area ? '去觀看' : '去观看'
      } else if(button) {
        text = button
      } else {
        text = '去完成'
      }

      return {text}
    }

    return {}
  }
}
