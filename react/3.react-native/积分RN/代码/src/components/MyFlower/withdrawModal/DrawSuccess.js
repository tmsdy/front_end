/**
 * Created by kerwinliu.
 * @date 2019-04-01
 * @description 培育完成可提现
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
  Width
} from '@iqiyi/rn-utils'
import {switchWithdrawStatus} from '../../../actions/GardenDetailActions'
import {ImageBox} from './ImageBox'
import WebImage from '../../WebImage'
import {formatCash} from '../../utils'


@connect(
  (state) => {
    const {totalCash, isWithdrawStatus} = state.gardenDetail
    return {
      totalCash: formatCash(totalCash), // 奖励金额
      isWithdrawStatus
    }
  },
  dispatch => bindActionCreators({
    switchWithdrawStatus,
  }, dispatch),
  null,
  {withRef: true},
)
export default class DrawSuccess extends PureComponent {
  render() {
    const {buttonImage = 'flower/view_wallet'} = this.props
    return (
      <WebImage name="flower/bg_light" style={styles.spotlight}>
        <ImageBox
          containerImage="flower/withdraw_success"
          containerStyle={styles.withdrawSuccess}
          containerText="- 已获得 -"
          priceValue={this.props.totalCash}
          onPress={this.props.onPress}
          buttonImage={buttonImage}
          buttonStyle={{bottom: 22}}
        />
      </WebImage>
    )
  }
}

const BG_WIDTH = .93 * Width
const styles = BaseStyleSheet.create({
  withdrawSuccess: {
    width: 275,
    height: 294,
    paddingTop: 111.5
  },
  spotlight: {
    width: BG_WIDTH,
    height: BG_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  }
})
