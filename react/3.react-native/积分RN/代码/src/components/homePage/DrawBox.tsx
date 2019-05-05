/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 宝箱组件
 * @Date: 2019-04-19 17:34:07
 */
import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';
import {TouchableOpacity, Image} from 'react-native';
import WebImage from '../WebImage';
import {goToLogin, shareWx} from '../../common/util';
import BaseStyleSheet from '../../common/BaseStyleSheet';
import {showToast} from '../../common/QYNativeBridge';
import Marquee from './Marquee';
import {DrawBoxData, AwardResultInfo} from '../../typings/apis/homePage';
import {fetchAwardsResult} from '../../model/homePage';
import {RuleModal, InsufficientIntegralModal, LotterySuccessModal, LotteryLottieModal, DrawBoxbubble} from './DrawBoxModal';
import {getCDNUrl} from '../../constants/configs';

const TASK_LIST_URL = 'TaskList';
const MY_GAIN = 'MyGain';
const WX_APPLET_SHARE = 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/treasurebox/lottery-applet-share.png'; // 默认分享的小程序方图
const REMOTE_IMAGE_URL = getCDNUrl('treasurebox/treasure-open-gif.webp'); // 抽奖成功的动效;
interface DrawBoxProps {
  drawBoxData?: DrawBoxData;
  marqueeList?: AwardResultInfo[];
  fetchData?: Function;
  totalScore?: number;
  goTo: Function;
  setTotalScore: Function;
  refreshAwards: Function;
}
interface State {
  foldRewards: boolean;
  showModal: boolean;
  showLotterySuccessModal: boolean;
  showLotteryLottie: boolean;
  lotteryRewardPic: string;
  lotteryRewardName: string;
  showRuleModal: boolean;
  showDrawBoxBubble: boolean;
  drawBoxStatus: boolean;
}
export default class DrawBox extends PureComponent<DrawBoxProps, {}> {
  state: State = {
    foldRewards: false, // 是否展示所有奖品
    showModal: false, // 是否显示积分不足modal
    showLotterySuccessModal: false, // 抽奖成功弹框
    showLotteryLottie: false, // 抽奖成功动效
    lotteryRewardName: '', // 抽奖成功奖品名称
    lotteryRewardPic: '', // 抽奖成功奖品图片
    showRuleModal: false, // 规则弹框
    showDrawBoxBubble: false, // 点击宝箱弹气泡
    drawBoxStatus: true // 宝箱的动画状态 ture:执行动画
  };

  isRequest = false; // 是否点击开箱抽奖按钮

  componentDidMount() {
    this.prefetchImage();
  }

  render() {
    const {showRuleModal, showModal, showLotterySuccessModal, lotteryRewardName, lotteryRewardPic, showLotteryLottie, showDrawBoxBubble} = this.state;
    const {drawBoxData: {description = '', bubbleText = []} = {}} = this.props;
    return (
      <WebImage style={styles.item} name="treasurebox/treasure-bg">
        {this._renderTopSection()}
        {/* 中间宝箱动效 */}
        {this._renderLottieDrawBox()}
        {/* 宝箱免费开箱按钮 */}
        {this._renderButton()}
        {/* 宝箱底部信息 */}
        {this._renderDrawBottomInfo()}
        {/* 奖品列表 */}
        {this._renderRewardList()}
        {/* 抽奖成功之后先展示动效 */}
        <LotteryLottieModal showLotteryLottie={showLotteryLottie} />
        {/* 抽奖成功弹框 */}
        <LotterySuccessModal
          showLotterySuccessModal={showLotterySuccessModal}
          lotteryRewardName={lotteryRewardName}
          lotteryRewardPic={lotteryRewardPic}
          goMyGainPage={this.goMyGainPage}
          hideLotterySuccessModal={this.hideLotterySuccessModal}
          awakeShare={this.awakeShare}
        />
        {/* 积分不足弹框 */}
        <InsufficientIntegralModal showModal={showModal} convertConfrimBtnFn={this.convertConfrimBtnFn} convertFailCancle={this.convertFailCancle} />
        {/* 活动规则弹框 */}
        <RuleModal showRuleModal={showRuleModal} description={description} hideRuleModal={this.hideRuleModal} />
        {/* 宝箱气泡 */}
        <DrawBoxbubble showDrawBoxBubble={showDrawBoxBubble} bubbleText={bubbleText} />
      </WebImage>
    );
  }

