/**
 * 养花详情页面底部日历
 */
import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {TouchableOpacity, ScrollView} from 'react-native';

import {View, Text} from '@iqiyi/rn-ui';
import {Width, isIOS} from '@iqiyi/rn-utils'

import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import MyFlowerConfig from '../../common/MyFlowerConfig';
import ReduxUtil from '../../common/ReduxUtil';
import {updateGardenInfo, historyInfo} from '../../actions/GardenDetailActions';

import {formatCash} from '../utils';
import {fetchHistory} from '../../model/MyFlower';
import {sendClickPingback} from '../../common/pingback';

import WebImage from '../WebImage';
import HelpModalPrimary from './HelpModal.primary';
import HelpModalCash from './HelpModal.cash';
import PingbackConfig from '../../common/PingbackConfig'

// 大礼包的起始领取日期
const GREAT_GIFT_BEGIN_DAY = 12;
const MONEY = 1;
const COIN = 0;
// 日历高度
const CALENDAR_HEIGHT = 115

interface CalendarsProps {
  [key: string]: any;
}

@(connect(
  ({gardenDetail}) => {
    let {
      isMasterMode,
      isHistoryGardenMode,
      masterGardenMode,
      friendGardenMode,
      friendUserId,
      masterGardenInfo,
      friendsGardenPool,
      historyList,
      illustrationSelected,
      showReplantBox,
    } = gardenDetail,
      gardenMode = isMasterMode ? masterGardenMode : friendGardenMode,
      {theme} = MyFlowerConfig[gardenMode],
      gardenInfo = isMasterMode ? masterGardenInfo : friendsGardenPool[friendUserId],
      {wateringInfo, gifts, daysInfo} = gardenInfo || {};
      const {channelCode} = masterGardenInfo
    return {
      theme,
      wateringInfo,
      gifts,
      daysInfo,
      isHistoryGardenMode,
      historyList,
      channelCode,
      isMasterMode,
      gardenMode,
      illustrationSelected,
      isWithdrawStatus: gardenDetail.isWithdrawStatus,
      showReplantBox,
      masterGardenInfo,
      masterGardenMode,
      gardenInfo
    }
  },
  dispatch => bindActionCreators({
    updateGardenInfo,
    historyInfo
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class Calendars extends PureComponent<CalendarsProps, {}> {
  private currTipTarget = null;
  private refScrollView = ReduxUtil.createRef();

  componentDidMount() {
    this.fetchHistoryList()
  }

  componentDidUpdate(prevProps) {
    if(this.props.wateringInfo && prevProps.wateringInfo && this.props.wateringInfo.waterDays !== prevProps.wateringInfo.waterDays) {
      this.onScrollViewLayout()
    }
  }

  render() {
    const {
      wateringInfo,
      isHistoryGardenMode,
      isMasterMode,
      showReplantBox,
      historyList,
      theme,
      gardenInfo
    } = this.props;
    const {calendars} = theme
    if((!isHistoryGardenMode || !isMasterMode) && !showReplantBox) {
      return (
        <View style={[styles.wrapper, {backgroundColor: calendars.backColor}]}>
          <WebImage name={calendars.topPic.pic} style={[styles.topSoil, {height: calendars.topPic.height}]}/>
          {!!calendars.bottomPic && <WebImage name={calendars.bottomPic} style={styles.bottomSoil}/>}
          {!!wateringInfo && !!gardenInfo && (
            <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 20, marginBottom: 10}}>
              <Text style={styles.calendarTitle}>{gardenInfo.name}</Text>
              {
                isMasterMode
                && (
                  <TouchableOpacity activeOpacity={1} onPress={this._pressHelper}>
                    <WebImage name="calendar_question" style={styles.calendarQuestion}/>
                  </TouchableOpacity>
                  )
              }
            </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                ref={this.refScrollView}
                onLayout={this.onScrollViewLayout}
                onScrollBeginDrag={this.onScrollBeginDrag}
              >
                {Array.from({length: wateringInfo.maxWaterDays}).map((_, i) => (
                  this.renderCalendarItem(i + 1)
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )
    }
    if(showReplantBox) {
      const history = historyList.find(fv => fv.channelCode === this.props.channelCode && fv.completes)
      if(!history) {
        return null
      }
      const {earnings, waters} = history
      let scoreText,
      unit;
      if(this.props.gardenMode !== GARDEN_ENUM.MODE.MONEY) {
        const temp = earnings.find(fv => fv.type === COIN)
        scoreText = temp.score
        unit = '积分'
      } else {
        const temp = earnings.find(fv => fv.type === MONEY)
        scoreText = formatCash(temp.score)
        unit = '元'
      }
      return (
        <View style={[styles.wrapper, {backgroundColor: calendars.backColor}]}>
          <WebImage name={calendars.topPic.pic} style={[styles.topSoil, {height: calendars.topPic.height}]}/>
          {!!calendars.bottomPic && <WebImage name={calendars.bottomPic} style={styles.bottomSoil}/>}
          <View style={styles.resultBoxTitle}>
            <Text style={styles.completeTime}>{gardenInfo.name}</Text>
            <Text style={{color: '#814418', fontSize: 12, textAlign: 'left'}}>已连续浇水21天</Text>
          </View>
          <View style={styles.detailBox}>
            <View style={styles.boxCenter}>
              <WebImage name="myflower_checked" style={styles.beePic}/>
              <Text style={{color: '#814418', fontSize: 11}}>获得奖励:{scoreText}{unit}</Text>
            </View>
            <View style={styles.boxCenter}>
              <WebImage name="tagdrop_icon" style={styles.beePic}/>
              <Text style={{color: '#814418', fontSize: 11}}>好友浇水:{waters}人</Text>
            </View>
          </View>
        </View>
      )
    }

    const {illustrationSelected} = this.props
    return (
      <View style={[styles.wrapper, {backgroundColor: calendars.backColor}]}>
        <WebImage name={calendars.topPic.pic} style={[styles.topSoil, {height: calendars.topPic.height}]}/>
        {!!calendars.bottomPic && <WebImage name={calendars.bottomPic} style={styles.bottomSoil}/>}
        <View style={{flexDirection: 'row', marginTop: 25, width: Width, justifyContent: 'space-between', paddingHorizontal: 17}}>
          <Text style={styles.completeTime}>{illustrationSelected.name}</Text>
          <Text style={{color: '#814418', fontSize: 12, textAlign: 'left'}}>养成{illustrationSelected.completes}次</Text>
        </View>
        <View style={styles.detailBox}>
          <View style={styles.boxCenter}>
            <WebImage name="ill_big_gift" style={styles.beePic}/>
            <Text style={{color: '#814418', fontSize: 11}}>果实：{illustrationSelected.fruit}</Text>
          </View>
          <View style={styles.boxCenter}>
            <WebImage name="ill_date_icon" style={styles.beePic}/>
            <Text style={{color: '#814418', fontSize: 11}}>花期： {illustrationSelected.maxDays}天</Text>
          </View>
        </View>
      </View>
    )
  }

  renderCalendarItem = (day) => {
    const {imageName, text, textColor, opacity, tipInfo, money} = this.getConfigInfoByDay(day);
    return (
      <TouchableOpacity
        onPress={e => this.onPress(e, day, tipInfo)}
        activeOpacity={1}
        key={day}
        style={styles.itemBox}
      >
        <WebImage name={imageName} style={[styles.item, {opacity}]}>
          {!!text && (
            <Text style={[styles.itemText, {color: textColor}]}>{text}</Text>
          )}
          {!!money && (
            <Text style={styles.moneyText}>{`${formatCash(money)}`}</Text>
          )}
        </WebImage>
      </TouchableOpacity>
    )
  };

  onScrollViewLayout = () => {
    // 日历滑动到当前浇水日期
    const {wateringInfo = {}} = this.props
    const {waterDays} = wateringInfo
    const offSet = waterDays > 5 ? waterDays - 4 : 0
    this.refScrollView.getInstance().then(ref => ref.scrollTo({x: offSet * 45, animated: true}));
  };

  onScrollBeginDrag = () => {
    if(this.currTipTarget) {
      this.props.hideTipBubble && this.props.hideTipBubble(this.currTipTarget);
    }
  };

  onPress = ({nativeEvent}, day, tipInfo) => {
    const {isMasterMode, gardenMode, daysInfo} = this.props

    if(!isMasterMode) return

    // 金钱花日历上，花期icon点击投递
    if(daysInfo && !!daysInfo.find(({type, day: _day}) => (type === 'period' && _day === day))) {
      const {page} = PingbackConfig[gardenMode]
      sendClickPingback(page, '', `huaqi_${day}`)
    }

    if(tipInfo) {
      this.props.showTipBubble({
        target: nativeEvent.target,
        tip: tipInfo,
        duration: 1500,
      });
      this.currTipTarget = nativeEvent.target;
    }
  };

  getConfigInfoByDay = (day) => {
    let {wateringInfo = {}, gifts = [], currUserId, gardenMode, daysInfo = []} = this.props,
      imageName = 'myflower_water',
      text = '',
      textColor = '#C08A5B',
      opacity = 1,
      money = 0,
      giftInfo = gifts.find(gift => gift.days === day),
      tipInfo = this.getTipInfo(day, giftInfo);
    const {calendars} = this.props.theme
    if(!parseInt(currUserId)) { // 未登录默认为浇水天数0
      wateringInfo.maxWaterDays = 21
      wateringInfo.waterDays = 0
    }
    if(day === wateringInfo.maxWaterDays && gardenMode !== GARDEN_ENUM.MODE.Cash) { // 该天为最后一天
      imageName = calendars.gifts.vip;
      if(wateringInfo.waterDays < wateringInfo.maxWaterDays) { // 当前还未到最后一天
        opacity = 0.6;
      }
    } else if(giftInfo) { // 该天有礼物
      if(giftInfo.status === GARDEN_ENUM.GIFT_STATUS.received) { // 已领取
        imageName = day < GREAT_GIFT_BEGIN_DAY ? calendars.gifts.checked.small : calendars.gifts.checked.big;
        if(giftInfo.type === MONEY) {
          money = giftInfo.score
        }
      } else if(giftInfo.status === GARDEN_ENUM.GIFT_STATUS.expired) {
        imageName = day < GREAT_GIFT_BEGIN_DAY ? calendars.gifts.unchecked.small : calendars.gifts.unchecked.big;
        if(giftInfo.type === MONEY) {
          money = 0
          opacity = 0.6
        }
      } else {
        imageName = day < GREAT_GIFT_BEGIN_DAY ? calendars.gifts.unchecked.small : calendars.gifts.unchecked.big;
        if(giftInfo.status === GARDEN_ENUM.GIFT_STATUS.locked) { // 未解锁
          opacity = 0.6;
        }
      }
    } else {
      const calDayInfo = (daysInfo && daysInfo.length) ? daysInfo.find(({day: _day}) => _day === day) : null
      // 花期时间
      const {waterDays} = wateringInfo
      if(day !== 1 && calDayInfo && calDayInfo.type === 'period') {
        if(day > waterDays) {
          // 该天未浇水
          const imgDay = day < 10 ? 4 : 10
          imageName = `flower/icon-flower-days-${imgDay}`
        } else {
          // 该天已浇水
          const imgDay = day < 10 ? 4 : 10
          imageName = `flower/icon-flower-days-${imgDay}-watered`
        }
      } else { // 普通无礼物天
        text = waterDays === day ? '今' : day;
        if(waterDays >= day) { // 该天已浇过水
          imageName = 'deep_water';
          textColor = '#F6BE8D';
        }
      }
    }

    return {imageName, text, textColor, opacity, tipInfo, money, giftInfo};
  };

  // 获取tip信息
  getTipInfo = (today, giftInfo) => {
    const {daysInfo = []} = this.props
    for(let {day, type, platform, content} of daysInfo) {
      if((!platform || (isIOS && platform === 'ios') || (!isIOS && platform === 'android'))) {
        if(today === day && type === 'period') {
          return content
        }
        if(today === day && type === 'gift' && giftInfo && giftInfo.status !== GARDEN_ENUM.GIFT_STATUS.expired) {
          return content
        }
      }
    }
    return ''
  }

  fetchHistoryList = () => {
    fetchHistory().then((list) => {
      if(list.length) {
        this.props.historyInfo(list)
      }
    })
  }

  _pressHelper = () => {
    sendClickPingback('flower_page', '', 'flower_rule');
    this.props.showConfirmModal({
      content: this.props.masterGardenMode === GARDEN_ENUM.MODE.Cash ? <HelpModalCash/> : <HelpModalPrimary/>,
    });
  }
}
const styles = global.BaseStyleSheet.create({
  wrapper: {
    alignItems: 'center',
    height: CALENDAR_HEIGHT,
  },
  container: {
    width: Width,
  },

  calendarTitle: {
    fontSize: 14,
    color: '#814418',
    marginLeft: 12.5,
    marginRight: 3,
    fontWeight: global.BaseStyleSheet.FontWeight.Medium,
  },

  itemBox: {
    width: 45,
    height: 45,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    marginTop: 5,
    fontWeight: global.BaseStyleSheet.FontWeight.Medium,
    fontSize: 14,
  },
  topSoil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18.5,
  },
  bottomSoil: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 13,
  },
  completeTime: {
    color: '#814418',
    fontWeight: global.BaseStyleSheet.FontWeight.Medium,
    fontSize: 14,
    textAlign: 'left',
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Width,
    paddingHorizontal: 10,
    flex: 1
  },
  boxCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start'
  },
  beePic: {
    width: 30,
    height: 30
  },
  btnText: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
    width: 73,
    lineHeight: 25
  },
  moneyText: {
    color: '#C59064',
    fontSize: 8,
    marginTop: -8,
    fontWeight: 'bold'
  },
  calendarQuestion: {
    width: 18,
    height: 18,
    alignSelf: 'center'
  },
  resultBoxTitle: {
    flexDirection: 'row',
    marginTop: 25,
    width: Width,
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginBottom: 12
  }
})
