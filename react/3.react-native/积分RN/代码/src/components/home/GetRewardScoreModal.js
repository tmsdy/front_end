/**
 * 21天Vip卡提示
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from '@iqiyi/rn-gradient-view';
import { View, Text } from '@iqiyi/rn-ui';
import { isIOS } from '@iqiyi/rn-utils'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WebImage from '../WebImage';
import px2dp from '../../common/px2dp'
import ConfirmModal from '../../components/ConfirmModal';
import { showToast } from '../../common/QYNativeBridge';
import { executeTask } from '../../api/index';
import { changeTotalScore } from '../../actions/TotalScoreActions'

@connect(null, dispatch => bindActionCreators({changeTotalScore}, dispatch), null, { withRef: true })
export default class GetRewardScoreModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastScore: this.props.lastScore,
      modalVisible: this.props.lastScore != 0 ? true : false
    }
  }
  componentDidMount() {
    console.log(1)
  }
  getData = () => {

  }

  getReward = () => {
    const requestBody = {
      growthDfpScoreDfpLoginTransfer: {
        need_ext: true,
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        needSyncState: true,
        durationType: 1,
        userId: global.USER_INFO.userId,
      }
    }

    const requestHeader = {
      task_code: 'growthDfpScoreDfpLoginTransfer',
      timestamp: Date.now(),
    }
    executeTask(requestHeader, requestBody).then((param) => {
      const {data} = param
      if (param.code === 'A0000' && data.code === 'A0000') {
        showToast('积分已经同步~')
        this.props.changeTotalScore(data.score)
        this.hideBox()
      } else if (param.code === 'A0000' && data.code === 'A0001') {
        showToast('该设备已被其他帐号关联~')
      } else {
        showToast('同步失败，稍后再试')
      }
    }).catch(() => {
      showToast('同步失败，稍后再试')
    })
  }

  hideBox = () => {
    this.setState({
      modalVisible: false
    })
    this.hide = true
    this.props.showNextModal()
  }

  render() {
    const { modalVisible, lastScore } = this.state
    if (this.hide) {
      return null;
    }
    return (
      <ConfirmModal
        modalVisible={modalVisible}
        cancelFn={this.hideBox}
      >
        <View style={styles.container}>
          <View style={styles.topBox}>
            <Text style={{ fontSize: 30, color: '#333333', fontFamily: 'DINAlternate-Bold' }}>{lastScore}</Text>
            <WebImage name="home_numi" style={{ width: 20, height: 20, marginLeft: 5 }} />
          </View>
          <Text style={styles.textBox}>当前账户未领取积分值</Text>
          <TouchableOpacity onPress={this.getReward} style={styles.btnBox}>
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              colors={['#FF7E00', '#FF9E00']}
              style={styles.shareModalBtnBox}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>提取积分</Text>
            </LinearGradient>
          </TouchableOpacity>
           <TouchableOpacity style={styles.closeBtn} onPress={this.hideBox}>
               <WebImage name="popup-close" style={{width: 44, height: 44}} />
           </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }

}
const styles = StyleSheet.create({
  shareModalBtnBox: {
    width: px2dp(220),
    height: px2dp(40),
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: px2dp(20),
    alignItems: 'center',
    marginBottom: -1,
    overflow: 'hidden',
  },
  btnBox: {
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 20,
    width: 120,
    height: 40,
    backgroundColor: '#FF751B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 44,
    height: 44,
    position: 'absolute',
    top: 0,
    right: 0
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: 270,
    alignItems: 'center'
  },
  topBox: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  textBox: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 6
  }
})