  // 预加载抽奖成功lottie动效
  prefetchImage = () => {
    Image.prefetch(REMOTE_IMAGE_URL);
  };

  // 唤醒分享
  awakeShare = () => {
    const {userId = 0, userName = ''} = global.USER_INFO;
    const {drawBoxData: {userBoostedTimes = 0} = {}} = this.props;
    if(!global.USER_INFO.isLogin) {
      goToLogin();
      return false;
    }
    const params = {
      pic: WX_APPLET_SHARE,
      url: 'https://m.iqiyi.com/', // 此字段不需要
      text: userBoostedTimes < 5 ? '我好想要这个大奖，帮我翻倍一下概率吧！' : '我已经抢到5倍中大奖概率！你不要试试吗？', // 该字段不需要
      title: userBoostedTimes < 5 ? '我好想要这个大奖，帮我翻倍一下概率吧！' : '我已经抢到5倍中大奖概率！你不要试试吗？',
      mp_path: `pages/lottery-help/lottery-help?userId=${userId}&nickName=${encodeURIComponent(userName)}&boostedTimes=${userBoostedTimes}&nickIcon=${
        global.USER_INFO.userIcon
      }`,
      mp_imageUrl: WX_APPLET_SHARE,
      rpage: '',
      shareType: 5 // 小程序
    };
    shareWx(params, this._shareCallBack);
  };

  // 分享成功需要刷新宝箱整体信息
  _shareCallBack = () => {
    const {fetchData} = this.props;
    fetchData && fetchData();
  };

  // 点击开箱按钮
  _draw = () => {
    if(!global.USER_INFO.isLogin) {
      goToLogin();
      return false;
    }
    const {drawBoxData: {newPrice = 0} = {}, totalScore} = this.props;
    // 积分不足
    if(newPrice > totalScore) {
      this.setState({
        showModal: true
      });
      return false;
    }
    if(this.isRequest) return false;
    this.isRequest = true;
    // 积分足够 调抽奖接口
    this.setState(
      {
        // drawBoxStatus: false
      },
      () => {
        fetchAwardsResult()
          .then(res => {
            if(res.winReward) {
              // TODO: 抽奖名称和图片应该是接口返回的 暂时前端从奖品列表中filter获取
              const {drawBoxData: {newRewards = []} = {}} = this.props;
              const curReward = newRewards.find(v => v.rewardId === res.rewardInfo.itemId) || {};
              this.setState(
                {
                  showLotteryLottie: true,
                  lotteryRewardName: `获得${curReward.rewardName}`,
                  lotteryRewardPic: curReward.rewardPic
                },
                () => {
                  setTimeout(() => {
                    this.setState({
                      showLotterySuccessModal: true,
                      showLotteryLottie: false,
                      drawBoxStatus: true
                    });
                  }, 1800);

                  // 抽奖成功 更新用户总积分
                  if(res.totalScore) {
                    this.props.setTotalScore(res.totalScore);
                  }

                  // 抽奖成功刷新弹幕信息
                  this.props.refreshAwards();
                }
              );
            } else {
              showToast('抽奖失败，积分已退回');
            }
          })
          .catch(() => {
            showToast('抽奖失败');
            this.setState({
              drawBoxStatus: true
            });
          })
          .finally(() => {
            this.isRequest = false;
          });
      }
    );
  };

  // 火速赚积分按钮回调
  convertConfrimBtnFn = () => {
    this.props.goTo(TASK_LIST_URL);
    this.setState({
      showModal: false
    });
  };

  // 取消按钮回调
  convertFailCancle = () => {
    this.setState({
      showModal: false
    });
  };

  // 隐藏活动规则弹框
  hideRuleModal = () => {
    this.setState({
      showRuleModal: false
    });
  };

  // 隐藏抽奖成功弹框 并且刷新宝箱信息
  hideLotterySuccessModal = () => {
    this.props.fetchData && this.props.fetchData();
    this.setState({showLotterySuccessModal: false});
  };

