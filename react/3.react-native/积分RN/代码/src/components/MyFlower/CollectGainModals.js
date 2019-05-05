/**
 * Created by liuzhimeng.
 * @date 2019-01-04
 * @description 金钱花半透明弹窗集合
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'

import {Image, Text, View} from '@iqiyi/rn-ui'

import WebImage from '../WebImage'
import CollectModal from './CollectModal'
import TranslucentModal, {CommonTitle} from '../TranslucentModal'
import {fetchConditionStatus} from '../../model/MyFlower'
import {updateCollectNum} from '../../actions/GardenDetailActions'
// import {sendClickPingback} from '../../common/pingback'

const GET_COLLECTION_CARD_IMAGE_MAP = [
  'flower/flower_cash_collect_gold',
  'flower/flower_cash_collect_money',
  'flower/flower_cash_collect_flower',
]

// 卡片获取进度弹窗（复活卡、集宝卡、提现卡）
@connect(
  ({gardenDetail}) => {
    return {
      collectNum: gardenDetail.collectNum,
      isMasterMode: gardenDetail.isMasterMode,
    }
  },
  dispatch => bindActionCreators({
    updateCollectNum,
  }, dispatch),
  null,
  {withRef: true},
)
export default class CollectProcessModal extends PureComponent {
  static propTypes = {
    cards: PropTypes.object, // 复活卡、提现卡、集宝卡
    channelCode: PropTypes.string,
    desc: PropTypes.string,
    show: PropTypes.func,
    hide: PropTypes.func,
  }

  static defaultProps = {
    cards: {
      fertilizer: {count: 0},
      collection: {count: 0},
      withdraw: {count: 0},
      speeder: {count: 0},
    },
  }

  componentDidMount() {
    const {type} = this._getCardState()
    if(type === 'collection') {
      this._fetchConditionStatus()
    }
  }

  render() {
    const cardState = this._getCardState()
    return cardState.type ? this._renderContent(cardState) : <View/>
  }

  _renderContent = ({type, fertilizerCount, collectionCount, withdrawCount, speedUpCount}) => {
    // 复活卡
    if(type === 'fertilizer') return <GetFertilizerModal count={fertilizerCount} hide={this.props.hide}/>
    // 集宝卡 / 复活卡
    if(['collection', 'fertilizerAndCollection'].includes(type)) {
      // 集宝卡&&复活卡
      if(type === 'fertilizerAndCollection') {
        return (
          <CollectGetFertilizerAndCardModal
            fertilizerCount={fertilizerCount}
            collectionCount={collectionCount}
            showButton={this.props.isMasterMode}
            onPress={this._goCollectModal}
            hide={this.props.hide}
          />
        )
      }
      // 集宝卡
      if(this.props.collectNum === 0) {
        return <View/>
      } else {
        return (
          <CollectGetCardModal
            count={collectionCount}
            collectNum={this.props.collectNum}
            showButton={this.props.isMasterMode}
            desc={this.props.desc}
            onPress={this._goCollectModal}
            hide={this.props.hide}
          />
        )
      }
    }
    // 提现卡
    if(type === 'withdraw') {
      return <DrawCashModal desc={this.props.desc} count={withdrawCount} hide={this.props.hide}/>
    }
    // 加速液
    if(type === 'speeder') {
      return <SpeederModal desc={this.props.desc} count={speedUpCount} hide={this.props.hide}/>
    }
    // 复活卡和提现卡
    if(type === 'fertilizerAndWithdraw') {
      return <GetFertilizerAndDrawCashModal fertilizerCount={fertilizerCount} withdrawCount={withdrawCount} hide={this.props.hide}/>
    }
    // 复活卡和加速肥
    if(type === 'fertilizerAndSpeeder') {
      return <GetFertilizerAndSpeederModal fertilizerCount={fertilizerCount} speedUpCount={speedUpCount} hide={this.props.hide}/>
    }
  }

  _getCount = (obj) => {
    return obj && obj.count ? obj.count : 0
  }

  // 获取卡片种类和数量
  _getCardState = () => {
    const {fertilizer, collection, withdraw, speeder} = this.props.cards
    // 复活卡
    const fertilizerCount = this._getCount(fertilizer)
    // 集宝卡
    const collectionCount = this._getCount(collection)
    // 提现卡
    const withdrawCount = this._getCount(withdraw)
    // 加速液
    const speedUpCount = this._getCount(speeder)

    let type = ''
    if(fertilizerCount) {
      if(collectionCount) type = 'fertilizerAndCollection'
      else if(withdrawCount) type = 'fertilizerAndWithdraw'
      else if(speedUpCount) type = 'fertilizerAndSpeeder'
      else type = 'fertilizer'
    } else if(collectionCount) {
      type = 'collection'
    } else if(withdrawCount) {
      type = 'withdraw'
    } else if(speedUpCount) {
      type = 'speeder'
    }

    return {type, fertilizerCount, collectionCount, withdrawCount, speedUpCount}
  }

  // 获取集宝卡进度
  _fetchConditionStatus = async () => {
    if(this.props.channelCode) {
      const {complete = 0} = await fetchConditionStatus(this.props.channelCode)
      this.props.updateCollectNum(complete)
    }
  }

  // 去金钱花集宝卡弹窗
  _goCollectModal = () => {
    this.props.hide()
    this.props.show({
      content: <CollectModal channelCode={this.props.channelCode} show={this.props.show} hide={this.props.hide}/>,
      showCloseButton: true,
    })
  }
}

// 获得复活肥
export function GetFertilizerModal({count, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '复活肥', count}]}/>}
      showButton={false}
      hide={hide}
    >
      <Image source={{uri: 'integral_bee_fertilizer'}} style={styles.fertilizerImage}/>
    </TranslucentModal>
  )
}
GetFertilizerModal.defaultProps = {
  count: 1
}

// 获得集宝卡
export class CollectGetCardModal extends PureComponent {
  static propTypes = {
    showButton: PropTypes.bool,
    count: PropTypes.number,
    collectNum: PropTypes.number,
    desc: PropTypes.string,
    hide: PropTypes.func,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    count: 1,
    showButton: false,
    desc: ''
  }

  render() {
    return (
      <TranslucentModal
        title={<CommonTitle list={[{name: '集宝卡', count: this.props.count}]}/>}
        desc={this.props.desc}
        buttonText="去集宝卡查看"
        showButton={this.props.showButton}
        onPress={this.props.onPress}
        hide={this.props.hide}
      >
        <WebImage name={this._getCardName()} style={styles.collectionImage}/>
      </TranslucentModal>
    )
  }

  _getCardName = () => {
    if(this.props.collectNum > 0) {
      return GET_COLLECTION_CARD_IMAGE_MAP[this.props.collectNum - 1]
    }
    return ''
  }
}

// 获得提现卡
export function DrawCashModal({desc, count, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '提现卡', count}]}/>}
      desc={desc}
      showButton={false}
      hide={hide}
    >
      <WebImage name="flower/flower_cash_reward_money" style={styles.drawCashImage}/>
    </TranslucentModal>
  )
}
DrawCashModal.defaultProps = {
  count: 1,
  desc: '您成功邀请好友加入花园'
}

// 获得加速肥
export function SpeederModal({desc, count, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '加速液', count}]}/>}
      desc={desc}
      showButton={false}
      hide={hide}
    >
      <WebImage name="flower/speed-up" style={styles.speedUpImage}/>
    </TranslucentModal>
  )
}
SpeederModal.defaultProps = {
  count: 1,
}

// 获得复活肥和集宝卡
export function CollectGetFertilizerAndCardModal({fertilizerCount, collectionCount, showButton, onPress, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '复活肥', count: fertilizerCount}, {name: '集宝卡', count: collectionCount}]}/>}
      desc="您成功邀请好友加入花园"
      buttonText="去集宝卡查看"
      showButton={showButton}
      hide={hide}
      onPress={onPress}
    >
      <WebImage name="flower/flower_cash_collect_modal_manure_flower" style={styles.fertilizerAndCardImage}/>
    </TranslucentModal>
  )
}
CollectGetFertilizerAndCardModal.defaultProps = {
  fertilizerCount: 1,
  collectionCount: 1
}

// 获得复活肥和提现卡
export function GetFertilizerAndDrawCashModal({fertilizerCount, withdrawCount, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '复活肥', count: fertilizerCount}, {name: '提现卡', count: withdrawCount}]}/>}
      desc="您成功邀请好友加入花园"
      showButton={false}
      hide={hide}
    >
      <WebImage name="flower/flower_cash_reward_money_and_fertilizer" style={styles.fertilizerAndDrawCashImage}/>
    </TranslucentModal>
  )
}
GetFertilizerAndDrawCashModal.defaultProps = {
  fertilizerCount: 1,
  withdrawCount: 1
}

// 获得复活肥和加速肥
export function GetFertilizerAndSpeederModal({fertilizerCount, speedUpCount, hide}) {
  return (
    <TranslucentModal
      title={<CommonTitle list={[{name: '复活肥', count: fertilizerCount}, {name: '加速液', count: speedUpCount}]}/>}
      desc="您成功邀请好友加入花园"
      showButton={false}
      hide={hide}
    >
      <WebImage name="flower/speed-up-and-reviver" style={styles.fertilizerAndSpeederImage}/>
    </TranslucentModal>
  )
}
GetFertilizerAndSpeederModal.defaultProps = {
  fertilizerCount: 1,
  speedUpCount: 1
}

// 获得现金奖励
export function RewardMoneyModal({money, autoClose, hide}) {
  return (
    <TranslucentModal
      title="获得现金奖励"
      showButton={false}
      autoClose={autoClose}
      hide={hide}
    >
      <WebImage name="flower/flower_cash_reward_cash" style={styles.rewardMoneyImage}>
        <Text style={styles.rewardMoneyCount}>{money}</Text>
      </WebImage>
    </TranslucentModal>
  )
}

RewardMoneyModal.defaultProps = {
  money: 0,
  autoClose: true,
}

const styles = BaseStyleSheet.create({
  collectionImage: {
    width: 178,
    height: 201,
  },

  fertilizerImage: {
    width: 200,
    height: 200,
  },

  fertilizerAndCardImage: {
    width: 200,
    height: 150,
  },

  rewardMoneyImage: {
    alignItems: 'center',
    width: 179,
    height: 178,
  },
  rewardMoneyCount: {
    marginTop: 33,
    lineHeight: 53.5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF7122',
    fontSize: 38,
  },

  drawCashImage: {
    width: 175,
    height: 180,
  },

  speedUpImage: {
    width: 225,
    height: 190,
  },

  fertilizerAndDrawCashImage: {
    width: 213,
    height: 155.5,
  },

  fertilizerAndSpeederImage: {
    width: 225,
    height: 190,
  },
})
