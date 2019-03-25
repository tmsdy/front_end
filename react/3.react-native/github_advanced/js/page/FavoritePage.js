import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'

type Props = {};
class FavoritePage extends Component<Props> {
  render() {
    let {onThemeChange} = this.props
    return (
      <View style={{marginTop:30}}>
       <Text>FavoritePage</Text>
       <Button 
        title="改变主题色为绿色"
        onPress={()=>{
          onThemeChange('green')
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
export default connect(mapStateToProps,mapDispatchToProps)(FavoritePage)
