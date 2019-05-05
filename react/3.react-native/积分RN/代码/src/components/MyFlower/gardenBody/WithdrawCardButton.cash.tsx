/**
 * Created by liuzhimeng.
 * @date 2019-01-05
 * @description 金钱花左下角提现卡按钮
 */

import React, {PureComponent} from 'react'
import {View, Text} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GetWithdrawCardModal from '../withdrawModal/GetWithdrawCardModal'
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector'
import {updateCashCardNum} from '../../../actions/GardenDetailActions'
import {fetchWithdrawInfo} from '../../../model/MyFlower'

import WebImage from '../../WebImage'
import FadeInBtn from '../../FadeInBtn'
import PingbackConfig from '../../../common/PingbackConfig'
import {sendClickPingback} from '../../../common/pingback'

interface CardButtonProps {
  theme: any;
  cashCardNum: number;
  gardenMode: string;
  hideConfirmModal: Function;
  showConfirmModal: Function;
  openWeb: Function;
  updateCashCardNum: Function;
}

@(connect(
  (state, props) => {
    const {cashCardNum} = getUserGardenDetail(state, props)
    return {
      cashCardNum
    }
  },
  dispatch => bindActionCreators({
    updateCashCardNum,
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class WithdrawCardButton extends PureComponent<CardButtonProps, {}> {
  componentDidMount() {
    this.getWithDrawCardInfo()
  }

  render() {
    const {theme} = this.props;
    return (
      <FadeInBtn style={[styles.container, {bottom: theme.withdrawCardButton && theme.withdrawCardButton.bottom}]} onPress={this._goGetWithdrawCard}>
        <View style={styles.totalNumWrapper}>
          <Text style={styles.totalNum}>x{this.props.cashCardNum}</Text>
        </View>
        <WebImage name="flower/flower_cash_withdraw_icon" style={styles.buttonIcon}/>
      </FadeInBtn>
    )
  }

  // 获取提现卡数据
  getWithDrawCardInfo = async () => {
    // 提现卡信息
    const {total: withdrawNum} = await fetchWithdrawInfo()
    this.props.updateCashCardNum(withdrawNum)
  }

  // 去获得提现卡
  _goGetWithdrawCard = () => {
    const {page} = PingbackConfig[this.props.gardenMode]
    sendClickPingback(page, 'withdraw_pop', 'withdraw_btn')

    this.props.hideConfirmModal()
    this.props.showConfirmModal({
      showCloseButton: false,
      content: (
        <GetWithdrawCardModal
          gardenMode={this.props.gardenMode}
          hide={this.props.hideConfirmModal}
          show={this.props.showConfirmModal}
          openWeb={this.props.openWeb}
        />
      ),
    })
  }
}

const styles = global.BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 55 + 43 + 15,
    left: 17,
    width: 100
  },
  buttonIcon: {
    width: 40,
    height: 43,
  },
  totalNumWrapper: {
    position: 'absolute',
    top: 0.5,
    left: 21,
    backgroundColor: '#ffffff',
    paddingLeft: 21 - 3,
    paddingRight: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  totalNum: {
    lineHeight: 16,
    color: '#419C00',
    fontSize: 12,
    fontWeight: '700'
  },
})
