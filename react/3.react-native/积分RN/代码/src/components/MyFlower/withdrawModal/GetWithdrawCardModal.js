/**
 * Created by kerwinliu.
 * @date 2019-04-02
 * @description 获取提现卡弹框
 */

import React, {PureComponent} from 'react'
import {
  Text,
  View
} from '@iqiyi/rn-ui'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Width} from '@iqiyi/rn-utils'
import HalfScreenModal from '../HalfScreenModal'
import TaskList from '../../TaskList/TaskList'
import ReduxUtil from '../../../common/ReduxUtil'
import {showModalTaskBubble} from '../../utils'
import {fetchWithdrawInfo, fetchAddFriendsProcess} from '../../../model/MyFlower'
import {showToast} from '../../../common/QYNativeBridge'
import DrawingModal from './DrawingModal'
import {isDone, isCompleted} from '../../../model/wonderfulPark/options'
import {filterExts} from '../../../common/util'
import PingbackConfig from '../../../common/PingbackConfig'
import {sendBlockPingback} from '../../../common/pingback'

@connect(
  (state) => {
    return {
      waterDays: state.gardenDetail.masterGardenInfo.wateringInfo.waterDays, // 浇水天数
    }
  },
  null,
  null,
  {withRef: true},
)
export default class GetWithdrawCardModal extends PureComponent {
  static propTypes = {
    hide: PropTypes.func,
    show: PropTypes.func,
    openWeb: PropTypes.func
  }

  static defaultProps = {
    hide: () => null,
    show: () => null,
    openWeb: () => null,
  }
  constructor(props) {
    super(props)
    this.state = {
      withdrawNum: 0,
      withdrawList: [],
      current: 0, // 金钱花特殊任务进度显示
      total: 0,
      shareTaskLoad: false // 金钱花进度接口完成后再去渲染任务列表 特殊处理
    }
    this.refHalfScreen = ReduxUtil.createRef()
    this.refTaskList = ReduxUtil.createRef()

    const pbConfig = PingbackConfig[this.props.gardenMode] || {}
    this.rpage = pbConfig.page || 'flower_page'
  }

  componentDidMount() {
    sendBlockPingback(this.rpage, 'withdraw_pop')
    this.getData()
  }

  render() {
    const {withdrawNum, shareTaskLoad} = this.state
    return (
      <HalfScreenModal
        ref={this.refHalfScreen}
        size={{height: 319}}
        hideConfirmModal={this.props.hide}
        showHeader={true}
        headerIcon="flower/withdraw_card_modal"
        title="提现卡"
        count={withdrawNum}
        description="可在浇水21天后提取现金"
        showButton={true}
        onButtonPress={this.pressButton}
        buttonOptions={{text: withdrawNum > 0 ? '立即使用' : '未获得', disabled: withdrawNum === 0}}
      >
        {
          shareTaskLoad ?
          <TaskList
            ref={this.refTaskList}
            height={75}
            channelGroup={302}
            type="flower"
            typeOptions={{
              propName: '提现卡'
            }}
            getTaskItemOptions={this.getTaskItemOptions}
            onIconPress={this.onIconPress}
            beforeTaskClick={this.beforeTaskClick}
            openWeb={this.props.openWeb}
            clickOptions={{
              rpage: this.rpage,
              block: 'withdraw_pop',
            }}
          /> : null
        }
        <View style={styles.footer}>
          <View style={styles.line}/>
          <View style={[styles.line, styles.shortLine]}/>
          <Text style={styles.footerText}>更多玩法敬请期待</Text>
          <View style={[styles.line, styles.shortLine]}/>
          <View style={styles.line}/>
        </View>
      </HalfScreenModal>
    )
  }
  // 是否满21天
  _check21Days = () => {
    return this.props.waterDays >= 21
  }

  pressButton = () => {
    if(this.state.withdrawNum <= 0) return false
    if(!this._check21Days()) {
      showToast('种满21天后才可提现')
    } else {
      this.props.hide()
      this.props.show({
        content: <DrawingModal withdrawList={this.state.withdrawList} openWeb={this.props.openWeb} hide={this.props.hide}/>,
        showCloseButton: true,
      })
    }
  }

  getData = async () => {
    // 提现卡信息
    const {total: withdrawNum, list: withdrawList} = await fetchWithdrawInfo()
    // 加好友状态
    const {current, total} = await fetchAddFriendsProcess()
    this.setState({
      withdrawNum,
      withdrawList,
      current,
      total,
      shareTaskLoad: true
    })
  }
  // 金钱花邀请任务要单独接口返回进度信息
  getTaskItemOptions = (task) => {
    const {current, total} = this.state
    const clickEvent = filterExts(task.exts || [], 'clickEvent')
    const shareType = filterExts(task.exts || [], 'shareType')
    if(total !== 0 && clickEvent && clickEvent.toLocaleLowerCase() === 'share' && shareType && shareType.toLocaleLowerCase() === 'cashcard') {
      return {
        buttonOptions: {
          text: (isDone(task) || !!(isCompleted(task))) ? '已完成' : `去邀请 ${current}/${total}`,
          containerStyle: {
            width: 100,
            height: 30,
          }
        }
      }
    }
  }

  beforeTaskClick = () => {
    return this.props.hide()
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
  containerStyle: {
    width: Width * .95,
    marginLeft: Width * .025
  },
  tips: {
    lineHeight: 19,
    fontSize: 12,
    color: '#999',
    marginTop: 5.1,
    fontFamily: 'PingFangSC-Regular'
  },
  shareButton: {
    width: 100,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#ff8a1f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareText: {
    fontSize: 14,
    color: '#ff8a1f',
    fontFamily: 'PingFangSC-Regular'
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
