/**
 * VIP卡弹窗
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {View, Text, Image} from '@iqiyi/rn-ui';
import {sendClickPingback} from '../../../common/pingback';
import WebImage from '../../WebImage';

import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import {switchHistoryGardenMode, switchShowReplantBox, switchSuccessActive} from '../../../actions/GardenDetailActions';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {askToCloseVipModal} from '../../../model/MyFlower';

@connect(
  (state, props) => {
    let {gardenMode, theme, isHistoryGarden} = getUserGardenDetail(state, props);
    return {
      gardenMode,
      theme,
      isHistoryGarden,
    };
  },
  dispatch => bindActionCreators({
    switchHistoryGardenMode,
    switchShowReplantBox,
    switchSuccessActive
  }, dispatch),
  null,
  {withRef: true},
)
export default class VIPCardRewardModal extends PureComponent {

  componentDidMount() {
    askToCloseVipModal().then()
  }

  render() {
    return (
      <View style={styles.container}>
        <WebImage name="vipCard_modal_title" style={styles.titlePic}/>
        <Image source={{uri: 'integral_gold_vip_card'}} style={styles.vipCard}/>
        <View style={{flexDirection: 'row', width: 260, justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={this.gotoOrderList} style={styles.jumpBtn}>
            <Text style={styles.jumpBtnText}>去查看</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showPlantBox} style={[styles.jumpBtn, {backgroundColor: '#FF9332', borderColor: '#FF9332'}]}>
            <Text style={styles.jumpBtnText}>知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  gotoOrderList = () => {
    sendClickPingback('flower_page', '800605', 'gotocheck');
    this.props.hide();
    this.props.gotoOrderList();
  }

  gotoIllustrationPage = () => {
    this.props.hide();
    this.props.switchHistoryGardenMode(GARDEN_ENUM.MODE.Primary);
  }

  showPlantBox = () => {
    this.props.hide();
    this.props.switchSuccessActive(false)
    this.props.switchShowReplantBox(true)
  }
}
const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
  },
  vipCard: {
    width: 260,
    height: 172,
  },
  jumpBtn: {
    width: 120,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    marginTop: 20
  },
  jumpBtnText: {
    color: '#FFF',
    fontSize: 14,
  },
  titlePic: {
    width: 110,
    height: 25,
    marginBottom: 20
  }
});
