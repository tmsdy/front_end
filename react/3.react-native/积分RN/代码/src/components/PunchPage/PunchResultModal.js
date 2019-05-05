/**
 * 奖励发放弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';
import GradientBtn from '../GradientBtn';
import {setStorage} from '../../common/util';
import {STORAGE_ENUM} from '../../constants/IntegralEnum'

export default class PunchResultModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={{}}>
        <WebImage name="punch/score_send" style={styles.picIcon}/>
        <View style={styles.modalContainer}>
          <Text style={styles.voteText}>昨日奖励计算中21:00后积分奖励自动到账</Text>
          <GradientBtn
            startColor="#20C7FB"
            endColor="#57B3FF"
            btnStyle={styles.btnStyle}
            wrapStyle={{marginTop: 5}}
            press={this.onHandleClick}
          >
            <Text style={styles.btnText} numberOfLines={1}>我知道了</Text>
          </GradientBtn>
        </View>
      </View>
    )
  }
  onHandleClick = () => {
    const {userVoteNumber} = this.props
    if(userVoteNumber === 88) {
      this.props.hide()
    } else {
      this.props.hide().then(this.props.askToVote)
    }
    const key = `${STORAGE_ENUM.PUNCH_NOTICE}${global.USER_INFO.userId}${new Date().toLocaleDateString()}`
    setStorage(key, true)
  }
}

const styles = BaseStyleSheet.create({
  modalContainer: {
    width: 270,
    height: 200,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: -70
  },
  picIcon: {
    width: 270,
    height: 128,
    alignSelf: 'center',
    zIndex: 2
  },
  voteText: {
    color: '#333333',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 70,
    lineHeight: 22,
    maxWidth: 210
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  tipsText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10
  },
  btnStyle: {
    width: 220,
    height: 40,
    borderRadius: 20,
    marginTop: 16
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16
  }
})
