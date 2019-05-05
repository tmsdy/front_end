/**
 * Created by liuzhimeng.
 * @date 2018-12-10
 * @description 奇妙乐园
 */
import React from 'react'
import {StatusBar} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'

import MyFlowerScene from '../components/MyFlower/MyFlowerScene'
import MainContent, {ParkNavBar} from '../components/wonderfulPark/MainContent'

import {setTotalScore} from '../actions/TotalScoreActions'
import {hideLoading} from '../common/QYNativeBridge'
// eslint-disable-next-line import/no-unresolved
import {withPanResponder} from '../components/wonderfulPark/withPanResponder'
import {sendPagePingback} from '../common/pingback'
import {PARK_PAGE} from '../components/wonderfulPark/pingback'
import {GARDEN_ENUM, PARK_NAV_BAR_STYLES} from '../constants/IntegralEnum'
import BasePage from '../components/BasePage'

const WithMainContent = withPanResponder(MainContent)

// 花儿页面屏幕模式
const SCREEN_MAP = {
  start: 'halfScreen',
  bottomEnd: 'fullScreen',
  topEnd: 'none',
}

@connect(
  ({gardenDetail, scoreInfo}) => {
    return {
      totalScore: scoreInfo.totalScore,
      currGardenMode: gardenDetail.isMasterMode ? gardenDetail.masterGardenMode : gardenDetail.friendGardenMode,
    }
  },
  (dispatch) => bindActionCreators({
    setTotalScore,
  }, dispatch),
  null,
  {withRef: true},
)
export default class WonderfulPark extends BasePage {

  pageName = PARK_PAGE

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.currGardenMode !== prevState.currGardenMode) {
      return {
        currGardenMode: nextProps.currGardenMode
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      screenModeType: 'halfScreen',
      isDisabled: false,
      currGardenMode: this.props.currGardenMode,
      navBar: 'black',
    }

    // 标记来源（首页、任务中心、我的）
    const screenProps = this.props.screenProps || {}
    const navigationParams = this.props.navigation.state.params || {}
    global.from = screenProps.from || navigationParams.from || global.from

    this.panResponderRef = React.createRef()
    this.withMainContentRef = React.createRef()
    this.refFlower = React.createRef()
  }

  componentDidMount() {
    if(isIOS) {
      this.setStatusBar()
    }
    sendPagePingback(this.pageName, {score: this.props.totalScore})
    hideLoading()
  }

  componentDidUpdate(prevProps) {
    if(isIOS && this.props.currGardenMode !== prevProps.currGardenMode) {
      this.setStatusBar()
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <WithMainContent
          {...this.props}

          ref={this.panResponderRef}
          wrapperdRef={this.withMainContentRef}

          renderNavbarComponent={<ParkNavBar type={this.state.navBar} back={this.back}/>}
          isDisabled={this.state.isDisabled}
          setScrollEnabled={this.setScrollEnabled}
          responderChange={this.responderChange}

          goTo={this.goTo}
          openWeb={this.openWeb}
        >
          <MyFlowerScene
            screenModeType={this.state.screenModeType}
            openWeb={this.openWeb}
            goTo={this.goTo}
            back={() => this.handlePanResponderChange('start')}
            ref={this.refFlower}
          />
        </WithMainContent>
      </View>
    )
  }

  onShow() {
    super.onShow();
    try {
      this.refFlower.current.getWrappedInstance().onShow()
      // 判断乐园页面是否是栈内正在显示的页面
      const {navigation} = this.props
      const {routes} = navigation.dangerouslyGetParent().state
      if(routes[routes.length - 1].routeName === 'IntegralPark') {
        this.withMainContentRef.current
        && this.withMainContentRef.current.onShow
        && this.withMainContentRef.current.onShow(true)
      }
    } catch(e) {
      this.withMainContentRef.current
      && this.withMainContentRef.current.onShow
      && this.withMainContentRef.current.onShow(false)
    }
  }


  setStatusBar = (keyName = this.state.currGardenMode) => {
    const {statusBar, navBar} = PARK_NAV_BAR_STYLES[keyName]
    this.setState({navBar})
    StatusBar.setBarStyle(statusBar, true)
  }

  // 手动控制页面显示模式
  handlePanResponderChange = (status) => {
    this.panResponderRef.current
    && this.panResponderRef.current.handlePanResponderChange(status)
  }

  // 启用内部ScrollView滚动
  setScrollEnabled = (value) => {
    this.withMainContentRef.current
    && this.withMainContentRef.current.setScrollEnabled(value)
  }

  // 手势状态变化时触发
  responderChange = (status) => {
    // 手势、动画移动结束时，更新花儿页面屏幕模式
    // console.log('handlePanResponderEnd', status)
    this.setState({screenModeType: SCREEN_MAP[status]})
    this.withMainContentRef.current
    && this.withMainContentRef.current.updateScreenMode(status)
    if(isIOS) {
      if(status === 'topEnd') {
        this.setStatusBar(GARDEN_ENUM.MODE.Primary)
      } else {
        const {navBar} = PARK_NAV_BAR_STYLES[this.state.currGardenMode]
        if(this.state.navBar !== navBar) {
          this.setStatusBar()
        }
      }
    }

    if(status === 'bottomEnd') {
      // 当切换到全屏的时候投递rpage
      sendPagePingback('flower_page', {from: 'paradise'});
    }
  }
}
