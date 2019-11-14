import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';

type Props = {};
export default class FavoritePage extends Component<Props> {
  render() {
    let {navigation} = this.props
    return (
      <View>
       <Text>FavoritePage</Text>
       <Button 
        title="改变主题色为绿色"
        onPress={()=>{
          navigation.setParams({ //设置的属性
            theme:{
              tintColor: "green",
              updateTime: new Date().getTime()
            }
          })
        }}
       />
      </View>
    );
  }
}

