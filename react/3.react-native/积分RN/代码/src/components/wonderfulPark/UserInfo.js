/**
 * Created by liuzhimeng.
 * @date 2018-12-14
 * @description 用户信息栏
 */
import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'
import TotalScore from '../totalScore/TotalScore'
import {goToLogin} from '../../common/util'
import {TOUCH_NONE} from '../../constants/touchableStyle'
import {sendClickPingback} from '../../common/pingback'
import {GO_LOGIN_CLICK, INTEGRAL_DETAIL_CLICK, MY_GAIN_CLICK, PARK_PAGE} from './pingback'

const goIntegralDetail = (isLogin, goTo) => {
  sendClickPingback(PARK_PAGE, '', INTEGRAL_DETAIL_CLICK)
  if(!isLogin) {
    return goToLogin()
  }
  // sendClickPingback('homeRN', 200100, 'detailbtn')
  goTo('IntegralDetail')
}

const goToMyGain = (goTo) => {
  sendClickPingback(PARK_PAGE, '', MY_GAIN_CLICK)
  goTo('MyGain')
  // openWeb(ORDERLIST[GET_ENV()])
}

const goLogin = () => {
  sendClickPingback(PARK_PAGE, '', GO_LOGIN_CLICK)
  goToLogin()
}

export default function UserInfo({isLogin, userIcon, totalScore, goTo}) {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatarWrapper}>
          <WebImage name={isLogin ? userIcon : 'default_icon'} style={styles.avatar}/>
        </View>
        <TouchableOpacity onPress={() => goIntegralDetail(isLogin, goTo)}>
          <TotalScore
            totalScore={totalScore}
            from="list"
            style={{marginLeft: 10}}
            textStyle={styles.scoreText}
            IconStyle={styles.scoreIcon}
          />
        </TouchableOpacity>
      </View>
      {isLogin ? (
        <TouchableOpacity {...TOUCH_NONE} onPress={() => goToMyGain(goTo)}>
          <WebImage style={styles.image} name="wonderfulpark/get_award"/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={() => goLogin()}>
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
UserInfo.propTypes = {
  isLogin: PropTypes.bool,
  userIcon: PropTypes.string,
  totalScore: PropTypes.number,
}
UserInfo.defaultProps = {
  isLogin: false,
  userIcon: 'default_icon',
  totalScore: 0,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 13
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  image: {
    width: 47,
    height: 35
  },
  scoreText: {
    lineHeight: 40,
    fontFamily: 'DINAlternate-Bold',
    fontSize: 30,
    color: '#333333'
  },
  scoreIcon: {
    width: 20,
    height: 20,
    marginLeft: 5
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 35,
    borderRadius: 20,
    borderColor: '#FF7E00',
    borderWidth: 2
  },
  loginButtonText: {
    fontSize: 16,
    color: '#FF7E00'
  }
})
