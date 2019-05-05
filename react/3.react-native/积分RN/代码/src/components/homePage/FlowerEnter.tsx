/**
 * 花儿入口页面
 * 展示优先级
 * 未种植/未登录/已种下种子，未浇水, 当天未浇水, 已浇水，有待领取礼物, 已浇水，1-2天后有待领取礼物, 已浇水，非上面两种情况, 已枯萎
 *  */
import React, {PureComponent} from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import {
  Text
} from '@iqiyi/rn-ui'
import {
  isIOS
} from '@iqiyi/rn-utils'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {setFlowerStatsBar} from '../../actions/HomePageActions'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import WebImage from '../WebImage'
import BubbleAnimation from '../Animation/BubbleAnimation'
import {sendClickPingback} from '../../common/pingback'

const FLOWER_SIZE = 50
const FLOWER_TIPS_TEXT = {
  seedText: isIOS ? '我有福利哦' : '我有vip哦',
  giftText: '天后有礼包',
  shareText: '邀好友来玩',
  deadText: '求复活，呜呜~'
}

interface FlowerMageStatusBarProps {
  navigate?: Function;
  [key: string]: any;
}

@(connect(({homePage}) => {
  const {channelCode, status, waterToday, hasLottery, daysWhenLottery} = homePage.homePageFlower
  return {channelCode, status, waterToday, hasLottery, daysWhenLottery}
}, dispatch => bindActionCreators({setFlowerStatsBar}, dispatch), null, {withRef: true}) as any)
export default class extends PureComponent<FlowerMageStatusBarProps, {}> {

  componentDidMount() {
    this.props.setFlowerStatsBar()
  }

  render() {
    if(!this.props.channelCode && this.props.status === -2) return null
    return (
      <TouchableOpacity style={styles.content} activeOpacity={1} onPress={this.goToFlower}>
        {this.renderDiff()}
      </TouchableOpacity>
    )
  }

  goToFlower = () => {
    sendClickPingback('pointcenter', '', 'flowerbtn')
    this.props.navigate('MyFlower')
  }

  renderDiff = () => {
    const {status} = this.props
    if(status === 0) {
      // 种子状态
      return (
        <React.Fragment>
          <BubbleAnimation style={styles.flowerTipsContent}>
            <Text style={styles.flowerTipsText}>{FLOWER_TIPS_TEXT.seedText}</Text>
          </BubbleAnimation>
          <WebImage name="homepage/seed" style={styles.seed}/>
        </React.Fragment>
      )
    }

    if(status === 1) {
      // 小苗
      return (
        <React.Fragment>
          {this.renderFlowerTips()}
          <WebImage name="homepage/seedling" style={styles.seed}/>
        </React.Fragment>
      )
    }

    if(status === 2) {
      // 成长中 小花
      return (
        <React.Fragment>
          {this.renderFlowerTips()}
          <WebImage name="homepage/growing_flower" style={styles.seed}/>
        </React.Fragment>
      )
    }

    if(status === 3 || status === 9) {
      // 成熟花 或者 可以收获
      return (
        <React.Fragment>
          {this.renderFlowerTips()}
          <WebImage name="homepage/grown_flower" style={styles.seed}/>
        </React.Fragment>
      )
    }

    if(status === -1) {
      // 枯萎
      return (
        <React.Fragment>
          <BubbleAnimation style={styles.flowerTipsContent}>
            <Text style={styles.flowerTipsText}>{FLOWER_TIPS_TEXT.deadText}</Text>
          </BubbleAnimation>
          <WebImage name="homepage/wither_flower" style={styles.seed}/>
        </React.Fragment>
      )
    }

    return null
  }

  // 幼苗期、成长期、成熟期 花期文字，浇水 》待领取 》 未来礼物 》 分享
  renderFlowerTips = () => {
    const {daysWhenLottery, hasLottery, waterToday, status} = this.props
    if(!waterToday) {
      // 未浇水 幼苗期水滴矮一些
      const top = status === 1 ? 25 : 15
      return (
        <WebImage name="homepage/water_drop" style={[styles.waterDrop, {top}]} />
      )
    }
    if(hasLottery) {
      // 待领取 或则 只有未来礼物的时候显示情况一致
      return (
        <BubbleAnimation style={styles.giftBubble}>
          <WebImage name="homepage/gift_bubble" style={styles.giftBubbleImg} />
        </BubbleAnimation>
      )
    }
    if(daysWhenLottery > 0 && daysWhenLottery < 3) {
      // 待领取 或则 只有未来礼物的时候显示情况一致
      return (
        <BubbleAnimation>
          <View style={styles.flowerTipsContent}>
            <Text style={styles.flowerTipsText}>{daysWhenLottery}{FLOWER_TIPS_TEXT.giftText}</Text>
            <WebImage name="homepage/gift_no_bubble" style={styles.giftNobubble}/>
          </View>
        </BubbleAnimation>
      )
    }
    // 显示文案
    return (
      <BubbleAnimation>
        <View style={styles.flowerTipsContent}>
          <Text style={styles.flowerTipsText}>{FLOWER_TIPS_TEXT.shareText}</Text>
        </View>
      </BubbleAnimation>
    )
  }
}

const styles = BaseStyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15
  },
  seed: {
    width: FLOWER_SIZE,
    height: FLOWER_SIZE,
    position: 'absolute',
    right: 15,
    zIndex: 1
  },
  flowerTipsContent: {
    marginRight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#FFF2E1'
  },
  flowerTipsText: {
    fontSize: 12,
    color: '#FF8C0B'
  },
  giftNobubble: {
    marginLeft: 3.5,
    width: 20,
    height: 21
  },
  waterDrop: {
    width: FLOWER_SIZE,
    height: 28,
    position: 'absolute',
    right: 15,
    zIndex: 2
  },
  giftBubble: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: 45,
    top: 25,
    zIndex: 2
  },
  giftBubbleImg: {
    width: 28,
    height: 28,
  }
})
