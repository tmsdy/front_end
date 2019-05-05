/**
 * 脑洞投稿新手引导弹窗
 */

import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';

import BaseStyleSheet from '../../common/BaseStyleSheet';

import WebImage from '../WebImage';
import GradientBtn from '../GradientBtn';

interface NewGuideModalProps{
  hide: Function;
  goTo: Function;
}

export default class NewGuideModal extends PureComponent<NewGuideModalProps, {}> {
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
        <WebImage name="topicpk/modal-get-score" style={styles.picIcon}/>
        <View style={styles.modalContainer}>
          <Text style={styles.voteText}>恭喜你!</Text>
          <Text style={styles.tipsText}>投稿问题被采纳，快领取积分奖励吧</Text>
          <GradientBtn
            startColor="#FF7E00"
            endColor="#FF9E00"
            btnStyle={styles.btnStyle}
            wrapStyle={{marginTop: 5}}
            press={this.onHandleClick}
          >
            <Text style={styles.btnText} numberOfLines={1}>前去领取</Text>
            <WebImage name="punch/arrow_icon" style={{width: 10, height: 10}}/>
          </GradientBtn>
        </View>
      </View>
    )
  }

  onHandleClick = () => {
    this.props.hide().then(this.props.goTo('MySubmitList'))
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
