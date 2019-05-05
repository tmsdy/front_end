/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 加速肥弹窗
 */

import React, {PureComponent} from 'react'

import ReduxUtil from '../../../common/ReduxUtil'
import {showModalTaskBubble} from '../../utils'

import HalfScreenModal from '../HalfScreenModal'
import TaskList from '../../TaskList/TaskList'
import PingbackConfig from '../../../common/PingbackConfig'
import {sendBlockPingback} from '../../../common/pingback'

export default class SpeedUpModal extends PureComponent {
  constructor(props) {
    super(props)

    this.refHalfScreen = ReduxUtil.createRef()
    this.refTaskList = ReduxUtil.createRef()

    const pbConfig = PingbackConfig[this.props.gardenMode] || {}
    this.rpage = pbConfig.page || 'flower_page'
  }

  componentDidMount() {
    sendBlockPingback(this.rpage, 'speed_pop')
  }

  render() {
    return (
      <HalfScreenModal
        ref={this.refHalfScreen}
        hideConfirmModal={this.props.hideConfirmModal}
        showHeader={true}
        headerIcon="flower/icon-speed-up"
        title="加速液"
        count={this.props.speederNum}
        description="可加速花儿成长到下一天，一个花期最多用7袋"
        showButton={true}
        onButtonPress={this.props.onButtonPress}
        buttonOptions={{
          text: !this.props.speederNum ? '未获得' : '立即使用',
          disabled: !this.props.speederNum,
        }}
      >
        <TaskList
          ref={this.refTaskList}
          height={160}
          channelGroup={300}
          type="flower"
          typeOptions={{
            propName: '加速液',
          }}
          onIconPress={this.onIconPress}
          beforeTaskClick={this.beforeTaskClick}
          openWeb={this.props.openWeb}
          clickOptions={{
            rpage: this.rpage,
            block: 'speed_pop',
          }}
        />
      </HalfScreenModal>
    )
  }

  beforeTaskClick = () => {
    return this.props.hideConfirmModal()
  }

  onIconPress = ({tip}, index) => {
    showModalTaskBubble({
      refModal: this.refHalfScreen,
      targetTaskList: this.refTaskList,
      index,
      tip,
    })
  }

}
