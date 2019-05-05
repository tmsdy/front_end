/**
 * 花园主体部分
 * Created by xushichao on 2018-12-20.
 */
import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View} from '@iqiyi/rn-ui';
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'

import {sendClickPingback, sendPagePingback} from '../../../common/pingback';
import ReduxUtil from '../../../common/ReduxUtil';
import {showToast} from '../../../common/QYNativeBridge';
import {DRAW_ENUM, GARDEN_ENUM, STORAGE_ENUM} from '../../../constants/IntegralEnum';
import {
  updateGardenInfo,
  updateFriendInfo,
  switchMasterGardenModeAsync,
  updateReviveNum,
  changeTotalCash,
  switchSuccessActive,
  switchShowReplantBox,
  historyInfo
} from '../../../actions/GardenDetailActions';
import {setTotalScore, changeTotalScore} from '../../../actions/TotalScoreActions';
import MyFlowerConfig from '../../../common/MyFlowerConfig';
import PingbackConfig from '../../../common/PingbackConfig';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {getStorage, setStorage, getObjectValueSafely, runEventOnce} from '../../../common/util';

import {
  fetchFlowerDetail,
  askToPlantFlower,
  askToWatering,
  askToGetReward,
  askToRevive,
  fetchHasShowVipCard,
  askToGetDrawReward,
  askToCloseVipModal,
  fetchHistory
} from '../../../model/MyFlower';

import {fetchDeviceScoreInfo} from '../../../model/homePage'

import {formatCash} from '../../utils'

import CollectProcessModal, {RewardMoneyModal} from '../CollectGainModals'
import PickSeedModal from '../PickSeedModal'

import RewardBubble from './RewardBubble'
import ReplantSeed from './ReplantSeed'
// import VIPCardRewardModal from './VIPCardRewardModal';
import Flower from './Flower';
import Kettle from './Kettle';
import Bee from './Bee';
import ReliveButton from './ReliveButton';
import SpeedUpButton from './SpeedUpButton';
import HomeBackButton from './HomeBackButton';
import NewGuideModal from './NewGuideModal';
import PlantSuccessActive from './PlantSuccessActive'
import FireWorksActive from './FireWorksActive'
import ReplantBox from './ReplantBox'
import LotteryGuideModal from './LotteryGuideModal'
import DrawBody from '../drawModal/DrawBody';
import CouponModal from './CouponModal';
import CashGuide from '../withdrawModal/CashGuide';
import WithdrawModalIndex from '../withdrawModal/WithdrawIndex';

