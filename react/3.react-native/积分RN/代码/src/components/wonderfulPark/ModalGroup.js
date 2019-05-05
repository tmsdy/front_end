/**
 * Created by liuzhimeng.
 * @date 2018-12-18
 * @description 弹窗组（签到，抢拍、运营广告弹窗）
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View} from '@iqiyi/rn-ui'
import Sign from '../home/Sign'
import GetRewardScoreModal from '../../components/home/GetRewardScoreModal'
import AdvModal from './AdvModal'
import FlowerSeed from './FlowerSeed'
import AuctionModal from './AuctionModal'
import {updateArrayState} from '../../common/util'
import {GET_ENV, MyQiangPaiURL} from '../../constants/configs'
import {sendBlockPingback} from '../../common/pingback'
import {ADV_MODAL_BLOCK, AUCTION_MODAL_BLOCK, PARK_PAGE, SEED_MODAL_BLOCK, SIGN_MODAL_BLOCK} from './pingback';

/**
 * 私有数据，外部不可调用，只能通过filterModalState方法获取
 * @type object {
 *  [keyName]:            弹窗关键字
 *    {
 *      key: number,      弹框顺序：签到 > 运营弹框 > 种子 > 抢拍 > 投篮机
 *                        如果打开h5页面，需要加开关（hideAllModal）控制所有的弹框不展示，再在onshow里面关掉开关，继续展示接下来的弹框
 *      state: string,    用于获取展示弹窗的state，略过第一位签到弹窗、第二位设备积分提醒弹窗
 *      initStatus: boolean, 是否初始加载弹窗
 *    },
 * }
 * @private
 */
const _PRIVATE_MODAL_ORDRE_MAP = {
  signOrder: {
    key: 0,
    state: 'isSignVisible',
    initStatus: true,
    blockPb: SIGN_MODAL_BLOCK,
  },
  advOrder: {
    key: 1,
    state: 'isAdvVisible',
    initStatus: false,
    blockPb: ADV_MODAL_BLOCK,
  },
  seedOrder: {
    key: 2,
    state: 'isSeedVisible',
    initStatus: false,
    blockPb: SEED_MODAL_BLOCK,
  },
  auctionOrder: {
    key: 3,
    state: 'isAuctionVisible',
    initStatus: false,
    blockPb: AUCTION_MODAL_BLOCK,
  },
}

/**
 *  获取_PRIVATE_MODAL_ORDRE_MAP方法
 * @param keyName 弹窗关键字
 * @param attr // 查询属性名
 * @returns {*}
 */
export const filterModalState = (keyName, attr = 'key') => {
  if(!keyName) {
    return _PRIVATE_MODAL_ORDRE_MAP
  }
  const _states = _PRIVATE_MODAL_ORDRE_MAP[keyName]
  if(_states) {
    return attr ? _states[attr] : _states
  }
  return attr ? '' : {}
}

const getInitModalList = () => {
  const _list = filterModalState()
  return Object.keys(_list)
    .map((keyName) => {
      const value = _list[keyName]
      return {keyName, status: value.initStatus}
    })
}

export default class ModalGroup extends PureComponent {
  static propTypes = {
    isLogin: PropTypes.bool,
    lastScore: PropTypes.number,
    adv: PropTypes.array,
    hideAllModal: PropTypes.bool,
    auctionCode: PropTypes.string,
    auctionData: PropTypes.object,
    openWeb: PropTypes.func,
    handlePanResponderChange: PropTypes.func,
    disablePanResponder: PropTypes.func,
  }

  static defaultProps = {
    isLogin: false,
    lastScore: 0,
    adv: [],
    hideAllModal: false,
    auctionCode: 'vip',
    auctionData: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      modalList: getInitModalList(),
      isSignVisible: false,
      isAuctionVisible: false,
      isAdvVisible: false,
      isSeedVisible: false,
    }

    this.auctionUrl = `${MyQiangPaiURL[GET_ENV()]}?code=${encodeURIComponent(this.props.auctionCode)}`

