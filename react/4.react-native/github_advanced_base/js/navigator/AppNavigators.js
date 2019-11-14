import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
// 这些create方法里面传页面生成Navigator，页面中默认props有navigation和screenProps
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'

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
const SwitchNavigator = createSwitchNavigator({ //用这个保证欢迎页跳到首页不会再跳回欢迎页了
  Init: InitNavigator,
  Main: MainNavigator,
},{
  initialRouteName: "Init",
  navigationOptions:{
    header:null
  }
})
const  AppContainer = createAppContainer(SwitchNavigator)

export default AppContainer

