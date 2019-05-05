/**
 * 重新种植用的种子
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Image, Text, View} from '@iqiyi/rn-ui';

import {sendClickPingback} from '../../../common/pingback';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import MyFlowerConfig from '../../../common/MyFlowerConfig';
import {showToast} from '../../../common/QYNativeBridge';
import {askToPlantFlower, fetchUserMoney} from '../../../model/MyFlower';
import {switchMasterGardenModeAsync, updateGardenInfo, setTotalCash} from '../../../actions/GardenDetailActions';

import ReplantModal from './ReplantModal';
// import ReplantSeedModal from './ReplantSeedModal';

@connect(
  (state, props) => {
    let {masterUserId, flowerInfo, gardenMode, theme} = getUserGardenDetail(state, props);
    return {
      masterUserId,
      flowerInfo,
      gardenMode,
      theme,
    };
  },
  dispatch => bindActionCreators({
    switchMasterGardenModeAsync,
    updateGardenInfo,
    setTotalCash,
  }, dispatch),
  null,
  {withRef: true},
)
export default class ReplantSeed extends PureComponent {
  render() {
    const {kettle, replantSeed} = this.props.theme;
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.showModal} style={[styles.container, {bottom: replantSeed.bottom}]}>
        <Image source={{uri: 'integral_replant_duzi'}} style={styles.seedIcon}/>
        <View style={[styles.replantTitle, {backgroundColor: kettle.text.backColor}]}>
          <Text style={[styles.replantTitleText, {color: kettle.text.color}]}>继续种植</Text>
        </View>
      </TouchableOpacity>
    )
  }

  showModal = () => {
    sendClickPingback('flower_page', '800604');
    // const {flowerInfo, gardenMode} = this.props
    // if(flowerInfo.type === 'vip' && gardenMode === GARDEN_ENUM.MODE.Cash) {
    //   this.props.showConfirmModal({
    //     content: <ReplantSeedModal onPress={this._plant} hide={this.props.hideConfirmModal} />,
    //     showCloseButton: false,
    //   })
    // } else {
    //   let {plantFlower, showConfirmModal, hideConfirmModal} = this.props;
    //   showConfirmModal({
    //     content: <ReplantModal
    //       plantFlower={plantFlower}
    //       hide={hideConfirmModal}
    //       revive={this.props.revive}
    //       shareToFriends={this.props.shareToFriends}
    //       currUserId={this.props.currUserId}
    //       updateUserMoney={this._fetchUserMoney}
    //       showSelectSeedBox={this.props.showSelectSeedBox}
    //     />,
    //   });
    // }
    let {plantFlower, showConfirmModal, hideConfirmModal, showSuccessActive} = this.props;
    if(showSuccessActive) {
      // 种植成功的状态直接弹出选种子弹框
      this.props.hideConfirmModal().then(() => this.props.showSelectSeedBox());
      return
    }
    showConfirmModal({
      content: <ReplantModal
        plantFlower={plantFlower}
        hide={hideConfirmModal}
        revive={this.props.revive}
        shareToFriends={this.props.shareToFriends}
        currUserId={this.props.currUserId}
        updateUserMoney={this._fetchUserMoney}
        showSelectSeedBox={this.props.showSelectSeedBox}
        replant={this.props.replant}
      />,
    });
  }

  _plant = () => {
    const {masterUserId} = this.props
    const targetGardenMode = GARDEN_ENUM.MODE.Primary;
    // 发送重新种植请求(注: 不能和场景切换同步做, 因为可能会请求失败!)
    askToPlantFlower({force: true, userId: masterUserId, channelCode: GARDEN_ENUM.CHANNEL_CODE.Rose})
      .then(({wateringInfo, gifts, beeCode, channelCode}) => {
        // 异步切换到初代花场景
        this.props.switchMasterGardenModeAsync(targetGardenMode)
          .then(() => {
            this.props.updateGardenInfo(masterUserId, {
              flowerInfo: MyFlowerConfig[targetGardenMode].theme.flower.pot,
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

  // 获取用户金额
  _fetchUserMoney = async () => {
    const {current = 0} = await fetchUserMoney()
    this.props.setTotalCash(current)
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    right: 29,
    alignItems: 'center',
  },
  seedIcon: {
    width: 47,
    height: 39,
  },
  replantTitle: {
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginTop: -10,
  },
  replantTitleText: {
    color: '#F6772A',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
  },
});
