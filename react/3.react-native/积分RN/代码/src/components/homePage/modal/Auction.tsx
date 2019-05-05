/**
 * Created by kerwinliu on 2018/8/13.
 */
import React, {PureComponent} from 'react'
import {View, Text} from '@iqiyi/rn-ui'
import {TouchableWithoutFeedback} from 'react-native'
import LinearGradient from '@iqiyi/rn-gradient-view'
import BaseStyleSheet from '../../../common/BaseStyleSheet'

import WebImage from '../../WebImage'
import {MyQiangPaiURL, GET_ENV} from '../../../constants/configs'
import {FetchAuctionData} from '../../../typings/apis/homePage'

interface AuctionProps {
  data: FetchAuctionData;
  auctionCode: string;
  openWeb(s: string): void;
  hideConfirmModal(): void;
}

export default class Auction extends PureComponent <AuctionProps, {}> {
  static defaultProps = {
    auctionCode: 'vip',
  }

  render() {
    const {data} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={{fontSize: 16, color: '#333'}}>抢拍成功</Text>
          <View style={styles.detail}>
            <Text style={{color: '#666666', fontSize: 14, marginVertical: 1}}>
              恭喜你花<Text style={{color: '#151515'}}> {data.cost} </Text>积分
            </Text>
            <Text style={{color: '#666666', fontSize: 14, marginVertical: 1}}>拍得{data.productName},已发放至账户</Text>
          </View>
          <TouchableWithoutFeedback onPress={this.openAuction}>
            <View style={[styles.button, {borderRadius: 50, marginTop: 15}]}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                colors={['#FF2C97', '#FF724D']}
                style={styles.button}
              >
                <Text style={{fontSize: 16, color: '#ffffff'}}>立即使用</Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <WebImage name="985_qiangpai" style={styles.icon} />
      </View>
    )
  }

  private openAuction = () => {
    const {auctionCode} = this.props
    this.props.hideConfirmModal().then(() => {
      this.props.openWeb(`${MyQiangPaiURL[GET_ENV()]}?code=${encodeURIComponent(auctionCode)}`)
    })
  }
}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 62.5,
  },
  box: {
    width: 270,
    height: 220,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingTop: 48.5,
    alignItems: 'center'
  },
  icon: {
    width: 175,
    height: 100,
    top: 0,
    left: 47.5,
    position: 'absolute'
  },
  detail: {
    width: 222.5,
    height: 63.5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 236,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
