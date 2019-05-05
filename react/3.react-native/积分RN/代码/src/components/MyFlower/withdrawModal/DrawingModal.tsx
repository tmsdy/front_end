/**
 * Created by kerwinliu.
 * @date 2019-04-01
 * @description 培育完成可提现
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Text} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {askToWithdrawInFlower} from '../../../model/MyFlower'
import {sendClickPingback, sendBlockPingback} from '../../../common/pingback'
import {switchWithdrawStatus, updateCashCardNum} from '../../../actions/GardenDetailActions'
import {showToast} from '../../../common/QYNativeBridge'
import {ImageBox} from './ImageBox'
import {WALLET_URL} from '../../../constants/configs'
import DrawSuccess from './DrawSuccess'
import {getObjectValueSafely, transferTimeTo} from '../../../common/util'
import {formatCash} from '../../utils'
import BaseStyleSheet from '../../../common/BaseStyleSheet'

const RPAGE = 'moneyRN'
const BLOCKV = '801004'

interface DrawingState {
  withdrawState: boolean;
}

interface DrawingProps {
  consumeEnd: number | string;
  cashCardNum: number;
  totalCash: number | string;
  goGetWithdrawCard: Function;
  switchWithdrawStatus: Function;
  withdrawList: any[];
  hide: Function;
  show: Function;
  openWeb: Function;
  updateCashCardNum: Function;
}

@(connect(
  (state) => {
    // 金钱花领取奖励时间
    const consumeEnd = getObjectValueSafely(state, 'gardenDetail.masterGardenInfo.consumeEnd')
    return {
      consumeEnd,
      cashCardNum: state.gardenDetail.cashCardNum,
      totalCash: formatCash(state.gardenDetail.totalCash), // 奖励金额
    }
  },
  dispatch => bindActionCreators({
    switchWithdrawStatus,
    updateCashCardNum
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class DrawingModal extends PureComponent<DrawingProps, DrawingState> {
  static propTypes = {
    show: PropTypes.func,
    hide: PropTypes.func,
    openWeb: PropTypes.func,
  }

  private inWithdrawing = false
  constructor(props) {
    super(props)
    this.state = {
      withdrawState: true // true 显示提现信息 false 显示确认信息
    }
  }

  // TODO 需要后台截止时间信息
  render() {
    const {withdrawState} = this.state
    const {consumeEnd} = this.props
    return (
      <ImageBox
        containerImage="flower/breed_success"
        containerStyle={styles.breedSuccess}
        containerText={withdrawState ? '- 累计获得 -' : '- 提现金额 -'}
        priceValue={this.props.totalCash}
        onPress={this._goWithdraw}
        buttonImage={withdrawState ? 'flower/withdraw_now' : 'flower/confirm_price'}
        buttonStyle={{bottom: 35}}
      >
        {
          withdrawState
          ? <Text style={styles.breedTips}>{this.getTime(consumeEnd)}</Text>
          : <Text style={styles.breedTips}>将提现至爱奇艺钱包</Text>
        }
      </ImageBox>
    )
  }

  // 点击去提现
  _goWithdraw = () => {
    const {goGetWithdrawCard, withdrawList} = this.props
    const withdrawInfo = withdrawList[0] || {}
    if(!withdrawInfo || !withdrawInfo.orderCode) {
      // 获取提现卡
      goGetWithdrawCard()
      return
    }
    const {withdrawState} = this.state
    if(withdrawState) {
      // 切换按钮状态
      return this.setState({withdrawState: false})
    }
    this._askToWithdraw()
  }

  // 发起提现
  _askToWithdraw = async () => {
    const {withdrawList, cashCardNum} = this.props
    const withdrawInfo = withdrawList[0] || {}
    if(this.inWithdrawing) {
      showToast('提现中，请勿重复点击')
      return
    }
    this.inWithdrawing = true

    showToast('提现中...')

    try {
      const {code, message, msg, validationResult} = await askToWithdrawInFlower(withdrawInfo.orderCode)

      if(!validationResult) {
        sendBlockPingback(RPAGE, 'minmoneytoast')
        return showToast('提现金额必须>3.6元哦')
      }

      if(code === 'A00000') {
        sendBlockPingback(RPAGE, BLOCKV, {rseat: 'walletbtn_show'})
        this.props.switchWithdrawStatus(true)
        this.props.updateCashCardNum(cashCardNum - 1)
        this._goDrawSuccessCard()
        return
      }

      if(code === 'A00004') {
        sendBlockPingback(RPAGE, 'dangertoast')
        return showToast('你的帐号风险较大，请24小时后再进行操作')
      }

      if(code === 'error') {
        sendBlockPingback(RPAGE, 'delaytoast')
      }

      const ms = message || msg
      showToast(ms)
      this.inWithdrawing = false

    } catch(e) {
      showToast('网络繁忙，提现失败')
      this.inWithdrawing = false
    }
  }

  // 展示提现成功页面
  _goDrawSuccessCard = () => {
    this.props.hide()
    this.props.show({
      showCloseButton: true,
      content: <DrawSuccess
        hide={this.props.hide}
        priceValue={this.props.totalCash}
        onPress={this.openWallet}
      />,
    })
  }

  openWallet = () => {
    // 查看爱奇艺钱包 按钮点击投递
    sendClickPingback(RPAGE, BLOCKV, 'walletbtn_click')
    this.props.hide()
    return this.props.openWeb(WALLET_URL)
  }

  getTime(timeStr) {
    if(!timeStr || timeStr < 0) return ''
    const dateStr = transferTimeTo('datetime', timeStr).toString().split(' ')[0]
    if(dateStr) {
      const dateArr = dateStr.split('-')
      if(dateArr.length === 3) {
        return `提现截止：${dateArr[0]}.${dateArr[1]}.${dateArr[2]}`
      }
    }
  }
}

const styles = BaseStyleSheet.create({
  breedSuccess: {
    width: 275,
    height: 302,
    paddingTop: 112.5
  },
  breedTips: {
    fontSize: 11,
    color: '#AF4200',
    lineHeight: 15,
    position: 'absolute',
    bottom: 17.5
  }
})
