/**
 * 重新种植提示弹框
 * Created by xushichao on 2018-12-13.
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import {Text, View} from '@iqiyi/rn-ui';

import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import WebImage from '../../WebImage';
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback';
import {fetchReliveInfo} from '../../../model/MyFlower';
import PingbackConfig from '../../../common/PingbackConfig';

@connect(
  (state, props) => {
    let {channelCode, gardenMode, flowerInfo} = getUserGardenDetail(state, props);
    return {
      masterTotalScore: state.scoreInfo.totalScore,
      channelCode,
      gardenMode,
      flowerInfo
    };
  },
  null,
  null,
  {withRef: true},
)
export default class ReplantModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      totalNum: 0,
      reviveList: [],
    }
  }

  componentDidMount() {
    this.fetchFertilizerInfo()
    // const {page, block, blockRseat} = PingbackConfig[this.props.gardenMode].replant
    // sendBlockPingback(page, block, {rseat: blockRseat})
  }

  render() {
    const {totalNum} = this.state
    return (
      <View style={styles.container}>
        <WebImage name="relive_modal_pic" style={styles.titleImg}/>
        <Text style={styles.desc}>你确定要重新种植从零开始嘛？使用复活化肥可以原地复活，继承当前天数哦！~</Text>
        <View style={styles.btnsBox}>
          <TouchableOpacity onPress={this.replant} style={[styles.btn, styles.replantBtn]}>
            <Text style={styles.btnText}>重新种植</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.relive} style={[styles.btn, styles.reliveBtn]}>
            <Text style={styles.btnText}>{totalNum ? '施肥复活' : '邀请好友'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  relive = () => {
    const {totalNum, reviveList} = this.state
    if(!totalNum) {
      const {page, block, rseat} = PingbackConfig[this.props.gardenMode].getFertilizer
      sendClickPingback(page, block, rseat);
      this.props.hide();
      this.props.shareToFriends('iDead')
    } else {
      const {page, block, rseat} = PingbackConfig[this.props.gardenMode].revive
      sendClickPingback(page, block, rseat);
      this.props.hide();
      this.props.revive(reviveList[0])
    }
  };

  /* 金钱花重新种植特殊逻辑：金钱花死掉之后重新重视继续种植金钱花，其他花死掉之后重新种植出现选种子弹窗。 */
  replant = () => {
    // const {page, block, rseat} = PingbackConfig[this.props.gardenMode].replant
    // sendClickPingback(page, block, rseat);
    // 新需求 @柯慧士，重新种植直接弹出种子弹框
    this.props.hide().then(() => this.props.showSelectSeedBox());
    // const {gardenMode, flowerInfo} = this.props
    // if(gardenMode === GARDEN_ENUM.MODE.Cash && flowerInfo.type === 'faded') {
    //   this.props.hide().then(() => this.props.replant({force: true, channelCode: GARDEN_ENUM.CHANNEL_CODE.Money}));
    // } else {
    //   this.props.hide().then(() => this.props.showSelectSeedBox());
    // }

    // this.props.showSelectSeedBox()
    // askToPlantFlower({force: true, userId: global.USER_INFO.userId, channelCode: this.props.channelCode})
    //   .then(({wateringInfo, gifts, beeCode, channelCode}) => {
    //     this.props.hide();
    //     this.props.updateUserMoney();
    //     this.props.plantFlower({wateringInfo, gifts, beeCode, channelCode});
    //   })
    //   .catch(() => {
    //     showToast('铲除失败，稍后再试~')
    //   })
  };

  fetchFertilizerInfo = () => {
    fetchReliveInfo()
      .then(({totalNum, reviveList}) => {
        if(totalNum) {
          const {page, block, blockRseat} = PingbackConfig[this.props.gardenMode].revive
          sendBlockPingback(page, block, {rseat: blockRseat})
        } else {
          const {page, block, blockRseat} = PingbackConfig[this.props.gardenMode].getFertilizer
          sendBlockPingback(page, block, {rseat: blockRseat})
        }
        this.setState({
          totalNum,
          reviveList,
        })
      })
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
    fontSize: 12,
    color: '#666',
    maxWidth: 225,
    marginTop: 25,
    textAlign: 'left',
  },
  btnsBox: {
    width: 270,
    paddingHorizontal: 17.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 25,
  },
  btn: {
    width: 110,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  reliveBtn: {
    backgroundColor: '#B670FF',
  },
  replantBtn: {
    backgroundColor: '#FFB33A',
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
});
