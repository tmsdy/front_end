/**
 * Created by liuzhimeng.
 * @date 2018/10/29
 * @description 通用弹窗内容
 */
import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import WebImage from '../../components/WebImage'
import CommonButton from '../CommonButton'
import {
  TEXT_COLOR_DEFAULT,
  TEXT_COLOR_TIPS,
} from '../../constants/baseStyles'

const CONTAINER_WIDTH = 305
const RULE_LIST = [
  {
    id: 'qa1',
    q: '勋章如何获取?',
    a: '不同勋章有不同的获取条件，点击打开勋章详情页，可以查看每个勋章的获取条件和当前进度。'
  }, {
    id: 'qa2',
    q: '勋章是否可佩戴？',
    a: '是，勋章均可佩戴。最多同时佩戴3个勋章，佩戴后可以在不同页面展示1至3个勋章。',
  }, {
    id: 'qa3',
    q: '勋章有期限吗？',
    a: '勋章没有有效期限，可以永久获取哦！',
  },
]

// 规则弹窗内容
export const RuleContent = ({onButtonPress}) => (
  <View style={styles.commonWrapper}>
    <Text style={styles.ruleTitle}>勋章规则</Text>
    <View>
      {RULE_LIST.map(({id, q, a}) => (
        <View key={id}>
          <Text style={styles.ruleLabel}>{q}</Text>
          <Text style={styles.ruleContent}>{a}</Text>
        </View>
      ))}
    </View>
    <View style={styles.buttonWrapper}>
      <CommonButton
        mode="gradient"
        text="我知道了"
        onPress={onButtonPress}
        containerStyle={{
          width: 220,
          height: 40,
        }}
      />
    </View>
  </View>
)

RuleContent.propTypes = {
  onButtonPress: PropTypes.func,
}
RuleContent.defaultProps = {
  onButtonPress: () => null,
}

// 勋章页面升级提示弹窗内容
export const UpdateContent = ({onButtonPress}) => {
  return (
    <View style={styles.container}>
      <WebImage name="integralmedal/update_bg" style={styles.updateBackground}/>
      <View
        style={[styles.commonWrapper, {
          borderRadius: 25,
          paddingTop: 138
        }]}
      >
        <View style={{alignItems: 'center'}}>
          <Text style={styles.updateContent}>标记你的奇妙时刻</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <CommonButton
            mode="gradient"
            text="立即开启"
            onPress={onButtonPress}
            containerStyle={{
              width: 134,
              height: 40
            }}
          />
        </View>
      </View>
    </View>
  )
}

UpdateContent.propTypes = {
  onButtonPress: PropTypes.func,
}
UpdateContent.defaultProps = {
  onButtonPress: () => null,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 40,
  },
  commonWrapper: {
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  buttonWrapper: {
    alignItems: 'center',
    minHeight: 40,
    marginTop: 18,
  },

  // 规则弹窗样式
  ruleTitle: {
    lineHeight: 25,
    marginBottom: 18,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT,
  },
  ruleLabel: {
    lineHeight: 20,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_COLOR_DEFAULT,
  },
  ruleContent: {
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 14,
    color: TEXT_COLOR_TIPS,
  },

  // 勋章页更新弹窗样式
  updateBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: CONTAINER_WIDTH,
    height: 165,
  },
  updateContent: {
    maxWidth: 208,
    lineHeight: 22.5,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: TEXT_COLOR_TIPS,
  },
})
