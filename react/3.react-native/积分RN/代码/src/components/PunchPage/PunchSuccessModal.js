/**
 * 打卡成功弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';
import GradientBtn from '../GradientBtn';

export default class PunchSuccessModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const {punchedNumber, scorePool} = this.props
    return (
      <View style={{}}>
        <WebImage name="punch/punch_success" style={styles.picIcon}/>
        <WebImage name="punch/punch_success_line" style={styles.picLine}/>
        <View style={styles.modalContainer}>
          <Text style={styles.voteText}>今天21:00后，积分自动到账</Text>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
              <View style={{width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#54B0E9', marginRight: 6}}/>
              <Text style={styles.tipsText}>当前打卡成功人数：{punchedNumber}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
              <View style={{width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#54B0E9', marginRight: 6}}/>
              <Text style={styles.tipsText}>昨日积分奖池总额：{scorePool}</Text>
            </View>
          </View>
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
  }
}

const styles = BaseStyleSheet.create({
  modalContainer: {
    width: 270,
    height: 252,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: -40
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
    marginTop: 40,
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
  },
  btnStyle: {
    width: 154,
    height: 40,
    borderRadius: 20,
    marginTop: 25
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16
  },
  picLine: {
    width: 310,
    height: 158,
    alignSelf: 'center',
    position: 'absolute',
    top: -50
  }
})
