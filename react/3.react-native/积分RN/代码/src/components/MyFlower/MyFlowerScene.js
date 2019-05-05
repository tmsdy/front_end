/**
 * 花儿页主场景
 * Created by xushichao on 2018-12-20.
 */
import React, {PureComponent} from 'react';
import {DeviceEventEmitter, BackHandler} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils'

import ReduxUtil from '../../common/ReduxUtil';
import {sendClickPingback} from '../../common/pingback';
import MyFlowerConfig from '../../common/MyFlowerConfig';
import {switchToMasterGardenMode, updateMasterUserId, switchHistoryGardenMode, resetMasterGarden} from '../../actions/GardenDetailActions';
// import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import {shareToFriends} from '../utils';

import DefaultNavBar from '../DefaultNavBar';
import TotalScore from '../totalScore/TotalScore';
import BaseConfirmModal from '../BaseConfirmModal';

import SceneSwitchCloud from './SceneSwitchCloud';
import GardenBody from './gardenBody/GardenBody';
import Calendars from './Calendars';
import TipBubbleSingleton from '../TipBubbleSingleton';
import FriendsList from './FriendsList';
import DiaryButton from './DiaryButton';
import IllustrationButton from './IllustrationButton'

import {setFlowerStatsBar} from '../../actions/HomePageActions'

const DEFAULT_ZOOM = 1.36;
// 关于长度的计算，向上取整，向下取整会出现覆盖不了全屏幕的问题
const CONTAINER_WIDTH = Math.ceil(Width * DEFAULT_ZOOM);
const ORIGIN_LEFT = Math.ceil(Width * 0.18);

@connect(
  ({gardenDetail}) => {
    let currGardenMode = gardenDetail.isMasterMode ? gardenDetail.masterGardenMode : gardenDetail.friendGardenMode;
    return {
      theme: MyFlowerConfig[currGardenMode].theme,
      isMasterMode: gardenDetail.isMasterMode,
      masterGardenMode: gardenDetail.masterGardenMode,
      masterUserId: gardenDetail.masterUserId,
      friendUserId: gardenDetail.friendUserId,
      friendsList: gardenDetail.friendsList,
      masterFlowerInfo: gardenDetail.masterGardenInfo.flowerInfo,
      masterWateringInfo: gardenDetail.masterGardenInfo.wateringInfo,
      masterGifts: gardenDetail.masterGardenInfo.gifts,
      isHistoryGardenMode: gardenDetail.isHistoryGardenMode,
      isSwitchingScene: gardenDetail.isSwitchingScene,
      masterGardenPlanting: gardenDetail.masterGardenInfo.channelCode, // 用户当前正在种植的花的类型
    };
  },
  dispatch => bindActionCreators({
    switchToMasterGardenMode,
    updateMasterUserId,
    switchHistoryGardenMode,
    resetMasterGarden,
    setFlowerStatsBar
  }, dispatch),
  null,
  {withRef: true},
)
export default class MyFlowerScene extends PureComponent {
  static DEFAULT_ZOOM = DEFAULT_ZOOM;

  static getDerivedStateFromProps(nextProps) {
    const {screenModeType} = nextProps;
    return {
      isHalfScreen: (screenModeType === 'halfScreen' || screenModeType === 'none'),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      userCheckDone: false, // 每次进入页面先检查用户是否改变, 检查完成后再开始渲染
      gardenHeight: 0, // 花园部分的总高度
      rightTopControllersPageY: 0, // 页面右顶角的控件集pageY坐标, 金币蜜蜂需要依据这个值来播放金币飞行动画
      ...MyFlowerScene.getDerivedStateFromProps(props),
    };

    this.title = '奇妙乐园';
    this.replantFlowerAfterBackFromRecord = false // vip弹窗跳转到兑换记录页面之后返回到养花页面需要手动给用户重新种下种子

    this.loginSubscription = DeviceEventEmitter.addListener('loginChange', () => this.onLoginChanged(false));
    this.onLoginChanged(true); // 进入页面时, 先同步下当前的主态用户信息

    this.hardwareBackSubscription = BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);