@connect(
  (state, props) => {
    let {
      isMasterGarden, masterUserId, gardenMode, theme, flowerInfo,
      wateringInfo, gifts, beeCode, isHistoryGarden, reviveNum, channelCode, showSuccessActive, showReplantBox,
      drawInfo, propInfo,
    } = getUserGardenDetail(state, props);
    return {
      masterTotalScore: state.scoreInfo.totalScore,
      isMasterGarden,
      masterUserId,
      gardenMode,
      theme,
      flowerInfo,
      wateringInfo,
      gifts,
      isHistoryGarden,
      beeCode,
      reviveNum,
      channelCode,
      showSuccessActive,
      showReplantBox,
      drawInfo,
      propInfo,
    };
  },
  dispatch => bindActionCreators({
    updateGardenInfo,
    updateFriendInfo,
    setTotalScore,
    changeTotalScore,
    switchMasterGardenModeAsync,
    updateReviveNum,
    switchSuccessActive,
    switchShowReplantBox,
    changeTotalCash,
    historyInfo
  }, dispatch),
  null,
  {withRef: true},
)
export default class GardenBody extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      rewardType: '',
      fireWorksActiveVisible: false
    };

    this.isShownVipCard = false

    this.refFlower = ReduxUtil.createRef();
    this.refKettle = ReduxUtil.createRef();
    this.refRevive = ReduxUtil.createRef()
    this.refSpeeder = ReduxUtil.createRef()
  }

  componentDidMount() {
    if(this.props.isMasterGarden && !parseInt(this.props.currUserId)) { // 主态未登录
      this.plantFlower({wateringInfo: {maxWaterDays: 21, waterDays: 0}}); // 仅展示种子动效并写死浇水信息
      // 未登录获取设备积分
      this.fetchDeviceScore()
    } else if(!this.props.isHistoryGarden) {
      this.fetchFlowerDetail();
    }
    if(!this.props.isMasterGarden && this.props.gardenMode === GARDEN_ENUM.MODE.Cash) {
      sendPagePingback('moneyRN_guest')
    } else if(this.props.isMasterGarden && this.props.gardenMode === GARDEN_ENUM.MODE.Cash) {
      sendPagePingback('moneyRN')
    }
    sendPagePingback(`flower_${this.props.gardenMode}`)
    sendPagePingback('flower_pv')
  }

  render() {
    const {
      isMasterGarden,
      visible,
      isHalfScreen,
      currUserId,
      gardenMode,
      isHistoryGarden,
      flowerInfo,
      wateringInfo,
      gardenHeight,
      rightTopControllersPageY,
      playCoinJumpAnimated,
      showTipBubble,
      showConfirmModal,
      hideConfirmModal,
      back,
      beeCode,
      showSuccessActive,
      showReplantBox
    } = this.props;
    const {
      rewardType,
      fireWorksActiveVisible
    } = this.state;
    const {
      GardenDecorations,
      Pig,
      WithdrawCardButton,
    } = MyFlowerConfig[gardenMode].Components;

    return (
      <View style={[styles.container, !visible && styles.gardenBodyInvisible]}>
        {/* 背景装饰(主态必须要在获取到花儿数据后再显示, 否则进入页面会造成一个冗余的场景切换) */}
        <GardenDecorations currUserId={currUserId}/>

        {!!flowerInfo && !!wateringInfo && !showReplantBox && (
          <View style={[styles.gardenBody]}>
            {/* 花朵 */}
            <Flower
              ref={this.refFlower}
              onPotAnimationEnd={this.onPotAnimationEnd}
              showTipBubble={showTipBubble}
              openWeb={this.props.openWeb}
              currUserId={currUserId}
              isHalfScreen={isHalfScreen}
              isHistoryGarden={isHistoryGarden}
              shareToFriends={this.props.shareToFriends}
              hideTipBubble={this.props.hideTipBubble}
            />

            {/* 水壶 */}
            {flowerInfo.type !== 'faded' && flowerInfo.type !== 'pot' && flowerInfo.type !== 'vip' && (
              <Kettle
                ref={this.refKettle}
                currUserId={currUserId}
                watering={this.watering}
                showTipBubble={showTipBubble}
              />
            )}

            {/* 重新种植用的种子 */}
            {((isMasterGarden && flowerInfo.type === 'faded') || (isMasterGarden && flowerInfo.type === 'vip' && gardenMode === GARDEN_ENUM.MODE.Cash && !isHistoryGarden)) && (
              <ReplantSeed
                showConfirmModal={showConfirmModal}
                hideConfirmModal={hideConfirmModal}
                revive={this.revive}
                plantFlower={this.plantFlower}
                shareToFriends={this.props.shareToFriends}
                theme={this.props.theme}
                currUserId={currUserId}
                showSelectSeedBox={this.showSelectSeedBox}
                replant={this.replant}
                showSuccessActive={showSuccessActive}
              />
            )}

            {/* 提现卡 */}
            {isMasterGarden && !isHalfScreen && !isHistoryGarden && (
              <WithdrawCardButton
                gardenMode={gardenMode}
                showConfirmModal={showConfirmModal}
                hideConfirmModal={hideConfirmModal}
                theme={this.props.theme}
              />
            )}

            {/* 加速肥 */}
            {isMasterGarden && !isHalfScreen && !isHistoryGarden && !!flowerInfo && !!wateringInfo && (
              <SpeedUpButton
                currUserId={currUserId}
                ref={this.refSpeeder}
                watering={this.watering}
                showConfirmModal={showConfirmModal}
                hideConfirmModal={hideConfirmModal}
                openWeb={this.props.openWeb}
                showTipBubble={this.props.showTipBubble}
              />
            )}

            {/* 复活肥 */}
            {isMasterGarden && !isHalfScreen && !isHistoryGarden && !!flowerInfo && (
              <ReliveButton
                currUserId={currUserId}
                revive={this.revive}
                ref={this.refRevive}
                shakeSpeederButton={this.shakeSpeederButton}
                openWeb={this.props.openWeb}
                showConfirmModal={showConfirmModal}
                hideConfirmModal={hideConfirmModal}
              />
            )}

            {/* 奖励气泡 */}
            {isMasterGarden && flowerInfo.type !== 'faded' && !!wateringInfo.wateredToday && !!rewardType && !!gardenMode && (
              <RewardBubble
                gardenMode={gardenMode}
                flowerInfo={flowerInfo}
                rewardType={rewardType}
                pickupReward={this.pickupReward}
                theme={this.props.theme}
              />
            )}

            {/* 蜜蜂 */}
            {!isHalfScreen && flowerInfo.type !== 'faded' && flowerInfo.type !== 'vip' && !!wateringInfo.wateredToday && gardenHeight > 0 && !!beeCode && (
              <Bee
                currUserId={currUserId}
                gardenHeight={gardenHeight}
                rightTopControllersPageY={rightTopControllersPageY}
                showConfirmModal={showConfirmModal}
                hideConfirmModal={hideConfirmModal}
                playCoinJumpAnimated={playCoinJumpAnimated}
                onBeeCatchFail={this.onBeeCatchFail}
                shakeReviveButton={this.shakeReviveButton}
                gotoOrderList={this.props.gotoOrderList}
              />
            )}

            {/* 客态页面展示回家按钮 */}
            {!isMasterGarden && (
              <HomeBackButton back={back}/>
            )}

            {/* 小花
            {isMasterGarden &&
              <HistoryFlower currUserId={currUserId} isHistoryGarden={isHistoryGarden}/>
            } */}
          </View>
        )}

        {/* 金钱花树下的猪 */}
        {!!flowerInfo && flowerInfo.type !== 'pot' && flowerInfo.type !== 'seed' && <Pig currUserId={currUserId} isHistoryGarden={isHistoryGarden}/>}
        {/* 礼花动效 */}
        {fireWorksActiveVisible && <FireWorksActive/>}

        {/* 培育成功动效 */}
        {(showSuccessActive || isHistoryGarden) && (
          <PlantSuccessActive
            onSuccessActiveEnd={this.onSuccessActiveEnd}
            onPlantSuccessStart={this.showCashModal}
            loop={isHistoryGarden}
          />
        )}

        {/* 种植成功后出现的重新种植按钮 */}
        {showReplantBox && !isHistoryGarden && (
          <ReplantBox
            replant={this.replant}
            isVisible={showReplantBox}
            showSelectSeedBox={this.showSelectSeedBox}
          />
        )}
      </View>
    );
  }

  // fetchDeviceScore 获取设备积分
  fetchDeviceScore = async () => {
    const data = await fetchDeviceScoreInfo(false)
    if(data.totalScore > -1) {
      this.props.setTotalScore(data.totalScore)
    }
  }

  fetchFlowerDetail = () => {
    fetchFlowerDetail({userId: this.props.currUserId})
      .then(({statusCode, totalScore, wateringInfo, gifts, flowerNewBorn, mode, beeCode, channelCode, name, drawInfo, daysInfo, propInfo, consumeEnd, consumeStart, bookInfo}) => {
        sendPagePingback(`${channelCode}_pv`)
        if(this.props.isMasterGarden) {
          this.props.setTotalScore(totalScore);
          // 主态模式只有在变化后才触发切换
          if(mode !== this.props.gardenMode) {
            return this.props.switchMasterGardenModeAsync(mode).then(() => {
              return {statusCode, wateringInfo, gifts, flowerNewBorn, beeCode, channelCode, drawInfo, daysInfo, propInfo, consumeEnd, consumeStart, bookInfo}
            })
          }
        }
        return {statusCode, wateringInfo, gifts, flowerNewBorn, beeCode, channelCode, name, drawInfo, daysInfo, propInfo, consumeEnd, consumeStart, bookInfo};
      })
      .then(({statusCode, wateringInfo, gifts, flowerNewBorn, beeCode, channelCode, name, drawInfo, daysInfo, propInfo, consumeEnd, consumeStart, bookInfo}) => {
        // 花朵相关初始化
        let flowerType = this.getFlowerTypeByStatusCode(statusCode);
        const flowerInfo = this.props.theme.flower[flowerType];
        this.props.updateGardenInfo(this.props.currUserId, {
          flowerInfo,
          wateringInfo,
          gifts,
          beeCode,
          channelCode,
          name,
          drawInfo,
          daysInfo,
          propInfo,
          consumeEnd,
          consumeStart,
          bookInfo
        });
        if(flowerNewBorn) { // 用户第一次种下种子 或者 一个周期后再次出现种子态
          if(this.props.isMasterGarden) {
            this.showSelectSeedBox()
          }
          // askToPlantFlower({force: false, userId: this.props.currUserId, channelCode}).then(this.plantFlower);
        } else if(flowerType) {
          // 如果当前天有礼物气泡则显示之
          this.showGiftBubbleIfNeeded(wateringInfo, gifts);
          // 如果当前是vip花显示奖励蒙层
          this.fetchIsNeedToShowVipCard()
          this.showNewPlayGuide()
        }
      })
      .catch(() => {
        showToast('网络异常，请稍后再试');
      });
  };

  fetchIsNeedToShowVipCard = () => {
    const {statusCode} = this.props.flowerInfo
    const {channelCode} = this.props
    const flowerType = this.getFlowerTypeByStatusCode(statusCode)
    if(flowerType === 'vip' && this.props.isMasterGarden) {
      // 初代花、有才花
      if(DRAW_ENUM.CHANNEL_CODE_SCOPE.includes(channelCode)) {
        fetchHasShowVipCard().then((vipShow) => {
          if(vipShow) {
            this.props.switchSuccessActive(true)
          } else {
            this.props.switchShowReplantBox(true)
          }
        })
      }
      // 金钱花
      if(channelCode === GARDEN_ENUM.CHANNEL_CODE.Money) {
        this.props.switchSuccessActive(true)
      }
    }
  }

  getFlowerTypeByStatusCode = (statusCode) => {
    return Object.keys(this.props.theme.flower).find(key => this.props.theme.flower[key].statusCode === statusCode);
  };

  plantFlower = ({wateringInfo, gifts, beeCode, channelCode}) => {
    this.props.hideTipBubble(); // 重新种植前尝试移除枯萎花朵的提示气泡
    this.props.updateGardenInfo(this.props.currUserId, {
      flowerInfo: this.props.theme.flower.pot,
      wateringInfo: {...wateringInfo, wateredToday: false}, // 第一次种下, 先标记为未浇水状态, 后续完成动效后, 更新状态
      gifts,
      beeCode,
      channelCode
    });
  };

  onPotAnimationEnd = () => {
    this.props.updateGardenInfo(this.props.currUserId, {flowerInfo: this.props.theme.flower.seed}).then(() => {
      runEventOnce(`NEW_GUIDE_${global.USER_INFO.userId}`).then(() => {
        this.props.showConfirmModal({
          content: <NewGuideModal
            currUserId={this.props.currUserId}
            gardenHeight={this.props.gardenHeight}
            hide={this.props.hideConfirmModal}
            show={this.props.showConfirmModal}
            showNewPlayGuide={this.showNewPlayGuide}
          />,
          showCloseButton: false,
        })
        .then(() => {
          // 金钱花在浇水引导后弹出新手引导
          if(this.props.gardenMode === GARDEN_ENUM.MODE.Cash) {
            this.showCashGuide(() => {
              this.refFlower.getInstance().then(ref => ref.displayNewGuideTip())
            })
          }
        })
      }).catch(() => {
        // 没有浇水引导的情况下尝试展示一次 金钱花引导
        if(this.props.gardenMode === GARDEN_ENUM.MODE.Cash) {
          this.showCashGuide()
        }
      })
    });
  };

  showGiftBubbleIfNeeded = (wateringInfo, gifts) => {
    // 当前天存在解锁状态的礼物, 显示礼物气泡
    if(gifts.some(gift => gift.days === wateringInfo.waterDays && gift.status === GARDEN_ENUM.GIFT_STATUS.unlocked)) {
      this.setState({rewardType: 'gift'});
    } else {
      this.setState({rewardType: null});
    }
  };

  replant = ({force = true, channelCode = 'rose'} = {}) => {
    sendClickPingback('flower_page', '800604', 'restartbtn');
    this.props.switchSuccessActive(false)
    this.props.switchShowReplantBox(false)
    // askToPlantFlower({force, userId: global.USER_INFO.userId, channelCode}).then(({wateringInfo, gifts, beeCode}) => {
    //   this.plantFlower({wateringInfo, gifts, beeCode, channelCode});
    // }).catch(() => {
    //   showToast('铲除失败，稍后再试~')
    // })

    const gardenMode = GARDEN_ENUM.CHANNELCODE_MODE[channelCode]
    askToPlantFlower({force, userId: global.USER_INFO.userId, channelCode}).then(({wateringInfo, gifts, beeCode, name}) => {
      // 异步切换到金钱花场景
      this.props.switchMasterGardenModeAsync(gardenMode).then(() => {
        this.props.updateGardenInfo(this.props.masterUserId, {
          flowerInfo: MyFlowerConfig[gardenMode].theme.flower.pot,
          wateringInfo: {...wateringInfo, wateredToday: false}, // 第一次种下, 先标记为未浇水状态, 后续完成动效后, 更新状态
          gifts,
          beeCode,
          channelCode,
          name
        });
      });
    }).catch(() => {
      showToast('网络异常，请稍后再试');
    });
  };

  showVipCardModalIfNeeded = (flowerType) => {
    const {drawInfo} = this.props
    if(flowerType === 'vip'
      && drawInfo && drawInfo.lottery
      && this.props.isMasterGarden
      && !this.props.isHistoryGarden
      && DRAW_ENUM.SCOPE.includes(this.props.gardenMode)
      && !this.isShownVipCard // 未展示过VIP抽奖弹窗
    ) {
      this.showDrawModal().then((isPositive) => {
        // 如果是点击背景或按钮关闭, 则展示结果页
        if(!isPositive) {
          this.props.switchSuccessActive(false)
          this.props.switchShowReplantBox(true)
        }
      })
    } else if(flowerType === 'vip'
      && this.props.isMasterGarden
      && !this.props.isHistoryGarden
      && DRAW_ENUM.SCOPE.includes(this.props.gardenMode)
    ) {
      this.props.switchSuccessActive(false)
      this.props.switchShowReplantBox(true)
    }
  }

  // 点击气泡领取奖励，金钱花直接领取，初代花+有才花参与抽奖
  pickupReward = () => {
    const {gardenMode} = this.props
    const {rewardType} = this.state

    if(rewardType === 'gift') {
      // 金钱花，获得积分奖励
      if(gardenMode === GARDEN_ENUM.MODE.Cash) {
        this.pickupCashReward()
        // 移除奖励气泡
        this.setState({rewardType: null})
      }

      // 初代花、有才花
      if(DRAW_ENUM.SCOPE.includes(gardenMode)) {
        const {drawInfo} = this.props
        // 中奖信息
        if(drawInfo && drawInfo.lottery) {
          // 积分、vip卡采用抽奖形式
          if([0, 1].includes(drawInfo.lottery.type)) {
            this.showDrawModal()
            return
          }

          // type = 2 || 3 也执行领取接口，通知后端更改日历状态
          askToGetDrawReward(drawInfo.lottery.id)
          this.switchGiftStatus()

          // 实物商品券
          if(drawInfo.lottery.type === 2) {
            this.props.showConfirmModal({
              showCloseButton: true,
              content: (
                <CouponModal
                  rewardInfo={{
                    itemName: drawInfo.lottery.description,
                    itemImg: drawInfo.lottery.image || '',
                  }}
                  hide={this.props.hideConfirmModal}
                  gotoOrderList={this.props.gotoOrderList}
                />
              ),
            })

            this.setState({rewardType: null}) // 移除奖励气泡
          }

          // 花儿道具（复活肥、提现卡）
          if(drawInfo.lottery.type === 3) {
            const {amount: count, raw: {daojuSubType}} = drawInfo.lottery
            let collectProcessModalProps = {}

            // 复活卡
            if(parseInt(daojuSubType) === 18) {
              collectProcessModalProps = {
                cards: {
                  fertilizer: {count}
                },
                hide: () => {
                  return this.props.hideConfirmModal().then(() => {
                    this.props.updateReviveNum(this.props.reviveNum + count)
                  })
                }
              }
            } else if(parseInt(daojuSubType) === 19) { // 提现卡
              collectProcessModalProps = {
                cards: {
                  withdraw: {count}
                },
                desc: '',
                show: this.props.showConfirmModal,
                hide: this.props.hideConfirmModal,
              }
            }

            this.props.showConfirmModal({
              content: <CollectProcessModal {...collectProcessModalProps}/>,
              showCloseButton: false,
            })

            this.setState({rewardType: null}) // 移除奖励气泡
          }

        }
      }
    }
  }

  // 手动切换日历礼物状态
  switchGiftStatus = () => {
    const {waterDays} = this.props.wateringInfo
    const gifts = (this.props.gifts || []).map((gift) => {
      return {
        ...gift,
        status: (gift.days === waterDays && gift.status === 1) ? 9 : gift.status
      }
    })
    this.props.updateGardenInfo(this.props.currUserId, {gifts})
  }

  // 弹出抽奖弹窗
  showDrawModal = () => {
    // 浇水21天自动抽奖
    const isTwenty = this.props.wateringInfo && this.props.wateringInfo.waterDays === 21

    return this.props.showConfirmModal({
      showCloseButton: true,
      content: (
        <DrawBody
          gardenMode={this.props.gardenMode}
          autoPlay={isTwenty}
          getReward={this.getReward}
          onBeginning={() => {
            if(!isTwenty) {
              // 点击抽奖按钮时移除气泡
              this.setState({rewardType: null})
              this.switchGiftStatus()
            }
          }}
          hideConfirmModal={this.props.hideConfirmModal}
        />
      ),
    }).then(() => {
      if(isTwenty) {
        askToCloseVipModal()
      }
    })
  }

  // 抽奖结束，领取各类型奖励
  getReward = (mode, {amount = 0}) => {
    // 领取抽奖积分
    if(mode === DRAW_ENUM.MODE.Score) {
      this.refFlower.getInstance().then(ref => ref.popupScoreTip(amount))
      this.props.changeTotalScore(amount)
    }
    // 去激活vip
    if(mode === DRAW_ENUM.MODE.Vip) {
      this.isShownVipCard = true
      this.props.gotoOrderList()
    }
  }

  // 领取金钱花奖励
  pickupCashReward = () => {
    askToGetReward({userId: this.props.currUserId}).then((data) => {
      let gifts = (this.props.gifts || []).map((gift) => {
        return Object.assign({}, gift, gift.days === data.days ? data : {});
      });
      this.props.updateGardenInfo(this.props.currUserId, {gifts});

      // 浇水21天
      const isTwenty = this.props.wateringInfo && this.props.wateringInfo.waterDays === 21
      this.props.changeTotalCash(data.score)
      this.props.showConfirmModal({
        content: (
          <RewardMoneyModal
            money={formatCash(data.score)}
            autoClose={!isTwenty}
            hide={() => {
              this.props.hideConfirmModal().then(() => {
                // 浇水21天，点击红包气泡展示获得奖励弹窗后，继续展示可以提现弹窗
                if(isTwenty) {
                  this.props.showWithdrawModal()
                }
              })
            }}
          />
        ),
        showCloseButton: false
      })
    })
  }

  /**
   * 浇水
   * @param {object} params 浇水参数，目前属性有，speedUp: 是否由加速液触发（2019.04.06）；
  */
  watering = (params = {}, orderCode = '') => {
    const {waterCostScore} = this.props.wateringInfo

    if((!params || !params.speedUp) && this.props.masterTotalScore < waterCostScore) {
      showToast('积分不足，去赚点积分吧~');
    } else {
      // 发送浇水请求
      askToWatering({
        userId: this.props.currUserId,
        helper: this.props.masterUserId,
        channelCode: this.props.channelCode,
        ...params,
      }, orderCode)
        .then(({statusCode, wateringInfo, gifts, moneyRed, beeCode, drawInfo, propInfo}) => {
          sendPagePingback(`water_${getObjectValueSafely(this.props, 'channelCode')}`)
          if(this.props.currUserId === this.props.masterUserId) {
            sendClickPingback('flower_page', '', 'water_inside')
          } else {
            const {page, block, rseat} = PingbackConfig[this.props.gardenMode].waterGuest
            sendClickPingback(page, block, rseat)
          }
          if(this.props.gardenMode === GARDEN_ENUM.MODE.Cash) {
            // 金钱花特殊处理
            const {page, block, rseat} = PingbackConfig[this.props.gardenMode].waterMaster
            sendClickPingback(page, block, rseat)
          }
          if(this.props.channelCode === GARDEN_ENUM.CHANNEL_CODE.Genius) {
            sendClickPingback('flower_page', 'talent_block', 'water_talent')
          }

          // 扣积分（使用加速液不扣积分）
          if(!params || !params.speedUp) {
            this.props.changeTotalScore(wateringInfo.waterCostScore * -1)
          }

          // 水壶浇水动效
          this.refKettle.getInstance().then(ref => ref.watering()).then(() => {
            if(this.props.flowerInfo && this.props.flowerInfo.type === 'seed') {
              this.refFlower.getInstance().then(ref => ref.playFlowerAnimation()).then(() => {
                this.onWateringDone({statusCode, wateringInfo, gifts, moneyRed, beeCode, drawInfo, propInfo}, params);
              });
            } else {
              this.onWateringDone({statusCode, wateringInfo, gifts, moneyRed, beeCode, drawInfo, propInfo}, params);
            }
          })
        })
        .catch((data) => {
          if(data.code === 'A00004') {
            showToast('你的帐号风险较大，请24小时后再进行操作');
          } else if(data.data.code === 'A0001') {
            showToast('浇水失败，请稍后再试');
          } else {
            showToast(data.data.message);
          }
        })
    }
  };

  /**
   * 完成浇水动画后, 更新花儿&水壶
   * @param {object} info 花儿信息
   * @param {object} params 浇水参数，同 this.watering
  */
  onWateringDone = ({statusCode, wateringInfo, gifts, moneyRed, beeCode, drawInfo, propInfo}, params = {}) => {
    let flowerType = this.getFlowerTypeByStatusCode(statusCode);
    this.props.updateGardenInfo(this.props.currUserId, {
      flowerInfo: this.props.theme.flower[flowerType],
      wateringInfo,
      gifts,
      beeCode,
      drawInfo,
      propInfo,
    }).then(() => {
      setTimeout(() => { // 延迟以便确保新花完成layout
        const {currUserId, masterUserId} = this.props
        if(currUserId === masterUserId) { // 主态页面浇完水后展示礼物预告和浇水提醒气泡
          this.refFlower.getInstance().then((ref) => {
            ref.playFlowerAnimation();
            ref.displayRewardForecastTip().then(ref.setWateringNotificationTip);
            // 浇水有操作加速液
            this.handleSpeederOnWatered(params)
          });
          if(flowerType === 'vip') {
            this.props.switchSuccessActive(true)
            this.setState({fireWorksActiveVisible: true})
          }
        } else { // 客态页面只展示浇水感谢
          this.refFlower.getInstance().then((ref) => {
            ref.playFlowerAnimation();
            ref.displayWateredToFriendsTip({userId: this.props.currUserId});
          });
        }
      }, 500);
    })

    // 帮好友浇水，更新好友信息
    if(!this.props.isMasterGarden) {
      this.props.updateFriendInfo(this.props.currUserId, {wateredToday: true});
    }

    // 21天浇完水后更新历史列表接口
    if(this.props.flowerInfo && this.props.flowerInfo.type === 'vip' && this.props.isMasterGarden) {
      this.fetchHistoryList()
    }

    // 浇水之后可能会返回红包
    if(moneyRed) {
      this.props.changeTotalCash(moneyRed)
      this.props.showConfirmModal({
        content: (
          <RewardMoneyModal
            money={formatCash(moneyRed)}
            autoClose={true}
            hide={() => this.props.hideConfirmModal()}
          />
        ),
        showCloseButton: false
      });
    }

    this.showGiftBubbleIfNeeded(wateringInfo, gifts)
  };

  // 金钱花初次浇水之后弹框引导
  showCashGuide = (cb = () => null) => {
    return runEventOnce(`${STORAGE_ENUM.CASH_NEW_GUIDE}_${global.USER_INFO.userId}`).then(() => {
      this.props.showConfirmModal({
        content: <CashGuide
          hide={this.props.hideConfirmModal}
        />,
        showCloseButton: false,
      })
      .then(() => {
        cb && cb()
      })
    })
  }

  revive = (item) => {
    if(this.props.flowerInfo && this.props.flowerInfo.type === 'faded') {
      const orderCode = getObjectValueSafely(item, 'orderCode')
      askToRevive(orderCode).then(({statusCode, wateringInfo, gifts, beeCode}) => {
        this.props.hideTipBubble()
        if(wateringInfo) {
          let flowerType = this.getFlowerTypeByStatusCode(statusCode);
          const flowerInfo = this.props.theme.flower[flowerType]
          this.refRevive.getInstance().then(ref => ref.playReviveAnimation());
          this.refFlower.getInstance().then(ref => ref.playFlowerAnimation());
          setTimeout(() => {
            this.props.updateGardenInfo(this.props.currUserId, {flowerInfo, wateringInfo, gifts, beeCode});
            this.refFlower.getInstance().then(ref => ref.playFlowerAnimation());
          }, 1800)
        }
        this.props.updateReviveNum(this.props.reviveNum - 1)
      }).catch(() => {
        showToast('复活机会已经用完了哦')
      })
    }
  }

  onBeeCatchFail = () => {
    this.refFlower.getInstance().then(ref => ref.popupBeeCatchFailTip());
  };

  // 完成任务后回调更新组件
  fetchNewPropsInfo = () => {
    this.refRevive.getInstance().then(ref => {
      ref.fetchNewPropsInfo()
      ref.fetchFertilizerInfo();
    });
    this.refSpeeder && this.refSpeeder.getInstance().then(ref => ref.getSpeederInfo());
  }

  shakeReviveButton = () => {
    this.refRevive.getInstance().then(ref => ref.shakeReviveButton());
  }

  shakeSpeederButton = () => {
    this.refSpeeder && this.refSpeeder.getInstance().then(ref => ref.shakeButton());
  }

  showSpeedBubble = () => {
    this.refSpeeder && this.refSpeeder.getInstance().then(ref => ref.showSpeedBubble());
  }

  // 第一次展示加速液，显示提示气泡
  showSpeederGuideOnce = () => {
    const {propInfo} = this.props
    if(propInfo) {
      const {speedTotalCount} = propInfo
      // 每次浇完水，从未使用过加速肥则抖动按钮
      if(!speedTotalCount) {
        this.shakeSpeederButton()
      }
      // 加速肥按钮气泡引导，只展示一次
      runEventOnce(`SHOW_SPEEDER_GUIDE_${global.USER_INFO.userId}`).then(() => {
        if(!speedTotalCount) {
          this.showSpeedBubble()
        }
      })
    }
  }

  // 培育成功动效后自动弹出奖励
  onSuccessActiveEnd = () => {
    if(this.props.isMasterGarden) {
      this.showVipCardModalIfNeeded('vip')
    }
  }

  // 金钱花立即弹框
  showCashModal = () => {
    if(this.props.isMasterGarden && this.props.gardenMode === GARDEN_ENUM.MODE.Cash && !this.props.isHistoryGarden) {
      // 金钱花
      this.props.showConfirmModal({
        content: <WithdrawModalIndex
          openWeb={this.props.openWeb}
          show={this.props.showConfirmModal}
          hide={this.props.hideConfirmModal}
        />,
        showCloseButton: true
      })
    }
  }

  // 浇水后处理加速液
  handleSpeederOnWatered = (params = {}) => {
    if(params && params.speedUp) {
      this.refSpeeder.getInstance().then(_ref => _ref.onWaterDone()) // 浇水后解禁加速液
    }
    this.showSpeederGuideOnce()
  }

  showSelectSeedBox = () => {
    this.props.showConfirmModal({
      content: <PickSeedModal
        hideConfirmModal={this.props.hideConfirmModal}
        replant={this.replant}
      />,
      showCloseButton: false,
      pressBgCloseModal: false
    })
  }

  showNewPlayGuide = () => {
    const key = STORAGE_ENUM.NEW_PLAY_GUIDE
    getStorage(key).then((data) => {
      if(!data) {
        this.props.showConfirmModal({
          content: <LotteryGuideModal hide={this.props.hideConfirmModal}/>,
          showCloseButton: false
        })
        setStorage(key, true)
      }
    })
  }

  fetchHistoryList = () => {
    fetchHistory().then((list) => {
      if(list.length) {
        this.props.historyInfo(list)
      }
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  gardenBody: {
    width: DEVICE_WIDTH,
    flex: 1,
    alignSelf: 'center',
  },
  gardenBodyInvisible: {
    position: 'absolute',
    left: 99999,
  },
});
