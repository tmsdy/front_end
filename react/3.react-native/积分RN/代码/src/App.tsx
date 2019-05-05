import React from 'react'
import {AppRegistry} from 'react-native'
import {Provider} from 'react-redux'

import {Navigator} from '@iqiyi/rn-navigation'
import {DeviceModule, QYRNBridge, UserModule} from '@iqiyi/rn-base-modules'

// tslint:disable:no-import-side-effect
import './constants/global'

import Router, {IRouteConfig, MIDDLE_PAGE} from './Router'
import {goToLogin} from './common/util'
import {showToast} from './common/QYNativeBridge'
import configureStore from './store/index'
import {loginChange} from './constants/loginStatusChange'
import {sendPagePingback} from './common/pingback'

interface AppProps {
  uniqueID: string;
  pageName: string;
  [propName: string]: any;
}

interface AppState {
  isLoading: boolean;
}

const store = configureStore()
const makeApp = () => {
  return class extends React.Component<AppProps, AppState> {
    private initPage: IRouteConfig;

    public static defaultProps = {
      pageName: 'HomePage'
    }

    constructor(props) {
      super(props)
      // bundle加载即执行，区分与页面加载
      sendPagePingback('IntegralMain')
      this.state = {
        isLoading: true,
      }

      this.initPage = Router[this.props.pageName] ? Router[this.props.pageName] : null
      this.initData()
      loginChange()
    }

    componentDidMount() {
      // 忽略所有warning
      console.disableYellowBox = true // eslint-disable-line no-console
      // 忽略指定关键词warning
      // console.ignoredYellowBox = ['Module QYRCTSkinManager', 'Warning: componentWillReceiveProps', 'Warning: componentWillUpdate', 'source.uri should not be an empty string']
    }

    render() {
      const {isLoading} = this.state
      const {uniqueID, pageName} = this.props
      const routeName = this.getRouterName(pageName)

      global.uniqueID = uniqueID
      global.from = ['HomePage', 'IntegralPark'].includes(routeName) ? 'WD' : routeName

      if(isLoading) {
        return null
      }

      return (
        <Provider store={store}>
          <Navigator stackConfig={{cardStyle: {shadowOpacity: 0, shadowColor: '#fff'}}} routes={Router} initialRoute={routeName} {...this.props} />
        </Provider>
      )
    }

    // 获取页面路由
    getRouterName = (pageName: string) => {
      // pageName是否在当前版本中存在
      return Router.hasOwnProperty(pageName) ? pageName : MIDDLE_PAGE
    }

    initData = () => {
      return Promise
        .all([this._getUserInfo(), this._getDeviceInfo(), this._getAreaAndLanguage()])
        .then(() => {
          global.COMMON_PARAMS = {
            userId: global.USER_INFO.userId || 0,
            authCookie: global.USER_INFO.authCookie,
            cookie: global.USER_INFO.authCookie,
            agentversion: global.CLIENT_INFO.appVersion,
            appver: global.CLIENT_INFO.appVersion,
            version: global.CLIENT_INFO.appVersion,
          }

          this.setState({isLoading: false})
        })
        .catch((err) => {
          showToast(err.message)

          // 监听用户登录、登出
          UserModule.sub((info) => {
            if(info && info.isLogin) {
              this.initData()
            }
          })
        })
    }

    _getUserInfo = async () => {
      try {
        const {isLogin, isVip: isVIP, userId, userCookie, userIcon, userName} = await UserModule.getUserInfoFromNative()

        if(!isLogin && this.initPage && this.initPage.needLogin) {
          // 跳转基线登录
          return goToLogin()
        }

        global.USER_INFO = {
          isVIP,
          userIcon,
          userName,
          isLogin,
          authCookie: userCookie,
          userId: isLogin && userId || 0,
        }
      } catch(e) {
        console.log(e) // eslint-disable-line
      }
    }

    _getDeviceInfo = async () => {
      try {
        const info = await DeviceModule.getDeviceInfo()
        global.CLIENT_INFO = {...info}
      } catch(e) {
        console.log(e) // eslint-disable-line
      }
    }

    _getAreaAndLanguage = async () => {
      try {
        const {area, language} = await QYRNBridge.getAreaAndLanguage()
        global.mod = `${area}_${language === 'zh-Hans-CN' ? 's' : 't'}`
      } catch(e) {
        console.log(e) // eslint-disable-line
      }
    }

  }
}

AppRegistry.registerComponent('RNIntegral', makeApp)
AppRegistry.registerComponent('RNTemplate', makeApp)
AppRegistry.registerComponent('AwesomeProject', makeApp)
