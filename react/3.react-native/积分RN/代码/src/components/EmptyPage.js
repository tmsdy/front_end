/**
 * Created by liuzhimeng.
 * @date 2018/9/21
 * @description
 */

import React from 'react'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {View, Text, Image} from '@iqiyi/rn-ui'
import QYNetError from '@iqiyi/rn-net-error'
import {isIOS} from '@iqiyi/rn-utils'
import {LoadMore} from './LoadMore'
import TopicButton from './topicPk/src/TopicButton'
import {goToLogin} from '../common/util'

const getNameMaps = (loginTip, emptyTip) => {
  return {
    loading: {
      type: 'loadMore',
      loadMoreOptions: {
        netInfo: 0,
      },
    },
    networkBroken: {
      type: 'error',
    },
    networkError: {
      type: 'error',
    },
    login: {
      type: 'empty',
      emptyType: 'login',
      text: loginTip,
    },
    empty: {
      type: 'empty',
      text: emptyTip,
    },
  }
}

const BUTTON_STYLES = {
  width: 180,
  height: 40,
  marginTop: 50,
}

const onEmptyButtonPress = (emptyType, onPress) => {
  if(emptyType === 'login') {
    return goToLogin()
  }
  onPress()
}

// 通用定制化空页面
// 包含种状态：loading加载中，networkBroken断网，networkError弱网或网络错误，login登录页，empty空态页
export const CustomEmptyPage = ({showName, children, loginTip, emptyTip, ...left}) => {
  if(!showName || showName === 'content') {
    return children
  }
  const emptyPageProps = getNameMaps(loginTip, emptyTip)[showName]
  if(emptyPageProps.type === 'error') {
    return <QYNetError {...left}/>
  }
  return <EmptyPage {...emptyPageProps} {...left}/>
}
CustomEmptyPage.propTypes = {
  children: PropTypes.node,
  showName: PropTypes.string, // showName为空则隐藏此组件
  loginTip: PropTypes.string, // 空态登录页提示文字
  emptyTip: PropTypes.string, // 空态页提示文字
  retry: PropTypes.func, // 网络错误页点击重试事件
}
CustomEmptyPage.defaultProps = {
  children: null,
  showName: null,
  loginTip: '请登录后查看',
  emptyTip: '未获取数据',
  retry: global.NOOP,
}

// 自定义空态页
export const EmptyPage = ({type, emptyType, text, showButton, buttonText, onButtonPress, loadMoreOptions, containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {type === 'empty' && (
        <View style={styles.emptyWrapper}>
          <Image source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}} style={styles.image}/>
          <Text style={styles.text}>{text}</Text>
          {(emptyType === 'login' || showButton) && (
            <TopicButton
              mode="pure"
              text={buttonText}
              buttonStyles={BUTTON_STYLES}
              onPress={() => onEmptyButtonPress(emptyType, onButtonPress)}
            />
          )}
        </View>
      )}
      {type === 'loadMore' && <LoadMore {...loadMoreOptions}/>}
    </View>
  )
}
EmptyPage.propTypes = {
  type: PropTypes.string, // 空态页状态类型：empty：加载空态页，loadMore：加载LoadMore组件

  text: PropTypes.string, // 空态页提示文字
  emptyType: PropTypes.string, // 空态页类型，值为login: 空态页为默认登录页；值为空则自定义配置

  buttonText: PropTypes.string, // 按钮文字
  showButton: PropTypes.bool, // 是否显示按钮，默认不显示
  onButtonPress: PropTypes.func, // 按钮点击事件

  loadMoreOptions: PropTypes.object, // loadMore 配置，详情查看loadMore组件

  containerStyle: PropTypes.object,
}
EmptyPage.defaultProps = {
  type: 'empty',
  text: '空态页文字',
  emptyType: '',
  buttonText: '立即登录',
  showButton: false,
  onButtonPress: global.NOOP,
  loadMoreOptions: {},
  containerStyle: {
    flex: 1,
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emptyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 164,
    height: 124,
  },
  text: {
    marginTop: 20,
    color: '#666666',
    fontSize: 14,
  },
})
