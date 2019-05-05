/**
 * Created by liuzhimeng.
 * @date 2019-04-04
 * @description 复活肥弹窗
 */

import React, {PureComponent} from 'react'
import {View, Text} from '@iqiyi/rn-ui'

import {showModalTaskBubble} from '../../utils'
import ReduxUtil from '../../../common/ReduxUtil'

import HalfScreenModal from '../HalfScreenModal'
import TaskList from '../../TaskList/TaskList'
import PingbackConfig from '../../../common/PingbackConfig'
import {sendBlockPingback} from '../../../common/pingback'
import BaseStyleSheet from '../../../common/BaseStyleSheet';

export default class ReviveModal extends PureComponent {
  constructor(props) {
    super(props)

    this.refHalfScreen = ReduxUtil.createRef()
    this.refTaskList = ReduxUtil.createRef()

    const pbConfig = PingbackConfig[this.props.gardenMode] || {}
    this.rpage = pbConfig.page || 'flower_page'
  }

  componentDidMount() {
    sendBlockPingback(this.rpage, 'revive_pop')
  }

  render() {
    return (
      <HalfScreenModal
        ref={this.refHalfScreen}
        hideConfirmModal={this.props.hideConfirmModal}
        size={{height: 319}}
        showHeader={true}
        headerIcon="flower/icon-reviver"
        title="复活肥"
        count={this.props.reviveNum}
        description="可复活枯萎的花，1朵最多用2袋"
        showButton={true}
        onButtonPress={this.props.onRelive}
        buttonOptions={{
          text: !this.props.reviveNum ? '未获得' : '立即使用',
          disabled: !this.props.reviveNum,
        }}
      >
        <TaskList
          ref={this.refTaskList}
          height={75}
          channelGroup={301}
          type="flower"
          typeOptions={{
            propName: '复活肥',
          }}
          onIconPress={this.onIconPress}
          openWeb={this.props.openWeb}
          beforeTaskClick={this.beforeTaskClick}
          clickOptions={{
            rpage: this.rpage,
            block: 'revive_pop',
          }}
        />
        <View style={styles.footer}>
          <View style={styles.line} />
          <View style={[styles.line, styles.shortLine]} />
          <Text style={styles.footerText}>更多玩法敬请期待</Text>
          <View style={[styles.line, styles.shortLine]} />
          <View style={styles.line} />
        </View>
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

const styles = BaseStyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
  },
  footerText: {
    color: '#bcbcbc',
    fontSize: 11,
    lineHeight: 15,
    marginHorizontal: 6
  },
  line: {
    height: BaseStyleSheet.hairlineWidth,
    width: 23,
    backgroundColor: '#999',
    marginHorizontal: 1
  },
  shortLine: {
    width: 3
  }
})
