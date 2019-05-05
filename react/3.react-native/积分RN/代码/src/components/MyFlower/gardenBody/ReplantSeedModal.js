/**
 * Created by liuzhimeng.
 * @date 2019-01-15
 * @description 重新种植初代花提示窗
 */
import React, {PureComponent} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


import WebImage from '../../WebImage'
import TranslucentModal from '../../TranslucentModal'

import {switchSuccessActive} from '../../../actions/GardenDetailActions';
import PingbackConfig from '../../../common/PingbackConfig'
import {GARDEN_ENUM} from '../../../constants/IntegralEnum'
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback'

const MODAL_TITLE = isIOS
  ? 'flower/flower_cash_replant_to_primary_title_guide_ios'
  : 'flower/flower_cash_replant_to_primary_title_guide_android'

  @connect(
    () => {
      return {
      };
    },
    dispatch => bindActionCreators({
      switchSuccessActive,
    }, dispatch),
    null,
    {withRef: true},
  )
export default class ReplantSeedModal extends PureComponent {
  componentDidMount() {
    const {page, block, blockRseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].replant
    sendBlockPingback(page, block, {rseat: blockRseat})
  }

  render() {
    return (
      <TranslucentModal
        autoClose={false}
        showButton={false}
        hide={this.props.hide}
        FooterComponent={this._renderFooterComponent()}
        boxStyle={{width: 135, height: 135}}
        animatedStyle={{width: 135, height: 135}}
        contentStyle={{width: 135, height: 125}}
      >
        <WebImage style={styles.seed} name="flower/flower_cash_replant_seed_guide"/>
      </TranslucentModal>
    )
  }

  _renderFooterComponent = () => {
    return (
      <View style={styles.footer}>
        <WebImage style={styles.title} name={MODAL_TITLE}/>
        <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
          <WebImage style={styles.plantImage} name="flower_zhongxia_btn"/>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {page, block, rseat} = PingbackConfig[GARDEN_ENUM.MODE.Cash].replant
    sendClickPingback(page, block, rseat)
    sendClickPingback('flower_page', 'result_money', 'goplant_money')
    this.props.switchSuccessActive(false)
    this.props.hide()
    this.props.onPress()
  }
}

const styles = StyleSheet.create({
  seed: {
    width: 88,
    height: 73,
  },
  title: {
    width: 278,
    height: 49,
  },
  footer: {
    alignItems: 'center',
  },
  plantImage: {
    width: 112,
    height: 46,
    marginTop: 53,
  }
})
