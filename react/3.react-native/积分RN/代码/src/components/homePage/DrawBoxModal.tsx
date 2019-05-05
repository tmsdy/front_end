/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 宝箱组件用到的弹框
 * @Date: 2019-04-22 16:49:19
 * @LastEditTime: 2019-04-30 16:26:49
 */

import React from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import {TouchableOpacity, ScrollView} from 'react-native';
import {isIOS} from '@iqiyi/rn-utils';
import WebImage from '../WebImage';
import BaseStyleSheet from '../../common/BaseStyleSheet';
import Modal from '../goodsDetail/ConvertResultModal';
import ConfirmModal from '../ConfirmModal';
// 活动规则弹框
export const RuleModal = props => {
  const {description, showRuleModal} = props;
  if(!description) return null;
  return (
    <ConfirmModal modalVisible={showRuleModal}>
      <View style={styles.ruleContainer}>
        <WebImage style={styles.ruleTitleBg} name="topicpk/modal-rule-bg">
          <Text style={styles.ruleTitle}>活动规则</Text>
        </WebImage>
        <ScrollView style={styles.ruleWrapper}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleText}>{description}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => props.hideRuleModal()}>
          <Text style={styles.buttonText}>我知道了</Text>
        </TouchableOpacity>
      </View>
    </ConfirmModal>
  );
};
// 积分不足弹框
export const InsufficientIntegralModal = props => {
  const {showModal} = props;
  return (
    <Modal
      modalVisible={showModal}
      showCancleBtn={true}
      showCloseBtn={false}
      showConfirmBtnText="火速赚积分"
      content="积分不够啦，宝箱开不了"
      confrimBtnFn={props.convertConfrimBtnFn}
      cancleBtnFn={props.convertFailCancle}
    />
  );
};
// 抽奖成功弹框
export const LotterySuccessModal = props => {
  const {showLotterySuccessModal, lotteryRewardName, lotteryRewardPic = 'treasurebox/default-reward', goMyGainPage, hideLotterySuccessModal, awakeShare} = props;
  return (
    <ConfirmModal modalVisible={showLotterySuccessModal} showCloseButton={true} cancelFn={() => hideLotterySuccessModal()}>
      <WebImage style={styles.lotterySuccessModal} name="treasurebox/treasure-modal-bg">
        <View style={styles.lotterySuccessTop}>
          <WebImage style={styles.title} name="treasurebox/lottery-success-title" />
          <Text style={styles.name}>{lotteryRewardName}</Text>
          <WebImage style={styles.lotteryPic} name={lotteryRewardPic} />
        </View>
        <View style={styles.lotterySuccessBottom}>
          <TouchableOpacity onPress={() => awakeShare()}>
            <View style={styles.lotterySuccessBtn}>
              <Text style={styles.lotterySuccessBtnText}>分享继续抽</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goMyGainPage()}>
            <Text style={styles.seeReward}>查看奖品</Text>
          </TouchableOpacity>
        </View>
      </WebImage>
    </ConfirmModal>
  );
};

// 抽奖成功之后先展示动效
export const LotteryLottieModal = props => {
  const {showLotteryLottie} = props;
  return (
    <ConfirmModal modalVisible={showLotteryLottie}>
      <WebImage style={styles.treasureLottieBox} name="treasurebox/treasure-open-gif.webp" />
    </ConfirmModal>
  );
};

// 点击宝箱时气泡提示

export const DrawBoxbubble = props => {
  const {showDrawBoxBubble, bubbleText} = props;
  if(!showDrawBoxBubble) return null;
  return (
    <View style={{position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 40}}>
      <View style={styles.treasureBubbleWrap}>
        <Text style={styles.treasureBubbleText}>{bubbleText[Math.floor(Math.random() * bubbleText.length)]}</Text>
      </View>
    </View>
  );
};
const styles = BaseStyleSheet.create({
  // 规则弹框
  ruleContainer: {
    width: 270,
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  ruleTitleBg: {
    position: 'relative',
    top: -2,
    width: '100%',
    height: 80,
    borderRadius: 10
  },
  ruleTitle: {
    lineHeight: 23,
    paddingTop: 30,
    paddingBottom: 23,
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold'
  },
  ruleWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    maxHeight: 120
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: 238,
    marginBottom: 7
  },
  ruleText: {
    maxWidth: 226,
    lineHeight: 17.5,
    fontSize: 12,
    color: '#333'
  },
  buttonWrapper: {
    width: 120,
    alignSelf: 'center',
    height: 37,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#FF7E00',
    backgroundColor: 'transparent'
  },
  buttonText: {
    color: '#ff6600',
    fontSize: 16
  },
  // 抽奖成功弹框
  lotterySuccessModal: {
    width: 300,
    height: 340,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20
  },
  title: {
    width: 81.5,
    height: 22.5
  },
  name: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#753FFF',
    marginTop: 5,
    opacity: 0.69
  },
  lotteryPic: {
    width: 90,
    height: 90,
    marginTop: 26
  },
  lotterySuccessBtn: {
    width: 220,
    height: 40,
    backgroundColor: '#FFE562',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lotterySuccessBtnText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#6F4400'
  },
  lotterySuccessTop: {
    alignItems: 'center'
  },
  lotterySuccessBottom: {
    alignItems: 'center'
  },
  seeReward: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 17.5
  },
  // 抽奖成功展示的动画效果
  treasureLottieBox: {
    width: 300,
    height: 340,
    justifyContent: 'center',
    alignItems: 'center'
  },
  treasureBubbleWrap: {
    minWidth: 102,
    height: 25,
    backgroundColor: '#000',
    borderBottomLeftRadius: isIOS ? 3 : 13,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: isIOS ? 13 : 50,
    borderTopRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  treasureBubbleText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FFFFFF'
  }
});
