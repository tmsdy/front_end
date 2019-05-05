/**
 * Created by liuzhimeng.
 * @date 2019-04-24
 * @description 任务规则弹窗
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity, ScrollView} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import BaseStyleSheet from '../../../common/BaseStyleSheet'

const ruleSign = [
  {
    day: '1天',
    score: '5'
  },
  {
    day: '2天',
    score: '7'
  },
  {
    day: '3天',
    score: '10'
  },
  {
    day: '4-5天',
    score: '14'
  },
  {
    day: '6-10天',
    score: '16'
  },
  {
    day: '11-15天',
    score: '18'
  },
  {
    day: '16-20天',
    score: '20'
  },
  {
    day: '21-25天',
    score: '23'
  },
  {
    day: '26-30天',
    score: '25'
  },
  {
    day: '30-∞天',
    score: '30'
  },
]

interface SignRuleProps {
  hideConfirmModal(): any;
}

export default class SignRule extends PureComponent<SignRuleProps, {}> {
  render() {
    return (
      <View style={[styles.modalWrapper, {width: 280}]}>
        <View style={styles.modalContentDaren}>
          <View style={{justifyContent: 'center', position: 'relative', top: -30}}>
            <Text style={{fontSize: 18, color: '#333333', fontWeight: 'bold', textAlign: 'center'}}>签到规则</Text>
          </View>
          <View style={{paddingHorizontal: 23}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: 117, marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22, fontWeight: 'bold', textAlign: 'center'}}>
                连续签到天数
              </Text>
              <Text style={{width: 117, marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22, fontWeight: 'bold', textAlign: 'center'}}>
                奖励
              </Text>
            </View>
            <ScrollView style={{maxHeight: 130, marginTop: -20}} showsVerticalScrollIndicator={false}>
              <View>
                {ruleSign.map((item, index) => {
                  const bacColor = index % 2 === 0 ? '#FAFAFA' : '#FFFFFF'
                  return (
                    <View key={item.day} style={{height: 25, backgroundColor: bacColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Text style={styles.signRuleRow}> {item.day} </Text>
                      <Text style={styles.signRuleRow}> {`${item.score}积分`} </Text>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
            <Text style={{fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              1.每日可签到一次；
            </Text>
            <Text style={{marginTop: -20, fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              2.连续签到天数越多，积分奖励越多；
            </Text>
            <Text style={{marginTop: -20, fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              3.如果签到中断，需要从头再来。
            </Text>
          </View>
          <TouchableOpacity style={styles.ruleBtnBox} onPress={this.props.hideConfirmModal}>
            <Text style={{color: '#FF7E00', fontSize: 18, textAlign: 'center'}}> 我知道了 </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
  signRuleRow: {
    lineHeight: 25,
    height: 25,
    width: 117,
    fontSize: 13,
    color: '#333333',
    textAlign: 'center'
  },
})
