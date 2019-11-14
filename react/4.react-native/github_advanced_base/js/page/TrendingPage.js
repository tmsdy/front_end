import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';

type Props = {};
export default class TrendingPage extends Component<Props> {
  
  render() {
    let {navigation} = this.props
    return (
      <View>
       <Text>TrendingPage</Text>
       <Button 
        title="改变主题色为红色"
        onPress={()=>{
          navigation.setParams({ //设置的属性
            theme:{
              tintColor: "red",
              updateTime: new Date().getTime()
            }
          })
        }}
       />
      </View>
    );
  }
}

