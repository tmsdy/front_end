
/**
 * 打卡赢现金历史记录页面
 */
import React from 'react';
import {FlatList} from 'react-native';
import {Text, View} from '@iqiyi/rn-ui';
import {Width, isLikeX} from '@iqiyi/rn-utils';


import NavBar from '../components/DefaultNavBar'
import {hideLoading} from '../common/QYNativeBridge';
import WebImage from '../components/WebImage';
import {fetchPucnHistory} from '../model/PunchPage'
import BaseStyleSheet from '../common/BaseStyleSheet';
import BasePage from '../components/BasePage';

const formatDate = (timeStamp) => {
  const day = new Date(timeStamp)
  return `${day.getFullYear()}.${`0${day.getMonth() + 1}`.substr(-2)}.${`0${day.getDate()}`.substr(-2)}`
}
const STATUS = {
  success: '打卡成功',
  fail: '打卡失败',
  wait: '待打卡'
}
export default class MyPunchRecord extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      total: 0, // 历史记录总数
      historyVotes: 0, // 历史参与投票数
      historyCost: 0, // 历史消耗积分
      historyRewards: 0, // 历史获得奖励
      historyRecords: [], // 历史记录列表
    };

    this.requestLock = false;
    this.pageSize = 30; // 每页获取的数量
    this.pageNo = 0; // 当前页号
    this.totalHistoryCount = 0; // 总的好友数
  }

  componentDidMount() {
    hideLoading()
    this.getRenderData()
  }

  render() {
    const {historyVotes, historyCost, historyRewards} = this.state
    const likeXStyle = isLikeX() ? {marginTop: 50, paddingTop: 50} : {paddingTop: 50}
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#1DCAFF'}}>
          <WebImage name="punch/record_bg" style={[{width: Width, height: 220 * Width / 375}, likeXStyle]}>
            <View>
              <Text style={styles.titleText}>我的战绩</Text>
            </View>
            <View style={styles.userDetailBox}>
                <View style={styles.detialItemBox}>
                  <Text style={styles.itemTitleText}>{historyVotes}</Text>
                  <Text style={styles.itemDetailText}>已经参与(次)</Text>
                </View>
                <View style={styles.detialItemBox}>
                  <Text style={styles.itemTitleText}>{historyCost}</Text>
                  <Text style={styles.itemDetailText}>累计投入(积分)</Text>
                </View>
                <View style={styles.detialItemBox}>
                  <Text style={styles.itemTitleText}>{historyRewards}</Text>
                  <Text style={styles.itemDetailText}>累计瓜分(积分)</Text>
                </View>
            </View>
          </WebImage>
          <NavBar
            title=""
            type="white"
            titleColor="#333333"
            backgroundColor="transparent"
            backPress={this.back}
            style={{position: 'absolute', top: 0}}
          />
        </View>
        <WebImage name="punch/notice_bar" style={styles.noticeBar}>
          <WebImage name="punch/clock" style={styles.noticeIcon}/>
          <Text style={styles.noticeText}>每日瓜分积分将于<Text style={{color: '#FF6600'}}>21:00</Text>前自动发放至你的账户</Text>
        </WebImage>
        {this.renderRecordList()}
      </View>
    )
  }
  renderHistoryItem = ({item}) => {
    const {date, statusCode, rewards} = item
    const _date = formatDate(date)
    const dateText = statusCode === 'wait' ? styles.greyDate : styles.blackDate
    const titleText = statusCode === 'wait' ? styles.greyTitle : styles.blackTitle
    return (
      <View style={styles.recordItem}>
        <Text style={dateText}>{_date}</Text>
        <Text style={titleText}>{STATUS[statusCode]}</Text>
        {statusCode !== 'wait' &&
          <View style={styles.recordScore}>
            <Text style={[styles.scoreText, statusCode === 'success' && {color: '#FF6600'}]}>+{rewards || 0}</Text>
            <WebImage name="punch/score" style={styles.scoreIcon}/>
          </View>}
      </View>
    )
  }
  renderRecordList = () => {
    const {historyRecords} = this.state
    if(historyRecords.length) {
      return (
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          <Text style={styles.recordTitle}>战绩明细</Text>
          <View style={{flex: 1}}>
            <FlatList
              style={{flex: 1}}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              data={historyRecords}
              renderItem={this.renderHistoryItem}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={this.renderFooter}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.noscore}>
        <WebImage name="pic" style={{width: 180, height: 180, marginTop: 70}} />
        <Text style={styles.noIntegral}>暂无记录，快去参与打卡挑战吧</Text>
      </View>
    )
  }

  getRenderData = () => {
    this.fetchHistoryList(false)
  }

  renderFooter = () => {
    return (
      <View style={{marginTop: 30}}>
        <Text style={{color: '#CCCCCC', fontSize: 10, textAlign: 'center'}}>最多显示最近3个月的记录</Text>
      </View>
    )
  }

  onEndReached = () => {
    this.fetchHistoryList(true)
  }
  fetchHistoryList = (isAppend) => {
    this.pageNo = isAppend ? this.pageNo + 1 : 0;
    if(this.requestLock || (this.state.historyRecords.length >= this.totalHistoryCount && this.pageNo > 0)) {
      return;
    }
    this.requestLock = true;
    const param = {
      pageSize: this.pageSize,
      page: this.pageNo,
    };
    fetchPucnHistory(param).then(({total, historyVotes, historyCost, historyRewards, historyRecords}) => {
      if(historyRecords && historyRecords.length) {
        if(!isAppend) {
          this.setState({
            historyRecords: []
          });
        }
        const _history = this.state.historyRecords.concat(historyRecords)
        this.setState({
          historyRecords: _history
        })
        this.totalHistoryCount = total;
        this.requestLock = false;
      }
      this.setState({
        historyVotes,
        historyCost,
        historyRewards,
      })
    })
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  navBar: {
    position: 'absolute',
    top: 0
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    fontSize: 30,
    marginLeft: 25,
    lineHeight: 42,
    marginTop: 5
  },
  userDetailBox: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 45
  },
  detialItemBox: {
    width: Width / 3,
    alignItems: 'center'
  },
  itemTitleText: {
    color: '#FFFFFF',
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    fontSize: 25,
    textAlign: 'center'
  },
  itemDetailText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15
  },
  noticeBar: {
    width: Width - 55,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    alignSelf: 'center',
  },
  noticeIcon: {
    width: 17,
    height: 17,
    marginRight: 5
  },
  noticeText: {
    color: '#333333',
    fontSize: 13
  },
  recordTitle: {
    color: '#333333',
    fontSize: 16,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    marginLeft: 13,
    lineHeight: 44
  },
  recordItem: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    width: Width - 26,
    alignSelf: 'center',
    justifyContent: 'flex-start'
  },
  blackText: {
    color: '#333333',
    fontSize: 14,
    width: (Width - 26) / 3
  },
  blackDate: {
    color: '#333333',
    fontSize: 14,
    width: (Width - 26) / 3,
    textAlign: 'left'
  },
  blackTitle: {
    color: '#333333',
    fontSize: 14,
    width: (Width - 26) / 3,
    textAlign: 'center'
  },
  greyDate: {
    fontSize: 14,
    width: (Width - 26) / 3,
    textAlign: 'left',
    color: '#999999'
  },
  greyTitle: {
    fontSize: 14,
    width: (Width - 26) / 3,
    textAlign: 'center',
    color: '#999999'
  },
  recordScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: (Width - 26) / 3

  },
  scoreText: {
    fontWeight: BaseStyleSheet.FontWeight.Bold,
    fontSize: 14,
    color: '#333333'
  },
  scoreIcon: {
    width: 22,
    height: 23,
    marginLeft: 4
  },
  title: {
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17
  },
  noscore: {
    flex: 1,
    alignItems: 'center',
  },
  bgBox: {
    iosx: {
      width: Width,
      height: 220 * Width / 375,
      marginTop: 50,
      paddingTop: 50
    }
  },
  noIntegral: {
    fontSize: 14,
    color: '#666666',
  },
})
