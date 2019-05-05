/**
 * Created by liuzhimeng.
 * @date 2018/9/18
 * @description
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ScrollView, StyleSheet} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import WebImage from '../../WebImage'
import ConfirmModal from '../../ConfirmModal'
import TopicButton from './TopicButton'
import {TEXT_COLOR_DEFAULT, TEXT_COLOR_TIPS} from '../constants'

const RULE_LIST = [
  '1.为你支持的一方投票，得票更多方获胜',
  '2.参与人数越多，胜方可瓜分积分值越高',
  '3.开奖后3天内皆可领取积分，过期作废',
]

export default class Modal extends Component {

  render() {
    const {mode, modalVisible} = this.props

    return (
      <ConfirmModal
        isTransparent={false}
        showCloseButton={mode === 'reminder'}
        modalVisible={modalVisible}
        cancelFn={() => this.onClose()}
      >
        {mode === 'reminder'
          ? this._renderReminder()
          : this._renderContent()
        }
      </ConfirmModal>
    )
  }

  _renderReminder() {
    const {
      content: {title, iconName},
      buttonText,
    } = this.props

    return (
      <View style={styles.container}>
        <WebImage style={styles.icon} name={iconName}/>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonWrapper}>
            <TopicButton
              mode="gradient"
              text={buttonText}
              onPress={() => this.onConfirm()}
              buttonStyles={{width: 220}}
            />
          </View>
        </View>
      </View>
    )
  }

  _renderContent() {
    return (
      <View style={styles.ruleContainer}>
        <WebImage style={styles.ruleTitleBg} name="topicpk/modal-rule-bg">
          <Text style={styles.ruleTitle}>活动规则</Text>
        </WebImage>
        <ScrollView style={styles.ruleWrapper}>
          {RULE_LIST.map(rule => (
            <View key={rule} style={styles.ruleItem}>
              <View style={styles.ruleIconWrapper}>
                <WebImage style={styles.ruleIcon} name="topicpk/yellow"/>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <TopicButton
            mode="default"
            text="我知道了"
            onPress={() => this.onConfirm()}
            buttonStyles={{width: 120}}
          />
        </View>
      </View>
    )
  }

  onConfirm() {
    this.props.onConfirm()
  }

  onClose() {
    this.props.onClose()
  }
}

Modal.propTypes = {
  modalVisible: PropTypes.bool,
  mode: PropTypes.string,
  content: PropTypes.object,
  buttonText: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
}

Modal.defaultProps = {
  modalVisible: false,
  mode: 'reminder',
  content: {},
  buttonText: '',
  onConfirm: () => null,
  onClose: () => null,
}

const MODAL_WIDTH = 270
const ICON_WIDTH = 160

const RULE_PADDING = 16
const RULE_ICON_WRAPPER_WIDTH = 12
const RULE_TEXT_MAX_WIDTH = (MODAL_WIDTH - RULE_PADDING * 2) - RULE_ICON_WRAPPER_WIDTH
const RULE_LINE_HEIGHT = 17.5

const styles = StyleSheet.create({
  ruleContainer: {
    width: MODAL_WIDTH,
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
    color: TEXT_COLOR_DEFAULT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleWrapper: {
    paddingHorizontal: RULE_PADDING,
    paddingBottom: 8,
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
    width: RULE_ICON_WRAPPER_WIDTH,
    height: RULE_LINE_HEIGHT,
    paddingTop: RULE_LINE_HEIGHT / 2 - 4,
  },
  ruleIcon: {
    width: 8,
    height: 8,
  },
  ruleText: {
    maxWidth: RULE_TEXT_MAX_WIDTH,
    lineHeight: RULE_LINE_HEIGHT,
    fontSize: 12,
    color: TEXT_COLOR_DEFAULT,
  },

  container: {
    position: 'relative',
    paddingTop: 70,
    backgroundColor: 'transparent',
  },
  icon: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: (MODAL_WIDTH - ICON_WIDTH) / 2,
    width: ICON_WIDTH,
    height: 140,
  },
  innerContainer: {
    position: 'relative',
    zIndex: 0,
    width: MODAL_WIDTH,
    paddingTop: 70,
    paddingHorizontal: 18,
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    color: TEXT_COLOR_DEFAULT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: TEXT_COLOR_TIPS,
    fontSize: 14,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
})
