/**
 * 蜜蜂
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {Animated, Easing, TouchableWithoutFeedback} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import {askToCatchBee, fetchBeeType} from '../../../model/MyFlower';
import ReduxUtil from '../../../common/ReduxUtil';
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback';
import {updateFriendInfo, updateReviveNum} from '../../../actions/GardenDetailActions';
import {changeTotalScore} from '../../../actions/TotalScoreActions';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import PingbackConfig from '../../../common/PingbackConfig';
import LottieAnimation from '../../LottieAnimation'

import CouponModal from './CouponModal'
import CollectProcessModal from '../CollectGainModals'
import {showToast} from '../../../common/QYNativeBridge';

// 蜜蜂size
const BEE_SIZE = 50;

// 金币size
const COINS_SIZE = 100;

// 蜜蜂容器宽高
const BEE_CON_WIDTH = 65;
const BEE_CON_HEIGHT = COINS_SIZE;

// 飞行边界
const BEE_BOUNCE_LEFT = 80;
const BEE_BOUNCE_RIGHT = 93;
const BEE_BOUNCE_TOP = 150 - (BEE_CON_HEIGHT - BEE_SIZE) / 2;
const BEE_BOUNCE_BOTTOM_BASE_FLOWER = -35 - (BEE_CON_HEIGHT - BEE_SIZE) / 2;

// 原地抖动参数
const QUIVER_MIN_TIMES = 0; // 最小抖动次数
const QUIVER_MAX_TIMES = 3;
const QUIVER_MAX_RADIUS = 10; // 最大抖动半径

// 动画持续时长/速度
const BEE_APPEAR_DURATION = 500;
const BEE_DISAPPEAR_DURATION = 160;
const BEE_QUIVER_DURATION = 500;
const BEE_FLY_SPEED = 45 / 1000;
const COINS_FLY_SPEED = 500 / 1000;

const BEE_INFO = {
  coin: {lottieName: 'bee_coin'},
  relive: {lottieName: 'bee_relive'},
  coupon: {lottieName: 'bee_coupon'},
  money: {lottieName: 'bee_money'},
};

// 后端蜜蜂类型到前端蜜蜂类型的映射关系
const BEE_TYPE_MAPPING = {
  bee_point: 'coin',
  bee_flower: 'relive',
  bee_ad: 'coupon',
  bee_money: 'money',
};

@connect(
  (state, props) => {
    let {isMasterGarden, masterUserId, flowerInfo, beeCode, reviveNum, gardenMode} = getUserGardenDetail(state, props);
    return {
      isMasterGarden,
      masterUserId,
      flowerInfo,
      beeCode,
      reviveNum,
      gardenMode
    };
  },
  dispatch => bindActionCreators({
    updateFriendInfo,
    changeTotalScore,
    updateReviveNum
  }, dispatch),
  null,
  {withRef: true},
)
export default class Bee extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      beeType: null,
      positiveDirection: true, // 蜜蜂飞行方向(默认正向(从右往左飞), 根据该值确定是或要翻转蜜蜂)
      opacity: 0
    };

    this.appeared = false;
    this.currPosition = null;
    this.rewardScore = 0; // 金币蜜蜂的奖励分值

    this.refCoins = ReduxUtil.createRef();
    this.refDisappearBubble = ReduxUtil.createRef();

    this.animBeeAppear = new Animated.Value(0);
    this.animBeePosition = new Animated.ValueXY({x: 0, y: 0});
    this.animCoinsAppear = new Animated.Value(1);
  }

  componentDidMount() {
    this.fetchBeeType(); // 获取当前需要出现的蜜蜂类型
  }

  componentWillUnmount() {
    this.animBeeAppear.stopAnimation();
    this.animBeePosition.stopAnimation();
    this.animCoinsAppear.stopAnimation();
  }

  render() {
    let {beeType, positiveDirection} = this.state;
    return !!beeType && (
      <View
        style={[styles.container]}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback onPress={this.onPressBee}>
          <Animated.View
            style={[styles.bee, {
              transform: [{
                translateX: this.animBeePosition.x,
              }, {
                translateY: this.animBeePosition.y,
              }],
            }]}
          >
            {/* 蜜蜂 */}
            <Animated.View
              style={[{
                opacity: this.animBeeAppear,
                width: BEE_SIZE,
                height: BEE_SIZE,
                transform: [{
                  scale: this.animBeeAppear.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                }, {
                  scaleX: positiveDirection ? 1 : -1,
                }],
              }]}
            >
              <LottieAnimation
                ref={el => el && el.play()}
                style={{width: BEE_SIZE, height: BEE_SIZE}}
                name={BEE_INFO[beeType].lottieName}
                loop={true}
              />
            </Animated.View>

            {/* 金币 */}
            <Animated.View
              style={[styles.coins, {
                opacity: this.animCoinsAppear,
                transform: [{
                  scale: this.animCoinsAppear.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1],
                  }),
                }],
              }]}
            >
              <LottieAnimation
                ref={this.refCoins}
                style={{width: COINS_SIZE, height: COINS_SIZE}}
                name="coins_from_bee"
                onAnimationEnd={this.onCoinsLottieAnimationEnd}
              />
            </Animated.View>

            <LottieAnimation
              ref={this.refDisappearBubble}
              style={[styles.disappearBubble, {opacity: this.state.opacity}]}
              name="bubble_from_bee"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  fetchBeeType = () => {
    fetchBeeType({userId: this.props.currUserId, beeCode: this.props.beeCode})
      .then(({morphCode}) => {
        let beeType = BEE_TYPE_MAPPING[morphCode];
        this.setState({beeType}, this.appearBee);
      })
      .catch(() => {
        // 蜜蜂获取失败(例如: 已被其他人捕获等), 也同步去掉好友头像上的蜜蜂icon
        if(!this.props.isMasterGarden) {
          this.props.updateFriendInfo(this.props.currUserId, {appeared: false})
        }
      });
  };

  appearBee = () => {

    sendBlockPingback('flower_page', '800507')
    this.currPosition = this.getRandomPositionInBounce();
    // 设定初始位置
    this.animBeePosition.setValue(this.currPosition);
    // 启动显示蜜蜂动画
    Animated.timing(this.animBeeAppear, {
      toValue: 1,
      duration: BEE_APPEAR_DURATION,
      easing: Easing.bezier(0.68, 0.53, 0.55, 0.085),
      useNativeDriver: true,
    })
      .start(({finished}) => {
        if(finished) {
          this.appeared = true;
          this.fly();
        }
      });
  };

  fly = () => {
    let quiverTimes = Math.floor(Math.random() * (QUIVER_MAX_TIMES - QUIVER_MIN_TIMES)) + QUIVER_MIN_TIMES;
    this.quiver(quiverTimes, () => {
      // 长距离飞行
      let targetPosition = this.getRandomPositionInBounce(),
        distance = Math.sqrt(Math.pow(targetPosition.x - this.currPosition.x, 2) + Math.pow(targetPosition.y - this.currPosition.y, 2));
      this.setState({
        positiveDirection: targetPosition.x <= this.currPosition.x, // 正向为从右往左飞
      });

      Animated.timing(this.animBeePosition, {
        toValue: targetPosition,
        duration: distance / BEE_FLY_SPEED,
        easing: Easing.bezier(0.455, 0.03, 0.515, 0.955),
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            this.currPosition = targetPosition;
            this.fly();
          }
        });
    });
  };

  quiver = (times, callback) => {
    let targetPosition = this.getRandomPositionInRound();
    if(times > 0) {
      Animated.timing(this.animBeePosition, {
        toValue: targetPosition,
        duration: BEE_QUIVER_DURATION,
        useNativeDriver: true,
      })
        .start(({finished}) => {
          if(finished) {
            this.currPosition = targetPosition;
            this.quiver(times - 1, callback);
          }
        });
    } else {
      callback();
    }
  };

  onPressBee = ({nativeEvent}) => {
    if(this.props.currUserId === this.props.masterUserId) {
      sendClickPingback('flower_page', '800507', 'beebtn')
    } else {
      const {page, block, rseat} = PingbackConfig[this.props.gardenMode].beeGuest
      sendClickPingback(page, block, rseat)
      // sendClickPingback('flower_page', '800612', 'bee_friend')
    }

    if(this.appeared) { // 完全显示后才可以点击
      const {beeType} = this.state
      let {pageX, pageY} = nativeEvent;
      this.animBeePosition.stopAnimation();
      this.currPosition = {x: pageX, y: pageY};
      this.appeared = false; // 蜜蜂点击后不再可点

      askToCatchBee({userId: this.props.currUserId, helper: this.props.masterUserId, beeCode: this.props.beeCode})
        .then(({rewardScore = 0, itemId, itemName, itemImg, itemCount, itemType, itemSubType}) => {
          if(beeType === 'coin') {
            sendBlockPingback('flower_page', '800508')

            this.rewardScore = rewardScore;
            // 播放蜜蜂消失/金币显示动画
            Animated.timing(this.animBeeAppear, {
              toValue: 0,
              duration: BEE_DISAPPEAR_DURATION,
              easing: Easing.bezier(0.68, 0.53, 0.55, 0.085),
              useNativeDriver: true,
            })
              .start();
            this.refCoins.getInstance()
              .then(ref => ref.play());
          } else if(beeType === 'relive') {
            sendBlockPingback('flower_page', '800509')

            this.props.showConfirmModal({
              content: (
                <CollectProcessModal
                  cards={{fertilizer: {count: 1}}}
                  hide={() => this.props.hideConfirmModal().then(this.props.updateReviveNum(this.props.reviveNum + 1))}
                />
              ),
              showCloseButton: false,
            });
            this.setState({beeType: null});
          } else if(beeType === 'coupon') {
            sendBlockPingback('flower_page', '800510')

            const rewardInfo = {itemId, itemName, itemCount, itemImg, itemType, itemSubType}
            this.props.showConfirmModal({
              content: (
                <CouponModal
                  rewardInfo={rewardInfo}
                  hide={this.props.hideConfirmModal}
                  gotoOrderList={this.props.gotoOrderList}
                />
              ),
              showCloseButton: false,
            });
            this.setState({beeType: null});
          } else if(beeType === 'money') {
            this.props.showConfirmModal({
              content: (
                <CollectProcessModal
                  cards={{collection: {count: 1}}}
                  channelCode={GARDEN_ENUM.CHANNEL_CODE.Money}
                  show={this.props.showConfirmModal}
                  hide={this.props.hideConfirmModal}
                />
              ),
              showCloseButton: false,
            });
            this.setState({beeType: null});
          } else if(beeType === 'coupon') {
            sendBlockPingback('flower_page', '800510')

            const rewardInfo = {itemId, itemName, itemCount, itemType, itemSubType}
            this.props.showConfirmModal({
              content: <CouponModal hide={this.props.hideConfirmModal} rewardInfo={rewardInfo} gotoOrderList={this.props.gotoOrderList}/>,
              showCloseButton: false,
            });
            this.setState({beeType: null});
          }
        })
        .catch((data) => {
          sendBlockPingback('flower_page', '800511')
          this.setState({
            opacity: 1
          })
          this.animBeeAppear.setValue(0);
          this.refDisappearBubble.getInstance()
            .then(ref => ref.start())
            .then(() => {
              this.setState({beeType: null});
            });
          this.props.onBeeCatchFail && this.props.onBeeCatchFail();
          if(data.code === 'A0023') {
            showToast('今天抓了太多好友的蜜蜂了，明天再来吧！')
          }
        })
        .finally(() => {
          // 不论蜜蜂捕捉成功或者失败，好友列表蜜蜂的icon都消失
          if(!this.props.isMasterGarden) {
            this.props.updateFriendInfo(this.props.currUserId, {appeared: false})
          }
        });
    }
  };

  onCoinsLottieAnimationEnd = () => {
    let targetPosition = {x: Width - COINS_SIZE, y: this.props.rightTopControllersPageY},
      distance = Math.sqrt(Math.pow(targetPosition.x - this.currPosition.x, 2) + Math.pow(targetPosition.y - this.currPosition.y, 2));
    Animated.parallel([
      Animated.timing(this.animCoinsAppear, {
        toValue: 0,
        duration: distance / COINS_FLY_SPEED,
        useNativeDriver: true,
      }),
      Animated.timing(this.animBeePosition, {
        toValue: {x: Width - COINS_SIZE, y: -30},
        duration: distance / COINS_FLY_SPEED,
        useNativeDriver: true,
      }),
    ])
      .start(({finished}) => {
        if(finished) {
          this.setState({beeType: null});
          this.props.changeTotalScore(this.rewardScore);
          this.props.playCoinJumpAnimated();
        }
      });
  };

  getRandomPositionInBounce = () => {
    let {flowerInfo, gardenHeight} = this.props,
      beeBounceWidth = Width - BEE_BOUNCE_LEFT - BEE_BOUNCE_RIGHT,
      beeBounceHeight = gardenHeight - BEE_BOUNCE_TOP - BEE_BOUNCE_BOTTOM_BASE_FLOWER - flowerInfo.height;
    return {
      x: Math.floor(Math.random() * (beeBounceWidth - BEE_CON_WIDTH)) + BEE_BOUNCE_LEFT,
      y: Math.floor(Math.random() * (beeBounceHeight - BEE_CON_HEIGHT)) + BEE_BOUNCE_TOP,
    }
  };

  getRandomPositionInRound = () => {
    let radius = Math.random() * QUIVER_MAX_RADIUS,
      angle = Math.random() * 360;
    return {
      x: this.currPosition.x + Math.floor(radius * Math.cos(angle)),
      y: this.currPosition.y + Math.floor(radius * Math.sin(angle)),
    }
  };
}
const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  bee: {
    width: BEE_CON_WIDTH,
    height: BEE_CON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coins: {
    position: 'absolute',
  },
  disappearBubble: {
    position: 'absolute',
    width: 63,
    height: 63,
    opacity: 0
  },
});
