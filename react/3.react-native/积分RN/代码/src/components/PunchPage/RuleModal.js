/**
 * 参与成功弹窗
 */

import React, {PureComponent} from 'react';
import {TouchableOpacity, ScrollView} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui';
import WebImage from '../WebImage';

const RULE = [
  '消耗10积分，即可报名参与打卡挑战活动',
  '次日20:00前回到该页面，即算打卡成功',
  '打卡成功的用户，可随机瓜分奖池，奖池积分将在21:00前到帐，并可在我的战绩页面查看',
  '参与次数越多，瓜分份额越大'
]
const MODAL_WIDTH = 270

const RULE_PADDING = 16
const RULE_ICON_WRAPPER_WIDTH = 12
const RULE_TEXT_MAX_WIDTH = (MODAL_WIDTH - RULE_PADDING * 2) - RULE_ICON_WRAPPER_WIDTH
const RULE_LINE_HEIGHT = 17.5
export default class RuleModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.ruleContainer}>
        <WebImage style={styles.ruleTitleBg} name="topicpk/modal-rule-bg">
          <Text style={styles.ruleTitle}>活动规则</Text>
        </WebImage>
        <ScrollView style={styles.ruleWrapper}>
        {RULE.map(rule => (
            <View key={rule} style={styles.ruleItem}>
              <View style={styles.ruleIconWrapper}>
                <WebImage style={styles.ruleIcon} name="topicpk/yellow"/>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.buttonWrapper} onPress={this.props.hide}>
          <Text style={[styles.defaultText]}>我知道了</Text>
        </TouchableOpacity>
      </View>
    )
  }
  onHandleClick = () => {
    const {userVoteNumber} = this.props
    if(userVoteNumber === 88) {
      this.props.hide()
    } else {
      this.props.hide().then(this.props.askToVote)
    }
  }
}

const styles = BaseStyleSheet.create({
  ruleContainer: {
    width: 270,
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  ruleTitleBg: {
    position: 'relative',
    top: -2,
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  ruleTitle: {
    lineHeight: 23,
    paddingTop: 30,
    paddingBottom: 23,
    textAlign: 'center',
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  buttonWrapper: {
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#FF7E00',
    backgroundColor: 'transparent',
    height: 37,
    width: 120,
    alignSelf: 'center',
    marginTop: 20
  },
  defaultText: {
    lineHeight: 16,
    paddingVertical: 11,
    textAlign: 'center',
    fontSize: 16,
    color: '#FF6600',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: 238,
    marginBottom: 7,
  },
  ruleIconWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 12,
    height: 17.5,
    paddingTop: 17.5 / 2 - 4,
  },
  ruleIcon: {
    width: 8,
    height: 8,
  },
  ruleText: {
    maxWidth: RULE_TEXT_MAX_WIDTH,
    lineHeight: RULE_LINE_HEIGHT,
    fontSize: 12,
    color: '#666666',
  },
})
