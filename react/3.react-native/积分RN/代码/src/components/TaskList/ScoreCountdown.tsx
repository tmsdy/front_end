/**
 * Created by liuzhimeng.
 * @date 2019-03-12
 * @description 翻倍奖励积分倒计时组件
 */
import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import BaseStyleSheet from '../../common/BaseStyleSheet'
import WebImage from '../WebImage'

const formatTime = (time: number): string => {
  const totalDay = Math.floor(time / (24 * 60 * 60 * 1000))
  const totalDayTime = totalDay * 24 * 60 * 60 * 1000
  const totalHour = Math.floor(time / (60 * 60 * 1000))
  const totalMin = Math.floor(time / (60 * 1000))

  const hour = Math.floor((time - totalDayTime) / (60 * 60 * 1000))

  if(time <= 60 * 1000) {
    return '1分钟'
  }
  if(time <= 60 * 60 * 1000) {
    return `${totalMin}分钟`
  }
  if(time <= 24 * 60 * 60 * 1000) {
    return `${totalHour}小时`
  }
  return `${totalDay}天${hour}小时`
}

interface ScoreCountdownProps {
  time: number;
  onPress(): void;
}
export default function ScoreCountdown({time = 0, onPress}: ScoreCountdownProps) {
  return time > 0 && (
    <View style={styles.dailytaskTitle}>
      <Text style={styles.doubleTextWrapper}>翻倍截止：{formatTime(time)}</Text>
      <TouchableOpacity style={styles.iconWrapper} activeOpacity={1} onPress={onPress}>
        <WebImage name="flower/icon-question" style={styles.questionIcon} />
      </TouchableOpacity>
    </View>
  )
}

export const SCORE_COUNTDOWN_RULE_TASK = {
  exts: [{
    name: 'notes',
    value: '1、为什么会有翻倍奖励？\n领取回血包、抽奖中奖或其他活动都有可能获得哦\n2、翻倍奖励如何使用？\n完成标有“积分X2”标识的任务，积分值自动翻倍！多次领取有效期将累加，多多益善~'
  }]
}

const styles = BaseStyleSheet.create({
  dailytaskTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 29,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
  },
  questionIcon: {
    width: 12,
    height: 12,
  },
  doubleTextWrapper: {
    fontSize: 12,
    color: '#999999',
  },
})
