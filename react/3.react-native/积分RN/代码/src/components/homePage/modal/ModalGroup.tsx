/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 积分中心弹窗组
 */

import React, {PureComponent} from 'react'
import EmptyComponent from '../../EmptyComponent'
import Sign from './Sign'
import Adv from './Adv'
import FlowerSeed from './FlowerSeed'
import Auction from './Auction'

interface ModalGroupProps {
  newborn: boolean;
  continuousValue: number;
  advList: any[]; // 运营广告数据
  auctionData: any;
  showConfirmModal(config: any): any;
  openWeb(config: any): any;
  goTo(config: any): any;
}

export default class ModalGroup extends PureComponent<ModalGroupProps, {}> {
  render() {
    return <EmptyComponent/>
  }

  public handleModal = () => {
    const {continuousValue, newborn, advList, auctionData, showConfirmModal, openWeb, goTo} = this.props

    if(continuousValue > 0) {
      showConfirmModal({
        showCloseButton: true,
        content: <Sign continuousValue={continuousValue} />,
      })
    }

    if(advList.length) {
      showConfirmModal({
        showCloseButton: true,
        content: <Adv data={advList[0]} openWeb={openWeb} />,
      })
    }

    if(newborn) {
      showConfirmModal({
        showCloseButton: false,
        content: <FlowerSeed goTo={goTo} />,
      })
    }

    if(auctionData.needNotice) {
      showConfirmModal({
        showCloseButton: true,
        content: <Auction data={auctionData} auctionCode="vip" openWeb={openWeb} />,
      })
    }
  }
}