    this.refNavBar = ReduxUtil.createRef();
    this.refTipBubbleSingleton = ReduxUtil.createRef();
    this.refConfirmModal = ReduxUtil.createRef();
    this.refTotalScoreBar = ReduxUtil.createRef();
    this.refMasterGardenBody = ReduxUtil.createRef()
    this.refWithdrawModal = ReduxUtil.createRef()
    this.refSceneSwitchCloud = ReduxUtil.createRef()

    if(__DEV__) {
      this.pageStartTime = Date.now();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 半屏转全屏
    if(prevState.isHalfScreen && !this.state.isHalfScreen) {
      this.activeConfirmModal();
    }

    // 切换场景时播放云动效
    if(prevProps.isSwitchingScene !== this.props.isSwitchingScene && this.props.isSwitchingScene) {
      this.hideTipBubble(); // 场景切换前先隐藏掉已存在的提示气泡
      this.refSceneSwitchCloud.getInstance().then(ref => ref.play())
    }
    // 主态/好友场景切换时需要修改navbar标题
    if(prevProps.isMasterMode !== this.props.isMasterMode || prevProps.friendUserId !== this.props.friendUserId) {
      let {friendUserId, friendsList, isMasterMode} = this.props,
        friendInfo = friendsList.find(item => item.userId === friendUserId) || {};
      this.title = isMasterMode ? '奇妙乐园' : `${friendInfo.nickname || ''}的花园`;
      this.refNavBar.getInstance().then(ref => ref.setTitle(this.title));
    }

    if(__DEV__) {
      // 首屏耗时统计
      if(!prevProps.masterFlowerInfo && this.props.masterFlowerInfo && this.pageStartTime) {
        setTimeout(() => {
          console.log('first_screen_rendering_time_consuming', (Date.now() - this.pageStartTime)); // eslint-disable-line no-console
        }, 0);
      }
    }
  }

  componentWillUnmount() {
    this.loginSubscription && this.loginSubscription.remove();
    this.hardwareBackSubscription && this.hardwareBackSubscription.remove();
    // 返回积分中心时候 手动更新首页花儿状态
    this.props.setFlowerStatsBar(true)
  }

