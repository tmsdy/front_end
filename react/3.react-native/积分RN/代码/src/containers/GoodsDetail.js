/**
 * 商品详情
 * @lzj
 * 关于领取按钮说明  来自@龚腾
 * 只有 0人民币和0积分的情况下 才会出现 领取 按钮
 * ！！！！积分所有产品不会出现 0 积分和 0人民币的情况，所以不用考虑领取逻辑
 * TODO 删除领取逻辑
 */

// TODO 重构代码
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  DeviceEventEmitter,
  NativeModules,
  Clipboard,
  StatusBar
} from 'react-native';
import {View, Text, Image, ActivityIndicator, Touchable} from '@iqiyi/rn-ui';
import {isIOS} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QYSwiper from '@iqiyi/rn-swiper';
import Swiper from '@iqiyi/rn-swiper-new'
import WebImage from '../components/WebImage';
import CouponImage from '../components/shoppingMall/CouponImage';
import NavBar from '../components/DefaultNavBar';
import {getUserInfo, executeTask} from '../api';
import {filterPic, goToLogin, unixTimeToFormat, createUrl, iosOpenRnPage, shareSNS, getObjectValueSafely} from '../common/util';
import ConfirmModal from '../components/ConfirmModal'
import {sendPagePingback, sendClickPingback, sendBlockPingback} from '../common/pingback'
import {showToast, hideLoading} from '../common/QYNativeBridge'
import {
  GET_ENV,
  EDIT_ADDRESS,
  GAME_LIVE_URL,
  QIXIU,
  GAME_VIP_URL,
  KAQUAN_URL,
  PRODUCTDETAIL
} from '../constants/configs'
import px2dp from '../common/px2dp';
import {changeTotalScore} from '../actions/TotalScoreActions';
import {TOUCH_COLORFUL_MASK, TOUCH_TEXT_ACTIVE} from '../constants/touchableStyle';
import Recommend from '../components/goodsDetail/Recommend'
import {fetchSecKillRecord, fetchCheckSecKillRecord, fetchAtmosphereInfo} from '../model/goodDetail'
// import mockJson from '../../mocks/daojuProductDetail'
import WithSafeView from '../components/WithSafeView'
import BasePage from '../components/BasePage';
import CountDown from '../components/goodsDetail/CountDown'
import ConvertLoading from '../components/goodsDetail/ConvertLoading';
import ConvertResultModal from '../components/goodsDetail/ConvertResultModal';
import {
  GOODS_DETAIL_RPAGE,
  GOODS_DETAIL_MY_GAIN_RSEAT,
  GOODS_DETAIL_SHARE_RSEAT,
  GOODS_DETAIL_MORE_RSEAT,
  GOODS_DETAIL_CONVERT_RSEAT,
  GOODS_DETAIL_SECKILL_BTN_RSEAT,
  GOODS_DETAIL_SECKILL_ORDER_RSEAT,
  GOODS_DETAIL_CONVERT_FAIL_CANCLE_RSEAT,
  GOODS_DETAIL_CONVERT_FAIL_TRY_RSEAT,
  GOODS_DETAIL_RECOMMEND_RSEAT,
  GOODS_DETAIL_CONVERT_SUCCESS_RSEAT,
  GOODS_DETAIL_SECKILL_PIC_RSEAT,
  GOODS_DETAIL_MAKE_INTEGRAL_BLOCK,
  GOODS_DETAIL_CONVERT_BLOCK,
  GOODS_DETAIL_SECKILL_BTN_BLOCK,
  GOODS_DETAIL_SECKILL_INTEGRAL_BLOCK,
  GOODS_DETAIL_CONVERT_FAIL_BLOCK,
  GOODS_DETAIL_CONVERT_LOADING_BLOCK,
  GOODS_DETAIL_CONVERT_LOADING_SUCCESS_BLOCK,
  GOODS_DETAIL_CONVERT_SUCCESS_BLOCK
} from '../components/goodsDetail/pingbackConfig';

const {width} = Dimensions.get('window');

const {QYRNBridgeModule} = NativeModules

const TEXT_BUTTON_COLOR = ['#FFA400', '#FF7E00']

const getErrorMessage = (code = null) => {
  const msgMap = {
    P00003: '库存不足，再去看看别的吧',
    G00011: '代金券超过限额，再去看看别的吧',
    G00013: '积分不足，快去做任务吧',
    G00021: '扣积分失败，请稍后重试',
    G00043: '兑换失败，您还不是会员哦~',
    G00044: '您已在其他渠道买过会员了哦~',
    G00025: '获取卡券券码失败',
    fail: '兑换失败，请稍后重试',
    error: '系统繁忙，请稍候重试',
  }
  if(code && msgMap.hasOwnProperty(code)) {
    return msgMap[code]
  }
  return msgMap.fail
}
// 轮播图高度
const IMG_HEIGHT = 150
// 兑换使用规则文案高度 超过3行显示下拉箭头
const RULE_HEIGHT = 70
@connect(({scoreInfo}) => {
  return {
    totalScore: scoreInfo.totalScore || 0,
  }
}, dispatch => bindActionCreators({changeTotalScore}, dispatch), null, {withRef: true})
export default class extends BasePage {

  pageName = 'pointbuy'

  constructor(props) {
    super(props)
    this.state = {
      goodsInfo: null, // 商品信息
      isLoading: true,
      modalVisible: false, // 确认兑换弹窗是否展示
      exchangeLoading: false, // 订单处理loading
      requestFailToastText: '兑换失败，请重试',
      totalScore: 0,
      level: 1, // 默认乐园等级
      showSuccessModal: false,
      transparentModal: true,
      isLogin: !!global.USER_INFO.userId,
      exchangeResult: '',
      hasActive: false,
      ruleNumberOfLines: 99, // 兑换使用默认行高
      showRuleArrow: false, // 是否显示兑换使用的下拉箭头
      atmosphereInfo: null, // 氛围信息
      hasSecKill: false, // 是否有秒杀资格
      secKillLeftTime: null, // 后端返回的毫秒时间戳秒杀时间
      convertLoadingVisible: false, // 新的兑换弹框loading modal
      convertLoadingText: '正在为您兑换...', // 兑换中以及兑换成功之后loading文案
      convertSuscessText: '', // 兑换成功显示的文案
      convertResultVisible: false, // 兑换结果弹框状态
      convertResultRetry: false, // 兑换结果失败是否点击了再试一次,点击再试一次如果失败的话toast提示
      convertResultContent: '兑换成功啦!', // 兑换失败时显示 商品刚刚出了点小问题
      convertResultConfirmText: '', // 兑换成功时根据商品类型显示文案 兑换失败时 文案：再试一次
      showConvertResultCancleBtn: false, // 是否显示取消按钮 只有兑换失败时显示
      convertConfrimBtnFn: () => null, // 兑换确认事件
      showCloseBtn: true, // 是否显示关闭按钮 只有兑换成功时才显示
      closeBtnFn: () => this._convertFailCancle()
    }
    this.paramsProps = this.props.navigation.state.params || {}
    this.showSuccessBoxAgin = false
    this.showBox = false
  }

