import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
class  Footer  extends  Component{
	constructor(){
		super(...arguments);
		this.state={
      author:"White Shark"
    }
	}
	render(){
	   return  (<View id='footer'>
       <Text className='footer_text'>Power by {this.state.author}</Text>
     </View>)
	}
}
export default Footer;
