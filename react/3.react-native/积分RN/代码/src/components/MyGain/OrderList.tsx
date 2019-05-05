/**
 * 我的收获页面列表组件
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  DeviceEventEmitter
} from 'react-native'
import {Text, ActivityIndicator} from '@iqiyi/rn-ui'
import {QYRNBridge} from '@iqiyi/rn-base-modules'
import QYNewList from '@iqiyi/rn-new-list'
import {EDIT_ADDRESS, GET_ENV} from '../../constants/configs'
import ConfirmModal from '../ConfirmModal'
import {hideLoading} from '../../common/QYNativeBridge'
import WebImage from '../WebImage'
import Loading from './Loading'
import {
  activateCommodity
} from '../../api/index'
import {
  OrderDetailInfo,
  OrderItem,
  OrderListState,
  OrderListProps
} from '../../typings/apis/myGain'
import {fetchUserOrders, fetchOrderDetail} from '../../model/myGain'

export default class OrderList extends Component<OrderListProps, OrderListState> {

  loginSubscription: any;
  RequestLoading: any;
  refRefresh: any;
  userInfo = global.USER_INFO
  isChangeUsedTab = false // 是否滑动到已使用tab一次

  readonly state: OrderListState = {
    isRefresh: false,
    orderList: [] as unknown as [OrderItem],
    orderDetailInfo: {} as unknown as OrderDetailInfo,
    showOrderDetailDialog: false,
    pullRefresh: false,
    page: 1,
    size: 20,
    productStatus: this.props.productStatus || 1,
    loadMore: false,
    isEmpty: false,
    loaded: true // loading效果
  }

  componentDidMount() {
    this.listenLogin()
    this.fetchData()
  }

  componentWillUnmount() {
    this.loginSubscription && this.loginSubscription.remove()
  }

  render() {
    const {isEmpty, loaded} = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this._renderContent()}
        {isEmpty ? this.renderEmpty() : null}
        {loaded ? this._renderSliderLoading() : null}
        {this._renderOrderDetailDialog()}
        <Loading
          ref={(r) => {
            this.RequestLoading = r
          }}
          hide={true}
        />
      </View>
    )
  }

  // 登录监听
  listenLogin = () => {
    this.loginSubscription = DeviceEventEmitter.addListener(
      'loginChange',
      this.onLoginChanged
    )
  }

  onLoginChanged = (isLogin) => {
    if(isLogin) {
      this.userInfo = {...this.userInfo, ...global.USER_INFO}
      this.setState(
        {
          loaded: true,
          isEmpty: false
        },
        () => {
          this.getOrderList()
        }
      )
    }
  }

  _renderRow = (item: OrderItem, index, rowID) => {
    const {
      btnText,
      timeStatusText,
      validTime,
      name,
      newPartnerSwitchInfo: {switchAddress, nickname} = {} as unknown as {switchAddress: string; nickname: string},
      productStatus,
      formatUseTime,
      isCommodityExpired
    } = item
    return (
      <View
        style={[
          styles.item,
          nickname ? styles.hasNickName : {}
        ]}
        key={rowID}
      >
        {nickname ? (
          <View style={styles.firstWrap}>
            <QYNewList.Button
              onPress={() => this.switchAddress(switchAddress)}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.beaconText}>{`${nickname}`}</Text>
                <Text style={styles.beaconText}>{'>'}</Text>
                {/* <WebImage
                  name="mygain_arrow-icon"
                  style={styles.nameArrowImage}
                /> */}
              </View>
            </QYNewList.Button>
          </View>
        ) : null}
        <View style={styles.secondWrap}>
          <QYNewList.Button style={{width: item.btnText ? 265 : '100%'}} onPress={() => this.getOrderDetail(item)}>
            <View style={styles.left}>
              <WebImage name={item.newUrl} style={styles.orderImage} />
              <View style={styles.middleTextWrap}>
                <View style={styles.timeStatus}>
                  {item.timeStatusText === '即将过期' ? (
                    <View style={styles.timeTextWrap}>
                      <Text style={styles.timeText}>{timeStatusText}</Text>
                    </View>
                  ) : null}
                  {item.timeStatusText === '已过期' ? (
                    <View style={styles.timeExpriedTextWrap}>
                      <Text style={styles.timeExpriedText}>
                        {timeStatusText}
                      </Text>
                    </View>
                  ) : null}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.middleTopText,
                      isCommodityExpired ? styles.commodityExpiredColor : ''
                    ]}
                  >
                    {name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.middleBottomText,
                    isCommodityExpired ? styles.commodityExpiredColor : ''
                  ]}
                >
                  {productStatus === 1
                    ? validTime
                    : `使用时间 ${formatUseTime}`}
                </Text>
              </View>
            </View>
          </QYNewList.Button>
          {item.btnText ? (
            <QYNewList.Button
              style={styles.rightBtn}
              onPress={() => this.handleBtn(item)}
            >
              <WebImage
                name={`${
                  isCommodityExpired ? 'mygain_expried-btn' : 'mygain-btn'
                }`}
                style={styles.btn}
              />

              <View style={styles.btnTextWrap}>
                <Text style={styles.btnText}>{btnText}</Text>
              </View>
            </QYNewList.Button>
          ) : null}
        </View>
        <View />
      </View>
    )
  }

  // 切换tab时的loading
  _renderSliderLoading = () => {
    return (
      <View style={styles.sliderLoad}>
        <ActivityIndicator text="内容即将呈现..." />
      </View>
    )
  }

    // 上拉loading
  _renderFooter = () => {
    const {pullRefresh} = this.state
    // if(!loadMore) {
    //   return (
    //     <View style={styles.footer}>
    //       <Text>无更多商品~</Text>
    //     </View>
    //   )
    // }
    if(!pullRefresh) return <View style={styles.footer} />
    return (
      <View style={styles.footer}>
        <ActivityIndicator text="正在加载..." />
      </View>
    )
  }

  // 列表为空
  renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <WebImage style={styles.emptyImage} name="none" />
        <Text style={styles.emptyText}>还没有商品噢，去兑换~</Text>
        <TouchableOpacity
          style={styles.emptyBtnWrap}
          onPress={() => this.props.goTo('ShoppingMall')}
        >
          <Text style={styles.emptyBtnText}>去看看</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // 触发上拉加载
  _onEndReached = () => {
    const {pullRefresh, loadMore} = this.state
    if(pullRefresh || !loadMore) return
    this.setState(
      {
        pullRefresh: true
      },
      () => {
        this.getOrderList()
      }
    )
  }

  // 列表组件
  _renderContent = () => {
    const {orderList} = this.state
    return (
      <QYNewList
        style={{flex: 1}}
        dataList={orderList}
        renderRow={this._renderRow}
        // cellHeight={100}
        cellHeightPossible={100}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={10}
        renderFooter={this._renderFooter}
        refreshProps={{
          ref: (refresh: boolean) => {
            this.refRefresh = refresh
          },
          onRefresh: () => this.onRefresh(),
          enabledPullDown: true,
          enabledPullUp: false,
          orientation: 0,
          refreshTexts: ['下拉刷新', '释放更新', '正在加载中...', '刷新完成!']
        }}
      />
    )
  }

  // 渠道名称页面跳转
  switchAddress(url: string) {
    this.props.openWeb(url)
  }

  // 展示请求loading
  showRequestLoading() {
    this.RequestLoading && this.RequestLoading.show()
  }

  // 隐藏请求loading
  hideRequestLoading() {
    this.RequestLoading && this.RequestLoading.close()
  }

  // 订单详情查询
  getOrderDetail(item: OrderItem) {
    this.showRequestLoading()
    fetchOrderDetail(item)
      .then((res) => {
        this.setState(res)
      })
      .catch(() => {
        QYRNBridge.showToast('网络繁忙，请稍后再试～')
      })
      .finally(() => {
        this.hideRequestLoading()
      })
  }

  // 填写地址url
  getAddressUrl({productId, orderCode}) {
    return `${
      EDIT_ADDRESS[GET_ENV()]
    }?productId=${productId}&orderId=${orderCode}`
  }

  // button事件
  handleBtn({
    btnType,
    newToUseLink,
    redeemCodes,
    productId,
    orderCode,
    newProductSource,
    type,
    subType,
    isCommodityExpired
  }) {
    const addressUrl = this.getAddressUrl({productId, orderCode})
    if(isCommodityExpired) return
    switch (btnType) {
      case 0: // 使用
        this.copyRedeemCodes(redeemCodes)
        this.hideModal()
        this.props.openWeb(newToUseLink)
        break
      case 1: // 填写地址  点击跳转线上填写地址页面
        this.hideModal()
        this.props.openWeb(addressUrl)
        break
      case 2: // 激活
        this.commodityActive({productId, orderCode})
        break
      case 3: // 复制
        this.copyRedeemCodes(redeemCodes)
        QYRNBridge.showToast('券码已复制成功')
        break
      case 4: // 查看
        if(type === 3 && subType === 0) {
          // 点击跳转线上填写地址页面
          this.props.openWeb(addressUrl)
          return
        }
        this.props.openWeb(newProductSource.url)
        break
      default:
        break
    }
  }

  // 复制券码
  copyRedeemCodes(redeemCodes) {
    Clipboard.setString(redeemCodes)
  }

  // 激活商品
  commodityActive({productId, orderCode}) {
    this.showRequestLoading()
    const query = this.getCommodityActiveQuery({productId, orderCode})
    activateCommodity(query)
      .then((res = {} as unknown as {data: any; message: string}) => {
        const {
          data: {code, msg} = {} as unknown as {code: string; msg: string},
          message = '网络繁忙，请稍后再试～'
        } = res
        //  商品激活（taskcode=daojuPurchaseActivate）返回成功刷新当前页面，tab状态切换至已使用，失败则toast提示见最后
        if(code === 'A00000') {
          this.hideModal()
          // 激活成功当前产品移除掉
          const filterOrderList = this.removeCurActivateCommodity({
            productId,
            orderCode
          })
          this.setState({
            orderList: filterOrderList as [OrderItem]
          })
          QYRNBridge.showToast('已激活')
          return
        }
        QYRNBridge.showToast(msg || message)
      })
      .catch(() => {
        QYRNBridge.showToast('网络繁忙，请稍后再试～')
      })
      .finally(() => {
        this.hideRequestLoading()
      })
  }

  // 删除已激活的商品
  removeCurActivateCommodity({productId, orderCode}) {
    const {orderList} = this.state
    return orderList.filter((item) => {
      return !(item.productId === productId && item.orderCode === orderCode)
    })
  }

  // 商品激活接口参数
  getCommodityActiveQuery({productId, orderCode}) {
    const requestHeader = {
      task_code: 'daojuPurchaseActivate',
      timestamp: Date.now()
    }
    const requestBody = {
      daojuPurchaseActivate: {
        order_code: orderCode,
        user_id: this.userInfo.userId,
        product_id: productId
      }
    }
    return {
      requestHeader,
      requestBody
    }
  }

  // 上拉刷新
  onRefresh(type = 'isRefresh', productStatus = 1) {
    const initOrderListParams = this.initOrderListParams()
    // 下拉刷新直接取state中的productStatus
    this.setState((prevState) => {
      const newProductStatus = type !== 'isRefresh' ? productStatus : prevState.productStatus
      return {
        ...initOrderListParams,
        isRefresh: true, // 下拉刷新
        loaded: type !== 'isRefresh',
        productStatus: newProductStatus
      }
    },
      () => {
        this.getOrderList()
      })
  }

  // 隐藏上拉刷新loading
  finishRefresh() {
    this.refRefresh && this.refRefresh.finishRefresh()
  }

  // 商品是否过期
  isCommodityExpired(expiredTime) {
    const timeSpan = new Date().getTime()
    return expiredTime < timeSpan
  }

  // 获取新的partnerSwitchInfo
  getNewPartnerSwitchInfo({partnerCode, partnerSwitchInfo}) {
    const filterParner = Object.keys(partnerSwitchInfo).find((v) => {
      return v === partnerCode
    })
    return filterParner ? partnerSwitchInfo[filterParner] : {}
  }

  // 没有切换到过已使用tab(切换到已使用tab1次以上)
  setChangeUsedTab() {
    if(!this.isChangeUsedTab) {
      this.isChangeUsedTab = this.props.productStatus === 2
    }
  }

  async fetchData() {
    try {
      if(!this.userInfo.isLogin) {
        // 没登录先去登录, 设置loaded和isEmpty字段 否则安卓从登陆页点击返回按钮一直显示loading状态
        this.setState({
          loaded: false,
          isEmpty: true
        })
        this.userInfo = await QYRNBridge.login()
      } else {
        this.getOrderList()
      }
    } catch(error) {
      QYRNBridge.showToast('网络繁忙，请稍后再试～')
    } finally {
      hideLoading()
    }
  }

  // 获取订单列表数据
  getOrderList() {
    const {page} = this.state
    fetchUserOrders(this.state)
      .then((res) => {
        console.log('fetchUserOrders', res)
        this.setState(res)
      })
      .catch(() => {
        QYRNBridge.showToast('网络繁忙，请稍后再试～')
        this.setState({
          page: page === 1 ? page : page - 1,
          loaded: false
        })
      })
      .finally(() => {
        this.finishRefresh()
        hideLoading()
      })
  }

  // 初始化查询订单列表的参数
  initOrderListParams() {
    return {
      orderDetailInfo: {} as unknown as OrderDetailInfo, // 订单详情信息
      showOrderDetailDialog: false, // 是否展示弹框
      pullRefresh: false, // 是否下拉加载
      page: 1,
      size: 20,
      productStatus: 1,
      loadMore: false, // 是否还能加载更多
      isEmpty: false, // 列表是否为空
      loaded: true // loading效果
    }
  }

  // 隐藏弹框
  hideModal() {
    this.setState({
      showOrderDetailDialog: false
    })
  }

  // 订单详情弹框展示
  _renderOrderDetailDialog() {
    const {showOrderDetailDialog, orderDetailInfo = {} as unknown as OrderDetailInfo} = this.state
    const {
      newUrl,
      name,
      rules,
      isCommodityExpired,
      newDialogContent: {dialogBtnText = '', fieldList = []} = {}
    } = orderDetailInfo
    return (
      <ConfirmModal modalVisible={showOrderDetailDialog}>
        <View style={styles.dialogContainer}>
          <View style={styles.dialogTop}>
            {newUrl ? (
              <WebImage style={styles.dialogImage} name={newUrl} />
            ) : null}
            {name ? <Text style={styles.dialogTitle}>{name}</Text> : null}
          </View>
          <View style={styles.dialogContent}>
            <View>
              {fieldList.length > 0
                && fieldList.map((item) => {
                    return item.value ? (
                      <View style={styles.dialogCommodityArch} key={item.id}>
                        <Text
                          numberOfLines={1}
                          style={styles.dialogCommodityArchLeftText}
                        >
                          {item.key}
                        </Text>
                        <Text style={styles.dialogCommodityArchRightText}>
                          {item.value}
                        </Text>
                      </View>
                    ) : null
                  })}
              {rules ? (
                <View style={styles.dialogCommodityArch}>
                  <Text
                    numberOfLines={1}
                    style={styles.dialogCommodityArchLeftText}
                  >
                    兑换规则：
                  </Text>
                  <ScrollView style={{maxHeight: 92}}>
                    <Text style={styles.dialogCommodityArchRightText}>
                      {rules}
                    </Text>
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </View>
          {dialogBtnText && !isCommodityExpired ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.handleBtn(orderDetailInfo)}
            >
              <View
                style={[
                  styles.dialogButton,
                  dialogBtnText === '已激活'
                    ? styles.dialogUsedActivityButton
                    : {}
                ]}
              >
                <Text style={styles.dialogBtnText}>{dialogBtnText}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.dialogCloseIcon}
            onPress={() => this.hideModal()}
          >
            <WebImage
              style={styles.dialogCloseImage}
              name="mygain_dialog-close-btn"
            />
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }
}

const styles = StyleSheet.create({
  // 列表item
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  hasNickName: {
    // height: 100
  },
  // commodityExpiredOpacity: {
  //   opacity: 0.4
  // },
  commodityExpiredColor: {
    color: '#999'
  },
  firstWrap: {
    paddingBottom: 7
    // justifyContent: 'center'
  },
  nameArrowImage: {
    width: 6,
    height: 6
  },
  beaconText: {
    fontSize: 13,
    color: '#999',
    marginRight: 5,
    lineHeight: 15
  },
  secondWrap: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  left: {
    flexDirection: 'row',
    height: 60
  },
  orderImage: {
    width: 60,
    height: 60
  },
  middleTextWrap: {
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 10
  },
  timeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  timeTextWrap: {
    width: 48,
    height: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FF3B30',
    borderRadius: 5 / 2,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeExpriedTextWrap: {
    width: 38,
    height: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
    borderRadius: 5 / 2,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeText: {
    fontSize: 10,
    color: '#FF3B30'
  },
  timeExpriedText: {
    fontSize: 10,
    color: '#999'
  },
  middleTopText: {
    fontSize: 16,
    color: '#333333',
    width: 125
  },
  middleBottomText: {
    fontSize: 12,
    color: '#666666'
  },
  rightBtn: {
    position: 'relative'
  },
  btn: {
    width: 80,
    height: 30
  },
  btnTextWrap: {
    position: 'absolute',
    width: 80,
    height: 30,
    borderRadius: 24,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 14,
    color: '#FFFFFF'
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  emptyImage: {
    width: 155,
    height: 112.5
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    marginTop: 45
  },
  emptyBtnWrap: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#FF7E00',
    width: 90,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  emptyBtnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FF7E00'
  },
  sliderLoad: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // 弹框样式
  dialogContainer: {
    width: 300,
    // maxHeight: 420,
    minHeight: 135,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  dialogTop: {
    flexDirection: 'column',
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialogImage: {
    width: 75,
    height: 75,
    marginBottom: 7
  },
  dialogTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333333'
  },
  dialogContent: {
    flexDirection: 'column'
  },
  dialogCommodityArch: {
    flexDirection: 'row',
    marginBottom: 4
  },
  dialogCommodityArchLeftText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666'
  },
  dialogCommodityArchRightText: {
    width: 180,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666'
  },
  dialogButton: {
    width: 250,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#FF7E00'
  },
  dialogUsedActivityButton: {
    backgroundColor: '#CCC'
  },
  dialogBtnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FFFFFF'
  },
  dialogCloseIcon: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  dialogCloseImage: {
    width: 44,
    height: 44,
    borderTopRightRadius: 12
  },
  footer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
