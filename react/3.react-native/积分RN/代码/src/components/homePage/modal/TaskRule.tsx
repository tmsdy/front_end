/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 任务规则弹窗
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import BaseStyleSheet from '../../../common/BaseStyleSheet'

interface TaskRuleProps {
  content: string;
  hideConfirmModal(): any;
}

export default class TaskRule extends PureComponent<TaskRuleProps, {}> {
  render() {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentDaren}>
          <View style={{justifyContent: 'center', position: 'relative', top: -30}}>
            <Text style={{fontSize: 18, color: '#333333', fontWeight: 'bold', textAlign: 'center'}}>规则说明</Text>
          </View>
          <View style={{paddingHorizontal: 23}}>
            <Text style={{marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              {this.props.content}
            </Text>
          </View>
          <TouchableOpacity style={styles.ruleBtnBox} onPress={this.props.hideConfirmModal}>
            <Text style={{color: '#FF7E00', fontSize: 18, textAlign: 'center'}}>我知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = BaseStyleSheet.create({
  modalWrapper: {
    width: 270,
    padding: 0,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center'
  },
  modalContentDaren: {
    paddingTop: 50,
  },
  ruleBtnBox: {
    justifyContent: 'center',
    width: 270,
    height: 45,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2'
  },
})
