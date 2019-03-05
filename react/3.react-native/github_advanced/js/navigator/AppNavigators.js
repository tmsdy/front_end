import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
// 这些create方法里面传页面生成Navigator，页面中默认props有navigation和screenProps
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import { connect } from "react-redux"
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers'

export const rootCom = 'Init';//设置根路由

const InitNavigator = createStackNavigator({
  WelcomePage:{
    screen: WelcomePage,
    navigationOptions:{
      header: null,// 禁用StackNavigator的Navigation bar，保证全屏显示
    }
  }
})

const MainNavigator = createStackNavigator({
  HomePage:{
    screen: HomePage,
    navigationOptions:{
      header:null
    }
  },
  DetailPage:{
    screen: DetailPage,
    navigationOptions:{
    }
  }
})
export const RootNavigator = createSwitchNavigator({ //用这个保证欢迎页跳到首页不会再跳回欢迎页了
  Init: InitNavigator,
  Main: MainNavigator,
},{
  initialRouteName: "Init",
  navigationOptions:{
    header:null
  }
})

export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
);

const App = createReduxContainer(RootNavigator);

const mapStateToProps = state => ({ //State到Props的映射关系
  state: state.nav,
});

//连接 React 组件与 Redux store
export default connect(mapStateToProps)(App);


