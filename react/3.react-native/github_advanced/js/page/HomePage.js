import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator,createAppContainer } from 'react-navigation'

type Props = {};
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

export default class HomePage extends Component<Props> {
  
  render() {
    NavigationUtil.navigation = this.props.navigation //把最外层的navigation给NavigationUtil
    return <DynamicTabNavigator />
  }

}


