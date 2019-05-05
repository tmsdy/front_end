/**
 * Created by kerwinliu.
 * @date 2019-04-01
 * @description 累计奖励弹框 培育中不能提现
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import DrawingModal from './DrawingModal'
import {sendClickPingback} from '../../../common/pingback'
import {showToast} from '../../../common/QYNativeBridge'
import {ImageBox} from './ImageBox'
import {formatCash} from '../../utils'

const RPAGE = 'moneyRN'
const BLOCKV = '801004'

@connect(
  (state) => {
    return {
      totalCash: formatCash(state.gardenDetail.totalCash), // 奖励金额
      waterDays: state.gardenDetail.masterGardenInfo.wateringInfo.waterDays, // 浇水天数
    }
  },
  null,
  null,
  {withRef: true},
)
export default class WithdrawModal extends PureComponent {
  static propTypes = {
    show: PropTypes.func,
    hide: PropTypes.func,
    openWeb: PropTypes.func,
  }

  render() {
    return (
      <ImageBox
        containerImage="flower/get_reward"
        containerText="- 累计获得 -"
        priceValue={this.props.totalCash}
        onPress={this._goWithdraw}
        buttonImage="flower/withdraw_now"
        buttonStyle={{bottom: 23.5}}
      />
    )
  }

  // 是否有提现卡
  _checkWithdrawNum = () => {
    return this.props.withdrawNum > 0
  }

  // 是否满21天
  _check21Days = () => {
    return this.props.waterDays >= 21
  }

  // 去提现
  _goWithdraw = () => {
    const {goGetWithdrawCard} = this.props
    if(!this._checkWithdrawNum()) {
      goGetWithdrawCard()
    } else if(!this._check21Days()) {
      showToast('种满21天后才可提现')
    } else {
      sendClickPingback(RPAGE, BLOCKV, 'moneygetbtn_click')
      this.props.hide()
      this.props.show({
        content: <DrawingModal
          goGetWithdrawCard={this.props.goGetWithdrawCard}
          withdrawList={this.props.withdrawList}
          openWeb={this.props.openWeb}
          hide={this.props.hide}
        />,
        showCloseButton: true,
      })
    }
  }
}