  render() {
    let {
      isMasterMode,
      theme,
      masterGardenMode,
      masterUserId,
      friendUserId,
      masterFlowerInfo,
      masterWateringInfo,
      isHistoryGardenMode,
    } = this.props;
    let {
      userCheckDone,
      isHalfScreen,
      gardenHeight,
      rightTopControllersPageY,
    } = this.state;

    // 优化首次请求的冗余渲染, 跳过获取合法的userId前的渲染
    if(masterUserId < 0 || !userCheckDone) {
      return false;
    }

    const {
      // CollectButton,
      WithdrawButton,
    } = MyFlowerConfig[masterGardenMode].Components;

    // 花园主体部分的通用属性
    let gardenBodyCommonProps = {
      isHalfScreen,
      gardenHeight,
      rightTopControllersPageY,
      playCoinJumpAnimated: this.playCoinJumpAnimated,
      gotoOrderList: this.gotoOrderList,
      showTipBubble: this.showTipBubble,
      hideTipBubble: this.hideTipBubble,
      showConfirmModal: this.showConfirmModal,
      hideConfirmModal: this.hideConfirmModal,
      openWeb: this.props.openWeb,
    };

    return (
      <View key={masterUserId} style={styles.container}>
        {/* 导航栏 */}
        {!isHalfScreen && (
          <DefaultNavBar
            style={styles.navBar}
            ref={this.refNavBar}
            type={theme.navBarBackType}
            titleColor={theme.navBarTitleColor}
            title={this.title}
            backgroundColor="transparent"
            backPress={this.back}
          />
        )}

        {/* 页面右顶角的控件集 */}
        {!isHalfScreen && !!masterFlowerInfo && (
          <View style={styles.rightTopControllers} onLayout={this.onRightTopControllersLayout} pointerEvents="box-none">
            {/* 总分值显示条 */}
            <TotalScore ref={this.refTotalScoreBar} from="flower" gotoHomePage={this.gotoHomePage}/>

            <View style={styles.rightTopButtons}>
              {/* 日记按钮 */}
              {isMasterMode && !isHistoryGardenMode && (
                <DiaryButton
                  masterGardenMode={masterGardenMode}
                  flowerInfo={masterFlowerInfo}
                  wateringInfo={masterWateringInfo}
                  showConfirmModal={this.showConfirmModal}
                  currUserId={masterUserId}
                />
              )}

              {/* 提现按钮（仅金钱花页面有，包含历史态金钱花） */}
              {(!isHalfScreen && isMasterMode && !!masterUserId)
                && (isHistoryGardenMode || (!!masterFlowerInfo && !!masterWateringInfo)) && (
                  <WithdrawButton
                    ref={this.refWithdrawModal}
                    type={masterFlowerInfo.type}
                    revive={this.revive}
                    showConfirmModal={this.showConfirmModal}
                    hideConfirmModal={this.hideConfirmModal}
                    openWeb={this.props.openWeb}
                  />
                )}

              {/* 帮助按钮 */}
              {/* {isMasterMode && !isHistoryGardenMode && masterGardenMode === GARDEN_ENUM.MODE.Primary && (
              <HelpButton showConfirmModal={this.showConfirmModal}/>
            )} */}

              {/* 金钱花集宝卡按钮（仅初代花界面有） */}
              {/* {isMasterMode && !!masterUserId && !isHistoryGardenMode && !!masterFlowerInfo && (
              <CollectButton showConfirmModal={this.showConfirmModal} hideConfirmModal={this.hideConfirmModal}/>
            )} */}

              {/* 花儿图鉴按钮 */}
              {(!isHistoryGardenMode && isMasterMode) && (
                <IllustrationButton showConfirmModal={this.showConfirmModal} hideConfirmModal={this.hideConfirmModal} />
              )}
            </View>

          </View>
        )}

        {/* 花园 */}
        <View style={styles.garden} onLayout={this.onGardenLayout}>
          {/* 主态花园 */}
          <GardenBody
            visible={isMasterMode && !isHistoryGardenMode}
            currUserId={masterUserId}
            {...gardenBodyCommonProps}
            ref={this.refMasterGardenBody}
            shareToFriends={shareToFriends}
            showWithdrawModal={this.showWithdrawModal}
          />

          {/* 客态花园 */}
          {!!friendUserId && (
            <GardenBody
              key={friendUserId}
              visible={!isMasterMode}
              currUserId={friendUserId}
              {...gardenBodyCommonProps}
              back={this.back}
              shareToFriends={shareToFriends}
            />
          )}

          {/* 历史花园 */}
          {!!isHistoryGardenMode && (
            <GardenBody
              currUserId={masterUserId}
              isHistoryGarden={true}
              visible={isMasterMode}
              {...gardenBodyCommonProps}
            />
          )}
        </View>

        {/* 日历 */}
        <Calendars
          showTipBubble={this.showTipBubble}
          hideTipBubble={this.hideTipBubble}
          currUserId={isMasterMode ? masterUserId : friendUserId}
          showConfirmModal={this.showConfirmModal}
          hideConfirmModal={this.hideConfirmModal}
          openWeb={this.props.openWeb}
        />

        {/* 好友列表 */}
        <FriendsList
          screenProps={this.props.screenProps}
          showConfirmModal={this.showConfirmModal}
          hideConfirmModal={this.hideConfirmModal}
        />

        {/* 页面全局显示需要的一些可视性绝对定位组件, 封装在页面可视区域容器内 */}
        <View style={styles.pageRangeBody} pointerEvents="box-none">
          {/* 提示气泡 */}
          {!isHalfScreen && (
            <TipBubbleSingleton ref={this.refTipBubbleSingleton}/>
          )}

          {/* 弹框容器 */}
          <BaseConfirmModal ref={this.refConfirmModal}/>
        </View>

         {/* 场景切换的云层 */}
         <SceneSwitchCloud ref={this.refSceneSwitchCloud}/>
      </View>
    );
  }

  getGlobalUserId = () => {
    return global.USER_INFO.isLogin && global.USER_INFO.userId || 0;
  };

  onLoginChanged = (force) => {
    let userId = this.getGlobalUserId();
    if(userId !== this.props.masterUserId) {
      this.props.updateMasterUserId(userId).then(() => {
        this.setState({userCheckDone: true});
      });
    } else if(force) { // 即使用户信息相同, 初次进入也需要重置项主态花园
      this.props.resetMasterGarden().then(() => {
        this.setState({userCheckDone: true});
      });
    }
  };

