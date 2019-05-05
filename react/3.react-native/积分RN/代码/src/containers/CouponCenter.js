/**
 * 积分兑券中心
 * Created by @lzj on 18/02/06
 */


import React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import QYNewList from '@iqiyi/rn-new-list'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import {
  showToast,
  hideLoading,
} from '../common/QYNativeBridge'
import NavBar from '../components/DefaultNavBar'
import WebImage from '../components/WebImage'
import CouponItem from '../components/CouponItem'
import ConfirmModal from '../components/ConfirmModal'
import {
  getUserInfo,
  getCouponList,
  exchangeCoupon,
  consumeScore,
  consumeCallback,
} from '../api/'
import {getSignForSingleCoupon} from '../common/util'
import {
  GET_ENV,
  SINGLE_COUPON,
  COMIC_URL,
  MOVIE_URL,
  MALL_URL,
  VIP_GOLD_URL,
} from '../constants/configs'
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import BasePage from '../components/BasePage';

export default class extends BasePage {

  pageName = 'coupon'

  constructor(props) {
    super(props)
    this.state = {
      totalScore: 0,
      total: 0, // 总券数
      pageNo: 0,
      couponList: [], // 卡券列表
      isLoading: true,
      isLoadingMore: false,
      noData: false,
      noMoreData: false,
      confirmModalVisible: false,
      scoreModalVisible: false,
      successModalVisible: false,
      detailModalVisible: false,
      loadingModalVisible: false,
    }
  }

  componentDidMount() {
    sendPagePingback(this.pageName)
    InteractionManager.runAfterInteractions(() => {
      Promise.all([
        this._getUserInfo(),
        this._getData()
      ])
        .catch(err => showToast(err.message))
        .finally(() => {
          hideLoading()
          this.setState({
            isLoading: false
          })
        })
    });
  }

  _getUserInfo = () => {
    getUserInfo()
      .then((data) => {
        const {totalScore} = data[0]
        this.setState({
          totalScore
        })
      })
      .catch()
  }

  // 获取代金券
  _getData = (flag) => {
    const {pageNo, couponList} = this.state
    const params = {
      pageNo: flag ? 1 : (pageNo + 1), // 接口分页 (默认值1)
      limit: flag ? couponList.length : 20, // 每页条数
      platform: isIOS ? 'ios' : 'android',
      userId: global.USER_INFO.userId,
      enterId: 3, // 用户领券入口编码
    }

    getCouponList(params)
      .then((data) => {
        const {total, coupons} = data
        const newCouponList = flag ? coupons : [...couponList, ...coupons]
        const sortedCoupons = this.getSortedCoupon(newCouponList)
        const noData = !newCouponList.length
        const noMoreData = newCouponList.length === total
        this.setState({
          isLoadingMore: false,
          total,
          pageNo: flag ? pageNo : (pageNo + 1),
          couponList: sortedCoupons,
          noData,
          noMoreData,
        })
      })
      .catch(() => {
        const noData = !this.state.couponList.length
        this.setState({
          noData,
          isLoadingMore: false,
        })
      })
  }

  getSortedCoupon(data) {
    data.sort((a, b) => {
      if(a.sendStatus) {
        return -1
      } else if(!a.sendStatus && !b.sendStatus && !a.num && b.num) {
        return 1
      } else if(!a.sendStatus && !b.sendStatus && a.num && !b.num) {
        return -1
      }
      return 0
    })

    return data.map((c, index) => {
      return {
        ...c,
        index
      }
    })
  }

  _onEndReached = () => {
    if(this.state.noMoreData) {
      return;
    }

    this.setState({
      isLoadingMore: true
    })
    this._getData()
  }

  // 兑换代金券
  _handleExchange = ({
                       partner,
                       requiredIntegral,
                     }) => {
    const orderNum = `${partner}${Date.now()}`

    this.orderNum = orderNum

    // 先消耗积分
    this._consumeScores(orderNum, requiredIntegral, this._getCoupon)
  }

