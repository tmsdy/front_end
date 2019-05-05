/**
 * Created by liuzhimeng.
 * @date 2019-04-07
 * @description 积分中心
 */

import React from 'react'
import {ScrollView, DeviceEventEmitter, StatusBar} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, Height as DEVICE_HEIGHT, isIOS} from '@iqiyi/rn-utils'
import QYPullToRefreshLayout from '@iqiyi/rn-refresh-view'
import LinearGradient from '@iqiyi/rn-gradient-view'

import BasePage from '../components/BasePage'
import BaseStyleSheet from '../common/BaseStyleSheet'
import BaseConfirmModal, {BaseConfirmModalConfig} from '../components/BaseConfirmModal'
import WithSafeView from '../components/WithSafeView'

import NavBar from '../components/homePage/NavBar'
import SwiperActivity from '../components/homePage/SwiperActivity'
import RefreshIcon from '../components/RefreshIcon'
// eslint-disable-next-line import/no-cycle
import MenuBar from '../components/homePage/MenuBar'
import ProductSection from '../components/homePage/ProductSection'
import TopContainer from '../components/homePage/TopContainer'
import TaskListSection from '../components/homePage/TaskListSection'
import EnvChange from '../components/EnvChange'

import Sign from '../components/homePage/modal/Sign'
import Adv from '../components/homePage/modal/Adv'
import DeviceScore from '../components/homePage/modal/DeviceScore'

import {setTotalScore, changeTotalScore} from '../actions/TotalScoreActions'
import ReduxUtil from '../common/ReduxUtil'
import {fetchUserInfo} from '../api'
import {fetchQiPuData, askToSignIn, fetchDeviceScoreInfo} from '../model/homePage'
import {QipuDataItem, FetchQiPuData} from '../typings/apis/homePage'
import {sendPagePingback} from '../common/pingback'

interface IntegralCenterState {
  lastPeriodScore: number;
  menuList: QipuDataItem[];
  advList: QipuDataItem[];
  productList: any[];
}

@(connect(
  (state) => {
    return {
      totalScore: state.scoreInfo.totalScore || 0,
    }
  },
  (dispatch) => bindActionCreators({
    setTotalScore,
    changeTotalScore,
  }, dispatch),
  null,
  {withRef: true}
) as any)
export default class IntegralCenter extends BasePage<{}, IntegralCenterState> {
  pageName = 'homeRN'

  private onRequesting: boolean;

  constructor(props: object) {
    super(props)

    this.state = {
      isLogin: global.USER_INFO.isLogin,
      lastPeriodScore: 0,
      menuList: [],
      advList: [],
      productList: [],
    }

    this.onRequesting = false

    this.refRefreshLayout = ReduxUtil.createRef()
    this.refConfirmModal = ReduxUtil.createRef()
    this.refSwiperCard = ReduxUtil.createRef()
    this.refScroll = ReduxUtil.createRef()
  }

