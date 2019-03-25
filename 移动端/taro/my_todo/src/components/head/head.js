import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import './head.less'
class  Head  extends  Component{
	constructor(){
		super(...arguments);
		this.state={};
	}
	render(){
	   return  (<View className='main-header'>
       <View className='title'>My-Todo</View>
     </View>)
	}
}
export default Head;