    this.MODAL_STATE_MAP = filterModalState()
  }

  render() {
    return (
      <View>
        {this.state.modalList.map(({keyName, status} = {}) => {
          if(!status || this.props.hideAllModal) {
            return null
          }
          switch (keyName) {
            case 'signOrder':
              return this._renderSignModal()
            case 'scoreOrder':
              return this._renderGetScoreModal()
            case 'advOrder':
              return this._renderAdv()
            case 'seedOrder':
              return this._renderSeed()
            case 'auctionOrder':
              return this._renderAuctionModal()
            default:
              return null
          }
        })}
      </View>
    )
  }

  // 签到弹窗
  _renderSignModal = () => {
    return (
      <CheckInModal
        key={this.MODAL_STATE_MAP.signOrder.key}
        isVisible={this.state.isSignVisible}
        isLogin={this.state.isLogin}
        showNextModal={() => this.showCommonNext('signOrder', 'hide')}
      />
    )
  }

  // 设备积分提醒弹窗
  _renderGetScoreModal = () => {
    return (
      <GetRewardScoreModal
        key={this.MODAL_STATE_MAP.scoreOrder.key}
        isLogin={this.props.isLogin}
        lastScore={this.props.lastScore}
        showNextModal={() => this.showCommonNext('scoreOrder')}
      />
    )
  }

  _renderAdv = () => {
    if(this.props.adv.length) {
      return (
        <AdvModal
          key={this.MODAL_STATE_MAP.advOrder.key}
          data={this.props.adv[0]}
          openWeb={this.props.openWeb}
          isVisible={this.state.isAdvVisible}
          openAdv={this._openAdv}
          close={() => this.showCommonNext('advOrder')}
        />
      )
    }
  }

  _renderSeed = () => {
    return (
      <FlowerSeed
        key={this.MODAL_STATE_MAP.seedOrder.key}
        isVisible={this.state.isSeedVisible}
        onPress={this._onSeedPress}
      />
    )
  }

  _renderAuctionModal = () => {
    return (
      <AuctionModal
        key={this.MODAL_STATE_MAP.auctionOrder.key}
        isVisible={this.state.isAuctionVisible}
        data={this.props.auctionData}
        hideModal={() => this.showCommonNext('auctionOrder')}
        open={this._openAuctionModal}
      />
    )
  }

  // 操作所有弹窗
  _handleModal = (handle = 'show', keyName, callback = () => null) => {
    // console.log('_handleModal', handle, keyName, callback)
    if(handle === 'show') {
      sendBlockPingback(PARK_PAGE, this.MODAL_STATE_MAP[keyName].blockPb)
    }

    const isShow = handle === 'show'
    const stateKey = this.MODAL_STATE_MAP[keyName].state

    this.props.disablePanResponder(isShow) // 打开弹窗，禁用手势
    this.setState({[stateKey]: isShow}, callback)
  }

  // 递归查询展示下一个可用弹窗
  _showNext = (keyName) => {
    const {modalList} = this.state
    // 如果弹窗不存在，退出
    if(!keyName || !this.MODAL_STATE_MAP.hasOwnProperty(keyName)) {
      return
    }
    // 如果弹窗组查询完，退出
    const nextKey = this.MODAL_STATE_MAP[keyName].key + 1
    if(nextKey >= modalList.length) {
      return
    }
    // 查询下一个弹窗
    const item = modalList[nextKey]
    // 查询到下一个弹窗，展示弹窗并停止递归
    if(item.status) {
      return this._handleModal('show', item.keyName)
    }
    // 继续查询下一个可展示弹窗
    this._showNext(item.keyName)
  }

  showCommonNext = (keyName, handler = 'remove') => {
    // console.log('showCommonNext', keyName, this.state.modalList)
    if(handler === 'hide') {
      this.hideModal(keyName)
    } else {
      this.removeModal(keyName)
    }
    this._showNext(keyName)
  }

  // 打开弹窗
  showModal = (keyName) => {
    this._handleModal('show', keyName)
  }

  // 关闭弹窗
  hideModal = (keyName) => {
    this._handleModal('hide', keyName)
  }

  // render弹框数组，除签到弹窗不可控（会自动展示）外，其余均不自动展示
  setModalState = (keyName, status, callback = () => null) => {
    // console.log('setModalState', keyName, status)
    const {modalList} = this.state
    const {key} = this.MODAL_STATE_MAP[keyName]
    if(modalList[key] && modalList[key].status !== status) {
      const newModalList = updateArrayState(modalList, key, {keyName, status})
      this.setState({modalList: newModalList}, callback)
    } else {
      callback()
    }
  }

  // 移除弹窗组件
  removeModal = (keyName, callback) => {
    const stateKey = this.MODAL_STATE_MAP[keyName].state
    this.setState({[stateKey]: false})
    this.setModalState(keyName, false, callback)
    this.props.disablePanResponder(false) // 移除弹窗，启用手势
  }

  _openAdv = (callback) => {
    this.removeModal('advOrder')
    callback && callback()
  }

  _onSeedPress = () => {
    this.removeModal('seedOrder')
    this.props.handlePanResponderChange('bottomEnd')
  }

  // 从弹框打开抢拍需要关闭接下来所有弹框
  _openAuctionModal = () => {
    this.removeModal('auctionOrder')
    this.props.openWeb(this.auctionUrl)
  }
}

function CheckInModal({isVisible, isLogin, showNextModal}) {
  return isVisible && (
    <Sign isLogin={isLogin} showNextModal={showNextModal}/>
  )
}

CheckInModal.propTypes = {
  isVisible: PropTypes.bool,
  isLogin: PropTypes.bool,
  showNextModal: PropTypes.func,
}
CheckInModal.defaultProps = {
  isVisible: false,
  isLogin: false,
  showNextModal: () => null,
}
