import React, { Component } from 'react';
import {Text, View, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation'
import { connect } from "react-redux"
import BackPressComponent from '../common/BackPressComponent'

type Props = {};
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

class HomePage extends Component<Props> {
  constructor(props) {
      super(props);
      this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }

  componentDidMount() {
      this.backPress.componentDidMount();
  }
  componentWillUnmount() {
      this.backPress.componentWillUnmount();
  }

  onBackPress() {
    const {dispatch,nav} = this.props
    if(nav.routes[1].index === 0){ //说明路由导航器前面没有可以退的了，在首页了
      return false //不处理直接返回让系统处理
    }
    dispatch(NavigationActions.back()) //手动返回上一页
    return true //让系统不处理
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


