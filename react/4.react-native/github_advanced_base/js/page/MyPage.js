import React, {Component} from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';

type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    let {navigation} = this.props
    return (
      <View>
       <Text>MyPage</Text>
       <Button 
        title="改变主题色为粉色"
        onPress={()=>{
          navigation.setParams({ //设置的属性
            theme:{
              tintColor: "pink",
              updateTime: new Date().getTime()
            }
          })
        }}
       />
      </View>
    );
  }
}

