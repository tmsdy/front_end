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
import {
  unixTimeToFormat,
  transferTimeTo,
  getRandomDate
} from '../../common/util'
import {EDIT_ADDRESS, GET_ENV} from '../../constants/configs'
import ConfirmModal from '../ConfirmModal'
import {hideLoading} from '../../common/QYNativeBridge'
import WebImage from '../WebImage'
import Loading from './Loading'
import {
  getOrderList,
  getOrderDetail,
  activateCommodity
} from '../../api/index'
import {
  OrderDetailInfo,
  OrderItem,
  OrderListState,
  OrderListProps
} from '../../typings/apis/myGain'


export default class OrderList extends Component<OrderListProps,OrderListState> {
  readonly state = {
    isRefresh: false,
    orderList: [],
    orderDetailInfo: {},
    showOrderDetailDialog: false,
    pullRefresh: false,
    page: 1,
    size: 20,
    productStatus: this.props.productStatus || 1,
    loadMore: false,
    isEmpty: false,
    loaded: true // loading效果
  } as OrderListState

  loginSubscription: any;
  RequestLoading: any;
  refRefresh: any;

  componentDidMount() {
    console.log('productStatus',this.props.productStatus)
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
  userInfo = global.USER_INFO
  isChangeUsedTab = false // 是否滑动到已使用tab一次
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
  // 订单详情弹框展示
  _renderOrderDetailDialog() {
    const {showOrderDetailDialog, orderDetailInfo = {} as OrderDetailInfo} = this.state
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
              {fieldList.length > 0 &&
                fieldList.map((item) => {
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
  // 隐藏弹框
  hideModal() {
    this.setState({
      showOrderDetailDialog: false
    })
  }
  // 初始化查询订单列表的参数
  initOrderListParams() {
    return {
      orderDetailInfo: {} as OrderDetailInfo, // 订单详情信息
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
  // 获取订单列表请求参数
  getOrderListQuery() {
    const {page, size, productStatus} = this.state
    const verticalCode = 'iQIYI'
    // this.isChangeUsedTab = this.props.productStatus === 2
    const requestHeader = {
      task_code: 'daojuUserOrders',
      timestamp: Date.now()
    }
    const requestBody = {
      daojuUserOrders: {
        vertical_code: verticalCode,
        user_id: this.userInfo.userId,
        size,
        page,
        tag: '兑换记录',
        product_status: productStatus
      }
    }
    return {
      requestHeader,
      requestBody
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
    const query = this.getOrderListQuery()
    getOrderList(query)
      .then((res) => {
        console.log('OrderList',res)
        this.handleOrderRes(res)
      })
      .catch(() => {
        QYRNBridge.showToast('网络繁忙，请稍后再试～')
        this.setState({
          page: this.getPageNum('error'),
          loaded: false
        })
      })
      .finally(() => {
        this.finishRefresh()
        hideLoading()
      })
  }
  // 获取页数
  getPageNum(type = 'success'):number {
    const {page} = this.state
    if(type === 'success') return page + 1
    return page === 1 ? page : page - 1
  }
  // 是否可以加载更多
  getLoadMore({total, size, length}) {
    if(size < this.state.size) return false
    return total > length
  }
  // 没有切换到过已使用tab(切换到已使用tab1次以上)
  setChangeUsedTab() {
    if(!this.isChangeUsedTab) {
      this.isChangeUsedTab = this.props.productStatus === 2
    }
  }
  handleOrderRes(orderRes = {} as {data:any}) {
    this.setChangeUsedTab()
    const {data: {code = '', data = {}} = {}} = orderRes
    const newContents = this.getNewContents(data)
    const newOrderList = this.state.isRefresh
      ? [...newContents]
      : [...this.state.orderList, ...newContents]
    const loadMore = this.getLoadMore({
      total: data.total,
      size: data.size,
      length: newOrderList.length
    })
    // 是否为空页面
    const isEmpty = newOrderList.length === 0
    // baseState
    const baseState = {
      orderList: newOrderList as [OrderItem],
      isEmpty,
      loaded: false,
      isRefresh: false,
      pullRefresh: false,
      loadMore: false
    }
    if(code !== 'A00000') {
      this.setState({
        page: this.getPageNum('error'),
        ...baseState
      })
      return
    }
    if(code === 'A00000') {
      this.setState({
        page: this.getPageNum(),
        ...baseState,
        loadMore
      })
    }
  }
  // 返回新的contents
  getNewContents({
    partnerSwitchInfo = {},
    productSource = {},
    contents = []
  }) {
    return contents.map((item) => {
      const {
        partnerCode,
        photoList,
        expiredTime,
        type,
        subType,
        toUseLink,
        payTime,
        useTime,
        productStatus,
        productId,
        orderCode
      } = item
      // partnerSwitchInfo
      const newPartnerSwitchInfo = this.getNewPartnerSwitchInfo({
        partnerCode,
        partnerSwitchInfo
      })
      // 图片
      const newUrl = this.getPicUrl(photoList)
      // 时间状态标识
      const timeTextObj = this.getNewTimeText(expiredTime)
      // 商品是否过期
      const isCommodityExpired = this.isCommodityExpired(expiredTime)
      // 获取新的productSource
      const newProductSource =
        (productSource && this.getNewProductSource(productId, productSource)) ||
        {}
      // 获取新的toUseLink
      const newToUseLink = this.getNewToUseLink({toUseLink, orderCode})
      // 按钮文字
      const {btnText, btnType} = this.getBtnText({
        type,
        subType,
        newToUseLink,
        productStatus,
        newProductSource
      })
      // 转换下单时间
      const formatPayTime = transferTimeTo('datetime', payTime)
      // 已使用商品使用时间
      const formatUseTime = useTime && unixTimeToFormat(useTime)
      // 转换商品类型
      const formatOrderType = this.formatOrderType({type, subType})
      return {
        ...item,
        newPartnerSwitchInfo,
        newUrl,
        ...timeTextObj,
        isCommodityExpired,
        btnText,
        btnType,
        formatPayTime,
        formatUseTime,
        newProductSource,
        formatOrderType,
        newToUseLink
      }
    })
  }
  // toUseLink 字段带上订单号
  getNewToUseLink({toUseLink = '', orderCode}) {
    if(!toUseLink) return ''
    if(toUseLink.includes('?')) {
      return `${toUseLink}&orderCode=${orderCode}`
    }
    return `${toUseLink}?orderCode=${orderCode}`
  }
  // 转换商品类型
  formatOrderType({type, subType}) {
    const formatOrderTypeMap = {
      0: 1, // 实物商品-常规
      1: 2, // 虚拟商品-会员直冲-激活
      2: 3, // 卡券-常规、商品券-常规
      3: 4 // 其他
    }
    // 未使用状态下的btn文字
    if(type === 3 && subType === 0) {
      // 实物商品-常规
      return formatOrderTypeMap[0]
    }
    if(type === 5 && subType === 10) {
      // 虚拟商品-会员直冲-激活
      return formatOrderTypeMap[1]
    }
    if((type === 4 && subType === 0) || (type === 6 && subType === 0)) {
      // 卡券-常规、商品券-常规
      return formatOrderTypeMap[2]
    }
    // 其他
    return formatOrderTypeMap[3]
  }
  // 获取新的partnerSwitchInfo
  getNewPartnerSwitchInfo({partnerCode, partnerSwitchInfo}) {
    const filterParner = Object.keys(partnerSwitchInfo).find((v) => {
      return v === partnerCode
    })
    return filterParner ? partnerSwitchInfo[filterParner] : {}
  }
  // 先取key=movePic的url，无movePic则取smallPic，再无则展示默认图
  getPicUrl(photoList) {
    const movePic = photoList.find(v => v.photoKey === 'movepic')
    if(movePic) return movePic.url
    const smallPic = photoList.find(v => v.photoKey === 'smallpic')
    if(smallPic) return smallPic.url
    const defaultPic = photoList.find(v => v.photoKey === 'default')
    if(defaultPic) return defaultPic.url
  }
  // 获取时间文案
  getNewTimeText(expiredTime) {
    const time = unixTimeToFormat(expiredTime)
    const timeSpan = new Date().getTime()
    const LIMIT_DAY = 3
    const LIMIT_TIME = getRandomDate(LIMIT_DAY)
    const timeTextMap = {
      0: `有效期至 ${time}`, // 有效日期
      1: '即将过期', // 距有效日期expiredTim<=3
      2: '已过期' // 已超过有效期expiredTim
    }
    if(expiredTime < timeSpan) {
      return {timeStatusText: timeTextMap[2], validTime: timeTextMap[0]}
    }
    if(expiredTime <= LIMIT_TIME) {
      return {timeStatusText: timeTextMap[1], validTime: timeTextMap[0]}
    }
    return {timeStatusText: '', validTime: timeTextMap[0]}
  }
  // 商品是否过期
  isCommodityExpired(expiredTime) {
    const timeSpan = new Date().getTime()
    return expiredTime < timeSpan
  }
  // 获取按钮显示的文字
  getBtnText({type, subType, newToUseLink, productStatus, newProductSource}):{btnText:string,btnType:number} {
    const btnTextMap = {
      0: {
        btnText: '使用',
        btnType: 0
      },
      1: {
        btnText: '填写地址',
        btnType: 1
      },
      2: {
        btnText: '激活',
        btnType: 2
      },
      3: {
        btnText: '复制',
        btnType: 3
      },
      4: {
        btnText: '查看',
        btnType: 4
      },
      100: {
        btnText: '',
        btnType: -1
      },
    }
    if(productStatus === 2) {
      // 已使用状态下的btn文字
      if(type === 3 && subType === 0) {
        // 实物商品-常规
        return btnTextMap[100]
      }
      return newProductSource.url ? btnTextMap[4] : btnTextMap[100]
    }
    // 未使用状态下的btn文字
    if(type === 3 && subType === 0) {
      // 实物商品-常规
      return btnTextMap[1]
    }
    if(type === 5 && subType === 10) {
      // 虚拟商品-会员直冲-激活
      return btnTextMap[2]
    }
    if((type === 4 && subType === 0) || (type === 6 && subType === 0)) {
      // 卡券-常规、商品券-常规
      return newToUseLink ? btnTextMap[0] : btnTextMap[3]
    }
    // 其他
    return newToUseLink ? btnTextMap[0] : btnTextMap[100]
  }
  // 获取新的productSource
  getNewProductSource(productId, productSource) {
    const filterProductSource = Object.keys(productSource).find((v) => {
      return +v === productId
    })
    return filterProductSource
      ? {productId, url: productSource[filterProductSource]}
      : {}
  }
  // 渠道名称页面跳转
  switchAddress(url, isCommodityExpired) {
    // if(isCommodityExpired) return
    this.props.openWeb(url)
  }
  // 获取订单详情页接口参数
  getOrderDetailQuery(orderCode) {
    const requestHeader = {
      task_code: 'daojuOrderStatusQuery',
      timestamp: Date.now()
    }
    const requestBody = {
      daojuOrderStatusQuery: {
        order_code: orderCode
      }
    }
    return {
      requestHeader,
      requestBody
    }
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
  async getOrderDetail(item) {
    try {
      const {orderCode, isCommodityExpired, productId} = item
      // if(isCommodityExpired) return // 过期商品不可点击
      this.showRequestLoading()
      const query = this.getOrderDetailQuery(orderCode)
      const detailRes = await getOrderDetail(query)
      // 返回当前详情信息
      const orderDetailInfo = this.handelDetailRes(detailRes, productId)
      console.log('orderDetailInfo',orderDetailInfo)
      const {addressInfo} = orderDetailInfo
      // 获取新的地址信息
      const newAddressInfo = addressInfo && this.getNewAddressInfo(addressInfo)
      // 新的订单详情字段
      const newOrderDetailInfo = {
        ...item,
        rules: orderDetailInfo.rules,
        redeemCodes: orderDetailInfo.redeemCodes,
        newAddressInfo
      }
      // 获取展示弹框内容,弹框中的字段统一从该方法中获取
      const newDialogContent = this.getDialogContentField(newOrderDetailInfo)
      // console.log(newOrderDetailInfo,newDialogContent)
      this.setState({
        showOrderDetailDialog: true,
        orderDetailInfo: {
          ...newOrderDetailInfo,
          newDialogContent
        }
      })
    } catch(error) {
      QYRNBridge.showToast('网络繁忙，请稍后再试～')
    } finally {
      this.hideRequestLoading()
    }
  }
  // 返回新的地址信息
  getNewAddressInfo(addressInfo): string {
    const {name = '', phone = '', address = ''} = addressInfo
    return `${name} ${phone} ${address}`
  }
  // 返回当前订单弹框渲染需要用到的字段
  getDialogContentField(newOrderDetailInfo) {
    const {
      productStatus,
      formatOrderType,
      toUseLink,
      newProductSource,
      redeemCodes,
      orderCode,
      newAddressInfo = '',
      formatPayTime
    } = newOrderDetailInfo
    const dialogBtnText = this.getDialogBtnText({
      formatOrderType,
      toUseLink,
      newProductSource,
      productStatus
    })
    const fieldList = this.getDialogFieldList({
      formatOrderType,
      productStatus,
      redeemCodes,
      orderCode,
      newAddressInfo,
      formatPayTime
    })
    return {
      fieldList,
      dialogBtnText
    }
  }
  // 获取弹窗fieldList(未使用|已使用)
  getDialogFieldList({
    formatOrderType,
    productStatus,
    redeemCodes,
    newAddressInfo,
    orderCode,
    formatPayTime
  }) {
    // formatOrderType
    // 1:实物商品-常规
    // 2:虚拟商品-会员直冲-激活
    // 3:卡券-常规、商品券-常规
    // 4: // 其他
    switch (formatOrderType) {
      case 1:
        return productStatus === 1
          ? this.reduceField({formatPayTime, orderCode})
          : this.reduceField({newAddressInfo, formatPayTime, orderCode})
      case 2:
        return this.reduceField({formatPayTime, orderCode})
      case 3:
        return this.reduceField({redeemCodes, formatPayTime, orderCode})
      case 4:
        return this.reduceField({formatPayTime, orderCode})
      default:
        break
    }
  }
  reduceField(args) {
    const fieldMap = {
      redeemCodes: '商品券码：',
      formatPayTime: '下单时间：',
      orderCode: '订单编号：',
      newAddressInfo: '收货信息：'
    }
    return Object.keys(args).reduce((pre, cur, currentIndex) => {
      pre.push({key: fieldMap[cur], value: args[cur], id: currentIndex})
      return pre
    }, [])
  }
  // 弹框详情btn文案 (已使用|未使用)
  getDialogBtnText({
    formatOrderType,
    toUseLink,
    newProductSource,
    productStatus
  }) {
    // formatOrderType
    // 1:实物商品-常规
    // 2:虚拟商品-会员直冲-激活
    // 3:卡券-常规、商品券-常规
    // 4: // 其他
    const btnText = {
      0: '',
      1: '已激活',
      2: '复制劵码并使用',
      3: '复制',
      4: '查看',
      5: '使用',
      6: '填写收货地址',
      7: '激活'
    }
    switch (formatOrderType) {
      case 1:
        return productStatus === 1 ? btnText[6] : btnText[0]
      case 2:
        return productStatus === 1 ? btnText[7] : btnText[1]
      case 3:
        return toUseLink ? btnText[2] : btnText[3]
      case 4:
        if(productStatus === 1) return toUseLink ? btnText[5] : btnText[0]
        return newProductSource.url ? btnText[4] : btnText[0]
      default:
        break
    }
  }
  handelDetailRes(res = {} as {data:any}, productId) {
    const {data: {code = '', data = []} = {}} = res
    if(code === 'A00000') {
      return this.filterOrderDetailList(data, productId) || {}
    }
  }
  filterOrderDetailList(data, productId) {
    return data.find((item) => {
      return item.productId === productId
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
      .then((res = {} as {data:any,message:string}) => {
        const {
          data: {code, msg} = {} as {code:string,msg: string},
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
          ref: (refresh) => {
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
  // 上拉刷新
  onRefresh(type = 'isRefresh', productStatus = 1) {
    const initOrderListParams = this.initOrderListParams()
    // 下拉刷新直接取state中的productStatus
    const newProductStatus =
      type !== 'isRefresh' ? productStatus : this.state.productStatus
    this.setState(
      {
        ...initOrderListParams,
        isRefresh: true, // 下拉刷新
        loaded: type !== 'isRefresh',
        productStatus: newProductStatus
      },
      () => {
        this.getOrderList()
      }
    )
  }
  // 隐藏上拉刷新loading
  finishRefresh() {
    this.refRefresh && this.refRefresh.finishRefresh()
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
  // 切换tab时的loading
  _renderSliderLoading = () => {
    return (
      <View style={styles.sliderLoad}>
        <ActivityIndicator text="内容即将呈现..." />
      </View>
    )
  }
  _renderRow = (item = {} as OrderItem, index, rowID) => {
    const {
      btnText,
      timeStatusText,
      validTime,
      name,
      newPartnerSwitchInfo: {switchAddress, nickname} = {} as {switchAddress:string,nickname:string},
      productStatus,
      formatUseTime,
      isCommodityExpired
    } = item
    console.log(item)
    return (
      <View
        style={[
          styles.item,
          nickname ? styles.hasNickName : {}
          // isCommodityExpired ? styles.commodityExpiredOpacity : {}
        ]}
        key={rowID}
      >
        {nickname ? (
          <View style={styles.firstWrap}>
            <QYNewList.Button
              onPress={() =>
                this.switchAddress(switchAddress, isCommodityExpired)
              }
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
