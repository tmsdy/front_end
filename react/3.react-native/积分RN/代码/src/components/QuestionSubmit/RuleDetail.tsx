/**
 * 脑洞投稿规则模块
 */
import React, {PureComponent} from 'react';
import {Text, View} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'

import WebImage from '../WebImage'

const RULE_TEXT = [
  '1.解除脑洞封印，快速构思出一个问题！问题题材不限，无论是影视综艺，还是生活情感，只要有料，洞君都来者不拒~注意问题字数不要超过30字喔，简单凝练地秀出你的脑洞~',
  '2.配上与脑洞问题相匹配的背景图片！如果你的问题足够优秀，没有图片洞君也愿意采纳呦 (*^▽^*)！',
  '3.投稿发送成功后，可以戳页面右上角“我的投稿”查看投稿审核进展~因投稿量太大，审核周期不固定，洞君会加班加点审核的！请耐心等待~'
]
const REWARD_TEXT = [
  '投稿一旦被采纳，即可获得',
  '200',
  '积分奖励（“我的投稿”页领取奖励）！投稿问题会在“脑洞大赏”展示！还等啥，快跟洞君一起刮起脑洞旋风吧！'
]

interface RuleDetailProps {
  text?: string;
}

export default class RuleDetail extends PureComponent<RuleDetailProps> {

  render() {
    return (
      <View style={styles.ruleBox}>
        <View style={styles.titleBox}>
          <View style={styles.line}/>
          <WebImage name="question/rule_title" style={styles.titlePic}/>
          <View style={styles.line}/>
        </View>
        <View style={{marginTop: 11}}>
          <View style={styles.ruleTitle}>
            <View style={styles.blueBox}/>
            <Text style={styles.titleText}>投稿规则</Text>
          </View>
          <View>
            {RULE_TEXT.map((item) => {
              return (
                <Text style={styles.ruleItemText}>{item}</Text>
              )
            })}
          </View>
        </View>
        <View style={{marginTop: 17.5}}>
          <View style={styles.ruleTitle}>
            <View style={styles.blueBox}/>
            <Text style={styles.titleText}>活动奖励</Text>
          </View>
          <Text style={styles.ruleItemText}>
            {REWARD_TEXT.map((item, index) => {
              if(index !== 1) {
                return (
                  <Text style={styles.ruleItemText}>{item}</Text>
                )
              }
              return (
                <Text style={[styles.ruleItemText, {color: '#FFEE4D'}]}>{item}</Text>
              )
              })}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = global.BaseStyleSheet.create({
  ruleBox: {
    paddingHorizontal: 35,
    marginTop: 51
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    width: 106,
    height: 0.5,
    backgroundColor: '#FFD3B7'
  },
  titlePic: {
    width: 56,
    height: 18,
    marginHorizontal: 10
  },
  ruleTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  blueBox: {
    width: 4,
    height: 13,
    backgroundColor: '#0064FF',
    marginRight: 5
  },
  titleText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 22,
    height: 22
  },
  ruleItemText: {
    color: '#FFD3B7',
    fontSize: 14,
    lineHeight: 20,
    width: Width - 74,
    alignSelf: 'center',
    marginLeft: 14
  }
})
