import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class WelcomePage extends Component<Props> {
  componentDidMount(){
    let {navigation} = this.props
    this.timer = setTimeout(()=>{
      NavigationUtil.resetToHomPage({navigation})
    },1000)
  }
  componentWillUnmount(){
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return (
      <View style={styles.container}>
       <Text style={styles.welcome}>Welcome背景</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
 
});