  count = 0
  refreshSecKillLeftTime = null // 每隔1分钟刷新secKillLeftTime
  hasActiveRequest = false // 点击了激活按钮 防止多次点击 发送多次请求
  componentDidMount() {
    // 支持注册制跳转
    this.detailId = this.paramsProps.itemId || this.props.screenProps.productId
    // this.detailId = 20583
    this.paramsProps.type = this.paramsProps.type || this.props.screenProps.type
    this.sendPagePingBack()
    isIOS && StatusBar.setBarStyle('dark-content', true);
    hideLoading()
    if(this.state.isLogin) {
      this.initData()
    } else {
      this.listenLogin()
      // 未登录展示信息
      Promise.all([
          this._getProductInfo(),
        ])
        .then(() => {
          this.setState({
            isLoading: false
          })
        })
        .catch()
    }
    // 增加展示氛围信息， 不校验登录
    this._fetchAtmosphereInfo()
  }
  // 页面来源投递
  sendPagePingBack() {
    const fromShare = getObjectValueSafely(this.props, 'screenProps.fromshare')
    const pageFrom = this.paramsProps.from
    sendPagePingback(this.pageName, {from: fromShare || pageFrom})
  }
  // 登录状态下调用 查询是否有秒杀资格
  _fetchCheckSecKillRecord = async () => {
    try {
      // const data = {code: 'A00000', secKillLeftTime: 300000}
      const data = await fetchCheckSecKillRecord(this.detailId) || {}
      if(data.code === 'A00000' && data.data && data.data.secKillLeftTime && data.data.secKillLeftTime > 0) {
        this.setState({
          secKillLeftTime: data.data.secKillLeftTime,
          hasSecKill: true
        })
        this.refreshSecKillLeftTime && clearTimeout(this.refreshSecKillLeftTime)
        // 每隔1分钟刷新一次secKillLeftTime
        this.refreshSecKillLeftTime = setTimeout(() => {
          this._fetchCheckSecKillRecord()
        }, 60000)
      } else {
        this.setState({
          secKillLeftTime: null,
          hasSecKill: false
        })
      }
    } catch(error) {
      //
    }
  }
  // 记录用户秒杀资格 分享成功之后调用该接口 返回成功代表有秒杀资格
  async _fetchSecKillRecord() {
    try {
      const data = await fetchSecKillRecord(this.detailId)
      if(data.code === 'A00000') {
        this._fetchCheckSecKillRecord()
      }
    } catch(error) {
      //
    }
  }
  // 获取顶部氛围轮播信息
  async _fetchAtmosphereInfo() {
    try {
      const data = await fetchAtmosphereInfo(this.detailId) || {}
      const atmosphereInfo = this.handleAtmosphereRes(data)
      this.setState({atmosphereInfo})
    } catch(error) {
      //
    }
  }
  handleAtmosphereRes(data) {
    if(data.code === 'A00000' && data.data) {
      return data.data
    }
    return null
  }
  initData = () => {
    Promise.all([
        this._getUserInfo(),
        this._getProductInfo(),
        this._fetchCheckSecKillRecord()
      ])
      .then(() => {
        this.setState({
          isLoading: false
        })
      })
      .catch()
  }
  // 登录监听
  listenLogin = () => {
    const _this = this
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      _this.setState({
        isLogin
      }, () => {
        _this.initData()
      })
    })
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
    this.refreshSecKillLeftTime && clearTimeout(this.refreshSecKillLeftTime)
  }

  onShow() {
    if(this.showSuccessBoxAgin) {
      this.setState({
        showSuccessModal: true
      })
    }
  }

  onHide() {
    if(this.showBox) {
      this.showSuccessBoxAgin = true
    }
  }

  _getUserInfo() {
    getUserInfo({
      typeCode: 'point,paradise',
    })
      .then((data) => {
        const {totalScore} = data[0]
        const {level} = data[1]
        this.setState({
          totalScore,
          level,
        })
      })
      .catch();
  }

  _getProductInfo() {
    const requestHeader = {
      task_code: 'daojuProductDetail',
      timestamp: Date.now(),
    }

    const requestBody = {
      daojuProductDetail: {
        product_id: this.detailId,
        user_id: global.USER_INFO.userId,
        user_scores: this.props.totalScore
      }
    }

    executeTask(requestHeader, requestBody)
      .then((data) => { // 此处有data一定不要忘记恢复
        // const data = mockJson
        if(data.code === 'A00000') {
          const goodsInfo = data.data;
          this.setState({
            goodsInfo,
          })
        }
      })
      .catch();
  }
  // 简化兑换loading加载状态
  _renderNewConvertModal() {
    const {convertLoadingVisible, convertLoadingText, convertSuscessText} = this.state
    return <ConvertLoading modalVisible={convertLoadingVisible} convertSuscessText={convertSuscessText} convertLoadingText={convertLoadingText} />
  }
  // 兑换结果弹框
  _renderResultModal() {
    const {convertResultVisible, showConvertResultCancleBtn, convertResultContent, convertResultConfirmText, convertConfrimBtnFn, showCloseBtn, closeBtnFn} = this.state;
    return (
      <ConvertResultModal
        modalVisible={convertResultVisible}
        showCancleBtn={showConvertResultCancleBtn}
        showConfirmBtnText={convertResultConfirmText}
        content={convertResultContent}
        confrimBtnFn={convertConfrimBtnFn}
        showCloseBtn={showCloseBtn}
        cancleBtnFn={this._convertFailCancle}
        closeBtnFn={closeBtnFn}
      />
    );
  }
  // 获取需要展示的氛围信息
  getAtmosphereInfo() {
    const {atmosphereInfo, goodsInfo} = this.state
    if(!(goodsInfo && atmosphereInfo)) return []
    const {remain} = goodsInfo
    const {recentViewCount, recentExchangeUsers} = atmosphereInfo
    const recentViewCountInfo = recentViewCount && `${recentViewCount}人正在浏览此商品`
    const remainInfo = remain > 200 ? '' : `商品库存仅剩${remain}`
    const formatExchangeUsersList = recentExchangeUsers.length > 0 && recentExchangeUsers.map((v) => {
      return v.length > 5 ? v.substring(0, 4).concat('... 兑换了该商品') : `${v}兑换了该商品`
    }) || []
    return remainInfo
    ? [recentViewCountInfo, remainInfo, ...formatExchangeUsersList]
    : [recentViewCountInfo, ...formatExchangeUsersList];
  }
  // 滚动消息通知
  _renderNoticeList() {
    const listPic = this.getAtmosphereInfo()
    if(listPic.length === 0) return null
    return (
     <View style={styles.noticeInfoWrap}>
       <View style={styles.disabled} />
       <View style={styles.noticeSwiper}>
        <Swiper
          horizontal={false}
          showsButtons={false}
          showsPagination={false}
          loop={true}
          removeClippedSubviews={false}
          autoplay={true}
          // autoplayTimeout={2}
          height={20}
        >
          {listPic.map((item, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <View numberOfLines={1} key={i} style={styles.noticeText}>
                <Text style={{fontSize: 11, color: '#ffffff', fontFamily: 'PingFangSC-Regular'}}>{item}</Text>
              </View>
            )
          })}
        </Swiper>
       </View>
     </View>
    );
  }
  // 顶部轮播图
  _renderSwiper() {
    const listPic = this._getSwiperList()
    // 无图展示默认图
    if(listPic.length === 0) {
      return <WebImage name="defalut-shopping-img" style={{height: IMG_HEIGHT, width}} />
    }
    return (
      <QYSwiper
        style={styles.swiperWrapper}
        showsButtons={false}
        // height={IMG_HEIGHT * 1.2}
        height={isIOS ? IMG_HEIGHT * 1.08 : IMG_HEIGHT * 1.2}
        removeClippedSubviews={false}
        autoplay={true}
        paginationStyle={{position: 'absolute', bottom: isIOS ? -5 : 10}}
        activeDotStyle={{backgroundColor: '#FF6600', height: 5, width: 11, borderRadius: 2.5}}
        dotStyle={{backgroundColor: '#D5D5D5', height: 5, width: 5, borderRadius: 2.5}}
        onScrollBeginDrag={() => sendClickPingback(GOODS_DETAIL_RPAGE, '', GOODS_DETAIL_SECKILL_PIC_RSEAT)}
      >
        {listPic.map((item, i) => {
          if(i === 0) { // 第一张轮播图按原有逻辑渲染
            return this._renderFirstSwiperPic();
          }
           // eslint-disable-next-line react/no-array-index-key
           return <WebImage key={i} name={item} style={{height: IMG_HEIGHT, width}} />;
        })}
      </QYSwiper>
    );
  }
  // 获取图片url
  _getPicUrl() {
    const {goodsInfo} = this.state;
    if(!goodsInfo) {
      return null;
    }
    const picMap = filterPic(goodsInfo.photoList);
    // const formatLargePic = (picMap.largepic && picMap.largepic.split(',')) || [];
    const imgUri = picMap.movepic || picMap.smallpic || 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/img_default@2x.png';
    return imgUri
  }
  // 渲染第一张swiper图片
  _renderFirstSwiperPic() {
    const {goodsInfo} = this.state;
    if(!goodsInfo) {
      return null;
    }
    const picMap = filterPic(goodsInfo.photoList);
    const formatLargePic = (picMap.largepic && picMap.largepic.split(',')) || [];
    // 产品 谭伊琳说 优先取 movepic（适配），largepic 和 smallpic 采用平铺
    const imgUri = picMap.movepic || formatLargePic[0] || picMap.smallpic || 'http://www.iqiyipic.com/common/fix/h5-aura/iqiyi-logo.png';
    const price = goodsInfo.score ? goodsInfo.originalPrice : 0;
    return (
      <View key={0}>
        {picMap.movepic ? (
          <View style={styles.topImageContainer}>
            <CouponImage price={price} imgUri={imgUri} />
          </View>
        ) : (
          <Image
            source={{uri: imgUri}}
            style={{
              width,
              height: width * 0.4
            }}
          />
        )}
      </View>
    );
  }
  // 获取largepic字段中除了第一张轮播图list
  _getSwiperList() {
    const {goodsInfo} = this.state
    if(!(goodsInfo && goodsInfo.photoList)) return []
    const {photoList = []} = goodsInfo
    const {movepic = '', largepic = '', smallpic = ''} = filterPic(photoList)
    const formatLargePic = largepic && largepic.split(',') || []
    // 第一张图片 按原有逻辑处理(movepic > 取largepic字段中的第一个 > 取smallpic > 默认图)
    const firstPic = movepic || formatLargePic[0] || smallpic
    const mergePics = formatLargePic.slice(1) ? [firstPic, ...formatLargePic.slice(1)] : [firstPic]
    return mergePics.filter(Boolean)
  }
  _renderTopSection = () => {
    const {goodsInfo} = this.state

    if(!goodsInfo) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator text="内容即将呈现..."/>
        </View>
      )
    }

    // const picMap = filterPic(goodsInfo.photoList)
    // const formatLargePic = picMap.largepic && picMap.largepic.split(',') || []
    // 产品 谭伊琳说 优先取 movepic（适配），largepic 和 smallpic 采用平铺
    // const imgUri = picMap.movepic || formatLargePic[0] || picMap.smallpic || 'http://www.iqiyipic.com/common/fix/h5-aura/iqiyi-logo.png'
    // const price = goodsInfo.score ? goodsInfo.originalPrice : 0;
    let newUserPrice = null;
    // 是否是新用户
    if(goodsInfo.newUser && goodsInfo.newUserScore !== null) {
      newUserPrice = goodsInfo.newUserScore;
    } else {
      newUserPrice = goodsInfo.score;
    }

    return (
      <View>
        {/* {
          picMap.movepic
            ? (
            <View style={styles.topImageContainer}>
              <CouponImage
                price={price}
                imgUri={imgUri}
              />
            </View>
          )
            : (
            <Image
              source={{uri: imgUri}}
              style={{
                width,
                height: width * 0.4
              }}
            />
          )
        } */}
        <View style={styles.topSection}>
          {/* <Text
            style={{color: '#333333', fontSize: 17, fontWeight: 'bold'}}
            numberOfLines={1}
          >
            {goodsInfo.name}
          </Text> */}
          <View style={styles.productName}>
            <Text
              style={{color: '#333333', fontSize: px2dp(17), fontWeight: 'bold', lineHeight: px2dp(50 / 2)}}
              numberOfLines={1}
            >
              {goodsInfo.name}
            </Text>
           <Touchable onPress={() => this._handleShare(true)}>
               <WebImage name="share-icon" style={{width: px2dp(50 / 2), height: px2dp(50 / 2)}} />
           </Touchable>
          </View>
          <View style={styles.priceBox}>
            <View style={styles.leftPrice}>
            {
              (goodsInfo.newUser && newUserPrice) ?
                <WebImage
                  name="new_user_price_bg"
                  style={{width: px2dp(45), height: px2dp(14), justifyContent: 'center', alignItems: 'center'}}
                >
                  <Text style={{fontSize: px2dp(9), color: '#FFFFFF'}}>福利特惠</Text>
                </WebImage> : null
            }
            {this._renderTopPriceInfo()}
            </View>
            {
              goodsInfo.salesNum ? (<Text style={styles.salesNum}>{goodsInfo.salesNum}人已兑</Text>) : null
            }
          </View>
        </View>
        <View style={styles.separator}/>
      </View>
    )
  }
  // 渲染轮播图下方信息
  _renderTopPriceInfo() {
    const {goodsInfo, hasSecKill} = this.state;
    let newUserPrice = null;
    // 是否是新用户
    if(goodsInfo.newUser && goodsInfo.newUserScore !== null) {
      newUserPrice = goodsInfo.newUserScore;
    } else {
      newUserPrice = goodsInfo.score;
    }
    if(!hasSecKill) { // 没有秒杀资格
      if(!goodsInfo.secKillPrice) { // 没有秒杀价格 执行原先老的逻辑
        return (
          <Text style={styles.detailPrice}>
            {goodsInfo.price ? `${goodsInfo.price / 100}元+` : ''}
            {newUserPrice || goodsInfo.score ? `${newUserPrice || goodsInfo.score}积分` : `Lv ${goodsInfo.limitGrade}可领取`}
          </Text>
        );
      }
      return (
        <Text style={styles.detailPrice}>
          {goodsInfo.price ? `${goodsInfo.price / 100}元` : ''}
          {newUserPrice || goodsInfo.score ? `${newUserPrice || goodsInfo.score}积分` : ''}
        </Text>
      );
    }
    return (// 有秒杀资格，显示秒杀价+原先老的兑换积分值
      <View style={styles.secKillPrice}>
        <Text style={styles.secKillPriceNum}>{goodsInfo.price ? goodsInfo.secKillPrice / 100 : goodsInfo.secKillPrice}</Text>
        <Text style={styles.secKillPriceText}>{goodsInfo.price ? '元' : '积分'}</Text>
        <View style={styles.originPriceWrap}>
          <Text style={styles.originPrice}>
            {goodsInfo.price ? `${goodsInfo.price / 100}元` : ''}
            {newUserPrice || goodsInfo.score ? `${newUserPrice || goodsInfo.score}积分` : ''}
          </Text>
        </View>
      </View>
    );
  }
  lookMore = (url) => {
    url && this.openWeb(url)
  }
  _renderGoodsDetail = () => {
    const {goodsInfo} = this.state
    if(!goodsInfo) {
      return null
    }
    // 下面这些操作是  替换掉商品详情里面产品配的特殊字段，然后点击跳转到对应的链接
    const replace = goodsInfo.exts && goodsInfo.exts.filter(fv => /replace_/.test(fv.name))[0]
    const replaceText = replace && replace.name
    const url = replace && replace.value
    const varible = replace && /replace_(.+)/.exec(replaceText)[1]
    const re = replace && (new RegExp(`${varible}$`, 'gim'))
    replace && (this.state.goodsInfo.intro = this.state.goodsInfo.intro.replace(re, ''))
    const {expiredType, expiredTime, expiredDay} = goodsInfo

    return (
      goodsInfo &&
      <View style={styles.detailWrap}>
        <Text style={styles.detailTitle}>商品详情</Text>
        <Text style={styles.detailInfo}>
          {this.state.goodsInfo.intro}
          {replace && <Text onPress={() => this.lookMore(url)}>
            <Text style={{
              color: '#FF6600',
              fontSize: 14
            }}
            >{varible}
            </Text>
                      </Text>}
        </Text>
        <Text style={styles.detailTitle}>有效期至</Text>
        {expiredType === 1 && <Text style={{
          color: '#666666',
          fontSize: 13,
          lineHeight: 19
        }}
        >{unixTimeToFormat(expiredTime)}兑换后{expiredDay}天内有效
                              </Text>}
        {
          expiredType === 0 &&
          <Text style={{
            color: '#666666',
            fontSize: 13,
            lineHeight: 19
          }}
          >{unixTimeToFormat(expiredTime)}
          </Text>}
          <Text style={styles.detailTitle}>兑换使用</Text>
          <Touchable onPress={() => { sendClickPingback(GOODS_DETAIL_RPAGE, '', GOODS_DETAIL_MORE_RSEAT); this.setState({ruleNumberOfLines: 100, showRuleArrow: false}); }}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text
                style={{
                  color: '#666666',
                  fontSize: 14,
                  lineHeight: 20
                }}
                textDecorationLine="line-through"
                numberOfLines={this.state.ruleNumberOfLines}
                onLayout={(e) => {
                  // ruleNumberOfLines初始设为99 如果高度大于60设置ruleNumberOfLines为3默认三行展示
                  // 此方法缺点：刚展示页面的时候肉眼可见先全部展示再缩放3行
                  if(this.state.ruleNumberOfLines === 100) {
                    return
                  }
                  if(e.nativeEvent.layout.height > RULE_HEIGHT) {
                    this.setState({showRuleArrow: true, ruleNumberOfLines: 3})
                  }
                }}
              >
                {this.state.goodsInfo.rules}
              </Text>
              { this.state.showRuleArrow ? <Text style={{color: '#FF9B00', fontSize: 14, lineHeight: 20}}>展开</Text> : null}
              {/* { this.state.showRuleArrow ? <WebImage name="arrow-bottom" style={{width: 21 / 2, height: 21 / 2, position: 'absolute', right: 2, bottom: 2}} /> : null} */}
            </View>
          </Touchable>
      </View>
    )
  }

  doExchange = () => {
    sendClickPingback('pointbuy', '100100', 'buynow')
    this.setState({
      modalVisible: true
    })
  }

  goToLogin = () => {
    sendClickPingback('pointbuy', '100100', 'buynow')
    // 去登录
    goToLogin()
  }

  // 打开任务列表页面
  openTaskList = () => {
    sendClickPingback('pointbuy', '100100', 'gotasklist')
    this.navigate('TaskList')
  }
  // 未登录 秒杀按钮展示状态
  _showNotLoginSecKillBtn() {
    const {goodsInfo, isLogin} = this.state
    if(!(goodsInfo && goodsInfo.secKillPrice)) return null
    const formatSecKillPrice = this._getFormatSecKillPrice()
    return (
      // eslint-disable-next-line max-len
      <TouchableHighlight onPress={() => { sendClickPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_SECKILL_BTN_BLOCK, GOODS_DETAIL_SECKILL_BTN_RSEAT); isLogin ? this._handleShare() : this.goToLogin() }} style={{width: px2dp(120), height: px2dp(60), backgroundColor: '#FF4A39', justifyContent: 'center', alignItems: 'center'}}>
            <Text onLayout={() => sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_SECKILL_BTN_BLOCK)} style={{fontSize: px2dp(16), color: '#ffffff'}}>{formatSecKillPrice}</Text>
      </TouchableHighlight>
    )
  }
  // 显示秒杀倒计时
  _renderCountDownBtn() {
    const {goodsInfo, secKillLeftTime} = this.state
    if(!(goodsInfo && goodsInfo.secKillPrice)) return null
    const formatSecKillPrice = this._getFormatSecKillPrice()
    sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_SECKILL_INTEGRAL_BLOCK)
    return (
      // eslint-disable-next-line max-len
      <TouchableOpacity onPress={() => { sendClickPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_SECKILL_INTEGRAL_BLOCK, GOODS_DETAIL_SECKILL_ORDER_RSEAT); this.confirmExchange() }} style={{width: px2dp(120), height: px2dp(60), backgroundColor: '#FF4A39', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: px2dp(16), color: '#ffffff'}}>{formatSecKillPrice}</Text>
            {
              secKillLeftTime ? <CountDown initData={() => this.initData()} secKillLeftTime={secKillLeftTime} /> : null
            }
      </TouchableOpacity>
    )
  }
  // format secKillPrice 只能配置price或者score一个
  _getFormatSecKillPrice() {
    const {goodsInfo: {price, score, secKillPrice}, hasSecKill} = this.state
    if(hasSecKill && secKillPrice) {
      if(price) return `${secKillPrice / 100}元下单`
      if(score) return `${secKillPrice}积分下单`
    }
    if(price) return `${secKillPrice / 100}元秒杀`
    if(score) return `${secKillPrice}积分秒杀`
    return ''
  }
  // 已登录情况 展示秒杀按钮
  _showSecKillBtn() {
    const {hasSecKill} = this.state
    if(!hasSecKill) return this._showNotLoginSecKillBtn()
    return this._renderCountDownBtn()
  }
  // 唤醒分享 btnShare为true代表是轮播图下方的分享
  _handleShare = (btnShare) => {
    const {hasSecKill, goodsInfo: {name = '', secKillPrice} = {}} = this.state
    const pic = this._getPicUrl()
    // 商品支持秒杀：“（（商品名称）+正在秒杀”，如果超过一行则2行展示
    // 商品不支持秒杀：“（（商品名称）+正在兑换”，如果超过一行则2行展示
    const title = secKillPrice ? `${name}正在秒杀` : `${name}正在兑换`
    // const text = secKillPrice ? `${name}正在秒杀` : `${name}`
    let dialogTitle = '分享给好友'
    if(btnShare) { // 分享icon按钮
      sendClickPingback(GOODS_DETAIL_RPAGE, '', GOODS_DETAIL_SHARE_RSEAT)
      if(secKillPrice && !hasSecKill) { // 有秒杀价格且没有秒杀资格
        dialogTitle = `分享成功5分钟内下单,即可${this._getFormatSecKillPrice()}`
      }
      if((hasSecKill && secKillPrice) || !secKillPrice) { // 没有秒杀价格 || 有秒杀价格并且有秒杀资格
        dialogTitle = '分享至'
      }
    } else if(secKillPrice && !hasSecKill) { // 有秒杀价格 && 没有秒杀资格
        dialogTitle = `分享成功5分钟内下单,即可${this._getFormatSecKillPrice()}`
    }
    // 分享到小程序的方图
    const wxImg = secKillPrice ? 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/seckill_applet@2x.png' : 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/goods_convert@2x.png'
    const params = {
      title,
      dialogTitle, // 分享自定义标题
      pic, // H5图片
      url: `${PRODUCTDETAIL[global._ENV_CONFIG_]}?productId=${this.detailId}&title=${encodeURIComponent(title)}&qyId=${encodeURIComponent(global.CLIENT_INFO.qyId)}`,
      mp_path: `pages/product/detail/detail?productId=${this.detailId}&title=${encodeURIComponent(title)}`,
      mp_imageUrl: wxImg,
      rpage: '',
      shareType: 5 // 小程序
    }
    shareSNS(params, this._shareCallBack)
  }
  // 秒杀分享回调
  _shareCallBack = () => {
    const {goodsInfo: {secKillPrice} = {}, hasSecKill} = this.state
    // 有秒杀价格并且有秒杀资格时点击分享不再重新获取时间
    if(hasSecKill && secKillPrice) return
    if(secKillPrice) {
      this._fetchSecKillRecord()
    }
  }
  _renderBtnStatus = () => {
    const {goodsInfo, level, totalScore, isLogin, hasSecKill} = this.state

    if(!goodsInfo) return


    // const price = goodsInfo.score ? goodsInfo.originalPrice : 0;
    let newUserPrice = null;
    // 是否是新用户
    if(goodsInfo.newUser && goodsInfo.newUserScore !== null) {
      newUserPrice = goodsInfo.newUserScore;
    } else {
      newUserPrice = goodsInfo.score;
    }
    const btnStatus = goodsInfo.exchangeStatus;
    if(btnStatus === 2) { // 库存不足
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>{goodsInfo.score ? '抢购一空' : '已领完'}</Text>
        </View>
      )
    } else if(btnStatus === 3) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>{goodsInfo.score ? '今日已兑完，明日再来' : '今日已领完'}</Text>
        </View>
      )
    }
    if(!isLogin) {
      return (
        <React.Fragment>
          <View style={styles.footerLeft}>
            <Text style={styles.loginText}>
            登录查看你的积分
            </Text>
          </View>
          <TouchableHighlight {...TOUCH_COLORFUL_MASK} onPress={this.goToLogin}>
            <LinearGradient
              start={{
                x: 0,
                y: 1
              }}
              end={{
                x: 1,
                y: 1
              }}
              colors={TEXT_BUTTON_COLOR}
              style={styles.pageBtnWrapper}
            >
              <Text style={styles.pageBtnText}>立即登录</Text>
            </LinearGradient>
          </TouchableHighlight>
          {
            this._showNotLoginSecKillBtn()
          }
        </React.Fragment>
      )
    }
    if(btnStatus === 4) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>{goodsInfo.score ? '已达每日兑换上限' : '今日已领取'}</Text>
        </View>
      )
    } else if(btnStatus === 5) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>{goodsInfo.score ? '已达每周兑换上限' : '本周已领取'}</Text>
        </View>
      )
    } else if(btnStatus === 6) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>{goodsInfo.score ? '已达每月兑换上限' : '本月已领取'}</Text>
        </View>
      )
    } else if(btnStatus === 7) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>已达总兑换上限</Text>
        </View>
      )
    }
    // vip可兑
    if(goodsInfo.forVip && !global.USER_INFO.isVIP) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>仅会员可兑</Text>
        </View>
      )
    }
    const limit = goodsInfo.limitGrade && goodsInfo.limitGrade.split(',')[0]
    if(btnStatus === 1) { // 可领取
      if(level < limit) {
        return (
          <View style={styles.btnGrey}>
            <Text style={styles.btnText}>不满足领取条件</Text>
          </View>
        )
      }
      // 获取secKillPrice积分值 如果是价格返回null
      const secKillPriceScore = goodsInfo.secKillPrice && this.getSecKillPriceScore()
      if(totalScore < (secKillPriceScore || newUserPrice || goodsInfo.score)) {
        return (
          <React.Fragment>
            {hasSecKill ? (
              <View style={styles.footerLeft}>
                <Text style={styles.footerText}>
                  支付：{goodsInfo.price ? `${goodsInfo.secKillPrice / 100}元` : ''}
                  {!goodsInfo.price ? `${goodsInfo.secKillPrice}积分` : ''}
                </Text>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Text style={[styles.footerText, {color: '#999999'}]}>还需:  </Text>
                  <Text style={[styles.footerText, {color: '#ff3b3b'}]}>{secKillPriceScore - totalScore}分</Text>
                </View>
                {/* <Text style={[styles.footerText, {color: '#ff3b3b', marginTop: 4}]}>积分不足，还差{secKillPriceScore - totalScore}分</Text> */}
              </View>
            ) : (
              <View style={styles.footerLeft}>
                <Text style={styles.footerText}>
                  支付：{goodsInfo.price ? `${goodsInfo.price / 100}元` : ''}
                  {goodsInfo.price && (newUserPrice || goodsInfo.score) ? '+' : ''}
                  {newUserPrice || goodsInfo.score ? `${newUserPrice || goodsInfo.score}积分` : ''}
                </Text>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Text style={[styles.footerText, {color: '#999999'}]}>还需:  </Text>
                  <Text style={[styles.footerText, {color: '#ff3b3b'}]}>{(newUserPrice || goodsInfo.score) - totalScore}分</Text>
                </View>
                {/* <Text style={[styles.footerText, {color: '#ff3b3b', marginTop: 4}]}>积分不足，还差{(newUserPrice || goodsInfo.score) - totalScore}分</Text> */}
              </View>
            )}
            <TouchableHighlight {...TOUCH_COLORFUL_MASK} onPress={this.openTaskList}>
              <LinearGradient
                start={{
                  x: 0,
                  y: 1
                }}
                end={{
                  x: 1,
                  y: 1
                }}
                colors={TEXT_BUTTON_COLOR}
                style={styles.pageBtnWrapper}
              >
                <Text style={styles.pageBtnText} onLayout={() => { sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_MAKE_INTEGRAL_BLOCK) }}>去赚积分</Text>
              </LinearGradient>
            </TouchableHighlight>
            {this._showSecKillBtn()}
          </React.Fragment>
        )
      }

      // sendBlockPingback('pointbuy', '100100')
      return (
        <React.Fragment>
          {hasSecKill ? (
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>
                支付：
                <Text style={{color: '#ef7b00'}}>
                {goodsInfo.price ? `${goodsInfo.secKillPrice / 100}元` : ''}
                {!goodsInfo.price ? `${goodsInfo.secKillPrice}积分` : ''}
                </Text>
              </Text>
              <Text style={[styles.footerText, {color: '#999', marginTop: 4}]}>余额：{totalScore}积分</Text>
            </View>
          ) : (
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>
                支付：
                <Text style={{color: '#ef7b00'}}>
                  {goodsInfo.price ? `${goodsInfo.price / 100}元` : ''}
                  {goodsInfo.price && (newUserPrice || goodsInfo.score) ? '+' : ''}
                  {newUserPrice || goodsInfo.score ? `${newUserPrice || goodsInfo.score}积分` : ''}
                </Text>
              </Text>
              <Text style={[styles.footerText, {color: '#999', marginTop: 4}]}>余额：{totalScore}积分</Text>
            </View>
          )}
          {!hasSecKill ? (
            <TouchableHighlight
              {...TOUCH_COLORFUL_MASK}
              onPress={() => {
                sendClickPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_BLOCK, GOODS_DETAIL_CONVERT_RSEAT);
                this.confirmExchange();
              }}
            >
              <LinearGradient
                start={{
                  x: 0,
                  y: 1
                }}
                end={{
                  x: 1,
                  y: 1
                }}
                colors={TEXT_BUTTON_COLOR}
                style={styles.pageBtnWrapper}
              >
                <Text
                  onLayout={() => {
                    sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_BLOCK);
                  }}
                  style={styles.pageBtnText}
                >
                  {(!goodsInfo.score && !goodsInfo.price) ? '立即领取' : '立即兑换'}
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          ) : null}
          {this._showSecKillBtn()}
        </React.Fragment>
      )
    } else if(btnStatus === 7) {
      return (
        <View style={styles.btnGrey}>
          <Text style={styles.btnText}>已领取</Text>
        </View>
      )
    }
  }
  // 只获取秒杀积分
  getSecKillPriceScore() {
     // 只比较秒杀积分是否小于当前用户拥有的积分 如果配置秒杀价格不做比较
    const {goodsInfo: {secKillPrice, price, score} = {}, hasSecKill} = this.state
    if(hasSecKill && secKillPrice && price) return null
    if(secKillPrice && hasSecKill && score) return secKillPrice
    return null
  }
  // 兑换失败取消按钮事件
  _convertFailCancle = () => {
    sendClickPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_FAIL_BLOCK, GOODS_DETAIL_CONVERT_FAIL_CANCLE_RSEAT)
    this.setState({
      convertResultVisible: false,
      convertResultRetry: false
    })
  }
  // 兑换失败再试一次按钮事件
  _convertFailConfirm() {
    sendClickPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_FAIL_BLOCK, GOODS_DETAIL_CONVERT_FAIL_TRY_RSEAT)
    this.setState({
      convertLoadingVisible: true,
      convertResultVisible: false
    }, () => {
      // sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_LOADING_BLOCK)
      this.confirmExchange()
    })
  }
  // 精品推荐 前十位商品的点击pingback
  recommendPingBack = (index) => {
    sendClickPingback(GOODS_DETAIL_RPAGE, '', `${GOODS_DETAIL_RECOMMEND_RSEAT}${index + 1}`)
  }
  _renderBottomBtn = () => {
    return (
      <View style={styles.btnWrap}>
        {this._renderBtnStatus()}
      </View>
    )
  }

  doCancle = () => {
    this.setState({
      modalVisible: false
    })
  }

  showResultToast = (text) => {
    this.setState({
      exchangeLoading: false,
    }, () => showToast(text))
  }

  confirmExchange = () => {
    const {goodsInfo} = this.state
    sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_LOADING_BLOCK)
    this.setState({
      modalVisible: false,
      exchangeLoading: true,
      convertLoadingVisible: true
    })
    const taskCode = goodsInfo.limitGrade ? 'daojuPurchaseExchangeNew_userGrade' : 'daojuPurchaseExchangeNew';

    const requestHeader = {
      task_code: taskCode,
      timestamp: Date.now(),
    }
    const requestBody = {
      daojuPurchaseExchangeNew: {
        vertical_code: 'iQIYI',
        partner_code: goodsInfo.partnerCode,
        agentversion: '9.7.5',
        appver: '9.7.5',
        money_type: 'point',
        product_num: 1,
        platform: isIOS ? '2_22_221' : '2_22_222',
        srcplatform: isIOS ? '20' : '21',
        user_id: global.USER_INFO.userId,
        product_id: this.detailId,
        cookie: global.COMMON_PARAMS.cookie
      }
    }

    executeTask(requestHeader, requestBody)
      .then((data) => {
        if(data.code === 'A00000') { // 兑换成功
          this.setState({
            exchangeResult: data.data
          })
          this.props.changeTotalScore(-1 * goodsInfo.score)
          this.initData()
          // if(!isIOS) {
          //   const {partner, orderCode} = data.data
          //   if(orderCode && partner) {
          //     this.pay(partner, orderCode)
          //     this.setState({
          //       exchangeLoading: false
          //     })
          //   } else {
          //     this.setState({
          //       exchangeLoading: false,
          //     }, () => {
          //       this.setState({
          //         showSuccessModal: true,
          //       })
          //       sendBlockPingback('pointbuy', '100200') // 兑换结果页面 结果弹窗展示pingback
          //     })
          //   }
          // } else {
          //   this.setState({
          //     exchangeLoading: false,
          //   }, () => {
          //     this.setState({
          //       showSuccessModal: true,
          //     })
          //   })
          // }
          if(!isIOS) {
            const {partner, orderCode} = data.data
            if(orderCode && partner) {
              this.pay(partner, orderCode)
              this.setState({
                convertLoadingVisible: false
              })
            } else {
              this.getNewConvertResult(data.data)
            }
          } else {
            this.getNewConvertResult(data.data)
          }
          sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_SUCCESS_BLOCK, {
            rseat: GOODS_DETAIL_CONVERT_SUCCESS_RSEAT
          })
          return
        }

        if(data.code === 'G00043') {
          sendBlockPingback('pointbuy', '100202') // 非会员兑换失败展示pingback
        }
        if(this.state.convertResultRetry) {
          this.setState({convertLoadingVisible: false}, () => showToast(getErrorMessage(data.code)))
        } else {
          this._convertFail()
        }
      })
      .catch(() => {
        // 兑换失败展示新的弹框
        if(this.state.convertResultRetry) {
          this.setState({convertLoadingVisible: false}, () => showToast(getErrorMessage('error')))
        } else {
          this._convertFail()
        }
      })
  }
  // 复制券码
  copyRedeemCodes(redeemCodes) {
    this.setState({convertResultVisible: false}, () => {
      Clipboard.setString(redeemCodes);
      showToast('复制成功');
    });
  }
  // 新的兑换成功的逻辑处理
  getNewConvertResult(convertResult = {}) {
    const {toUseLink = '', orderCode = '', redeemCodes = []} = convertResult;
    const {goodsInfo: {itemId, type, subType} = {}} = this.state;
    // 商品类型
    const orderType = this.formatOrderType({type, subType});
    if(orderType === 1) {
      // 实物商品-常规
      this.setState(
        {
          convertLoadingVisible: true,
          convertSuscessText: '兑换成功',
          convertLoadingText: '准备填写地址...'
        },
        () => {
          setTimeout(() => {
            const param = {
              productId: itemId,
              orderId: orderCode
            };
            sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_LOADING_SUCCESS_BLOCK)
            this.setState({convertLoadingVisible: false})
            const openUrl = createUrl(EDIT_ADDRESS[GET_ENV()], param);
            this.openWeb(openUrl);
          }, 500);
        }
      );
      return;
    }
    if(orderType === 2) {
      // 虚拟商品-会员直冲-激活
      this.setState({
        convertLoadingVisible: false,
        convertResultVisible: true,
        showCloseBtn: true,
        convertResultConfirmText: '激活',
        convertConfrimBtnFn: () => this.activeProduct()
      });
      return;
    }
    if(orderType === 3) {
      // 卡券-常规、商品券-常规
      if(!toUseLink) {
        this.setState({
            convertLoadingVisible: false,
            convertResultVisible: true,
            showCloseBtn: true,
            convertResultConfirmText: '复制券码',
            convertConfrimBtnFn: () => this.copyRedeemCodes(redeemCodes[0])
          });
        return;
      }
      this.setState(
        {
          convertLoadingVisible: true,
          convertResultVisible: false,
          convertSuscessText: '兑换成功',
          convertLoadingText: '券码已复制 正在帮您跳转剁手...'
        },
        () => {
          setTimeout(() => {
            this.setState({convertLoadingVisible: false})
            sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_LOADING_SUCCESS_BLOCK)
            redeemCodes.length > 0 && Clipboard.setString(redeemCodes[0]);
            this.openWeb(toUseLink);
          }, 500);
        }
      );
      return;
    }
    // 其他商品类型
    if(!toUseLink) {
      // 未配置使用链接
      this.setState({
        convertLoadingVisible: false,
        convertResultVisible: true,
        showCloseBtn: true,
        convertResultConfirmText: '再看看其他优惠',
        convertConfrimBtnFn: () => {
          this.setState({convertResultVisible: false});
          this.goTo('ShoppingMall');
        }
      });
      return;
    }
    // 配置了去使用链接
    this.setState(
      {
        convertLoadingVisible: true,
        convertResultVisible: false,
        convertSuscessText: '兑换成功',
        convertLoadingText: '帮您跳转剁手...'
      },
      () => {
        setTimeout(() => {
          this.setState({convertLoadingVisible: false});
          redeemCodes.length > 0 && Clipboard.setString(redeemCodes[0]);
          sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_LOADING_SUCCESS_BLOCK)
          this.openWeb(toUseLink);
        }, 500);
      }
    );
  }
  // 转换商品类型
  formatOrderType({type, subType}) {
    const formatOrderTypeMap = {
      0: 1, // 实物商品-常规
      1: 2, // 虚拟商品-会员直冲-激活
      2: 3, // 卡券-常规、商品券-常规
      3: 4 // 其他
    };
    // 未使用状态下的btn文字
    if(type === 3 && subType === 0) {
      // 实物商品-常规
      return formatOrderTypeMap[0];
    }
    if(type === 5 && (subType === 10 || subType === 21)) {
      // 虚拟商品-会员直冲-激活  // 虚拟商品+会员激活（待废弃）、虚拟商品+会员激活（新)
      return formatOrderTypeMap[1];
    }
    if((type === 4 && subType === 0) || (type === 6 && subType === 0)) {
      // 卡券-常规、商品券-常规
      return formatOrderTypeMap[2];
    }
    // 其他
    return formatOrderTypeMap[3];
  }
  // 兑换失败
  _convertFail() {
    sendBlockPingback(GOODS_DETAIL_RPAGE, GOODS_DETAIL_CONVERT_FAIL_BLOCK)
    this.setState({
      convertResultVisible: true,
      convertLoadingVisible: false,
      showConvertResultCancleBtn: true,
      convertResultConfirmText: '再试一次',
      convertResultContent: '商品刚出了点小问题',
      showCloseBtn: false,
      convertConfrimBtnFn: () => {
        this.setState({convertResultRetry: true}, () => this._convertFailConfirm());
      }
    });
  }
  pay = (partner, partnerOrderNo) => {
    try {
      QYRNBridgeModule.openPay({
          partner,
          partner_order_no: partnerOrderNo
        })
        .then((result) => {
          const {PAY_RESULT_STATE, PAY_RESULT_SUB_STATE} = result
          if(PAY_RESULT_STATE === 610001 && PAY_RESULT_SUB_STATE !== 1) {
            this.setState({
              showSuccessModal: true,
            })
            // setTimeout(() => {
            //     this.setState({
            //         showSuccessModal: false,
            //     })
            // }, 3000)
          } else {
            showToast('支付失败，积分稍后返还')
          }
        });
    } catch(e) {
      showToast('网络繁忙，稍后重试')
    }

  }