  _consumeScores = (orderNum, score, cb) => {
    this.setState({
      loadingModalVisible: true,
    })

    const params = {
      itemSystem: '6',
      orderNum,
      score,
    }

    consumeScore(params)
      .then((data) => {
        const {credits} = data // 积分兑换后的剩余积分数
        this.setState({
          totalScore: credits
        })
        cb.call(this)
      })
      .catch(() => {
        this.setState({
          loadingModalVisible: false,
        })
        showToast('积分消费失败，请稍候再试')
      })
  }

  _getCoupon = () => {
    const {partner, partnerId, batchNo} = this.coupon
    const params = {
      partner: partnerId,
      batchNo,
      uid: global.USER_INFO.userId,
      platform: 'pcw',
      version: '1.0.0',
    }

    params.sign = getSignForSingleCoupon(params, partner)

    params.authCookie = SINGLE_COUPON[GET_ENV()][partner]

    exchangeCoupon(params)
      .then(() => {
        this.setState({
          loadingModalVisible: false,
        })

        sendPagePingback('gottencouponpop')
        setTimeout(() => {
          this.setState({
            successModalVisible: true,
          })
        }, 200)

        // 刷新当前页面信息
        this._getUserInfo()
        this._getData(true)
      })
      .catch(() => {
        this.setState({
          loadingModalVisible: false,
        })

        // 提示兑券失败，并回滚积分
        showToast('抱歉，兑换失败，积分将立即返回您的账户~')
        this._revokeScoreConsume()
      })
  }

  _revokeScoreConsume = () => {
    const params = {
      itemSystem: '6',
      orderNum: this.orderNum,
      success: false,
    }

    consumeCallback(params)
      .then(() => {
        this._getUserInfo()
      })
      .catch(() => {
        this._getUserInfo()
      })
  }

  _goToMyCoupons = () => {
    sendClickPingback('coupon', 400100, 'mycoupon');

    // iOS 通过注册制跳转 我的代金券 页面我的代金券 页面
    if(isIOS) {
      const params = {
        biz_id: 104,
        biz_params: {
          biz_sub_id: 14,
          biz_params: '',
        }
      }

      this.openWeb(JSON.stringify(params))
    } else {
      // 安卓通过 router 跳转
      this.openWeb('iqiyi://router/qy_coupons')
    }
  }

  _useCoupon = () => {
    sendClickPingback('gottencouponpop', 400100, 'usecoupon');

    this.setState({
      detailModalVisible: false,
      successModalVisible: false,
    })

    switch (this.coupon.partner) {
      case 'movie_ticket':
        return this.openWeb(MOVIE_URL)
      case 'iqiyi_mall':
        return this.openWeb(MALL_URL)
      case 'manhua_iqiyi':
        return this.openWeb(COMIC_URL)
      case 'qiyue':
        return this.openWeb(VIP_GOLD_URL)
      default:
        this._goToMyCoupons()
    }
  }

  _handleLeftClick = (coupon) => {
    sendClickPingback('coupon', 400200, `coupon_${coupon.index + 1}`)

    this.coupon = coupon
    this._showDetailModal()
  }

  _handleRightClick = (coupon) => {
    sendClickPingback('coupon', 400200, `getcoupon_${coupon.index + 1}`)

    const {requiredIntegral} = coupon
    if(requiredIntegral > this.state.totalScore) {
      return this.setState({
        scoreModalVisible: true
      })
    }

    this.coupon = coupon
    this._showConfirmModal()
  }

  _showConfirmModal = () => {
    sendPagePingback('getcouponpop')

    this.setState({
      confirmModalVisible: true,
    })
  }

  hideConfirmModal = () => {
    this.setState({
      confirmModalVisible: false
    })
  }

  hideScoreModal = () => {
    sendClickPingback('couponinfopop', 400200, 'read')

    this.setState({
      scoreModalVisible: false,
    })
  }

  hideSuccessModal = () => {
    this.setState({
      successModalVisible: false,
    })
  }

  _showDetailModal = () => {
    sendPagePingback('couponinfopop')

    this.setState({
      detailModalVisible: true
    })
  }

