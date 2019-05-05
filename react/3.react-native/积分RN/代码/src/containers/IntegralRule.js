/*
 * Created by liqian
 */
import React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from '@iqiyi/rn-ui';
import NavBar from '../components/DefaultNavBar';
import WebImage from '../components/WebImage';
import {hideLoading} from '../common/QYNativeBridge';
import {sendPagePingback} from '../common/pingback';
import BasePage from '../components/BasePage';

const {width} = Dimensions.get('window');

const ruleArray = [
  {
    title: '积分可以用来做什么？',
    content: '积分目前可以用来抢拍会员卡、兑换商品、购物抵扣，更多丰富功能等你来发现～'
  },
  {
    title: '我要怎么获得积分呢？',
    content: ''
  },
  {
    title: '深度任务又是什么？',
    content:
      '深度任务结合了一次性任务和每日任务，以任务序列的形式依次展示，每完成一项任务并领取奖励后即会出现下一项任务，帮助你快速收获爱奇艺积分！'
  },
  {
    title: '任务完成后，积分就自动到我的账户？',
    content:
      '不是，任务完成后需要回到任务中心页面领取积分噢～未领取的积分将在每日24点失效，快去使用你的积分吧！'
  },
  {
    title: '未登录情况下获得积分，提取到帐号上为何会失败？',
    content:
      '在任务中心登录后会把帐号和当前设备绑定。之后该设备在未登录情况下完成的任务、获取的积分都会同步到该帐号，无法同步到其他帐号上。同时，更希望你登录帐号来做任务哦，更多会员卡福利等你来拿'
  },
  {
    title: '积分存在有效期吗？',
    content: '存在的，积分有效期为获取之日起至次年的6月1日。如在2017年9月1日获得的10积分，将在2018年6月1日过期清零。在使用积分时，将会优先使用过期积分。'
  },
  {
    title: '兑换或购买的商品物流等信息，该去哪里查看与反馈呢？',
    content: '可在爱奇艺首页－商城入口－我的订单中查看对应订单与联系商家客服。'
  },
  {
    title: '获得和兑换的积分值有问题，该去哪里反馈呢？',
    content: '一经兑换成功积分不退还，如出现其他问题或产品相关建议，可在以下对应渠道。'
  }
];

export default class IntegralRule extends BasePage {

  pageName = 'integral_rules'

  componentDidMount() {
    hideLoading()
    sendPagePingback(this.pageName)
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          title="积分规则"
          type="black"
          titleColor="#333333"
          backgroundColor="#ffffff"
          backPress={this.back}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[0].title}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <Text style={{lineHeight: 25, color: '#333333', marginLeft: 2}}>{ruleArray[0].content}</Text>
            </View>
          </View>

          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[1].title}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <View>
                <Text style={{lineHeight: 25, color: '#333333'}}>
                  通过做任务赚取积分。在手机端、ipad端、网页端、电脑端都有不同的任务可以获得积分，并且每端之间的任务不互通。手机端任务分为挑战任务和每日任务，挑战任务：只可完成一次，每日任务：每日24点重新计算：
                </Text>
                <Text/>
                <Text style={{lineHeight: 25, color: '#333333'}}>1.观看30分钟视频任务</Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>每累计观看视频时长超过30分钟即任务完成，快进不算时长，每日最多完成3次。
                  PS：在哪端完成任务即在哪端领取，不同端（ipad端、网页端、电脑端）不累加时长。
                </Text>
                <Text/>
                <Text style={{lineHeight: 25, color: '#333333'}}>
                  2.分享视频任务
                </Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>
                  分享视频播放页面，点击非全屏页面下方的分享按钮——分享后，点击“返回爱奇艺”——回到爱奇艺播放页，出现”分享成功，领取积分“提示即任务完成，每日最多完成1次
                </Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>
                  PS：泡泡中的视频以及直播不算在该任务范畴内；复制链接、分享专辑页不算完成任务
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[2].title}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[2].content}</Text>
            </View>
          </View>

          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[3].title} </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[3].content}</Text>
            </View>
          </View>
          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[4].title} </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <View>
                <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[4].content}</Text>
              </View>
            </View>
          </View>
          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[5].title} </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[5].content}</Text>
            </View>
          </View>
          <View style={styles.ruleWrap}>
            <View style={styles.questionBox}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[6].title} </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[6].content}</Text>
            </View>
          </View>
          <View style={styles.ruleWrap}>
            <View style={{marginTop: 25, flexDirection: 'row'}}>
              <WebImage style={styles.image} name="question"/>
              <Text style={styles.title}>{ruleArray[7].title} </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 19, width: width - 58}}>
              <WebImage style={styles.answerImg} name="answer"/>
              <View>
                <Text style={{lineHeight: 25, color: '#333333'}}>{ruleArray[7].content}</Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>反馈：</Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>1、爱奇艺在线客服：我的－帮助反馈－在线客服；</Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>2、爱奇艺电话客服：拨打热线电话400-923-7171；</Text>
                <Text style={{lineHeight: 25, color: '#333333'}}>PS：兑换或购买的商品存在疑问有问题，请直接商家客服。</Text>
              </View>
            </View>
          </View>
          <View style={{width: width - 15, paddingBottom: 20, paddingHorizontal: 15}}>
            <Text/>
            <Text style={{lineHeight: 25, color: '#333333'}}>若发现有作弊行为，爱奇艺有权直接取消相关资格，严重者将进行封号处理，本活动解释归爱奇艺所有</Text>
          </View>
          <Text/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
  },
  ruleWrap: {
    width: width - 15,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    color: '#333333',
    width: width - 58,
    textAlign: 'left',
  },
  image: {
    marginRight: 10,
    width: 18,
    height: 16,
  },
  answerImg: {
    marginRight: 10,
    width: 18,
    height: 16,
    marginTop: 5
  },
  questionBox: {
    marginTop: 25,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-start'
  }
});
