/**
 * Created by liuzhimeng.
 * @date 2019-01-05
 * @description 金钱花提现卡弹窗
 */
import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'

import {Text, View} from '@iqiyi/rn-ui'

import CommonButton from '../CommonButton'
import WebImage from '../WebImage'
import {ModalCardBg} from './CollectModal'
import WithdrawingModal from './WithdrawingModal'
import HelpModal from './HelpModal.cash'
import {fetchReliveInfo, fetchWithdrawInfo} from '../../model/MyFlower'
import {shareToFriends} from '../utils'
import {getUserScoreInfo} from '../../selectors/GardenDetailSelector'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'
import {GARDEN_ENUM} from '../../constants/IntegralEnum'
import PingbackConfig from '../../common/PingbackConfig'
import {switchWithdrawStatus} from '../../actions/GardenDetailActions'
import WithdrawModalIndex from './withdrawModal/WithdrawIndex'

const RPAGE = 'moneyRN'
const BLOCKV = '801004'

// const CASH_DESC_LIST = [
//   ['红包日：', '第1、5、12、18、21日浇水获现金'],
//   ['第12日：', '花儿浇水后最高可获得888元'],
//   ['第21日：', '花儿浇水后最高可获得2019元'],
//   ['提现截止日期：', '2019.04.30'],
// ]

const FLOWER_DIE_DESC_LIST = [
  '花儿枯萎奖励就会失效，使用复活肥，可激活当前奖励。',
  '如果选择重新种植，失去当前奖励，重新开始。',
]

// 金钱花提现卡流程弹窗（包含培育过程状态、规则说明弹窗、已提现状态、提现流程等等）
export default class WithdrawModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isMainbody: true,
    }
  }

  render() {
    return this.state.isMainbody
      ? <WithdrawMainModal {...this.props} goHelp={() => this._goMain(false)}/>
      : <HelpModal showBack={true} hide={this.props.hide} goBack={() => this._goMain(true)}/>
  }

  _goMain = (isMainbody) => {
    this.setState({isMainbody})
  }
}