  onHardwareBackPress = () => {
    this.back();
    // 如果是非主态或者大场景下的全屏态, 不做页面回退(return true)
    return !this.props.isMasterMode || this.props.screenModeType === 'fullScreen';
  };

  onGardenLayout = ({nativeEvent}) => {
    this.setState({gardenHeight: nativeEvent.layout.height});
  };

  onRightTopControllersLayout = ({nativeEvent}) => {
    this.setState({rightTopControllersPageY: nativeEvent.layout.y});
  };

  playCoinJumpAnimated = () => {
    this.refTotalScoreBar.getInstance().then(ref => ref.playCoinJumpAnimated());
  };

  // 显示提现弹窗
  showWithdrawModal = () => {
    this.refWithdrawModal.getInstance().then(ref => ref.showModal())
  }

  gotoOrderList = () => {
    this.replantFlowerAfterBackFromRecord = true
    // this.props.openWeb(ORDERLIST[GET_ENV()])
    this.props.goTo('MyGain', {
      showVipCardModalIfNeeded: this.onShow
    })
  };

  onShow = () => {
    if(this.props) {
      const {masterFlowerInfo, isHalfScreen, isHistoryGarden} = this.props

      if(masterFlowerInfo && masterFlowerInfo.type === 'vip') {
        this.refMasterGardenBody.getInstance().then(ref => ref.showVipCardModalIfNeeded('vip'))
      }

      // 完成任务返回，触发获得新道具
      if(masterFlowerInfo && !isHalfScreen && !isHistoryGarden) {
        this.refMasterGardenBody.getInstance().then(ref => ref.fetchNewPropsInfo())
      }
    }
  }

  revive = (item) => {
    this.refMasterGardenBody.getInstance().then(ref => ref.revive(item))
  }

  gotoHomePage = () => {
    sendClickPingback('flower_page', '', 'gohomepage_f')
    this.props.goTo('HomePage')
  };

  back = () => {
    this.hideTipBubble();
    if(this.props.isSwitchingScene) {
      return
    }
    if(!this.props.isMasterMode) { // 好友花园
      this.props.switchToMasterGardenMode();
    } else if(this.props.isHistoryGardenMode) { // 历史花园
      this.props.switchHistoryGardenMode(this.props.masterGardenPlanting);
      this.refMasterGardenBody.getInstance().then(ref => ref.fetchIsNeedToShowVipCard());
    } else {
      this.props.back && this.props.back();
    }
  };

  showTipBubble = (config) => {
    return this.refTipBubbleSingleton.getInstance().then(ref => ref.show(config));
  };

  hideTipBubble = (target) => {
    return this.refTipBubbleSingleton.getInstance().then(ref => ref.hide(target));
  };

  showConfirmModal = (config) => {
    return this.refConfirmModal.getInstance().then((ref) => {
      if(this.state.isHalfScreen) {
        return ref.queueToShow(config, false); // 仅排队
      } else {
        return ref.queueToShow(config, true); // 排队后主动触发显示
      }
    });
  };

  hideConfirmModal = () => {
    return this.refConfirmModal.getInstance().then(ref => ref.positiveHide());
  };

  activeConfirmModal = () => { // 激活modal显示, 它和showConfirmModal区别是该方法并不传入配置, 仅用于触发已经在队列中等候的modal的显示
    this.refConfirmModal.getInstance().then(ref => ref.show());
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',

    width: CONTAINER_WIDTH,
    marginLeft: ORIGIN_LEFT * -1,
    // transform: [{scale: 1 / 1.36}], // 模拟主场景的case, 勿删!!!
  },

  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Width,
    marginLeft: ORIGIN_LEFT,
    zIndex: 100,
  },

  pageRangeBody: {
    position: 'absolute',
    width: Width,
    top: 0,
    bottom: 0,
    marginLeft: ORIGIN_LEFT,
  },

  garden: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  rightTopControllers: {
    position: 'absolute',
    top: 0,
    right: ORIGIN_LEFT,
    zIndex: 150,
    alignItems: 'flex-end',
    ios: {
      top: 18,
    },
    iosx: {
      top: 48,
    },
  },
  rightTopButtons: {
    width: 80,
    alignItems: 'center',
  }
});
