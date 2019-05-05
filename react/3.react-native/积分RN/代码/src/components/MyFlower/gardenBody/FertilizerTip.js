/**
 * 点击化肥按钮提示弹窗
 */
import React, {PureComponent} from 'react';

import {Image, Text, View} from '@iqiyi/rn-ui';

const TEXT_CONTENT = {
  revive: [
    {label: '功效', text: '复活枯萎的花'},
    {label: '来源', text: '邀请好友或捕捉蜜蜂'},
  ],
  withdraw: [
    {label: '功效', text: '浇水21天后，可提取现金'},
    {label: '来源', text: '拥有好友10名，邀请爱奇艺新用户1名'},
  ],
  speeder: [
    {label: '功效', text: '浇水21天后，可提取现金'},
    {label: '来源', text: '拥有好友10名，邀请爱奇艺新用户1名'},
  ],
}

export default class FertilizerTip extends PureComponent {
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.fertilizerTipBox}>
          <View style={styles.boxBg} pointerEvents="none"/>
          {TEXT_CONTENT[this.props.type].map(({label, text}) => (
            <View key={label} style={styles.tipItem}>
              <View style={styles.leftPart}>
                <Text style={styles.leftText}>{label}</Text>
              </View>
              <Text style={styles.rightText}>{text}</Text>
            </View>
          ))}
        </View>
        <Image source={{uri: 'integral_revive_tip_arrow'}} style={styles.bottomArrow}/>
      </View>
    )
  }
}

const CONTAINER_WIDTH = 170
const styles = BaseStyleSheet.create({
  wrapper: {
    width: CONTAINER_WIDTH,
  },
  fertilizerTipBox: {
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  boxBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CONTAINER_WIDTH,
    height: 200,
    backgroundColor: 'rgba(255, 253, 235, 0.9)',
    opacity: 0.9,
    borderRadius: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  leftPart: {
    justifyContent: 'center',
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFEFB7',
    paddingHorizontal: 6.5,
  },
  leftText: {
    color: '#B56C00',
    fontSize: 12,
    fontWeight: '500',
  },
  rightText: {
    flex: 1,
    color: '#B56C00',
    fontSize: 12,
    lineHeight: 16.5,
    marginLeft: 6,
  },
  bottomArrow: {
    width: 12,
    height: 10,
    marginLeft: 26,
  },
})