  _hideDetailModal = () => {
    sendClickPingback('couponinfopop', 400200, 'poplatergetcoupon')

    this.setState({
      detailModalVisible: false,
    })
  }

  _confirmAgain = () => {
    sendClickPingback('couponinfopop', 400200, 'popgetcoupon')

    this.setState({
      detailModalVisible: false
    })

    const {requiredIntegral} = this.coupon
    if(requiredIntegral > this.state.totalScore) {
      return setTimeout(() => {
        this.setState({
          scoreModalVisible: true
        })
      }, 200)
    }

    setTimeout(this._showConfirmModal, 200)
  }

  cancelExchange = () => {
    sendClickPingback('getcouponpop', 400200, 'latergetcoupon')
    this.hideConfirmModal()
  }

  // 确认兑券
  confirmExchange = () => {
    sendClickPingback('getcouponpop', 400200, 'nowgetcoupon')
    this.setState({
      confirmModalVisible: false,
      detailModalVisible: false,
    })

    this._handleExchange(this.coupon)
  }

  _renderList = () => {
    const {couponList, noData} = this.state
    if(!noData) {
      return (
        <QYNewList
          style={{flex: 1}}
          separatorColor="#E3E3E3"
          dataList={couponList}
          cellHeight={100}
          renderRow={this._renderRow}
          renderFooter={this._renderListFooter}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={10}
        />
      )
    }
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
        <WebImage name="none" style={{width: 155, height: 112.5}}/>
        <Text style={{color: '#666666', fontSize: 14, marginTop: 50}}>卡券即将上架，敬请期待~</Text>
      </View>
    )
  }

  _renderRow = (data) => {
    return (
      <CouponItem
        coupon={data}
        handleLeftClick={() => this._handleLeftClick(data)}
        handleRightClick={() => this._handleRightClick(data)}
      />
    )
  }

  _renderListFooter = () => {
    const {isLoadingMore, noMoreData} = this.state
    if(isLoadingMore) {
      return (
        <View style={styles.bottom_tips}>
          <Text style={styles.tips_text}>加载中...</Text>
        </View>
      )
    }

    if(noMoreData) {
      return (
        <View style={styles.bottom_tips}>
          <Text style={styles.tips_text}>没有更多了</Text>
        </View>
      )
    }
  }

  _renderModal = () => {
    const {
      confirmModalVisible,
      scoreModalVisible,
      successModalVisible,
      detailModalVisible,
    } = this.state

    if(confirmModalVisible) {
      return (
        <ConfirmModal
          modalVisible={confirmModalVisible}
          cancelFn={null}
        >
          <View style={styles.modal_box}>
            <View style={styles.modal_content}>
              <Text style={styles.tip_header}>确认兑换该卡券吗？</Text>
            </View>
            <View style={styles.modalBtnBox}>
              <TouchableOpacity onPress={this.cancelExchange} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>暂不兑换</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.confirmExchange} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>确认兑换</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ConfirmModal>
      )
    }

    if(scoreModalVisible) {
      return (
        <ConfirmModal
          modalVisible={scoreModalVisible}
          cancelFn={null}
        >
          <View style={styles.modal_box}>
            <View style={styles.modal_content}>
              <Text style={styles.tip_header}>积分不足，快去赚取积分吧~</Text>
            </View>
            <View style={styles.modalBtnBox}>
              <TouchableOpacity onPress={this.hideScoreModal} style={styles.cancelBtn}>
                <Text style={styles.confirmText}>我知道了</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ConfirmModal>
      )
    }

    if(successModalVisible) {
      return (
        <ConfirmModal
          modalVisible={successModalVisible}
          showCloseButton
          cancelFn={this.hideSuccessModal}
        >
          <View style={styles.modal_box}>
            <View style={styles.modal_content}>
              <Text style={styles.tip_header}>兑换成功!</Text>
              <Text style={styles.tip_content}>可在我的钱包-代金券中查看</Text>
            </View>
            <View style={styles.modalBtnBox}>
              <TouchableOpacity onPress={this._goToMyCoupons} style={styles.cancelBtn}>
                <Text style={styles.confirmText}>立即查看</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._useCoupon} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>前往使用</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ConfirmModal>
      )
    }

    if(detailModalVisible) {
      return (
        <ConfirmModal
          modalVisible={detailModalVisible}
          showCloseButton
          cancelFn={this._hideDetailModal}
        >
          <View style={styles.modal_box}>
            <View style={styles.modal_content}>
              <Image source={{uri: `http://pic0.iqiyipic.com/common/20180308/${this.coupon.partner}.jpg`}} style={{width: 75, height: 75}}/>
              <Text style={styles.coupon_title}>{this.coupon.couponName}</Text>
              <Text style={styles.coupon_desc}>{this.coupon.useDesc || '这里是优惠券描述描述描述'}</Text>
            </View>
            <View style={styles.modalBtnBox}>
              {
                (this.coupon.sendStatus > 0) &&
                <React.Fragment>
                  <TouchableOpacity onPress={this._hideDetailModal} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>暂不兑换</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._confirmAgain} style={styles.confirmBtn}>
                    <Text style={styles.confirmText}>确认兑换</Text>
                  </TouchableOpacity>
                </React.Fragment>
              }
              {
                (!this.coupon.sendStatus && this.coupon.num > 0) &&
                <TouchableOpacity onPress={this._useCoupon} style={styles.cancelBtn}>
                  <Text style={styles.confirmText}>前往使用</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </ConfirmModal>
      )
    }
  }

  render() {
    const {
      isLoading,
      totalScore,
      loadingModalVisible,
    } = this.state
    return (
      <View style={styles.container}>
        <NavBar
          title="兑券中心"
          backPress={this.back}
        />
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <WebImage name="numi" style={{width: 30, height: 30}}/>
            <Text style={styles.headerTitle}>积分</Text>
            <Text style={styles.points}>{totalScore}</Text>
          </View>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={this._goToMyCoupons}
          >
            <View style={styles.headerItem}>
              <View style={styles.middleline}/>
              <WebImage name="mine" style={{width: 30, height: 30}}/>
              <Text style={styles.headerTitle}>我的代金券</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          {
            isLoading ?
              <View style={[styles.container, {
                justifyContent: 'center',
                alignItems: 'center'
              }]}
              >
                <ActivityIndicator color="#0BBE06" text="玩儿命加载中..."/>
              </View>
              :
              this._renderList()
          }
        </View>
        {this._renderModal()}
        {
          loadingModalVisible &&
          <ConfirmModal
            modalVisible={loadingModalVisible}
            cancelFn={null}
          >
            <View style={styles.modal_box_2}>
              <View style={styles.modal_content}>
                <ActivityIndicator style={{width: 30, height: 30}}/>
                <Text style={styles.coupon_desc}>兑换中...</Text>
              </View>
            </View>
          </ConfirmModal>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3E3E3',
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 15,
  },
  points: {
    fontSize: 17,
    color: '#FF7E00',
    marginLeft: 12,
  },
  bottom_tips: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips_text: {
    color: '#666666',
    fontSize: 13,
  },
  middleline: {
    height: 20,
    borderColor: '#E3E3E3',
    borderWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    left: 0,
    top: 20
  },
  modal_box: {
    width: 270,
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    alignItems: 'center',
  },
  modal_box_2: {
    width: 150,
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    alignItems: 'center',
  },
  modal_content: {
    paddingVertical: 28,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tip_header: {
    color: '#333333',
    fontSize: 18,
    textAlign: 'center',
  },
  tip_content: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  modalBtnBox: {
    width: 270,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6'
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E6E6E6'
  },
  cancelText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 18,
    color: '#FD7E23',
    textAlign: 'center'
  },
  coupon_title: {
    fontSize: 16,
    color: '#FF8E00',
    textAlign: 'center',
  },
  coupon_desc: {
    fontSize: 13,
    color: '#999999',
    marginTop: 24,
  }
})
