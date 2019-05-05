/**
 * 积分不足弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';
import GradientBtn from '../GradientBtn';
import {sendClickPingback} from '../../common/pingback';
import {getObjectValueSafely} from '../../common/util';

export default class LackScoreModal extends PureComponent {
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
        <WebImage name="punch/modal_cry" style={styles.picIcon}/>
        <View style={styles.modalContainer}>
          <Text style={styles.voteText}>积分不足</Text>
          <Text style={styles.tipsText}>去任务中心可以赚取更多积分</Text>
          <GradientBtn
            startColor="#FF7E00"
            endColor="#FFA400"
            btnStyle={styles.btnStyle}
            wrapStyle={{marginTop: 5}}
            press={this.onHandleClick}
          >
            <Text style={styles.btnText} numberOfLines={1}>去赚积分</Text>
            <WebImage name="punch/arrow_icon" style={{width: 10, height: 10}}/>
          </GradientBtn>
        </View>
      </View>
    )
  }
  onHandleClick = () => {
    sendClickPingback('daka', '200001', 'dakamore', {score: getObjectValueSafely(this.props, 'score')})
    this.props.hide().then(this.props.gotoHomePage)
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
