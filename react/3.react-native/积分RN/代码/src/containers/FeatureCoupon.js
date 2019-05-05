/**
 * 商品详情
 * @lzj
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {View, Text, Image, ActivityIndicator} from '@iqiyi/rn-ui';
import {isIOS} from '@iqiyi/rn-utils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar';
import {getUserInfo, consumeCallback, consumeScore, bindCoupon, getCouponList} from '../api';
import {getSignForSingleCoupon, getCouponImage} from '../common/util';
import ConfirmModal from '../components/ConfirmModal'
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import {hideLoading, showToast} from '../common/QYNativeBridge'

import {changeTotalScore} from '../actions/TotalScoreActions'
import BasePage from '../components/BasePage';

const {width} = Dimensions.get('window');
@connect(null, dispatch => bindActionCreators({changeTotalScore}, dispatch), null, {withRef: true})
export default class extends BasePage {

  pageName = 'pointbuy'

  constructor(props) {
    super(props)
    this.state = {
      goodsInfo: this.props.navigation.state.params.item, // 商品信息
      isLoading: true,
      modalVisible: false, // 确认兑换弹窗是否展示
      exchangeLoading: false, // 订单处理loading
      requestFailToastText: '兑换失败，请重试',
      totalScore: 0,
      level: 1, // 默认乐园等级
      showSuccessModal: false,
      transparentModal: true,
    }
    this.paramsProps = this.props.navigation.state.params
    this.orderNum = ''
    this.pageNo = this.paramsProps.pageNo
  }

  count = 0

  componentDidMount() {
    sendPagePingback(this.pageName);
    hideLoading()
    Promise.all([
      this._getUserInfo(),
      this._getCouponList()
      //   this._getProductInfo(),
    ])
      .then(() => {
        this.setState({
          isLoading: false
        })
      })
      .catch()
  }

  _getUserInfo() {
    getUserInfo({
      typeCode: 'point,paradise',
    }).then((data) => {
      const {totalScore} = data[0]
      const {level} = data[1]
      this.setState({
        totalScore,
        level,
      })
    }).catch();
  }

  _renderTopSection = () => {
    const {goodsInfo} = this.state
    return (
      goodsInfo ?
        <View>
          <Image
            source={{uri: getCouponImage(goodsInfo.partner, 'detail')}}
            style={{width, height: 150}}
          />
          <View style={styles.topSection}>
            <Text style={{color: '#333333', fontSize: 17}} numberOfLines={1}>
              {goodsInfo.couponName}
            </Text>
            <View style={styles.priceBox}>
              <Text style={styles.detailPrice}>
                {goodsInfo.requiredIntegral}积分
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
        :
        <View style={styles.centerBox}>
          <ActivityIndicator text="内容即将呈现..." />
        </View>
    )
  }

  _renderGoodsDetail = () => {
    const {goodsInfo} = this.state
    if(goodsInfo) {
      return (
        <View style={styles.detailWrap}>
          <Text style={styles.detailTitle}>兑换规则</Text>
          <Text style={{color: '#666666', fontSize: 13, lineHeight: 19}}>
            {goodsInfo.useDesc}
          </Text>
        </View>
      )
    }
    return null
  }

  doExchange = () => {
    sendClickPingback('pointbuy', '100100', 'buynow')
    this.setState({
      modalVisible: true
    })
  }

  _renderBtnStatus = () => {
    const {goodsInfo} = this.state
    const {num, sendStatus, requiredIntegral} = goodsInfo
    /*
      num:uid在该批次下代金券数量；
      ①num>0，表示用户已领取过该批次，前端显示去使用button；
      ②num=0，表示用户未领取过该批次，需继续判断该批次是否可领取，如果批次可领取，则显示去领取button。
      sendStatus:该批次是否可领取
      ①sendStatus=1，表示该批次还有余券可以领取；
      ②sendStatus=0，表示该批次已被抢光，如果用户未领取过该批次，则前端显示已抢光标签；
      exceedBindLimit:UID在该批次是否到达兑换上限。——目前要求用户只能在免费领券中心或积分兑券中心领取一次，所以根据num字段来判断即可，该字段为预留字段，当允许用户重复领取时，该字段作为依据判断用户是否达到领取上限。
      ①true：已达兑换上限。
      ②false：未达兑换上限
      requiredIntegral:兑换该批次所需的积分值
    */
    const {totalScore} = this.state
    if(!goodsInfo) return
    if(sendStatus === 1) { // 表示该批次还有余券可以领取
      if(num === 0) {
        if(totalScore >= requiredIntegral) {
          return (
            <TouchableOpacity onPress={this.doExchange}>
              <View style={styles.btnBox}>
                <Text style={styles.btnText}>立即兑换</Text>
              </View>
            </TouchableOpacity>
          )
        }
        return (
          <View style={styles.btnGrey}>
            <Text style={styles.btnText}>积分不足</Text>
          </View>
        )
      }
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>已领取</Text>
        </View>
      )
    }
    return (
      <View style={styles.btnGrey}>
        <Text style={styles.btnText}>库存不足</Text>
      </View>
    )
  }

  _renderBottomBtn = () => {
    return (
      <View style={styles.btnWrap}>
        <WebImage name="btn_shadow" style={styles.btnShadow} />
        {this._renderBtnStatus()}
      </View>
    )
  }

  doCancle = () => {
    this.setState({
      modalVisible: false
    })
  }

  confirmExchange = () => { // 兑换逻辑： 1 调用积分消耗接口，如果调用成功调用卡券绑定接口，2 绑定成功则提示用户去查看，绑定失败则调用积分回滚
    const {goodsInfo} = this.state
    this.setState({
      modalVisible: false,
      exchangeLoading: true
    })
    this.orderNum = `${goodsInfo.partner}${Date.now()}` // 前端生成订单号 呵呵
    const params = {
      itemSystem: '6',
      orderNum: this.orderNum,
      score: goodsInfo.requiredIntegral,
      extInfo: 'default'
    }
    this._doConsum(params, this._doBindCoupon) // 先调用积分消耗接口，消耗成功调用卡券绑定接口
  }
  _doConsum = (params, cb) => {
    consumeScore(params).then((data) => {
      const {goodsInfo} = this.state
      const {credits} = data // 积分兑换后的剩余积分数
      this.setState({
        totalScore: credits
      })
      this.props.changeTotalScore(-1 * goodsInfo.requiredIntegral)
      cb.call(this) // 积分消耗成功，调用卡券绑定接口
    }, () => {
      this.setState({
        exchangeLoading: false,
      }, () => {
        showToast('兑换失败，请稍候再试~')
      })
    }).catch(() => {
      this.setState({
        exchangeLoading: false,
      }, () => {
        showToast('兑换失败，请稍候再试~')
      })
    })
  }
  _doBindCoupon = () => {
    const {goodsInfo} = this.state
    const param = {
      partner: goodsInfo.partner,
      batch_no: goodsInfo.batchNo,
      user_id: global.USER_INFO.userId,
      version: '1.0.0'
    }
    param.sign = getSignForSingleCoupon(param, goodsInfo.partner)
    bindCoupon(param).then(() => {
      this.setState({
        exchangeLoading: false,
      }, () => {
        this.setState({
          showSuccessModal: true,
        })
      })
      this._getCouponList()
      setTimeout(() => {
        this.setState({
          showSuccessModal: false,
        })
      }, 3000)
    }, () => {
      this.setState({
        exchangeLoading: false,
      }, () => {
        showToast('兑换失败，请稍候再试~')
      })
      this._revokeScoreConsume()
    })
  }
  // 获取卡券列表
  _getCouponList = () => {
    const {goodsInfo} = this.state
    const params = {
      pageNo: this.pageNo, // 接口分页 (默认值1)
      limit: 1, // 每页条数
      platform: isIOS ? 'ios' : 'android',
      userId: global.USER_INFO.userId,
      enterId: 3, // 用户领券入口编码
    }
    getCouponList(params).then((data) => {
      const {coupons} = data
      const _goodsInfo = coupons.filter(fv => fv.batchNo == goodsInfo.batchNo)[0]
      this.setState({
        goodsInfo: _goodsInfo
      })
    }).catch(() => {
    })
  }
  _revokeScoreConsume = () => {
    const {item} = this.paramsProps
    const params = {
      itemSystem: '6',
      orderNum: this.orderNum,
      success: false,
    }
    consumeCallback(params).then(() => {
      this._getUserInfo()
      this.props.changeTotalScore(item.requiredIntegral)
    }).catch(() => {
      this._getUserInfo()
    })
  }
  _viewList = () => {
    this.setState({
      showSuccessModal: false,
    }, () => {
      this.goTo('MyGain')
      // const url = ORDERLIST[GET_ENV()]
      // if (isIOS) {
      //   this.openWeb(JSON.stringify({
      //     url,
      //     uiMode: 9,
      //   }))
      // } else {
      //   this.openWeb(JSON.stringify({
      //     url,
      //     have_operation_view: false,
      //   }))
      // }
    })
  }

  _rendershowExchangeBox = () => {
    const {modalVisible} = this.state
    return (
      modalVisible &&
      <ConfirmModal
        modalVisible={modalVisible}
        cancelFn={this.doCancle}
      >
        <View style={styles.modalBox}>
          <Text style={styles.topText}>确认兑换</Text>
          <Text style={styles.tipText}>请按照后续的提示使用</Text>
          <View style={styles.modalBtnBox}>
            <TouchableOpacity onPress={this.doCancle} style={styles.cancleBtn}>
              <Text style={styles.cancleText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.confirmExchange} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ConfirmModal>
    )
  }

  _renderExecuteBox = () => {
    const {exchangeLoading} = this.state
    return (
      exchangeLoading &&
      <ConfirmModal
        modalVisible={exchangeLoading}
        cancelFn={this.doCancle}
      >
        <View style={styles.executeLoading}>
          <ActivityIndicator text="正在处理..." />
        </View>
      </ConfirmModal>
    )
  }

  _renderSuccessBox = () => {
    const {showSuccessModal, transparentModal} = this.state
    return (
      showSuccessModal &&
      <ConfirmModal
        modalVisible={showSuccessModal}
        cancelFn={null}
        isTransparent={transparentModal}
      >
        <View style={styles.loadingBox}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._viewList}
          >
            <Text style={{color: '#ffffff', fontSize: 14}}>
              领取成功，请去
              <Text style={{color: '#FF7E00', fontSize: 14}}>兑换记录</Text>
              页查看
            </Text>
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }

  render() {
    const {name} = this.paramsProps
    return (
      <View style={styles.container}>
        <NavBar title={name} backPress={this.back} />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {this._renderTopSection()}
          {this._renderGoodsDetail()}
        </ScrollView>
        {this._renderBottomBtn()}
        {this._rendershowExchangeBox()}
        {this._renderExecuteBox()}
        {this._renderSuccessBox()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topSection: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  centerBox: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  detailPrice: {
    color: '#FF8410',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
  },
  realPrice: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 15,
    textDecorationLine: 'line-through',
    textDecorationColor: '#999999',
  },
  separator: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    width,
  },
  detailWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  detailTitle: {
    color: '#333333',
    fontSize: 15,
    marginTop: 22,
    marginBottom: 11,
  },
  detailInfo: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 20,
  },
  btnWrap: {
    width,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7E00',
    width: width * 0.7,
    height: 40,
    borderRadius: 40
  },
  btnText: {
    color: '#ffffff',
    fontSize: 19,
    textAlign: 'center',
  },
  btnShadow: {
    width,
    height: 35,
    position: 'absolute',
    top: -35
  },
  btnGrey: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    width: width * 0.7,
    height: 40,
    borderRadius: 40,
  },
  modalBox: {
    width: 270,
    height: 142,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: -50
  },
  tipText: {
    marginTop: 20,
    color: '#333333',
    fontSize: 14
  },
  modalBtnBox: {
    width: 270,
    height: 45,
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4'
  },
  cancleBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  confirmBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E4E4E4'
  },
  cancleText: {
    fontSize: 17,
    color: '#333333',
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 17,
    color: '#FF7E00',
    textAlign: 'center'
  },
  executeLoading: {
    width: 180,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingBox: {
    width: 300,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 46,
  }
})
