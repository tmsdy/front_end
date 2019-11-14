

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import AppContainer from './navigator/AppNavigators';
import { createStackNavigator, createAppContainer } from "react-navigation";
import WelcomePage from './page/WelcomePage'
import HomePage from './page/HomePage'
import DetailPage from './page/DetailPage'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>123</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

