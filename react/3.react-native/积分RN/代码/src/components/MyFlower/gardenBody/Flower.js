/**
 * 花朵
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import {View} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import {executeTask} from '../../../api';
import {getStorage, setStorage, formatQipuData, runEventOnce} from '../../../common/util';
import ReduxUtil from '../../../common/ReduxUtil';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {GARDEN_ENUM, STORAGE_ENUM} from '../../../constants/IntegralEnum';

import LottieAnimation from '../../LottieAnimation';
import RewardForecastTip from './RewardForecastTip';
import NewUserGuideTip from './NewUserGuideTip';
import ScoreIncreasedTip from './ScoreIncreasedTip';
import TipBubbleWithButton from '../TipBubbleWithButton';
import {sendClickPingback} from '../../../common/pingback';
import {askToFlowerAddPush} from '../../../model/MyFlower';

@connect(
  (state, props) => {
    let {isMasterGarden, masterUserId, gardenMode, flowerInfo, wateringInfo, gifts, isHistoryGarden, channelCode} = getUserGardenDetail(state, props);
    return {
      isMasterGarden,
      masterUserId,
      gardenMode,
      flowerInfo,
      wateringInfo,
      gifts,
      isHistoryGarden,
      channelCode,
    };
  },
  null,
  null,
  {withRef: true},
)
export default class Flower extends PureComponent {
  constructor(props) {
    super(props);

    this.tips = new Map(); // 所有花儿提示信息列表, 点击花儿后轮询播放
    this.currFlowerTipIndex = 0;
    this.currFlowerTipDone = true; // 当前提示是否完成显示, 完成后才响应下一个轮询点击
    this.flowerTarget = null;
    this.flowerAnimationPlayed = false; // 空盆动画是否已经播放过

    this.refFlower = ReduxUtil.createRef();
  }

  componentDidMount() {
    this.fetchFlowerTips(); // 获取全部提示信息
  }

  componentDidUpdate(prevProps) {
    let {isMasterGarden, isHalfScreen, flowerInfo} = this.props;
    if(isMasterGarden) { // 主态
      if(prevProps.isHalfScreen && !isHalfScreen && flowerInfo.type === 'pot' && !this.flowerAnimationPlayed) { // 半屏模式切换全屏模式, 且空盆动画尚未播放过
        this.playFlowerAnimation();
      }
    }
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        {this.renderFlowerByType()}
      </View>
    );
  }

  renderFlowerByType = () => {
    let {flowerInfo, onPotAnimationEnd} = this.props,
      extraFlowerProps = {},
      enablePress = false;
    if(flowerInfo.type === 'pot') { // 空盆
      extraFlowerProps.onAnimationEnd = onPotAnimationEnd;
      extraFlowerProps.onLayout = this.onPotLayout;
    } else if(flowerInfo.type === 'seed') { // 种子
      extraFlowerProps.onLayout = this.onAliveFlowerLayout;
    } else if(flowerInfo.type === 'faded') { // 枯萎
      // extraFlowerProps.onAnimationEnd = onDeadAnimationEnd;
      extraFlowerProps.onLayout = this.onFadedFlowerLayout;
    } else {
      enablePress = true;
      extraFlowerProps.onLayout = this.onAliveFlowerLayout;
    }

    // 正常生长的花
    return (
      <TouchableOpacity activeOpacity={1} onPress={enablePress ? this.displayNextFlowerTip : NOOP}>
        {this.renderFlowerAnimation(flowerInfo, extraFlowerProps)}
      </TouchableOpacity>
    );
  };

  renderFlowerAnimation = (flowerInfo, props) => {
    return (
      <LottieAnimation
        key={flowerInfo.type}
        ref={this.refFlower}
        style={{width: flowerInfo.width, height: flowerInfo.height, marginBottom: flowerInfo.marginBottom, zIndex: 3}}
        name={flowerInfo.name}
        remote={flowerInfo.remote}
        {...props}
      />
    );
  };

  playFlowerAnimation = () => {
    this.flowerAnimationPlayed = true;
    return this.refFlower.getInstance().then(ref => ref.start());
  };

  popupScoreTip = (scoreNum) => {
    this.props.showTipBubble({
      target: this.flowerTarget,
      tipView: <ScoreIncreasedTip scoreNum={scoreNum}/>,
      offsetY: 10,
      duration: 2000, // 提示信息持续2秒
      opacityAnimConfig: {from: 1, to: 0, duration: 2000},
      offsetYAnimConfig: {from: 0, to: -220, duration: 2000},
    });
  };

  popupBeeCatchFailTip = () => {
    this.props.showTipBubble({
      target: this.flowerTarget,
      tip: '哎呦, 蜜蜂飞走啦~',
      offsetY: 10,
      duration: 2000, // 提示信息持续2秒
      opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      offsetYAnimConfig: {from: 0, to: -100, duration: 1000},
    })
  };

  onPotLayout = () => {
    let {isMasterGarden, isHalfScreen} = this.props;
    if(isMasterGarden && isHalfScreen) { // 主态半屏模式先不播放空盆动效, 全屏后播放
      // do nothing
    } else { // 默认空盆布局完成后即开始播放动效
      this.playFlowerAnimation();
    }
  };

  onFadedFlowerLayout = ({nativeEvent}) => {
    if(this.props.isMasterGarden) {
      this.props.showTipBubble({target: nativeEvent.target, tip: '昨天没来，我等的花都谢了'});
    } else {
      this.props.showTipBubble({
        target: nativeEvent.target,
        tip: <TipBubbleWithButton
          tip="最悲惨的是，我屎了，TA还不知道！"
          btnText="告诉TA"
          type="dead"
          channelCode={this.props.channelCode}
          shareToFriends={this.props.shareToFriends}
          hideTipBubble={this.props.hideTipBubble}
        />,
        duration: 5000,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      });
    }
  };

  onAliveFlowerLayout = ({nativeEvent}) => {
    this.flowerTarget = nativeEvent.target;
    if(!this.props.isMasterGarden) {
      this.props.showTipBubble({
        target: this.flowerTarget,
        tip: '你好呀，吃饭了没？',
        duration: 3000,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      });
    }
  };

  displayRewardForecastTip = () => { // 显示奖励预告提示
    let {wateringInfo, gifts, gardenMode, showTipBubble} = this.props;
    // 金钱花不展示礼物预告
    if(gardenMode === GARDEN_ENUM.MODE.Cash) {
      return Promise.resolve();
    }

    // 奖励领取的当天, 不显示下次领取奖励预告
    if(gifts.some(gift => gift.days === wateringInfo.waterDays) || wateringInfo.waterDays === wateringInfo.maxWaterDays) {
      return Promise.resolve();
    }

    return showTipBubble({
      target: this.flowerTarget,
      tip: <RewardForecastTip wateringInfo={wateringInfo}/>,
      duration: 3000,
      opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
    });
  };

  setWateringNotificationTip = () => {
    const {gifts, wateringInfo} = this.props

    /** 礼物气泡和push气泡重叠 所以 礼物期间不出push气泡 和柯慧士确定过 */
    if(gifts.some(gift => gift.days === wateringInfo.waterDays) || wateringInfo.waterDays === wateringInfo.maxWaterDays) {
      return
    }

    // 通知引擎打开浇水通知（仅执行一次）
    runEventOnce(`push_show${global.USER_INFO.userId}`).then(() => {
      askToFlowerAddPush()
    })
  }

  displayNewGuideTip = (index = 0) => {
    if(index < NewUserGuideTip.TIP_COUNT) {
      return this.props.showTipBubble({
        target: this.flowerTarget,
        tip: <NewUserGuideTip index={index} gardenMode={this.props.gardenMode}/>,
        offsetY: 70,
        duration: 2000, // 提示信息持续2秒
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
        offsetYAnimConfig: {from: 0, to: -100, duration: 1000},
      }).then(() => {
        return this.displayNewGuideTip(index + 1);
      });
    } else {
      return Promise.resolve();
    }
  };

  getTipsFromMap = (mode, channelCode) => {
    return this.tips.get(`${channelCode}-${mode}`) || []
  };

  displayNextFlowerTip = () => { // 花儿点击后轮询播放显示信息

    sendClickPingback('flower_page', '', 'flower_click')
    const mode = this.props.isMasterGarden ? 'master' : 'guest'
    let tips = this.getTipsFromMap(mode, this.props.channelCode)
    if(this.currFlowerTipDone && !this.props.isHistoryGarden && tips.length) { // 当前提示完成后才可以响应下一个
      this.props.showTipBubble({
        target: this.flowerTarget,
        tip: tips[this.currFlowerTipIndex],
        offsetY: 10,
        duration: 2000, // 提示信息持续2秒
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
        offsetYAnimConfig: {from: 0, to: -100, duration: 1000},
      });
      this.currFlowerTipIndex = (this.currFlowerTipIndex + 1) % tips.length;
      setTimeout(() => { // 两秒后解除禁制
        this.currFlowerTipDone = true;
      }, 2000);
      this.currFlowerTipDone = false;
    }
    this.playFlowerAnimation();
  };

  fetchFlowerTips = () => {
    executeTask({
      task_code: 'qipu_flower_money_tips',
      timestamp: Date.now(),
    }).then((data) => {
      const result = formatQipuData([data])[0];
      const temp = new Map();
      result.forEach((item) => {
        const {flower, from} = item.values || {}
        temp.set(`${flower}-${from}`, item.title.proper_title && item.title.proper_title.split('/') || []);
      })
      this.tips = temp
    });
  };

  displayWateredToFriendsTip = () => {
    this.props.showTipBubble({
      tip: '多谢恩人续命！我又可以多活一天了！',
      target: this.flowerTarget,
      duration: 3000
    })
  }

  showWelcomeTip = () => {
    const {isMasterGarden, masterUserId} = this.props
    if(isMasterGarden) { // 主态页气泡：每日首次进入花儿页，展示气泡“好开心，你回来啦~”
      let today = new Date()
      today = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`
      const key = `${STORAGE_ENUM.FIRST_GREETING_PER_DAY}${masterUserId}${today}`
      getStorage(key).then((data) => {
        if(!data) {
          this.props.showTipBubble({
            target: this.flowerTarget,
            tip: '好开心，你回来啦~',
            duration: 3000,
            opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
          });
          setStorage(key, true)
        }
      })
    } else { // 客态页气泡：若好友花儿无可交互内容（枯死，待浇水），则展示气泡“你好呀，吃饭了没？”
      this.props.showTipBubble({
        target: this.flowerTarget,
        tip: '你好呀，吃饭了没？',
        duration: 3000,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      });
    }
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: Width,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
