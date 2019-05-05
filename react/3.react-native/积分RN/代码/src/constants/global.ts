/**
 * 设置全局可访问的常量
 */
import {DeviceModule, UserModule} from '@iqiyi/rn-base-modules'
import {AsyncStorage} from 'react-native'
import BaseStyleSheet from '../common/BaseStyleSheet'

const {isLogin, isVIP, userId, userCookie: authCookie, userIcon, userName} = UserModule.get();

global.CLIENT_INFO = DeviceModule.get();

global.USER_INFO = {
  isLogin,
  isVIP,
  userIcon,
  userName,
  authCookie,
  userId: isLogin ? userId : 0,
};

global.COMMON_PARAMS = {
  userId: global.USER_INFO.userId,
  authCookie: global.USER_INFO.authCookie,
  cookie: global.USER_INFO.authCookie,
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  version: global.CLIENT_INFO.appVersion
};

global.BaseStyleSheet = BaseStyleSheet

global.NOOP = () => {};

// 初始化立即获取环境参数
(async () => {
  global._ENV_CONFIG_ = 'pro'
  try {
    const value = await AsyncStorage.getItem('envteststore');
    if(value === 'test') {
      // 只有获取到缓存参数为 test 才置为test 环境
      global._ENV_CONFIG_ = 'test'
    }
  } catch(error) {
    global._ENV_CONFIG_ = 'pro'
  }
})()
