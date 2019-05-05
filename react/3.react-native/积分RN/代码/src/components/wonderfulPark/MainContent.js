/**
 * Created by liuzhimeng.
 * @date 2018-12-10
 * @description 奇妙乐园页面内容
 */
import React, {Component} from 'react'
import {DeviceEventEmitter, ScrollView, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

import {Text, View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, isIOS, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import DefaultNavBar from '../DefaultNavBar'
import {CustomEmptyPage} from '../EmptyPage'
import UserInfo from './UserInfo'
import FocusMap from './FocusMap'
import Announcement from './Announcement'
import DailyTask, {RuleModal} from './DailyTasks'
import ModalGroup, {filterModalState} from './ModalGroup'
import MallAdv, {WelfareEnter} from './MallAdv'
import HotExchange from './HotExchange'
import TreasureList from './TreasureList'
import Auction from '../wonderfulPark/Auction'
import TopicPK from './TopicPK'
import Answer from './answer'
import GameList from './ParkGames'

import {getAdvStorageAsync} from './AdvModal'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../common/asyncStorage'
import {hideLoading} from '../../common/QYNativeBridge'
import {filterExts} from '../../common/util'
import {getAuctionData, getDfpScore, getFLowerData, getTotalData, getUserInfoData} from '../../model/wonderfulPark'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'
import {GET_ENV, QiangPaiURL} from '../../constants/configs'
import {PARK_PAGE} from './pingback'

// 记录养花种子未登录弹出次数
const FLOWER_SEED_MODAL_ONCE = 'FLOWER_SEED_MODAL_ONCE'

function MainContainer({style, children, ...left}) {
  return isIOS
    ? <ScrollView style={style} {...left}>{children}</ScrollView>
    : <View style={style}>{children}</View>
}

export default class ParkContent extends Component {
  static propTypes = {
    screenStatus: PropTypes.string,
    handlePanResponderChange: PropTypes.func,
    disablePanResponder: PropTypes.func,
    updateOffsetTop: PropTypes.func,
  }

  static defaultProps = {
    screenStatus: 'start',
    handlePanResponderChange: global.NOOP,
    disablePanResponder: global.NOOP,
    updateOffsetTop: global.NOOP,
  }

  constructor(props) {
    super(props)
    this.state = {
      emptyShowName: 'loading', // 页面初始化状态
      isLogin: global.USER_INFO.isLogin,
      isVIP: global.USER_INFO.isVIP,
      userId: global.USER_INFO.userId,
      userIcon: global.USER_INFO.userIcon || 'default_icon',
      banner: [], // 轮播图数据
      games: [], // 益智游戏数据
      legaoMessage: [], // 滚动消息列表
      showAuction: false, // 竞拍开关
      auctionCode: 'vip',
      adv: [], // 运营弹框数据,
      lastScore: 0, // 设备积分值

      welfareUrl: '',
      welfareVisible: false,

      isRuleVisible: false,
      ruleMode: 'default',
      ruleContent: {},

      auctionData: {},

      scrollEnabled: false,

      screenMode: 'start',
    }

    this.listener = null

    this.dailyTaskRef = React.createRef()
    this.modalGroupRef = React.createRef()

    this.modalGroupData = filterModalState()
  }

  componentDidMount() {
    hideLoading()
    this.props.disablePanResponder(true)
    this.initData()
      .then(() => {
        if(this.props.screenStatus !== 'bottomEnd') {
          this.showModalInGroup('signOrder')
        } else {
          this.props.disablePanResponder(false)
        }
      })
      .catch(() => {
        this.props.disablePanResponder(false)
      })
    this.listenLogin()
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomEmptyPage showName={this.state.emptyShowName} containerStyle={{height: DEVICE_HEIGHT - 250}} retry={this._retry}>
          <MainContainer
            style={{flex: 1}}
            scrollEnabled={this.state.scrollEnabled}
            onScroll={this._onScroll}
            scrollEventThrottle={16}
            bounces={false}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
          >
            {/* 顶部用户信息栏 */}
            <UserInfo
              goTo={this.props.goTo}
              openWeb={this.props.openWeb}
              isLogin={this.state.isLogin}
              userIcon={this.state.userIcon}
              totalScore={this.props.totalScore}
            />
            {/* banner图 */}
            <FocusMap goTo={this.props.goTo} openWeb={this.props.openWeb} list={this.state.banner} isLogin={this.state.isLogin} totalScore={this.props.totalScore}/>
            {/* 乐园公告 */}
            {!!this.state.legaoMessage.length && <Announcement list={this.state.legaoMessage}/>}
            {/* 今日任务 */}
            <DailyTask
              screenProps={this.props.screenProps}
              goTo={this.props.goTo}
              openWeb={this.props.openWeb}
              ref={this.dailyTaskRef}
              isLogin={this.state.isLogin}
              isVIP={this.state.isVIP}
              userId={this.state.userId}
              showRule={this.showRuleModal}
              refreshDailyTask={this._refreshDailyTask}
            />
            {/* 话题pk */}
            <TopicPK isLogin={this.state.isLogin} goTo={this.props.goTo} totalScore={this.props.totalScore}/>
            {/* 什么值得兑 */}
            <MallAdv openWeb={this.props.openWeb} showWelfare={this.showWelfare}/>
            {/* 问答 */}
            <Answer goTo={this.props.goTo} openWeb={this.props.openWeb} setScrollEnabled={isIOS ? this.setScrollEnabled : this.props.setAndroidScrollEnabled}/>
            {/* 热门兑换 */}
            <HotExchange goTo={this.props.goTo} openWeb={this.props.openWeb}/>
            {/* 积分竞拍 */}
            {!!this.state.showAuction && <Auction auctionCode={this.state.auctionCode} openWeb={this.props.openWeb}/>}
            {/* 积分夺宝 */}
            <TreasureList totalScore={this.props.totalScore} setTotalScore={this.props.setTotalScore} goTo={this.props.goTo} openWeb={this.props.openWeb}/>
            {/* 公益游戏 */}
            <GameList openWeb={this.props.openWeb} isLogin={this.state.isLogin} totalScore={this.props.totalScore} list={this.state.games}/>
            {/* 底部信息 */}
            {this._renderBottom()}
          </MainContainer>
        </CustomEmptyPage>
        {/* 福利页入口 */}
        <WelfareEnter openWeb={this.props.openWeb} isVisible={this.state.welfareVisible} url={this.state.welfareUrl} onPress={() => this.setState({welfareVisible: false})}/>
        {/* 规则弹窗 */}
        <RuleModal mode={this.state.ruleMode} isVisible={this.state.isRuleVisible} content={this.state.ruleContent} onPress={this.hideRuleModal}/>
        {/* 连续弹窗组 */}
        <ModalGroup
          openWeb={this.props.openWeb}
          handlePanResponderChange={this.props.handlePanResponderChange}
          ref={this.modalGroupRef}
          isLogin={this.state.isLogin}
          lastScore={this.state.lastScore}
          adv={this.state.adv}
          auctionData={this.state.auctionData}
          auctionCode={this.state.auctionCode}
          disablePanResponder={this.props.disablePanResponder}
        />
      </View>
    )
  }

  _renderBottom() {
    return (
      <View style={styles.bottom}>
        <View style={styles.line}/>
        <Text style={styles.bottomText}>奇妙乐园商务合作：tp_park@qiyi.com</Text>
        <View style={styles.line}/>
      </View>
    )
  }

  _onScroll = ({nativeEvent: {contentOffset: {y}}}) => {
    this.props.updateOffsetTop(y)
  }

  _refreshDailyTask = () => {
    try {
      const {refreshDailyTask} = this.props.navigation.state && this.props.navigation.state.params
      refreshDailyTask && refreshDailyTask()
    } catch(e) {
      return false
    }
  }

  setScrollEnabled = (value) => {
    this.setState({scrollEnabled: value})
  }

  // 生成弹窗（不自动弹出）
  setModalGroupState = (key, status) => {
    this.modalGroupRef.current &&
    this.modalGroupRef.current.setModalState(key, status)
  }

  // 展示弹窗（如果存在弹窗则会弹窗，不存在则不弹出）
  showModalInGroup = (key) => {
    this.modalGroupRef.current &&
    this.modalGroupRef.current.showModal(key)
    sendBlockPingback(PARK_PAGE, this.modalGroupData[key].blockPb)
  }

  // 抢拍首页
  goToAuction = () => {
    sendClickPingback('paradise', '300102', 'goauction')
    const url = `${QiangPaiURL[GET_ENV()]}?code=${encodeURIComponent(this.state.auctionCode)}&from=paradise`
    this.props.openWeb(url)
  }

  // 设置运营广告弹窗
  _setAdvState = async (adv) => {
    const times = parseInt(filterExts(adv[0].key_value_pair, 'times'), 10) || 0
    try {
      const hasTimes = await getAdvStorageAsync()
      if(times > 0 && hasTimes < times) {
        this.setModalGroupState('advOrder', true)
      }
    } catch(e) {
      return false
    }
  }

  // 更新用户信息
  _updateUserInfo() {
    this.setState({
      isLogin: global.USER_INFO.isLogin,
      isVIP: global.USER_INFO.isVIP,
      userId: global.USER_INFO.userId,
      userIcon: global.USER_INFO.userIcon || 'default_icon',
    })
  }

  // 获取用户积分
  _getUserInfoData = async () => {
    if(!global.USER_INFO.isLogin) {
      return false
    }
    const {totalScore} = await getUserInfoData()
    this.setState({emptyShowName: null})
    if(totalScore > -1) {
      this.props.setTotalScore(totalScore)
    }
  }

  // 获取设备积分
  _getScore = async () => {
    if(global.USER_INFO.isLogin) return false
    const {totalScore} = await getDfpScore()
    if(totalScore > -1) {
      this.props.setTotalScore(totalScore)
    }
  }

  // 获取页面总数据
  _getTotalData = async () => {
    try {
      const {banner, showAuction, auctionCode, adv, legaoMessage, games} = await getTotalData()
      if(adv.length) {
        this._setAdvState(adv)
        this.setState({adv})
      }
      sendBlockPingback('paradise', '300102')
      this.setState({
        banner,
        legaoMessage,
        showAuction,
        auctionCode,
        games,
        emptyShowName: null,
      })
    } catch(e) {
      this.setState({emptyShowName: 'networkError'})
    }
  }

  // 获取抢拍弹框
  _getAuctionData = async () => {
    const {needNotice, ...auctionData} = await getAuctionData()
    this.setState({auctionData, emptyShowName: null}, () => {
      this.setModalGroupState('auctionOrder', !!needNotice)
    })
  }

  // 设置花儿种子弹窗
  _getFLowerData = async () => {
    if(this.state.isLogin) {
      const {newborn = false} = await getFLowerData()
      // 新玩家 用户未种过种子
      if(newborn) {
        this.setModalGroupState('seedOrder', true)
      }
    } else {
      // 未登录只弹一次养花种子
      const onceValue = await getAsyncStoragePromise(FLOWER_SEED_MODAL_ONCE)
      if(!onceValue) {
        saveAsyncStoragePromise(FLOWER_SEED_MODAL_ONCE, 1)
        this.setModalGroupState('seedOrder', true)
      }
    }
  }

  _retry = () => {
    this.setState({emptyShowName: 'loading'}, () => {
      this.initData()
    })
  }

  updateScreenMode = (screenMode) => {
    this.setState({screenMode})
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', this._loginChange)
  }

  _loginChange = (isLogin) => {
    if(isLogin) {
      this.setState({isLogin}, () => {
        this.update().then(() => {
          // 登录完成，乐园页面下重新呼出弹窗
          try {
            const {routes} = this.props.navigation.dangerouslyGetParent().state
            if(routes[routes.length - 1].routeName === 'IntegralPark' && this.state.screenMode !== 'bottomEnd') {
              this.showModalInGroup('signOrder')
            }
          } catch(e) {} // eslint-disable-line
        })
      })
    }
  }

  // todo: 因为无法判断是否来自登录页，所以如果是从登录页返回时，数据会更新两次
  onShow() {
    this.update()
  }

  initData = () => {
    this._updateUserInfo()
    this._getScore()
    this._getUserInfoData()
    return Promise.all([
      this._getTotalData(),
      this._getAuctionData(),
      this._getFLowerData(),
    ])
  }

  update() {
    this.updateTaskList()
    return this.initData()
  }

  // 显示福利页入口
  showWelfare = (url) => {
    this.setState({
      welfareUrl: url,
      welfareVisible: true,
    })
  }

  showRuleModal = (ruleMode, ruleContent) => {
    this.setState({isRuleVisible: true, ruleMode, ruleContent})
    this.props.disablePanResponder(true)
  }

  hideRuleModal = () => {
    this.setState({isRuleVisible: false})
    this.props.disablePanResponder(false)
  }

  updateTaskList = () => {
    this.dailyTaskRef.current && this.dailyTaskRef.current.getTaskData()
  }
}

export const ParkNavBar = ({type, back}) => {
  const titleColor = type === 'black' ? '#333333' : '#ffffff'
  return (
    <DefaultNavBar
      title="奇妙乐园"
      type={type}
      titleColor={titleColor}
      backgroundColor="transparent"
      borderBottomColor="transparent"
      backPress={back}
    />
  )
}
ParkNavBar.defaultProps = {
  type: 'black',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
    backgroundColor: '#ffffff',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 25,
  },
  line: {
    width: 50,
    height: 1,
    backgroundColor: '#DDDDDD',
    borderRadius: 1.5,
  },
  bottomText: {
    paddingHorizontal: 10,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
  },
})
