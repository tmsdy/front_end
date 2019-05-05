/**
 * Created by liuzhimeng.
 * @date 2019-01-05
 * @description 进行提现弹窗
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {Text, View} from '@iqiyi/rn-ui'
import CommonButton from '../CommonButton'
import WebImage from '../WebImage'
import {CashCountComponent} from './WithdrawModal'
import {askToWithdrawInFlower} from '../../model/MyFlower'
import {showToast} from '../../common/QYNativeBridge'
import {WALLET_URL} from '../../constants/configs'
import {getUserScoreInfo} from '../../selectors/GardenDetailSelector'
import {switchWithdrawStatus} from '../../actions/GardenDetailActions'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'

const RPAGE = 'moneyRN'
const BLOCKV = 801008

@connect(
  (state, props) => {
    const {totalCash, isWithdrawStatus} = getUserScoreInfo(state, props)
    return {totalCash, isWithdrawStatus}
  },
  dispatch => bindActionCreators({
    switchWithdrawStatus,
  }, dispatch),
  null,
  {withRef: true},
)
export default class WithdrawingModal extends PureComponent {
  static propTypes = {
    withdrawList: PropTypes.array,
    hide: PropTypes.func,
    openWeb: PropTypes.func,
  }

  static defaultProps = {
    hide: () => null,
    openWeb: () => null,
  }

  constructor(props) {
    super(props)
    this.inWithdrawing = false
  }

  componentDidMount() {
    sendBlockPingback(RPAGE, BLOCKV, {rseat: 'confirmbtn_show'})
  }

  render() {
    const {HeaderComponent, tip, buttonText} = this._getConfig()
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={this.props.hide}>
          <WebImage style={styles.bodyImage} name="flower/flower_cash_withdraw_red">
            {this.props.isWithdrawStatus && <WebImage style={styles.bodySuccessImage} name="flower/flower_cash_withdraw_coins"/>}
            {HeaderComponent}
            <View style={styles.bottomWrapper}>
              <Text style={styles.bottomText}>{tip}</Text>
            </View>
          </WebImage>
        </TouchableOpacity>
        <CommonButton
          mode="pure"
          text={buttonText}
          onPress={this._onPress}
          containerStyle={{width: 160}}
          buttonWrapperStyle={{backgroundColor: '#FFA429'}}
        />
      </View>
    )
  }

  _getConfig = () => {
    if(this.props.isWithdrawStatus) {
      return {
        HeaderComponent: <Text style={styles.withdrawSuccess}>提现成功</Text>,
        tip: `成功转出${this.props.totalCash}元\n至爱奇艺钱包`,
        buttonText: '查看爱奇艺钱包',
      }
    }
    return {
      HeaderComponent: <CashCountComponent count={this.props.totalCash} desc="提现金额"/>,
      tip: `现金${this.props.totalCash}元\n将提现至爱奇艺钱包`,
      buttonText: '确认金额',
    }
  }

  _onPress = () => {
    if(this.props.isWithdrawStatus) {
      // 查看爱奇艺钱包 按钮点击投递
      sendClickPingback(RPAGE, BLOCKV, 'walletbtn_click')
      this.props.hide()
      return this.props.openWeb(WALLET_URL)
    }
    // 确认金额 按钮点击投递
    sendClickPingback(RPAGE, BLOCKV, 'confirmbtn_click')
    this._askToWithdraw()
  }

  // 发起提现
  _askToWithdraw = async () => {
    if(this.inWithdrawing) {
      showToast('提现中，请勿重复点击')
      return
    }
    this.inWithdrawing = true

    const withdrawInfo = this.props.withdrawList[0] || {}
    if(!withdrawInfo || !withdrawInfo.orderCode) {
      showToast('没有提现卡，提现失败')
      return
    }

    showToast('提现中...')

    try {
      const {code, message, msg} = await askToWithdrawInFlower(withdrawInfo.orderCode)

      if(code === 'A00000') {
        sendBlockPingback(RPAGE, BLOCKV, {rseat: 'walletbtn_show'})
        this.props.switchWithdrawStatus(true)
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
}

const CONTAINER_WIDTH = 300
const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bodyImage: {
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: 360,
    paddingTop: 50,
  },
  bodySuccessImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 300,
    height: 250,
  },
  withdrawSuccess: {
    lineHeight: 35,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FF3D5C',
  },
  bottomWrapper: {
    position: 'absolute',
    left: 0,
    bottom: 85,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
  },
  bottomText: {
    lineHeight: 20,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
  },
})