  // 跳转我的收获页面
  goMyGainPage = () => {
    this.setState({showLotterySuccessModal: false});
    this.props.goTo && this.props.goTo(MY_GAIN);
  };

  // 点击宝箱
  clickDrawBox = () => {
    // 产品说气泡不要了 直接抽奖
    this._draw();
    // const {drawBoxData: {bubbleText = []} = {}} = this.props;
    // if(!bubbleText.length) {
    //   return false;
    // }
    // this.setState({
    //   showDrawBoxBubble: true,
    //   drawBoxStatus: false
    // });
    // setTimeout(() => {
    //   this.setState({
    //     showDrawBoxBubble: false,
    //     drawBoxStatus: true
    //   });
    // }, 1000);
  };

  _renderTopSection() {
    return (
      <View style={{position: 'absolute', top: 15}}>
        {/* 宝箱顶部提示信息 */}
        {this._renderDrawTopInfo()}
        {/* 循环滚动弹幕 */}
        {this._renderMarquee()}
      </View>
    );
  }

  // 宝箱顶部提示信息
  _renderDrawTopInfo() {
    return (
      <View style={styles.tips}>
        <View style={styles.tipsLeft}>
          <WebImage name="treasurebox/treasure-icon" style={styles.ruleIcon} />
          <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: 13, color: '#333333', marginLeft: 3}}>疯狂宝箱</Text>
          <View style={styles.verticalLine} />
          <Text style={{fontFamily: 'PingFangSC-Medium', fontSize: 11, color: '#C393C8'}}>百分百中奖</Text>
        </View>
        <TouchableOpacity onPress={() => this.setState({showRuleModal: true})}>
          <WebImage name="ic_wenhao_home" style={styles.ruleIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  // 宝箱弹幕消息
  _renderMarquee() {
    return (
      <View style={styles.marqueeWrap}>
        <Marquee
          textList={this.props.marqueeList}
          speed={100}
          width={Width - 55}
          height={17}
          direction="left"
          separator={40}
          reverse={false}
          bgContainerStyle={{backgroundColor: 'transparent'}}
          textStyle={{fontSize: 12, color: '#CFA6D4', lineHeight: 17}}
        />
        <Marquee
          textList={this.props.marqueeList}
          speed={100}
          width={Width - 55}
          height={17}
          direction="left"
          separator={40}
          reverse={false}
          bgContainerStyle={{backgroundColor: 'transparent'}}
          textStyle={{fontSize: 12, color: '#CFA6D4', lineHeight: 17}}
        />
      </View>
    );
  }

  // 宝箱中间位置lottie图片 TODO:使用Image.prefetch 加载webp图片 先加载一个静态图
  _renderLottieDrawBox() {
    const {drawBoxStatus} = this.state;
    const url = drawBoxStatus ? 'treasurebox/treasure-gif.webp' : 'treasurebox/static-treasure-box.png';
    return (
      <TouchableOpacity style={styles.treasureBoxWrap} onPress={this.clickDrawBox} activeOpacity={1}>
        <WebImage style={styles.treasureBox} name={url} />
      </TouchableOpacity>
    );
  }

  // 奖品列表

  _renderRewardList() {
    const {drawBoxData: {newRewards = []} = {}} = this.props;
    const {foldRewards} = this.state;
    if(!newRewards.length) return null;
    const rewards = foldRewards ? newRewards : newRewards.slice(0, 1);
    const rotate = foldRewards ? {rotate: '-90deg'} : {rotate: '90deg'};
    return (
      <TouchableOpacity activeOpacity={1} style={styles.treasureboxNewRewrad} onPress={() => this.setState({foldRewards: !foldRewards})}>
        <View>
          <WebImage style={styles.rewardBigIcon} name="treasurebox/big-prize-icon" />
          <View style={styles.rewardsWrap}>
            {rewards.map(v => {
              return (
                <View style={styles.rewardItem} key={v.rewardId}>
                  <WebImage style={styles.rewardItemImg} name={v.rewardPic} />
                  {!!this.state.foldRewards && <Text style={styles.rewardItemText}>{v.rewardName}</Text>}
                </View>
              );
            })}
          </View>
          <View style={styles.rewardBottomWrap}>
            <Text style={styles.rewardText}>全部奖品</Text>
            <WebImage style={[styles.foldIcon, {transform: [rotate]}]} name="treasurebox/unfold-icon" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // 宝箱按钮
  _renderButton() {
    const {drawBoxBtnText, userBoostedTimes = 0} = this.props.drawBoxData;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.treasureboxBtn} onPress={this._draw}>
        <View style={styles.btnTop}>
          {userBoostedTimes ? (
            <WebImage style={styles.probability} name="treasurebox/probability-bg">
              <Text style={styles.probabilityText}>大奖概率x{userBoostedTimes}</Text>
            </WebImage>
          ) : null}
          <Text style={styles.btnText}>{drawBoxBtnText}</Text>
        </View>
        <View style={styles.btnBottom} />
      </TouchableOpacity>
    );
  }

  // 宝箱底部信息
  _renderDrawBottomInfo() {
    const {shareBtnText, boostHintText} = this.props.drawBoxData;
    return (
      <View style={{position: 'absolute', bottom: 5, right: 4, width: Width - 110}}>
        <View style={styles.treasureboxBottom}>
          <Text />
          <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: 12, color: '#ffffff', lineHeight: 25, fontWeight: '700'}}>{boostHintText}</Text>
          <TouchableOpacity style={styles.double} onPress={this.awakeShare}>
            <Text style={{fontFamily: 'PingFangSC-Semibold', fontSize: 10, color: '#ffffff', fontWeight: '700'}}>{shareBtnText}</Text>
            <WebImage style={styles.wxIcon} name="treasurebox/treasure-wx-icon" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = BaseStyleSheet.create({
  item: {
    width: Width - 55,
    height: 0.95 * (Width - 55),
    paddingTop: 12.5,
    paddingBottom: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tips: {
    paddingLeft: 10,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tipsLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  verticalLine: {
    width: 0.5,
    height: 11,
    backgroundColor: '#E3C7F2',
    marginHorizontal: 5
  },
  ruleIcon: {
    width: 15,
    height: 15
  },
  treasureboxBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 25,
  },
  double: {
    width: 62,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF70C0',
    borderRadius: 12.5,
  },
  wxIcon: {
    width: 20,
    height: 20
  },
  treasureBoxWrap: {
    position: 'absolute',
    zIndex: 6
  },
  // 宝箱位置
  treasureBox: {
    width: 225,
    height: 207
  },
  treasureboxBtn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 35,
    height: 40,
    justifyContent: 'flex-end',
    zIndex: 30
  },
  btnTop: {
    width: 200,
    height: 35,
    backgroundColor: '#FFDD34',
    borderRadius: 35 / 2,
    position: 'absolute',
    top: 0,
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#6F4400',
    fontWeight: '700'
  },
  btnBottom: {
    width: 200,
    height: 35,
    backgroundColor: '#FFB23A',
    borderRadius: 20,
    opacity: 0.73
  },
  rewardBigIcon: {
    width: 25,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 15
  },
  rewardItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  rewardItemImg: {
    width: 68 / 2,
    height: 68 / 2,
    marginBottom: 1.5
  },
  rewardItemText: {
    color: '#ffffff',
    fontSize: 10
  },
  rewardBottomWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rewardText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 9,
    color: '#4A45BD'
  },
  foldIcon: {
    width: 17 / 2,
    height: 16 / 2,
    transform: [{rotate: '90deg'}]
  },
  probability: {
    width: 47,
    height: 11,
    position: 'absolute',
    top: 0,
    right: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  probabilityText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  marqueeWrap: {
    marginTop: 23.5
  },
  treasureboxNewRewrad: {
    width: 125 / 2,
    position: 'absolute',
    left: 0,
    top: 92 / 2,
    zIndex: 50,
    paddingTop: 5,
    paddingHorizontal: 5,
    paddingBottom: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#CBC8FF'
  },
  rewardsWrap: {
    backgroundColor: '#7771F8',
    borderTopRightRadius: 5,
    paddingVertical: 2.5,
    width: 52.5
  }
});
