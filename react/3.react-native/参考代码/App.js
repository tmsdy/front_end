import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}
class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Welcome Screen</Text>
      </View>
    );
  }
}
const AppNavigator = createStackNavigator({
  Home:{
    screen:HomeScreen
  } ,
  Welcome:{
    screen:WelcomeScreen,
    navigationOptions:{
      header:null
    }
  }
},{
  initialRouteName: "Welcome"
})
// export default createAppContainer(AppNavigator);

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}