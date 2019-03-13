import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

type Props = {};
class TrendingPage extends Component<Props> {
  
  render() {
    let {onThemeChange} = this.props
    return (
      <View style={{marginTop:30}}>
       <Text>TrendingPage</Text>
       <Button 
        title="改变主题色为红色"
        onPress={()=>{
          onThemeChange('red')
        }}
       />
      </View>
    );
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage)