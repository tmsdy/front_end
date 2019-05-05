/**
 * Created by liuzhimeng.
 * @date 2019-01-05
 * @description 金钱花右上角提现按钮
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {Image, Text, View} from '@iqiyi/rn-ui'

import FadeInBtn from '../FadeInBtn'
import LottieAnimation from '../LottieAnimation'
import WithdrawModal from './WithdrawModal'

import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../common/asyncStorage'
import {fetchUserMoney, fetchWithdrawState} from '../../model/MyFlower'
import {getUserScoreInfo} from '../../selectors/GardenDetailSelector'
import {setTotalCash, switchWithdrawStatus} from '../../actions/GardenDetailActions'
import {GARDEN_ENUM} from '../../constants/IntegralEnum'
import {showToast} from '../../common/QYNativeBridge'
import {getObjectValueSafely} from '../../common/util'
import {formatCash} from '../utils'

// 第一次进入金钱花显示提现卡动效
const FLOWER_CASH_WITHDRAW_BUTTON_ACTIVE = `FLOWER_CASH_WITHDRAW_BUTTON_ACTIVE_${global.USER_INFO.userId}`

// 金钱花提现卡按钮
@connect(
  (state, props) => {
    const {isWithdrawStatus} = getUserScoreInfo(state, props)
    // 金钱花领取奖励时间
    const consumeEnd = getObjectValueSafely(state, 'gardenDetail.masterGardenInfo.consumeEnd')
    const totalCash = getObjectValueSafely(state, 'gardenDetail.totalCash')
    return {
      consumeEnd,
      totalCash: formatCash(totalCash),
      isWithdrawStatus,
      isHistoryGardenMode: state.gardenDetail.isHistoryGardenMode || false,
      wateringInfo: state.gardenDetail.masterGardenInfo.wateringInfo || {waterDays: 0},
    }
  },
  dispatch => bindActionCreators({
    setTotalCash,
    switchWithdrawStatus,
  }, dispatch),
  null,
  {withRef: true},
)
export default class WithdrawButton extends PureComponent {
  static propTypes = {
    showConfirmModal: PropTypes.func,
    hideConfirmModal: PropTypes.func,
    revive: PropTypes.func,
    openWeb: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      showAnimation: false,
    }

    this.isShownAnimation = false
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    if(!this.isShownAnimation && !this.state.showAnimation && this._canWithdraw()) {
      this.isShownAnimation = true
      this._showCashActive()
    }
  }

  render() {
    return (
      <FadeInBtn style={styles.container} onPress={this.showModal}>
        <View style={styles.iconWrapper}>
          {this.state.showAnimation
            ? (
              <View style={styles.animationWrapper}>
                <LottieAnimation
                  ref={el => el && el.play()}
                  style={{flex: 1}}
                  name="reward_money"
                  loop={true}
                />
              </View>
            )
            : <Image source={{uri: 'integral_cash_btn'}} style={styles.buttonIcon}/>
          }
          <View style={[styles.cashWrapper, this.state.showAnimation ? styles.withBg : {}]}>
            <Text style={styles.cashCountText}>{this.props.totalCash}</Text>
          </View>
        </View>
      </FadeInBtn>
    )
  }

  showModal = () => {
    if(this.props.consumeEnd > 0 && this.props.consumeEnd < Date.now()) {
      return showToast('活动已结束')
    }
    this.setState({showAnimation: false})
    this.props.showConfirmModal({
      content: (
        <WithdrawModal
          revive={this.props.revive}
          openWeb={this.props.openWeb}
          show={this.props.showConfirmModal}
          hide={this.props.hideConfirmModal}
        />
      ),
      showCloseButton: true,
    })
  }

  // 培育成功（历史态金钱花 / 浇水21天）
  _isSuccess = () => {
    return this.props.isHistoryGardenMode || this.props.wateringInfo.waterDays >= 21
  }

  // 未提现 && 培育成功
  _canWithdraw = () => {
    return !this.props.isWithdrawStatus && this._isSuccess()
  }

  getData = async () => {
    if(this._isSuccess()) {
      this._fetchWithdrawState()
    } else {
      // 未培育成功 或 未提现，查询当前金额
      this._fetchUserMoney()
    }
  }

  // 获取用户提现情况（包含是否提现、未提现金额、累计已提现金额）
  _fetchWithdrawState = async () => {
    try {
      const {code, data = {}, message = '网络繁忙，提现金额查询失败'} = await fetchWithdrawState(GARDEN_ENUM.CHANNEL_CODE.Money)

      if(code === 'A00000') {
        const {hasWithdrawn = false, remainAmount = 0, withdrawnAmount = 0} = data

        const cash = hasWithdrawn ? withdrawnAmount : remainAmount
        this.props.switchWithdrawStatus(hasWithdrawn)
        this.props.setTotalCash(cash)
        this._showCashActiveInit()

      } else {
        showToast(message)
      }

    } catch(e) {
      showToast('网络繁忙，提现金额查询失败')
    }
  }

  // 获取用户金额
  _fetchUserMoney = async () => {
    try {
      const {current = 0} = await fetchUserMoney()
      this.props.setTotalCash(current)
      return current
    } catch(e) {
      return 0
    }
  }

  // 判断是否展示提现按钮金币动效
  _showCashActiveInit = async () => {
    const hasShown = await getAsyncStoragePromise(FLOWER_CASH_WITHDRAW_BUTTON_ACTIVE) === 'hasShown'
    const canWithdraw = this._canWithdraw()
    if(!hasShown || canWithdraw) {
      if(!hasShown) {
        saveAsyncStoragePromise(FLOWER_CASH_WITHDRAW_BUTTON_ACTIVE, 'hasShown')
      }
      if(canWithdraw) {
        this.isShownAnimation = true
      }
      this._showCashActive()
    }
  }

  // 播放动效
  _showCashActive = () => {
    this.setState({showAnimation: true})
  }
}

const BASE_SIZE = 40
const CASH_WIDTH = 38
const CONTAINER_WIDTH = 17 * 2 + BASE_SIZE
const CONTAINER_HEIGHT = 7.5 * 2 + BASE_SIZE
const styles = BaseStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
  },
  animationWrapper: {
    width: 53,
    height: 58,
  },
  cashWrapper: {
    position: 'absolute',
    left: (CONTAINER_WIDTH - CASH_WIDTH) / 2,
    bottom: 7.5 + 1,
    width: CASH_WIDTH,
  },
  withBg: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: CASH_WIDTH,
    backgroundColor: '#ee5f5b',
  },
  cashCountText: {
    height: 13,
    lineHeight: 13,
    textAlign: 'center',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: BASE_SIZE,
    height: 43,
  },
})