  componentDidMount() {
    sendPagePingback('pointcenter')
    if(isIOS) {
      StatusBar.setBarStyle('dark-content', true)
    }

    this.hideNativeLoading()

    this.fetchInitData()

    if(!global.USER_INFO.isLogin) {
      this.listenLogin()
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {lastPeriodScore, isLogin} = this.state

    return (
      <View style={styles.container}>
        {/* 顶部背景色 */}
        <View style={styles.backgroundTop} />
        {/* 顶部标题栏 */}
        <NavBar onBack={this.back} goTo={this.navigate} />
        <View style={{flex: 1}}>
          <QYPullToRefreshLayout
            ref={this.refRefreshLayout}
            orientation={0}
            enabledPullDown={true}
            renderHeader={() => <RefreshIcon color="#ffffff" />}
            onRefresh={this.onRefresh}
          >
            <ScrollView ref={this.refScroll} showsVerticalScrollIndicator={false}>
              <WithSafeView style={{width: '100%', backgroundColor: '#ffffff'}}>
                {/* 顶部渐变色 */}
                <LinearGradient
                  style={styles.backgroundScroll}
                  colors={['#FFD500', '#ffffff']}
                />
                {/* 个人信息栏 && 通知公告 */}
                <TopContainer
                  lastPeriodScore={lastPeriodScore}
                  openWeb={this.openWeb}
                  navigate={this.navigate}
                  isLogin={isLogin}
                />
                {/* 导航菜单栏 */}
                <MenuBar
                  list={this.state.menuList}
                  totalScore={this.props.totalScore}
                  openWeb={this.openWeb}
                  navigate={this.navigate}
                />
                {/* 每日任务 */}
                <TaskListSection
                  openWeb={this.openWeb}
                  goTo={this.navigate}
                  showConfirmModal={this.showConfirmModal}
                  hideConfirmModal={this.hideConfirmModal}
                />
                {/* TODO:解决UIManager.measure安卓获取不到y值；或者有好的方案请告知下 */}
                <SwiperActivity
                  ref={this.refSwiperCard}
                  totalScore={this.props.totalScore}
                  goTo={this.navigate}
                  openWeb={this.openWeb}
                  refScroll={this.refScroll}
                  screenProps={this.props.screenProps}
                />
                {/* 秒杀 && 其他商品列表组 */}
                <ProductSection openWeb={this.openWeb} goTo={this.navigate} />
                <EnvChange />
              </WithSafeView>
            </ScrollView>
          </QYPullToRefreshLayout>
        </View>

        <View style={styles.pageRangeBody} pointerEvents="box-none">
          {/* 弹框容器 */}
          <BaseConfirmModal ref={this.refConfirmModal} />
        </View>

      </View>
    )
  }

  onShow() {
    this.fetchInitData()
  }

  // 监听登录事件
  listenLogin = () => {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      if(isLogin) {
        this.setState({isLogin})
        this.fetchInitData()
        this.refreshSwiperCard()
      }
    })
  }

  // 登录成功之后刷新卡片数据
  refreshSwiperCard = () => {
    this.refSwiperCard.getInstance().then(ref => ref.fetchData())
  }

  // 排队后主动触发显示
  showConfirmModal = (config: BaseConfirmModalConfig) => {
    return this.refConfirmModal.getInstance().then((ref) => {
      return ref.queueToShow(config, true);
    })
  }

  // 激活modal显示, 它和showConfirmModal区别是该方法并不传入配置, 仅用于触发已经在队列中等候的modal的显示
  activeConfirmModal = () => {
    this.refConfirmModal.getInstance().then(ref => ref.show())
  }

  hideConfirmModal = () => {
    return this.refConfirmModal.getInstance().then(ref => ref.positiveHide())
  }

  // 获取用户信息
  fetchUserInfo = async () => {
    if(global.USER_INFO.isLogin) {
      try {
        const data = await fetchUserInfo({needExpire: 1})
        const {lastPeriodScore, totalScore} = data
        this.props.setTotalScore(totalScore)
        this.setState({lastPeriodScore})
        return data
      } catch(e) {
        return null
      }
    }
    return null
  }

  fetchQiPuData = async (): Promise<FetchQiPuData> => {
    if(this.state.menuList.length) {
      const {menuList, advList} = this.state
      return {menuList, advList}
    }

    const data = await fetchQiPuData()
    const {menuList, advList} = data

    this.setState({menuList, advList})

    return data
  }

  // 签到并获取设备积分
  signInAndGetDeviceScore = async () => {
    const [{score, continuousValue}, {totalScore}] = await Promise.all([askToSignIn(), fetchDeviceScoreInfo()])

    // 未登录 && 登录 后签到
    if(score > -1) {
      this.props.changeTotalScore(score)
    }

    // 未登录用户 且 已用设备签到后访问页面，查询设备积分并展示
    if(!global.USER_INFO.isLogin && score <= 0 && totalScore > 0) {
      this.props.setTotalScore(totalScore)
    }

    // 显示签到弹窗
    if(continuousValue > 0) {
      this.showConfirmModal({
        showCloseButton: true,
        content: <Sign continuousValue={continuousValue} />,
      })
    }

    // 登录用户，如有设备积分，展示设备积分转移弹窗
    if(global.USER_INFO.isLogin && totalScore > 0) {
      this.showConfirmModal({
        showCloseButton: true,
        content: <DeviceScore score={totalScore} hideConfirmModal={this.hideConfirmModal} />,
      })
    }

    return {score, continuousValue, totalScore}
  }

  fetchInitData = async () => {
    let resData = []

    if(this.onRequesting) {
      return resData
    }

    this.onRequesting = true

    this.fetchUserInfo()
    resData = await Promise.all([
      this.signInAndGetDeviceScore(),
      this.fetchQiPuData(),
    ])
    const [, {advList = []}] = resData

    this.finishRefresh()

    if(advList.length) {
      this.showConfirmModal({
        showCloseButton: true,
        content: <Adv data={advList[0]} openWeb={this.openWeb} hideConfirmModal={this.hideConfirmModal} />,
      })
    }

    this.onRequesting = false

    return resData
  }

  finishRefresh = () => {
    this.refRefreshLayout.getInstance().then(ref => ref.finishRefresh())
  }

  onRefresh = () => {
    this.fetchInitData()
  }

}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: '#ffffff',
  },
  backgroundTop: {
    ...BaseStyleSheet.absoluteFillObject,
    width: '100%',
    height: '60%',
    backgroundColor: '#FFD500',
  },
  backgroundScroll: {
    ...BaseStyleSheet.absoluteFillObject,
    width: '100%',
    height: 75,
  },
  pageRangeBody: BaseStyleSheet.absoluteFillObject,
})
