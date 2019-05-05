/**
 * Created by liukai.
 * @date 2019/01/05
 * @description 勋章详情
 */

import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableOpacity} from 'react-native'
import ScrollTabView, {ScrollableTabBar} from '@iqiyi/rn-scroll-tab-view-beta'
import Animation from '@iqiyi/rn-lottie'
import {Text, View} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {Width as DEVICE_WIDTH, Height as DEVICE_HEIGHT, isLikeX} from '@iqiyi/rn-utils'
import Medal from '../components/integralMedalv2/Medal'
import WebImage from '../components/WebImage'
import PercentageCircle from '../components/PercentageCircle'
import {getCDNUrl, VIDEO_RECOMMEND_URL, DAN_MU_URL} from '../constants/configs'
import {isURL, roundFun, isPluginURL} from '../common/util'
import {
  DETAIL_MODAL_BLOCK,
  getMedalPingbackById,
  sendMainBlockPingback,
  sendMainPagePingback,
  GO_SHOPPING_MALL_CLICK,
  sendMainClickPingback,
  SHOPPING_MASTER_MEDAL_DETAIL_BLOCK,
  SHOPPING_MASTER_MEDAL_DETAIL_CLICK
} from '../components/integralMedalv2/pingback';
import {getMedalDetail, getProcess, fetchRegionCount} from '../model/integralMedalv2'
import {hideLoading, showToast} from '../common/QYNativeBridge'
import LoadingPage from '../components/LoadingPage'
import {NetError} from '../components/shoppingMall/EmptyPage'
import BasePage from '../components/BasePage';


const NATIVE_URL_MAP = {
  danmu: DAN_MU_URL,
  shipin: VIDEO_RECOMMEND_URL,
}
const CIRCLE_TYPE = 'pure'
const LIGHT_TITLE_BG = ['b', 'o', 'p']
const GRAY_TITLE_BG = 'g'

const PAGE_BG_COLOR = [
  {
    startColor: '#6AABFF',
    endColor: '#006CF6',
    buttonColor: 'rgba(255,255,255,0.30)'
  },
  {
    startColor: '#FFB675',
    endColor: '#FD534A',
    buttonColor: 'rgba(255,255,255,0.30)'
  },
  {
    startColor: '#B98FFF',
    endColor: '#7F19E0',
    buttonColor: 'rgba(255,255,255,0.30)'
  }
]
// 进度条不支持纯色背景
const INNER_COLOR = [
  {
    innerColor: '#2281F9',
    borderColor: '#A2CBFF'
  },
  {
    innerColor: '#FE6D56',
    borderColor: '#FFCDC2'
  },
  {
    innerColor: '#8F3AE8',
    borderColor: '#D2A7FF'
  }]
// 灰色背景图
const INNER_GRAY_COLOR = {
    innerColor: '#B2B2C1',
    borderColor: '#F0F2FF'
}
// 灰色剩余进度条颜色
const GRAY_LAST_BORDER_COLOR = '#cacad4'

const MEDAL_CONTENT_CONTAINER = {
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 0,
  alignItems: 'center',
  width: 310,
  height: 305,
}
const GRAY_BG = {
  startColor: '#D2D3DA',
  endColor: '#A4A4B6'
}
const getSource = level => getCDNUrl(`json/new_medal_show_15_v${level}.zip`)

export default class extends BasePage {

