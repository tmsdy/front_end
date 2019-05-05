/**
 * Created by liuzhimeng.
 * @date 2019-01-04
 * @description 金钱花集宝卡按钮
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import WebImage from '../WebImage'
import FadeInBtn from '../FadeInBtn'
import CollectModal from './CollectModal'
import {fetchConditionStatus, fetchHistory} from '../../model/MyFlower'
import {GARDEN_ENUM} from '../../constants/IntegralEnum'
import {updateCollectNum} from '../../actions/GardenDetailActions'

// 金钱花集宝卡按钮
@connect(
  ({gardenDetail}) => {
    return {
      collectNum: gardenDetail.collectNum,
      masterUserId: gardenDetail.masterUserId,
      channelCode: gardenDetail.masterGardenInfo.channelCode,
    }
  },
  dispatch => bindActionCreators({
    updateCollectNum,
  }, dispatch),
  null,
  {withRef: true},
)
export default class CollectButton extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasCashFlower: true, // 种过金钱花后，则不展示金钱花集宝卡按钮
    }

    this.isUnmount = false
  }

  componentDidMount() {
    this._fetchHistory()
    this._fetchConditionStatus()
  }

  componentWillUnmount() {
    this.isUnmount = true
  }

  render() {
    return !this.state.hasCashFlower && (
      <FadeInBtn style={styles.container} onPress={this.showModal}>
        <WebImage style={styles.buttonIcon} name="webp/flower_collect_button.webp"/>
      </FadeInBtn>
    )
  }

  showModal = () => {
    this.props.showConfirmModal({
      content: <CollectModal show={this.props.showConfirmModal} hide={this.props.hideConfirmModal}/>,
    })
  }

  _fetchHistory = async () => {
    const list = await fetchHistory()
    if(!this.isUnmount) {
      const hasCashFlower = list.findIndex(i => i.mode === GARDEN_ENUM.MODE.Cash) > -1
      this.setState({hasCashFlower})
    }
  }

  _fetchConditionStatus = async () => {
    if(this.props.channelCode) {
      const {complete = 0} = await fetchConditionStatus(this.props.channelCode)
      this.props.updateCollectNum(complete)
    }
  }
}

const BASE_SIZE = 40
const BASE_HEIGHT = 43
const CONTAINER_WIDTH = 17 * 2 + BASE_SIZE
const CONTAINER_HEIGHT = 15 + BASE_HEIGHT
const styles = BaseStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  buttonIcon: {
    width: BASE_SIZE,
    height: BASE_HEIGHT,
  },
})
