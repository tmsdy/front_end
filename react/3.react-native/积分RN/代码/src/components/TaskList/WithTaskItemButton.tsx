/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 任务列表内子项按钮
 */

import React, {PureComponent} from 'react'
import {Animated} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import BaseButton, {BaseButtonProps} from '../BaseButton'
import WebImage from '../WebImage'

export const enum TASK_BUTTON_STATUS {
  Undo = 'undo',
  Done = 'done',
  Draw = 'draw',
  Drawed = 'drawed',
}

const TASK_BUTTON_CONFIG = {
  [TASK_BUTTON_STATUS.Undo]: {
    options: {text: '去完成', linearColor: '#f4f4f4', textColor: '#FF410F', disabled: false},
  },
  [TASK_BUTTON_STATUS.Draw]: {
    options: {text: '领取', linearColor: ['#FF410F', '#FF6100'], textColor: '#ffffff', disabled: false},
  },
  [TASK_BUTTON_STATUS.Drawed]: {
    options: {text: '已领取', linearColor: '#f4f4f4', textColor: '', disabled: true},
  },
  [TASK_BUTTON_STATUS.Done]: {
    options: {text: '已完成', linearColor: '#f4f4f4', textColor: '', disabled: true},
  },
}

export interface TaskItemButtonProps extends BaseButtonProps {
  task: {
    channelCode: string;
    button: string;
  };
  area: string;
  score?: number;
  isDrawedStatus: boolean;
  isDoneStatus: boolean;
  isCompletedStatus: boolean;
}

interface TaskItemButtonState {
  visiable: boolean;
  animScore: Animated.Value;
}

export default class TaskItemButton extends PureComponent<TaskItemButtonProps, TaskItemButtonState> {
  static defaultProps = {
    score: -1,
    area: '',
    isDrawedStatus: false,
    isDoneStatus: false,
    isCompletedStatus: false,
  }

  constructor(props: TaskItemButtonProps) {
    super(props)

    this.state = {
      visiable: false,
      animScore: new Animated.Value(0),
    }
  }

  componentWillUnmount() {
    this.state.animScore.stopAnimation()
  }

  render() {
    if(!this.props.task) {
      return null
    }

    const status = this.getTaskStatus()
    const {text, linearColor, textColor, disabled} = TASK_BUTTON_CONFIG[status].options

    return (
      <React.Fragment>
        <BaseButton
          text={this.getUndoTextOptions(status, text)}
          textColor={textColor}
          linearColor={linearColor}
          disabled={disabled}
          {...this.props}
        />
        {this.state.visiable && (
          <Animated.View
            style={[styles.animContainer, {
              opacity: this.state.animScore.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              top: this.state.animScore.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -9],
              }),
            }]}
          >
            <WebImage name="home_numi" style={styles.animIcon} />
            <Text style={{color: '#FF7E00'}}>{this.props.score}</Text>
          </Animated.View>
        )}
      </React.Fragment>
    )
  }

  public play = (): Promise<void> => {
    return new Promise((resolve) => {
      this.setState({visiable: true}, () => {
        Animated.timing(this.state.animScore, {
          toValue: 1,
          duration: 300,
        }).start(({finished}) => {
          if(finished) {
            this.setState({visiable: false})
            resolve()
          }
        })
      })
    })
  }

  private getTaskStatus = () => {
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

  private getUndoTextOptions = (status: string, configText: string) => {
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

      return text
    }

    return configText
  }
}

const styles = BaseStyleSheet.create({
  animContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    minWidth: 82,
    backgroundColor: 'transparent',
  },
  animIcon: {
    width: 15,
    height: 15,
    marginRight: 2,
  },
})