  pageName = 'medalRN';

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      goTo: () => null,
      currentPage: 0,
      loading: true,
      pageBgColor: GRAY_BG,
      innerColor: INNER_GRAY_COLOR,
      netInfo: 0, // 0 表示正常，1表示断网，2表示有网但是错误
      regionCount: null, // 地域人数
      regionList: [], // 地域人数列表
    }
    try {
      this.init()
    } catch(e) {
      showToast('没有对应的勋章详情')
      this.back()
    }
  }

  init =() => {
    const {channelCode} = this.props.navigation.state.params || this.props.screenProps
    this._getMedalDetail(channelCode)
    this._fetchRegionCount(channelCode)
  }
  // 获取勋章地域人数
  _fetchRegionCount(channelCode) {
    fetchRegionCount().then((data) => {
      const obj = this._handleRegionCountRes(data, channelCode)
      this.setState({regionCount: obj.total, regionList: data})
    }).catch()
  }
  _handleRegionCountRes(data = [], channelCode) {
    const {province} = this.props.navigation.state.params || this.props.screenProps
    let regionObj = {}
    // eslint-disable-next-line array-callback-return
    data && data.find((v) => {
      const values = v.values || []
      if(v.province === province) {
         const obj = values.find((l) => {
          return l.channelCode === channelCode
         })
         regionObj = obj || {}
      }
    })
    return regionObj
  }
  _handleMedalRankTotal() {
    // const {medalRank: medalTotal} = this.props.navigation.state.params
    const {regionCount: medalTotal} = this.state
    const region = this._getRegion()
    if(medalTotal) {
      if(medalTotal < 100000) return `${region}地区已有${medalTotal}人获得`
      if(medalTotal < 99990000 && medalTotal >= 100000) return `${region}地区已有${roundFun(medalTotal / 10000, 0)}万人获得`
      if(medalTotal >= 99999999) return `${region}地区已有9999万人获得`
    }
    return false
  }
  // 统计到省、直辖市
  _getRegion() {
    const citys = ['北京', '上海', '天津', '深圳']
    const {province, city} = this.props.navigation.state.params
    if(citys.includes(city)) return city
    return `${province}`
  }
  _getMedalDetail(channelCode) {
    return getMedalDetail(channelCode)
      .then(({details, source, initialPage}) => {
        // 获取进度条信息
        if(source) {
          getProcess(source, details)
            .then((medalDetails) => {
              this.hideNativeLoading()
              const {userStatus} = medalDetails[initialPage]
              this.setState({
                loading: false,
                list: medalDetails,
                initialPage,
                currentPage: initialPage,
                pageBgColor: userStatus === 0 ? PAGE_BG_COLOR[initialPage] : GRAY_BG,
                innerColor: userStatus === 0 ? INNER_COLOR[initialPage] : INNER_GRAY_COLOR,
                netInfo: 0
              })
            }, () => {
              this.hideNativeLoading()
              this.setState({
                loading: false,
                netInfo: 2
              })
            })
        } else {
          const {userStatus} = details[initialPage]
          this.setState({
            loading: false,
            list: details,
            initialPage,
            pageBgColor: userStatus === 0 ? PAGE_BG_COLOR[initialPage] : GRAY_BG,
            innerColor: userStatus === 0 ? INNER_COLOR[initialPage] : INNER_GRAY_COLOR,
            netInfo: 0
          })
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
          netInfo: 2
        })
      })
  }

  onChangeTab(currentPage) {
    const {id, userStatus, _detail: {channelCode} = {}} = this.state.list[currentPage]
    // 购物达人
    if(channelCode.includes('dianshang_dingdan')) {
      sendMainBlockPingback(SHOPPING_MASTER_MEDAL_DETAIL_BLOCK)
      sendMainClickPingback(SHOPPING_MASTER_MEDAL_DETAIL_BLOCK, `${SHOPPING_MASTER_MEDAL_DETAIL_CLICK}${currentPage + 1}`)
    }
    const obj = this._handleRegionCountRes(this.state.regionList, channelCode)
    sendMainBlockPingback(DETAIL_MODAL_BLOCK, {
      rseat: getMedalPingbackById(id, 'detail'),
    })
    this.setState({
      pageBgColor: userStatus === 0 ? PAGE_BG_COLOR[currentPage] : GRAY_BG,
      currentPage,
      innerColor: userStatus === 0 ? INNER_COLOR[currentPage] : INNER_GRAY_COLOR,
      regionCount: obj.total
    })
  }

  onButtonPress(i) {
    // 购物
    if(i.id.includes('dianshang_dingdan')) {
      sendMainClickPingback(SHOPPING_MASTER_MEDAL_DETAIL_BLOCK, GO_SHOPPING_MALL_CLICK)
    }
    if(isURL(i.bottomUrl) || isPluginURL(i.bottomUrl)) {
      this.openWeb(i.bottomUrl)
    } else if(i.extMaps) { // native跳转
      const source = i.extMaps.medalSource
      // console.log(source, NATIVE_URL_MAP[source])
      if(NATIVE_URL_MAP[source]) {
        this.openWeb(NATIVE_URL_MAP[source])
      }
      if(source === 'dianshang') {
        this.goTo('ShoppingMall')
      }
    }
  }

  _renderTabBar() {
    return (
      <ScrollableTabBar
        style={styles.menuTab}
        tabsContainerStyle={styles.menuContainer}
        underlineStyle={styles.tabUnderline}
        underlineWidth={0}
        renderTab={(...args) => this._renderScrollableTab(...args)}
      />
    )
  }

  _renderScrollableTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const {currentPage} = this.state
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={`_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
      >
        <View style={styles.menuTabItem}>
          <View style={[styles.medalCircle, {backgroundColor: currentPage === page ? '#fff' : 'rgba(255,255,255,0.2)'}]}>
            <Medal size={20} url={this.state.list[page].url} showBackground={false}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderDiff() {
    const {list, initialPage, innerColor, netInfo} = this.state
    const {hasGeo} = this.props.navigation.state.params
    const medalRankText = this._handleMedalRankTotal()
    if(!list || list.length < 1 || netInfo !== 0) {
      return (
        <View style={{width: DEVICE_WIDTH, height: DEVICE_HEIGHT, backgroundColor: '#fff', justifyContent: 'center', paddingTop: 100}}>
          <NetError netInfo={netInfo} retry={this.init}/>
        </View>
      )
    }
    if(list.length === 1) {
      return <DetailBody item={list[0]} hasGeo={hasGeo} medalRank={medalRankText} style={styles.simpleLayout}/>
    }
    return (
      <ScrollTabView
        scrollWithoutAnimation={true}
        initialPage={initialPage}
        renderTabBar={() => this._renderTabBar()}
        onChangeTab={({i}) => this.onChangeTab(i)}
        style={{backgroundColor: 'transparent'}}
      >
        {list.map((item, index) => (
          <DetailBody key={item.id} index={index} item={item} onButtonPress={() => this.onButtonPress(item)} innerColor={innerColor} hasGeo={hasGeo} medalRank={medalRankText} />
        ))}
      </ScrollTabView>
    )
  }

  componentDidMount() {
    this.sendFistShoppingBlock()
    sendMainPagePingback();
    hideLoading()
  }
  sendFistShoppingBlock() {
    const {channelCode} = this.props.navigation.state.params
    if(channelCode.includes('dianshang_dingdan')) {
      sendMainBlockPingback(SHOPPING_MASTER_MEDAL_DETAIL_BLOCK)
    }
  }
  render() {
    const {pageBgColor, loading, netInfo} = this.state
    if(loading) {
      return <LoadingPage />
    }
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          start={{x: 1, y: 0}}
          end={{x: 1, y: 1}}
          colors={[pageBgColor.startColor, pageBgColor.endColor]}
        >
            {this.renderDiff()}
            <TouchableOpacity style={styles.modalClose} activeOpacity={1} onPress={this.back}>
              <WebImage style={styles.modalCloseIcon} name={netInfo === 0 ? 'integralmedal/modal_close' : 'integralmedal/modal_close_black'}/>
            </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }
}

const DetailBody = ({item, style, index, innerColor, onButtonPress, hasGeo, medalRank}) => (
  <View style={StyleSheet.flatten([styles.medalLayout, style])}>
    <View style={styles.medalContainer}>
      {(item.userStatus === 0 && item.star > 1) && (
        <View style={styles.animationWrapper}>
          <Animation
            style={styles.animation}
            ref={el => !!el && el.play()}
            url={getSource(item.star)}
            loop={false}
          />
        </View>
      )}
      <Medal url={item.url} size={149} containerStyle={MEDAL_CONTENT_CONTAINER}/>
      <View style={styles.medalWrapper}>
        {item.showSimpleConent
          ? <SimpleContent detail={item}/>
          : <CommonContent detail={item} index={index} innerColor={innerColor}/>
        }
      </View>
    </View>
    {
      item.userStatus !== 0 && item.bottomType === 'button' &&
      <TouchableOpacity activeOpacity={1} onPress={onButtonPress} style={[styles.shareButton, {backgroundColor: '#ffffff'}]}>
        <Text style={{color: '#333', fontSize: 16, fontWeight: '700'}}>{item.bottomText}</Text>
      </TouchableOpacity>
    }
    {
      item.userStatus === 1 && item.bottomType === 'text' &&
      <View style={[styles.shareButton, {backgroundColor: 'transparent'}]}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>{item.bottomText}</Text>
      </View>
    }
    {/* 未获取勋章展示获取底部人数 */}
    {
      [1, 2].includes(item.userStatus) && hasGeo && medalRank ? <BottomInfo medalRank={medalRank} /> : null
    }
    <View style={styles.medalBottomWrapper}>
      {[0].includes(item.userStatus) && item.bottomType === 'text' && <Text style={styles.bottomText}>{item.bottomText}</Text>}
    </View>
  </View>
)
const BottomInfo = (props) => {

  return (
    <View style={styles.medalBottomWrapper}>
      <Text style={styles.bottomText}>{props.medalRank}</Text>
    </View>

  )
}
const SimpleContent = ({detail: {title, extMaps, description, userStatus}}) => (
  <View style={{alignItems: 'center', paddingTop: 22.5}}>
    <TitleWithBg index={0} title={title} userStatus={userStatus} star={0}/>
    <Text
      style={[styles.content, {
        textAlign: 'center',
        color: '#fff',
        marginTop: -10,
        fontSize: 16
      }]}
    >
      “{extMaps.interestDescription}”
    </Text>
    <View style={[styles.mainContentWrapper, {marginTop: 50}]}>
      <Text style={[styles.content, {color: '#fff', fontSize: 13}]}>{description}</Text>
    </View>
  </View>
)
SimpleContent.propTypes = {
  detail: PropTypes.object,
}
SimpleContent.defaultProps = {
  detail: {
    title: '',
    description: '',
    extMaps: {
      interestDescription: ''
    }
  }
}

const CommonContent = ({detail, index, innerColor}) => (
  <View style={{alignItems: 'center', paddingTop: 22.5}}>
    <TitleWithBg index={index} title={detail.title} userStatus={detail.userStatus} star={detail.star}/>
    <View style={styles.contentWrapper}>
      <View style={styles.contentInnerWrapper}>
        {detail.content.map(i => <Text key={i} style={styles.content}>{i}</Text>)}
      </View>
    </View>
    <View style={[styles.mainContentWrapper, {height: 96 + 15}]}>
      {detail.percentageList.map(i => (
        <View key={i.id} style={styles.percentageItem}>
          <PercentageCircle
            type={CIRCLE_TYPE}
            percent={i.percent}
            color={innerColor.borderColor}
            // bgcolor={innerColor.innerColor === INNER_GRAY_COLOR.innerColor ? GRAY_LAST_BORDER_COLOR : 'transparent'}
            bgcolor={GRAY_LAST_BORDER_COLOR}
            innerColor={innerColor.innerColor}
          >
            <Text style={styles.percentageText}>{i.text}</Text>
          </PercentageCircle>
          <Text style={styles.percentageLabel}>{i.title}</Text>
        </View>
      ))}
    </View>
  </View>
)
CommonContent.propTypes = {
  detail: PropTypes.object,
}
CommonContent.defaultProps = {
  detail: {
    content: [],
    percentageList: [],
  }
}

// title 带背景图
const TitleWithBg = ({index, title, userStatus, star}) => {
  const imageLetter = userStatus === 0 ? LIGHT_TITLE_BG[index] : GRAY_TITLE_BG
  return (
    <View style={styles.titleBg}>
      <WebImage name={`integralmedal/${imageLetter}_left`} style={styles.lefttb}/>
      <WebImage name={`integralmedal/${imageLetter}_right`} style={styles.righttb}/>
      <WebImage name={`integralmedal/${imageLetter}_center`} style={styles.centertb}>
        <Text style={styles.title}>{title}</Text>
      </WebImage>
      <MedalStar star={star} userStatus={userStatus}/>
    </View>
  )
}

/**
 * 勋章等级
 * @param star {0, 1, 2, 3} // 等级，值为0不显示，值为1显示1颗星，值为2显示2颗星，值为3显示3颗星
 * @param size {number} // ✨尺寸
 * @param spacing {number} // ✨间距
 * @returns {null|React.Component}
 */
const MedalStar = ({star, userStatus}) => {
  if(!star) {
    return null
  }
  const starName = userStatus === 0 ? 'light_star' : 'gray_star'
  return (
    <View style={styles.starContainer}>
      {[...Array(star)].map((v, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <WebImage key={index} name={`integralmedal/${starName}`} style={{width: 37, height: 37}}/>
      ))}
    </View>
  )
}

// const TAB_WIDTH = (DEVICE_WIDTH - 180) / 3
const TAB_WIDTH = 40
const TAB_HEIGHT = isLikeX() ? 100 : 70
const CONTENT_WIDTH = 310
const INNER_CONTENT_WIDTH = 305 - (20 * 2)

const styles = StyleSheet.create({
  menuTab: {
    height: TAB_HEIGHT,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  tabUnderline: {
    width: 0,
    height: 0,
  },
  modalClose: {
    position: 'absolute',
    height: 44,
    width: 44,
    left: 10,
    top: isLikeX() ? 55 : 25
  },
  modalCloseIcon: {
    height: 44,
    width: 44,
  },
  animationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  animation: {
    width: CONTENT_WIDTH,
    height: 1.1 * CONTENT_WIDTH
  },
  medalCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center'
  },
  // 菜单子项
  menuTabItem: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: TAB_WIDTH,
    paddingLeft: 0,
    paddingRight: 0,
  },

  simpleLayout: {
    width: DEVICE_WIDTH,
    marginTop: TAB_HEIGHT,
    paddingBottom: 0,
  },
  medalLayout: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 28,
    // paddingTop: isLikeX() ? 40 : 0,
  },
  medalContainer: {
    alignItems: 'center',
    width: CONTENT_WIDTH,
    paddingTop: 67.5,
  },
  medalWrapper: {
    zIndex: 0,
    alignItems: 'center',
    width: CONTENT_WIDTH,
    // height: 380,
    paddingTop: 106.5,
    backgroundColor: 'transparent',
  },
  modalBg: {
    position: 'absolute',
    right: 0,
    zIndex: 0,
  },
  title: {
    lineHeight: 21,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
  },
  content: {
    lineHeight: 18.5,
    textAlign: 'left',
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 5
  },
  starWrapper: {
    alignItems: 'center',
    marginTop: 7.5,
    marginBottom: 15,
  },
  contentWrapper: {
    alignItems: 'center',
    marginTop: 23.3,
    width: 305
  },
  contentInnerWrapper: {
    // width: 305,
    alignItems: 'flex-start',
    height: 47,
    justifyContent: 'center'
  },
  mainContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: INNER_CONTENT_WIDTH,
    marginTop: 22,
  },
  percentageItem: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  percentageLabel: {
    width: '100%',
    lineHeight: 16,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    opacity: 0.7
  },
  percentageText: {
    lineHeight: 23.5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  medalBottomWrapper: {
    alignItems: 'center',
    width: CONTENT_WIDTH,
    marginTop: 30,
    position: 'absolute',
    bottom: isLikeX() ? 30 : 0
  },
  bottomText: {
    lineHeight: 16.5,
    paddingBottom: 15,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 33.5,
    color: '#fff',
    opacity: 0.7
  },

  titleBg: {
    height: 69,
    width: 190,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 13.5,
  },
  lefttb: {
    width: 37,
    height: 26.5
  },
  righttb: {
    width: 37,
    height: 26.5
  },
  centertb: {
    width: 149,
    height: 31.5,
    position: 'absolute',
    top: 0,
    left: 20.5,
    justifyContent: 'center'
  },
  starContainer: {
    flexDirection: 'row',
    height: 37,
    position: 'absolute',
    top: 32,
    width: 149,
    left: 20.5,
    justifyContent: 'center'
  },
  shareButton: {
    height: 40,
    width: 305,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
