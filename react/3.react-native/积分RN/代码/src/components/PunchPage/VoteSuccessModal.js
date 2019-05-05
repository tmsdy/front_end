/**
 * 参与成功弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';
import GradientBtn from '../GradientBtn';
import {sendClickPingback} from '../../common/pingback';
import {getObjectValueSafely} from '../../common/util';

export default class VoteSuccessModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const {userVoteNumber} = this.props
    const titleText = userVoteNumber === 88 ? '参与次数已达今日上限' : '参与次数越多，瓜分份额越大'
    const btnText = userVoteNumber === 88 ? '明天再来' : '再投一次'
    return (
      <View style={{}}>
        <WebImage name="punch/vote_success" style={styles.picIcon}/>
        <View style={styles.modalContainer}>
          <Text style={styles.voteText}>成功参与{userVoteNumber}次！</Text>
          <Text style={styles.tipsText}>{titleText}</Text>
          <GradientBtn
            startColor="#FF7E00"
            endColor="#FFA400"
            btnStyle={styles.btnStyle}
            wrapStyle={{marginTop: 5}}
            press={this.onHandleClick}
          >
            <Text style={styles.btnText} numberOfLines={1}>{btnText}</Text>
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
      sendClickPingback('daka', '200002', 'dakacompete', {score: getObjectValueSafely(this.props, 'score')})
      this.props.hide().then(this.props.askToVote)
    }
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
    width: 160,
    height: 140,
    alignSelf: 'center',
    zIndex: 2
  },
  voteText: {
    color: '#333333',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 70,
    lineHeight: 22
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
