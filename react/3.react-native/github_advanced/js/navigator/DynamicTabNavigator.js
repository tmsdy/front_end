import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator,createAppContainer } from 'react-navigation'
import {BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'

type Props = {};
import NavigationUtil from './NavigationUtil'
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const TABS = { //配置页面的路由
  PopularPage: {
    screen: PopularPage,
    navigationOptions:{
      tabBarLabel: "最热",
      tabBarIcon: ({tintColor,focused})=>{
        return <MaterialIcons 
        name={'whatshot'}
        size={26}
        style={{color:tintColor}}
        />
      }
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions:{
      tabBarLabel: "趋势",
      tabBarIcon: ({tintColor,focused})=>{
        return <Ionicons 
        name={'md-trending-up'}
        size={26}
        style={{color:tintColor}}
        />
      }
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions:{
      tabBarLabel: "收藏",
      tabBarIcon: ({tintColor,focused})=>{
        return <MaterialIcons 
        name={'favorite'}
        size={26}
        style={{color:tintColor}}
        />
      }
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions:{
      tabBarLabel: "我的",
      tabBarIcon: ({tintColor,focused})=>{
        return <EvilIcons 
        name={'user'}
        size={26}
        style={{color:tintColor}}
        />
      }
    }
  }
}
// 方便动态配置tab属性
class DynamicTabNavigator extends Component<Props> {
  constructor(props){
    super(props)
    console.disableYellowBox = true //防止弹警告框的
  }
  shouldComponentUpdate(){
    return this.Tabs ? false: true 
  }
  _tabNavigator() { //props变化会重新调用这个方法
    const {PopularPage,TrendingPage,FavoritePage,MyPage} = TABS
    const tabs = {PopularPage,TrendingPage,FavoritePage,MyPage} //根据需要定制显示的tab
    FavoritePage.navigationOptions.tabBarLabel = '最爱' //可以动态配置的
    return this.Tabs = createBottomTabNavigator(tabs,{
      tabBarComponent:props=>{
        return <TabBarComponent theme={this.props.theme} {...props}/>
      }
    })
  }
  render() {
    const Tab = createAppContainer(this._tabNavigator())
    return <Tab />
  }

}

class TabBarComponent extends Component<Props> {
  constructor(props) {
    super(props)
    // console.log(props)
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }
  render(){
    return <BottomTabBar 
      {...this.props}
      activeTintColor={this.props.theme}
    />
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);


