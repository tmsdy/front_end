import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'

type Props = {};
class MyPage extends Component<Props> {
  render() {
    let {onThemeChange} = this.props
    let statusBar = {
      backgroundColor: '#666' ,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar 
        title={'最热'}
        statusBar={statusBar}
        style={{backgroundColor: "#666"}}
      />
    return (
      <View style={{marginTop:30}}>
        {navigationBar}
      </View>
    );
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})
export default connect(mapStateToProps,mapDispatchToProps)(MyPage)