@connect(
  (state, props) => {
    const {totalCash, isWithdrawStatus} = getUserScoreInfo(state, props)
    return {
      totalCash, // 奖励金额
      isWithdrawStatus,
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
class WithdrawMainModal extends PureComponent {
  static propTypes = {
    goHelp: PropTypes.func, // 去帮助页
    revive: PropTypes.func, // 复活
    show: PropTypes.func,
    hide: PropTypes.func,
    openWeb: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      reviveList: [], // 复活肥列表
      reviveNum: 0, // 复活肥数量
      withdrawList: [], // 提现卡列表
      buttonText: '', // 按钮文字
    }

    this.withdrawNum = 0 // 提现卡数量
  }

  componentDidMount() {
    sendBlockPingback(RPAGE, BLOCKV, {rseat: 'moneycard'})
    this._getData()
  }

  render() {
    if(!this._isDie()) {
      return (
        <React.Fragment>
          {
            this._renderNormalDesc()
          }
        </React.Fragment>
      )
    }
    const backupState = this._getWithdrawBackup()
    return (
      <ModalCardBg
        withQuestionIcon={false}
        goHelp={() => this.props.goHelp()}
        HeaderComponent={<Text style={styles.boxTitle}>{this._renderTitle()}</Text>}
      >
        <View style={styles.container}>
          <CashCountComponent
            style={{marginBottom: 12}}
            count={this.props.totalCash}
            disabled={this._isDie()}
            desc={this._getCashTip()}
          />
          <View style={styles.cashDesc}>
            {this._renderDieCashDesc()}
          </View>
          <View style={styles.line}/>
          <View style={styles.withdrawBackup}>
            <View style={styles.backupIconWrapper}>
              <WebImage style={styles.backupIcon} name={backupState.image}/>
            </View>
            <Text style={styles.backupText}>{backupState.text}</Text>
          </View>
        </View>
        <View style={styles.bottomWrapper}>
          {this._canWithdraw() && (
            <TouchableOpacity activeOpacity={1} onPress={() => this._goToShare()}>
              <WebImage style={styles.share} name="flower/flower_cash_withdraw_share_icon"/>
            </TouchableOpacity>
          )}
          <CommonButton
            mode="pure"
            text={this.state.buttonText}
            onPress={() => this._getButtonConfig()
              .press()}
            containerStyle={{width: 150}}
            buttonWrapperStyle={{backgroundColor: '#FFA429'}}
          />
        </View>
      </ModalCardBg>
    )
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

  // 标题
  _renderTitle = () => {
    if(this._isDie()) return '当前奖励已失效'
    if(this._isSuccess()) return '培育成功'
    return `第${this.props.waterDays}天`
  }

  // 奖励提示文字
  _getCashTip = () => {
    if(this._isDie()) return '当前奖励已失效'
    if(this.props.isWithdrawStatus) return '累计获得奖励金额（已提现）'
    return '累计获得奖励金额'
  }

  // 枯萎文案
  _renderDieCashDesc = () => {
    return (
      <React.Fragment>
        {FLOWER_DIE_DESC_LIST.map(item => (
          <View key={item} style={[styles.descItem, {alignItems: 'flex-start'}]}>
            <View style={styles.descTitleImageWrapper}>
              <WebImage style={styles.descTitleImage} name="flower/flower_cash_withdraw_decoration_icon"/>
            </View>
            <Text style={styles.descContent} numberOfLines={1}>{item}</Text>
          </View>
        ))}
      </React.Fragment>
    )
  }

  // 正常提示文案
  _renderNormalDesc = () => {
    // return (
    //   <React.Fragment>
    //     {CASH_DESC_LIST.map(item => (
    //       <View key={item[0]} style={styles.descItem}>
    //         <Text style={styles.descTitle}>{item[0]}</Text>
    //         <Text style={styles.descContent} numberOfLines={1}>{item[1]}</Text>
    //       </View>
    //     ))}
    //   </React.Fragment>
    // )
    return (
      <WithdrawModalIndex
        openWeb={this.props.openWeb}
        show={this.props.show}
        hide={this.props.hide}
      />
    )
  }

  // 提现卡文案
  _getWithdrawBackup = () => {
    if(this._isDie()) {
      return {
        image: 'flower/flower_cash_fertilizer_icon',
        text: '使用复活肥就能原地复活！邀请好友即可获得',
      }
    }
    return {
      image: this.withdrawNum ? 'flower/flower_cash_withdraw_icon' : 'flower/flower_cash_not_get_withdraw_card',
      text: '浇水21日后凭提现卡提现，拥有10位好友或邀请爱奇艺新用户可获提现卡',
    }
  }

  _getData = async () => {
    if(this._isDie()) {
      // 复活化肥信息
      const {totalNum: reviveNum, reviveList} = await fetchReliveInfo()
      if(reviveNum) {
        const {page, block, blockRseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].revive
        sendBlockPingback(page, block, {rseat: blockRseat})
      } else {
        const {page, block, blockRseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].getFertilizer
        sendBlockPingback(page, block, {rseat: blockRseat})
      }
      this.setState({reviveNum, reviveList}, () => {
        this.setState({buttonText: this._getButtonText()})
      })
    } else {
      // 提现卡信息
      const {total: withdrawNum, list: withdrawList} = await fetchWithdrawInfo()

      this.withdrawNum = withdrawNum

      if(this.props.isWithdrawStatus) {
        sendBlockPingback(RPAGE, BLOCKV, {rseat: 'moneyripeshare_show'})
      }

      if(!this.props.isWithdrawStatus && this._goToWithdraw()) {
        sendBlockPingback(RPAGE, BLOCKV, {rseat: 'moneygetbtn_show'})
      }

      this.setState({withdrawList}, () => {
        this.setState({buttonText: this._getButtonText()})
      })
    }
  }

  // 是否可以去提现
  _goToWithdraw = () => {
    return this.withdrawNum && (this.props.isHistoryGardenMode || this.props.waterDays >= 21)
  }

  // 获得按钮文字
  _getButtonText = () => {
    return this._getButtonConfig().text
  }

  // 获取按钮配置
  _getButtonConfig = () => {
    if(this._isDie()) {
      return {
        text: this.state.reviveNum ? '立即复活' : '我要复活肥',
        press: this._relive,
      }
    }
    if(this.props.isWithdrawStatus) {
      return {
        text: '炫耀成果',
        press: () => this._goToShare('cashComplete', true),
      }
    }
    if(this._goToWithdraw()) {
      return {
        text: '立即提现',
        press: this._goWithdraw,
      }
    }
    if(this.withdrawNum) {
      return {
        text: '邀请好友',
        press: () => this._goToShare('giveSeed'),
      }
    }
    return {
      text: '获取提现卡',
      press: this._goWithdraw,
    }
  }

  // 去复活
  _relive = () => {
    const {reviveNum, reviveList} = this.state
    this.props.hide()
    if(!reviveNum) {
      const {page, block, rseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].getFertilizer
      sendClickPingback(page, block, rseat)
      shareToFriends('cashRevive')
    } else {
      const {page, block, rseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].revive
      sendClickPingback(page, block, rseat)
      this.props.revive(reviveList[0])
    }
  }

  // 去提现
  _goWithdraw = () => {
    this.props.hide()
    if(this._goToWithdraw()) {
      sendClickPingback(RPAGE, BLOCKV, 'moneygetbtn_click')
      this.props.show({
        content: <WithdrawingModal withdrawList={this.state.withdrawList} openWeb={this.props.openWeb} hide={this.props.hide}/>,
        showCloseButton: false,
      })
    } else {
      // 获取提现卡
      sendClickPingback(RPAGE, BLOCKV, 'moneycardshare')
      shareToFriends('cashGetWithdraw')
    }
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

// 金额显示组件
export function CashCountComponent({style, count, desc, disabled}) {
  const _disabledStyle = disabled ? {color: '#FFD9DF'} : {}
  return (
    <View style={[styles.cashContainer, style]}>
      <View style={styles.cashWrapper}>
        <Text style={[styles.cashCountText, _disabledStyle]}>{count}</Text>
        <Text style={[styles.cashCountUnit, _disabledStyle]}>元</Text>
      </View>
      {!!desc && <Text style={[styles.cashTip, _disabledStyle]}>{desc}</Text>}
    </View>
  )
}

CashCountComponent.propTypes = {
  count: PropTypes.number,
  desc: PropTypes.string,
  disabled: PropTypes.bool,
}
CashCountComponent.defaultProps = {
  count: 0,
  disabled: false,
}

const CONTAINER_WIDTH = 300
const styles = BaseStyleSheet.create({
  boxTitle: {
    width: CONTAINER_WIDTH,
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 28,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DE773D',
  },

  container: {
    alignItems: 'center',
    paddingHorizontal: 27,
  },

  cashDesc: {
    width: 250,
    paddingHorizontal: 9,
    paddingVertical: 11.5,
    backgroundColor: '#FFF0E3',
    borderRadius: 5,
    marginBottom: 20,
  },
  descItem: {
    flexDirection: 'row',
  },
  descTitle: {
    height: 19,
    lineHeight: 19,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC9065',
  },
  descContent: {
    flex: 1,
    lineHeight: 19,
    marginBottom: 4,
    fontSize: 12,
    color: '#DC9065',
  },
  descTitleImageWrapper: {
    paddingHorizontal: 5,
    paddingTop: 7,
  },
  descTitleImage: {
    width: 7.5,
    height: 7.5,
  },

  line: {
    width: 245,
    height: 0.5,
    marginBottom: 22,
    backgroundColor: '#F6DFCA',
  },

  withdrawBackup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backupIconWrapper: {
    width: 37,
    height: 38.5,
    marginRight: 10,
  },
  backupIcon: {
    width: 37,
    height: 38.5,
  },
  backupText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16.5,
    color: '#DC9065',
  },

  bottomWrapper: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  share: {
    width: 40,
    height: 40,
    marginRight: 20,
  },

  // CashCountComponent
  cashContainer: {
    alignItems: 'center',
  },
  cashWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 56,
  },
  cashCountText: {
    height: 56,
    lineHeight: 56,
    fontSize: 40,
    color: '#FF3D5C',
    fontWeight: 'bold',
  },
  cashCountUnit: {
    height: 43,
    lineHeight: 43,
    fontSize: 14,
    color: '#FF3D5C',
    fontWeight: 'bold',
  },
  cashTip: {
    lineHeight: 16.5,
    textAlign: 'center',
    fontSize: 12,
    color: '#FF7D6F',
  },
})
