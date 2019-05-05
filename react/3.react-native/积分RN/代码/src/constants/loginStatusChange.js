import {DeviceEventEmitter} from 'react-native'
import {UserModule} from '@iqiyi/rn-base-modules'

export function loginChange() {
  UserModule.sub((info) => {
    console.log(info, '===登录===')
    if(info && info.isLogin) {
      const {
        isLogin,
        isVip: isVIP,
        userId,
        userCookie,
        userIcon,
        userName
      } = info
      global.USER_INFO = {
        authCookie: userCookie,
        isVIP,
        userId: isLogin && userId || 0,
        userIcon,
        userName,
        isLogin
      }
      global.COMMON_PARAMS = {
        userId: global.USER_INFO.userId,
        authCookie: global.USER_INFO.authCookie,
        cookie: global.USER_INFO.authCookie,
        agentversion: global.CLIENT_INFO.appVersion,
        appver: global.CLIENT_INFO.appVersion,
        version: global.CLIENT_INFO.appVersion
      }
      DeviceEventEmitter.emit('loginChange', isLogin)
    }
  })
}
