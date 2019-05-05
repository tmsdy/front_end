/**
 * Created by liuzhimeng.
 * @date 2019-04-07
 * @description 设备积分转移弹窗
 */

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {View, Text} from '@iqiyi/rn-ui'

import BaseStyleSheet from '../../../common/BaseStyleSheet'
import WebImage from '../../WebImage'
import BaseButton from '../../BaseButton'

import {changeTotalScore} from '../../../actions/TotalScoreActions'
import {askToTransferDeviceScore} from '../../../model/homePage'

interface DeviceScoreProps {
  score: number;
  hideConfirmModal(): void;
  changeTotalScore?(score: number): void;
}

@(connect(
  null,
  dispatch => bindActionCreators({changeTotalScore}, dispatch),
  null,
  {withRef: true}
) as any)
export default class DeviceScore extends PureComponent<DeviceScoreProps, {}> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreText}>{this.props.score}</Text>
          <WebImage name="home_numi" style={styles.scoreIcon}/>
        </View>
        <Text style={styles.textBox}>当前账户未领取积分值</Text>
        <BaseButton
          text="提取积分"
          linearColor={['#FF7E00', '#FF9E00']}
          textColor="#ffffff"
          onPress={this.transferScore}
          containerStyle={{
            width: 120,
            height: 40,
            borderRadius: 20,
          }}
          textStyle={{
            fontSize: 16,
            fontWeight: BaseStyleSheet.FontWeight.Medium,
          }}
        />
      </View>
    )
  }

  transferScore = async () => {
    const {finished} = await askToTransferDeviceScore()

    if(finished) {
      this.props.changeTotalScore(this.props.score)
      this.props.hideConfirmModal()
    }
  }

}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    width: 270,
    paddingTop: 20,
    paddingBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  scoreWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 30,
    color: '#333333',
  },
  scoreIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  textBox: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 6,
    marginBottom: 6,
  }
})