// to do 删除_viewList方法
  _viewList = () => {
    sendClickPingback('pointbuy', '100200', 'seelist_btn')
    this.showSuccessBoxAgin = false
    this.showBox = false
    this.setState({
      showSuccessModal: false,
    }, () => {
      this.goTo('MyGain')
      // const url = ORDERLIST[GET_ENV()]
      // if(isIOS) {
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
  // 调用商品激活接口
  activeProduct = () => {
    if(this.hasActiveRequest) return
    this.hasActiveRequest = true
    const requestHeader = {
      task_code: 'daojuOrderChangeProductStatus',
      timestamp: Date.now(),
    }
    const {exchangeResult} = this.state
    const requestBody = {
      daojuOrderChangeProductStatus: {
        vertical_code: 'iQIYI',
        order_code: exchangeResult.orderCode,
        device_id: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
        user_id: global.USER_INFO.userId,
        dfp: global.CLIENT_INFO.dfp
      }
    }
    executeTask(requestHeader, requestBody)
      .then((data) => {
        const {code = '', msg = '系统忙，稍后再试'} = data || {}
        if(code === 'A00000') {
          this.setState({
            hasActive: true,
            convertResultVisible: false
          })
          showToast('激活成功')
          return
        }
        if(code === 'G00026') {
          showToast(msg)
          return
        }
        showToast(msg)
      }, () => {
        // 激活失败
        showToast('系统忙，稍后再试')
      })
      .catch(() => {
        showToast('系统忙，稍后再试')
      }).finally(() => { this.hasActiveRequest = false })
  }
  _rendershowExchangeBox = () => {
    const {modalVisible, goodsInfo} = this.state
    return (
      modalVisible &&
      <ConfirmModal
        modalVisible={modalVisible}
        cancelFn={this.doCancle}
      >
        <View style={styles.modalBox}>
          <Text style={styles.topText}>
            {goodsInfo.score ?
              `确定使用${goodsInfo.newUser ? goodsInfo.newUserScore || goodsInfo.score : goodsInfo.score}积分兑换`
              :
              '确认领取'
            }
          </Text>
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
 // to do老的兑换流程_renderExecuteBox hideSuccussBox successBoxContent successBoxBtn2 clickBoxBtn2 _renderSuccessBox方法应该没有用了
  _renderExecuteBox = () => {
    const {exchangeLoading} = this.state
    return (
      exchangeLoading &&
      <ConfirmModal
        modalVisible={exchangeLoading}
        cancelFn={this.doCancle}
      >
        <View style={styles.executeLoading}>
          <ActivityIndicator text="正在处理..."/>
        </View>
      </ConfirmModal>
    )
  }
  hideSuccussBox = () => {
    this.setState({
      showSuccessModal: false,
    })
  }
  successBoxContent = () => {
    const {goodsInfo, exchangeResult} = this.state
    let content = ''
    if(goodsInfo.type === 7) { // type 7 付费会员
      content = '恭喜您会员充值成功！'
    } else if(goodsInfo.type === 3) { // type 3 实物
      content = '填写收货信息后，我们会尽快为您发货！'
    } else if((goodsInfo.type === 4 || goodsInfo.type === 6) && goodsInfo.subType === 0) {
      content = `商品券码:${exchangeResult.redeemCodes}`
    } else if(goodsInfo.type === 5 && goodsInfo.subType === 10) {
      content = '激活即可享受会员！'
    } else if(!goodsInfo.price && !goodsInfo.score) {
      content = '恭喜您领取成功，快去使用吧'
    } else {
      content = '恭喜您兑换成功，快去使用吧！'
    }
    return content
  }
  successBoxBtn2 = () => {
    const {goodsInfo, exchangeResult} = this.state
    let showBtn2 = true
    const {toUseLink} = exchangeResult;
    let btnText = ''
    if((goodsInfo.type === 4 || goodsInfo.type === 6) && goodsInfo.subType === 0) { // 卡券+常规  商品券+常规
      btnText = toUseLink ? '复制并使用' : '复制券码'
      if(!toUseLink) {
        showBtn2 = false
      }
    } else if(goodsInfo.type === 4 && goodsInfo.subType === 11) {
      btnText = '立即使用'
    } else if(goodsInfo.type === 3 && goodsInfo.subType === 0) {
      showBtn2 = false
      btnText = '填写地址'
    } else if(goodsInfo.type === 5 && goodsInfo.subType === 10) {
      btnText = '激活'
    } else {
      toUseLink ? btnText = '立即使用' : showBtn2 = false
    }
    return {
      showBtn2,
      btnText
    }
  }
  clickBoxBtn2 = () => {
    const {goodsInfo, exchangeResult} = this.state
    const {toUseLink} = exchangeResult;
    this.showBox = true
    // this.showSuccessBoxAgin = true
    sendClickPingback('pointbuy', '100200', 'gotouse_btn')
    if((goodsInfo.type === 4 || goodsInfo.type === 6) && goodsInfo.subType === 0) { // 卡券+常规  商品券+常规
      this.hideSuccussBox()
      Clipboard.setString(exchangeResult.redeemCodes[0])
      this.openWeb(toUseLink)
    } else if(goodsInfo.type === 4 && goodsInfo.subType === 11) { // 卡券+链接
      // alert(typeof exchangeResult.redeemCodes)
      this.hideSuccussBox()
      this.openWeb(toUseLink)
    } else if(goodsInfo.type === 3 && goodsInfo.subType === 0) { // 实物类型填写收货地址
      const param = {
        productId: goodsInfo.itemId,
        orderId: exchangeResult.orderCode,
      }
      const openUrl = createUrl(EDIT_ADDRESS[GET_ENV()], param)
      this.hideSuccussBox()
      this.openWeb(openUrl)
    } else if(goodsInfo.type === 5 && goodsInfo.subType === 10) { // 虚拟商品+会员直冲   激活
      this.activeProduct()
    } else {
      this.hideSuccussBox()
      if(toUseLink === 'gamezhibo') {
        setTimeout(() => {
          // this.openWeb(GAME_LIVE_URL)
          iosOpenRnPage(this.props.screenProps.uniqueID, JSON.parse(GAME_LIVE_URL))
        }, 1000)
      } else if(toUseLink === 'qixiulibao') {
        // const qxurl = QIXIU;
        // qxurl['biz_params']['biz_params'] = 'authcookie=' + global.USER_INFO.authCookie
        // const bundleUrl =
        // `iqiyi://mobile/register_business/show?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(qxurl)))}`
        const qxurl = {
          ...QIXIU,
          biz_params: {
            ...QIXIU.biz_params,
            biz_params: `authcookie=${global.USER_INFO.authCookie}`
          }
        }
        setTimeout(() => {
          // this.openWeb(bundleUrl)
          iosOpenRnPage(this.props.screenProps.uniqueID, qxurl)
        }, 1000)
      } else if(toUseLink === 'kaquan') {
        this.openWeb(KAQUAN_URL)
      } else if(toUseLink === 'gamevip') {
        // 只有android业务
        this.openWeb(GAME_VIP_URL)
      } else {
        this.openWeb(toUseLink)
      }
    }
  }
  _renderSuccessBox = () => {
    if(!this.state.showSuccessModal) {
      return null
    }
    const {showSuccessModal, goodsInfo, hasActive, exchangeResult} = this.state
    const title = (!goodsInfo.price && !goodsInfo.score) ? '领取成功' : '兑换成功'
    const content = this.successBoxContent();
    const {showBtn2, btnText} = this.successBoxBtn2();
    const {toUseLink} = exchangeResult
    return (
      <ConfirmModal
        modalVisible={showSuccessModal}
        cancelFn={null}
      >
        <View style={styles.loadingBox}>
          <View style={styles.boxTitle}>
            <Text style={{
              fontSize: 18,
              color: '#333333',
              textAlign: 'center',
              flex: 1
            }}
            >{title}
            </Text>
            <TouchableOpacity onPress={this.hideSuccussBox} style={styles.closeBtn}>
              <WebImage
                name="popup-close"
                style={{
                  width: px2dp(44),
                  height: px2dp(44)
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{
            maxWidth: px2dp(260),
            marginTop: px2dp(30)
          }}
          >
            <Text style={{
              fontSize: 16,
              color: '#333333',
              textAlign: 'center'
            }}
            >{content}
            </Text>
          </View>
          <View style={styles.successBtnBox}>
          {
            toUseLink && !hasActive ?
            <TouchableHighlight
              style={{
                  height: px2dp(40),
                  borderRadius: px2dp(20),
                }}
              {...TOUCH_COLORFUL_MASK}
              onPress={this.clickBoxBtn2}
            >
                <LinearGradient
                  start={{
                    x: 0,
                    y: 1
                  }}
                  end={{
                    x: 1,
                    y: 1
                  }}
                  colors={['#FF7E00', '#FF9E00']}
                  style={styles.shareModalBtnBox}
                >
                  <Text style={styles.btnText}>{btnText}</Text>
                </LinearGradient>
            </TouchableHighlight> :
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._viewList}
              style={{
                width: px2dp(260),
                height: px2dp(40),
                borderRadius: px2dp(20),
                borderWidth: 1,
                borderColor: '#FF7E00',
                justifyContent: 'center'
              }}
            >
              <Text style={{
                fontSize: 16,
                color: '#FF6600',
                textAlign: 'center'
              }}
              >查看记录
              </Text>
            </TouchableOpacity>
          }
            {showBtn2 && hasActive && <View style={{
              width: px2dp(125),
              height: px2dp(40),
              borderRadius: px2dp(20),
              backgroundColor: '#CCCCCC',
              justifyContent: 'center'
            }}
            >
              <Text style={styles.btnText}>已激活</Text>
                                      </View>}
          </View>
        </View>
      </ConfirmModal>
    )
  }

  _goToHistory = () => {
    sendClickPingback(GOODS_DETAIL_RPAGE, '', GOODS_DETAIL_MY_GAIN_RSEAT)
    this.showSuccessBoxAgin = false
    this.showBox = false
    this.goTo('MyGain')
    // this.openWeb(ORDERLIST[GET_ENV()])
  }

  // NavBar 右侧内容区域
  _renderRightView = () => {
    return (
      <View style={{height: 44, justifyContent: 'center', alignItems: 'flex-end'}}>
        <TouchableHighlight {...TOUCH_TEXT_ACTIVE} onPress={this._goToHistory} style={{marginRight: 15}}>
          <Text style={{color: '#666', fontSize: 14}} numberOfLines={1}>我的收获</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    const {goodsInfo} = this.state
    const name = !this.paramsProps.name ? '' : this.paramsProps.name
    const goodsName = !goodsInfo || !goodsInfo.name ? '' : goodsInfo.name
    const title = !name ? goodsName : name

    const vc = (
      <View style={styles.container}>
        <NavBar
          title={title}
          type="black"
          titleColor="#333333"
          backgroundColor="#ffffff"
          renderRightView={this._renderRightView}
          rightViewWidth={90}
          backPress={this.back}
        />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {this._renderNoticeList()}
          {this._renderSwiper()}
          {this._renderTopSection()}
          {this._renderGoodsDetail()}
          { !!goodsInfo && !!goodsInfo.itemId &&
          <Recommend goTo={this.goTo} product_id={goodsInfo.itemId} partner_code={goodsInfo.partnerCode} recommendPingBack={this.recommendPingBack} /> }
        </ScrollView>
        {this._renderBottomBtn()}
        {/* {this._rendershowExchangeBox()}
        {this._renderExecuteBox()} */}
        {/* _renderSuccessBox 产品说支付这块保留老的流程，不知道咋想的,统一新的流程可以废弃很多无用的代码 */}
        {this._renderSuccessBox()}
        {this._renderNewConvertModal()}
        {this._renderResultModal()}
      </View>);

    return (
      <WithSafeView style={{flex: 1, backgroundColor: '#ffffff'}} forceInset={{top: 'never', bottom: 'always'}}>
        {vc}
      </WithSafeView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topSection: {
    paddingHorizontal: 12,
    paddingBottom: 15,
    paddingTop: isIOS ? 15 : 0,
  },
  topImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height: 150,
  },
  centerBox: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between'
  },
  leftPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salesNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999'
  },
  secKillPrice: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  secKillPriceNum: {
    color: '#FF6600',
    fontSize: 22,
    fontFamily: 'PingFangSC-Medium',
  },
  secKillPriceText: {
    color: '#FF6600',
    fontSize: 22,
    fontFamily: 'PingFangSC-Medium',
  },
  originPriceWrap: {
    position: 'relative'
  },
  originPrice: {
    color: '#999',
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
    marginLeft: 4,
    textDecorationLine: 'line-through',
  },
  originPriceLine: {
    borderWidth: 0.5,
    borderColor: '#979797',
    position: 'relative',
    top: -8,
    right: 0
  },
  detailPrice: {
    color: '#FF8410',
    fontSize: 20,
    fontWeight: '600',
  },
  realPrice: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 15,
    textDecorationLine: 'line-through',
    textDecorationColor: '#999999',
  },
  separator: {
    borderBottomColor: '#EEEEEE',
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
    marginBottom: 5,
    fontWeight: 'bold'
  },
  detailInfo: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 20,
  },
  btnWrap: {
    width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
    flexDirection: 'row',
  },
  btnBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
    height: 40,
    borderRadius: 40
  },
  // btnText: {
  //   color: '#ffffff',
  //   fontSize: 19,
  //   textAlign: 'center',
  // },
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
    width,
    height: 60
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
    width: px2dp(300),
    height: px2dp(200),
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  shareModalBtnBox: {
    width: px2dp(260),
    height: px2dp(40),
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: px2dp(20),
    alignItems: 'center',
    marginBottom: -1,
    overflow: 'hidden',
  },
  pageBtnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: px2dp(120),
    height: px2dp(60),
    overflow: 'hidden',
  },
  pageBtnText: {
    color: '#FFFFFF',
    fontSize: px2dp(16),
    textAlign: 'center',
  },
  btnText: {
    fontSize: px2dp(16),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  boxTitle: {
    height: px2dp(50),
    width: px2dp(300),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    width: px2dp(44),
    height: px2dp(44),
    position: 'absolute',
    top: 0,
    right: 0
  },
  successBtnBox: {
    width: px2dp(265),
    height: px2dp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: px2dp(20)
  },
  footerLeft: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 7
  },
  footerText: {
    fontSize: px2dp(12),
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 16
  },
  loginText: {
    color: '#666',
    fontSize: px2dp(14)
  },
  swiperWrapper: {
    // height: IMG_HEIGHT
  },
  noticeInfoWrap: {
    position: 'absolute',
    left: 0,
    top: 8,
    zIndex: 9,
    // height: 20,
  },
  disabled: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 20,
    zIndex: 199,
    width: '100%',
    backgroundColor: 'transparent',
  },
  noticeSwiper: {
    height: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: px2dp(143),
    backgroundColor: 'rgba(0,0,0, .3)',
  },
  noticeText: {
    paddingHorizontal: 7,
    justifyContent: 'center',
    flex: 1
  },
  productName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
