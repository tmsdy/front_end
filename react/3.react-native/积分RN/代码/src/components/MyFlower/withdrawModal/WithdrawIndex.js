/**
 * Created by kerwinliu.
 * @date 2019-04-01
 * @description 新版提现弹框
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchWithdrawInfo} from '../../../model/MyFlower'
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback'
import {switchWithdrawStatus} from '../../../actions/GardenDetailActions'
import WithdrawModal from './WithdrawModal'
import DrawingModal from './DrawingModal'
import DrawSuccess from './DrawSuccess'
import GetWithdrawCardModal from './GetWithdrawCardModal'
import {shareToFriends} from '../../utils'

const RPAGE = 'moneyRN'
const BLOCKV = '801004'

@connect(
  (state) => {
    return {
      isWithdrawStatus: state.gardenDetail.isWithdrawStatus,
      isHistoryGardenMode: state.gardenDetail.isHistoryGardenMode, // 是否为历史花儿页面
      type: state.gardenDetail.masterGardenInfo.flowerInfo.type, // 花儿状态
      waterDays: state.gardenDetail.masterGardenInfo.wateringInfo.waterDays, // 浇水天数
    }
  },
  dispatch => bindActionCreators({
    switchWithdrawStatus,
  }, dispatch),
  null,
  {withRef: true},
)
export default class WithdrawModalIndex extends PureComponent {
  static propTypes = {
    show: PropTypes.func,
    hide: PropTypes.func,
    openWeb: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      withdrawNum: 0, // 提现卡数量
      withdrawList: [], // 提现卡列表
    }
  }
  componentDidMount() {
    this._getData()
  }
  render() {
    return (
      <React.Fragment>
        {
          this._Breeding() && this._renderReward()
        }
        {
          this._canWithdraw() && this._renderBreedSuccess()
        }
        {
          this._hasWithdraw() && this._renderWithdrawSuccess()
        }
      </React.Fragment>
    )
  }
  // 累计奖励弹框
  _renderReward = () => {
    const {show, hide} = this.props
    return (
      <WithdrawModal
        withdrawNum={this.state.withdrawNum}
        goGetWithdrawCard={this._goGetWithdrawCard}
        withdrawList={this.state.withdrawList}
        show={show}
        hide={hide}
      />
    )
  }
  // 未提现 && 培育成功
  _renderBreedSuccess = () => {
    const {show, hide, openWeb} = this.props
    return (
      <DrawingModal
        withdrawNum={this.state.withdrawNum}
        withdrawList={this.state.withdrawList}
        goGetWithdrawCard={this._goGetWithdrawCard}
        show={show}
        hide={hide}
        openWeb={openWeb}
      />
    )
  }
  // 提现成功弹框
  _renderWithdrawSuccess = () => {
    const {show, hide} = this.props
    return (
      <DrawSuccess
        show={show}
        hide={hide}
        buttonImage="flower/flaunt_result"
        onPress={() => this._goToShare()}
      />
    )
  }

  // 培育过程中
  _Breeding = () => {
    return !this._isDie() && !this._isSuccess() && !this._canWithdraw()
  }

  // 枯萎了
  _isDie = () => {
    return !this.props.isHistoryGardenMode && this.props.type === 'faded'
  }

  // 培育成功
  _isSuccess = () => {
    return this.props.isHistoryGardenMode || this.props.type === 'vip'
  }

  // 未提现 && 培育成功
  _canWithdraw = () => {
    return !this.props.isWithdrawStatus && this._isSuccess()
  }

  // 已经提现 && 培育成功
  _hasWithdraw = () => {
    return this.props.isWithdrawStatus && this._isSuccess()
  }

  _getData = async () => {
    // 提现卡信息
    const {total: withdrawNum, list: withdrawList} = await fetchWithdrawInfo()

    if(this.props.isWithdrawStatus) {
      sendBlockPingback(RPAGE, BLOCKV, {rseat: 'moneyripeshare_show'})
    }

    if(!this.props.isWithdrawStatus && this._goToWithdraw()) {
      sendBlockPingback(RPAGE, BLOCKV, {rseat: 'moneygetbtn_show'})
    }
    this.setState({withdrawList, withdrawNum})
  }

  // 是否有提现卡可以去提现
  _goToWithdraw = () => {
    return this.state.withdrawNum && this.props.isHistoryGardenMode
  }
  // 是否有提现卡
  _checkWithdrawNum = () => {
    return this.state.withdrawNum > 0
  }

  // 是否满21天
  _check21Days = () => {
    return this.props.waterDays >= 21
  }
  // 去获得提现卡
  _goGetWithdrawCard = () => {
    this.props.hide()
    this.props.show({
      showCloseButton: false,
      content: <GetWithdrawCardModal
        hide={this.props.hide}
        show={this.props.show}
        openWeb={this.props.openWeb}
      />,
    })
  }
  // 去分享
  _goToShare = (type = 'cashComplete') => {
    if(type === 'cashComplete') {
      sendClickPingback(RPAGE, BLOCKV, 'moneyripeshare_click')
    }
    this.props.hide()
    shareToFriends(type)
  }
}

