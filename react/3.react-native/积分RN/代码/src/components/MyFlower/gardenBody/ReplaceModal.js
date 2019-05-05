/**
 * Created by liuzhimeng.
 * @date 2019-01-09
 * @description 改种金钱花弹窗
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View, Text} from '@iqiyi/rn-ui'

import {askToPlantFlower} from '../../../model/MyFlower'
import {showToast} from '../../../common/QYNativeBridge';
import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import MyFlowerConfig from '../../../common/MyFlowerConfig';
import {switchMasterGardenModeAsync, updateGardenInfo} from '../../../actions/GardenDetailActions';

import WebImage from '../../WebImage'
import CommonButton from '../../CommonButton'

// import {sendClickPingback, sendBlockPingback} from '../../common/pingback'

@connect(
  ({gardenDetail}) => {
    const {masterUserId} = gardenDetail
    return {
      masterUserId,
    };
  },
  dispatch => bindActionCreators({
    switchMasterGardenModeAsync,
    updateGardenInfo,
  }, dispatch),
)
export default class ReplaceModal extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <WebImage name="flower/flower_to_cash_modal_bg" style={styles.titleImg}/>
        <Text style={styles.desc}>一个花期（21天）内只能种一朵花哦</Text>
        <View style={styles.btnsBox}>
          <CommonButton mode="pure" pureColor="#FFC32C" width={110} text="种完再换" onPress={this.props.hide}/>
          <CommonButton mode="pure" pureColor="#FF6A5A" width={110} text="就要金钱花" onPress={this.replaceByCash}/>
        </View>
      </View>
    )
  }

  replaceByCash = () => {
    this.props.hide()
    // 改种金钱花
    let gardenMode = GARDEN_ENUM.MODE.Cash;
    // 发送重新种植请求(注: 不能和场景切换同步做, 因为可能会请求失败!)
    askToPlantFlower({force: true, userId: global.USER_INFO.userId, channelCode: GARDEN_ENUM.CHANNEL_CODE.Money}).then(({wateringInfo, gifts, beeCode, channelCode}) => {
      // 异步切换到金钱花场景
      this.props.switchMasterGardenModeAsync(gardenMode).then(() => {
        this.props.updateGardenInfo(this.props.masterUserId, {
          flowerInfo: MyFlowerConfig[gardenMode].theme.flower.pot,
          wateringInfo: {...wateringInfo, wateredToday: false}, // 第一次种下, 先标记为未浇水状态, 后续完成动效后, 更新状态
          gifts,
          beeCode,
          channelCode
        });
      });
    }).catch(() => {
      showToast('网络异常，请稍后再试');
    });
  }
}

const styles = BaseStyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleImg: {
    width: 270,
    height: 120,
  },
  desc: {
    fontSize: 15,
    color: '#333333',
    maxWidth: 250,
    marginTop: 25,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  btnsBox: {
    width: 270,
    paddingHorizontal: 17.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 25,
  },
})
