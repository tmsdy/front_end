import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import './foodlist.less'
class  FoodList  extends  Component{
	constructor(){
		super(...arguments);
		this.state={};
	}
	render(){
		console.log(this.props)
	   return  (<View>FoodList</View>)	
	}
}
export default FoodList;