/**
 * 浇水提醒
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {QYRNBridge} from '@iqiyi/rn-base-modules';
import {View, Text} from '@iqiyi/rn-ui';

import {PHONE_SETTING_URL} from '../../../constants/configs';
import {saveAsyncStorage} from '../../../common/util'
import {showToast} from '../../../common/QYNativeBridge'
import {sendClickPingback} from '../../../common/pingback';
import {askToFlowerAddPush} from '../../../model/MyFlower'

export default class WateringNotificationTip extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tip}>需要浇水的时候我call你！</Text>
        <TouchableOpacity style={styles.pushBtn} onPress={this.gotoSetPush}>
          <Text style={styles.pushBtnText}>浇水提醒</Text>
        </TouchableOpacity>
      </View>
    );
  }

  gotoSetPush = () => {
    this.saveIsShowPush()
    QYRNBridge.isNotificationEnabled().then((isPush) => {
      askToFlowerAddPush().then((data) => {
        if(data && isPush) {
          showToast('通知已打开~记得来浇水哦！')
        }
      })

      if(!isPush) {
        sendClickPingback('flower_page', '800608', 'pushbtn')
        this.props.openWeb(PHONE_SETTING_URL);
      }
    });
  }

  saveIsShowPush = () => {
    const keys = [[`push_show${global.USER_INFO.userId}`, 'true']]
    saveAsyncStorage(keys)
  }

}
const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip: {
    color: '#B56C00',
    fontSize: 12,
  },
  pushBtn: {
    backgroundColor: '#21A0FF',
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pushBtnText: {
    fontSize: 12,
    color: '#FFF',
  },
});
