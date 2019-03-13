import React, { Component } from 'react';
import {Text, View, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation'
import { connect } from "react-redux"

type Props = {};
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

class HomePage extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress',this.onBackPress)
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.onBackPress)
  }
  onBackPress = () => {
    const {dispatch,nav} = this.props
    console.log(nav)
    if(nav.routes[1].index === 0){ //说明路由导航器前面没有可以退的了，在首页了
      return false //不处理直接返回让系统处理
    }
    dispatch(NavigationActions.back()) //手动返回上一页
    return true //让系统不处理
  }
  componentWillUnmount() {
      this.backPress.componentWillUnmount();
  }
  render() {
    NavigationUtil.navigation = this.props.navigation //把最外层的navigation给NavigationUtil
    return <DynamicTabNavigator />
  }

}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(HomePage); 


