/**
 * 昨日打卡战况
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';

import {getObjectValueSafely} from '../../common/util'
import px2dp from '../../common/px2dp';

import WebImage from '../WebImage';

export default class YesterdayDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
    const lastSuccess = getObjectValueSafely(this.props, 'lastSuccess', 0)
    const lastFailed = getObjectValueSafely(this.props, 'lastFailed', 0)
    const topList = getObjectValueSafely(this.props, 'topUsers', [])
    if(topList.length < 3) {
      return null
    }
    return (
      <WebImage name="punch/yesterday_title" style={styles.yesterdayBox}>
        <View style={styles.titleWrapper}>
          <Text style={styles.successText}>成功 {lastSuccess}</Text>
          <Text style={styles.failText}>失败 {lastFailed}</Text>
        </View>
        <View style={styles.rankListBox}>
          <View>
            <View style={styles.secondItemBox}>
              <WebImage uri={topList[1].avatar} style={styles.secondUserIcon}/>
              <WebImage name="punch/second_avatar" style={styles.sencondAvatar}/>
              <WebImage name="punch/get_second" style={styles.secondText}/>
            </View>
            <Text style={styles.secondNickName} numberOfLines={1}>{topList[1].nickName}</Text>
            <Text style={styles.orangeText}>+{topList[1].reward}积分</Text>
          </View>

          <View>
            <View style={styles.firstItemBox}>
              <WebImage uri={topList[0].avatar} style={styles.firstUserIcon}/>
              <WebImage name="punch/first_avatar" style={styles.firstAvatar}/>
              <WebImage name="punch/get_first" style={styles.firstText}/>
            </View>
            <Text style={styles.secondNickName} numberOfLines={1}>{topList[0].nickName}</Text>
            <Text style={styles.orangeText}>+{topList[0].reward}积分</Text>
          </View>

          <View>
              <View style={styles.secondItemBox}>
                <WebImage uri={topList[2].avatar} style={styles.secondUserIcon}/>
                <WebImage name="punch/third_avatar" style={styles.sencondAvatar}/>
                <WebImage name="punch/get_third" style={styles.secondText}/>
              </View>
              <Text style={styles.secondNickName} numberOfLines={1}>{topList[2].nickName}</Text>
              <Text style={styles.orangeText}>+{topList[2].reward}积分</Text>
          </View>
        </View>
      </WebImage>
    )

  }
}

const styles = BaseStyleSheet.create({
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
    alignItems: 'center'
  },

  yesterdayBox: {
    width: px2dp(349),
    height: px2dp(243),
    marginTop: 120,
    paddingHorizontal: 22,
  },
  rankListBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 31,
    width: px2dp(305),
    alignSelf: 'center',
  },
  secondItemBox: {
    width: 70,
    height: 71.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondUserIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    position: 'absolute',
    top: 5.5
  },
  sencondAvatar: {
    width: 63,
    height: 63,
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
  secondText: {
    width: 70,
    height: 18,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  firstItemBox: {
    width: 75,
    height: 80.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  firstUserIcon: {
    width: 65,
    height: 65,
    borderRadius: 27.5,
    position: 'absolute'
  },
  firstAvatar: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
  firstText: {
    width: 70,
    height: 18,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  successText: {
    color: '#FF4F7F',
    fontSize: 11,
    width: 73,
    textAlign: 'center'
  },
  failText: {
    color: '#50ADDD',
    fontSize: 11,
    width: 73,
    textAlign: 'center'
  },
  secondNickName: {
    maxWidth: 70,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10
  },
  orangeText: {
    color: '#FF6600',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 3
  },
  titleWrapper: {
    flexDirection: 'row',
    marginTop: px2dp(43),
    justifyContent: 'center'
  }
})
