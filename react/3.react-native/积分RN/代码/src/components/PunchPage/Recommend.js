/**
 * 昨日打卡战况
 */

import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import px2dp from '../../common/px2dp';

import WebImage from '../WebImage';
import {sendClickPingback} from '../../common/pingback';

export default class YesterdayDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
    const {recommond} = this.props
    if(recommond.length < 3) {
      return null
    }
    return (
      <View style={[styles.recommondBox]}>
        <View style={styles.bottomTitleBox}>
          <Text style={styles.bottomTitleText}>为你推荐</Text>
          <View style={styles.blutCircle}/>
        </View>
        <View style={styles.picBox}>
          <TouchableOpacity onPress={() => this.goToLink(recommond[0].link, 1)} activeOpacity={1}>
            <WebImage name={recommond[0].pic || 'punch/punch_flower_entry'} style={styles.leftBox}/>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => this.goToLink(recommond[1].link, 2)} activeOpacity={1}>
              <WebImage name={recommond[1].pic || 'punch/punch_change_goods'} style={styles.rightTooBox}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.goToLink(recommond[2].link, 3)} activeOpacity={1}>
              <WebImage name={recommond[2].pic || 'punch/punch_topick_pk'} style={[styles.rightTooBox, {marginTop: -10}]}/>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.goToLink(recommond[3].link, 4)} activeOpacity={1}>
          <WebImage name={recommond[3].pic || 'punch/punch_more_task'} style={styles.moreBox}/>
        </TouchableOpacity>
      </View>
    )
  }
  goToLink = (url, index) => {
    sendClickPingback('daka', '', `dakawei${index}`)
    if(url) {
      this.props.openWeb(url)
    }
  }
}

const styles = BaseStyleSheet.create({
  recommondBox: {
    width: Width,
    paddingHorizontal: 6.5,
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  bottomTitleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    marginTop: 26,
  },
  blutCircle: {
    width: 17,
    height: 17,
    backgroundColor: '#A7F3FF',
    borderRadius: 17,
    alignSelf: 'center',
    marginLeft: -10,
    zIndex: 0,
    marginTop: -10
  },
  bottomTitleText: {
    color: '#333333',
    fontSize: 17,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    textAlign: 'center',
    zIndex: 1
  },
  picBox: {
    flexDirection: 'row',
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  leftBox: {
    width: px2dp(170),
    height: px2dp(170)
  },
  rightTooBox: {
    width: px2dp(201),
    height: px2dp(90),
    marginLeft: -10
  },
  moreBox: {
    width: px2dp(362),
    height: px2dp(71),
    alignSelf: 'center',
    marginTop: -5
  }
})
