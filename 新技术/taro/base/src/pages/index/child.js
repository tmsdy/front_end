import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';

class  Child  extends  Component{
	constructor(){
		super(...arguments);
		this.state={};
  }
  componentWillReceiveProps(nextProps){
    console.log('props属性变化了：'+nextProps.name)
  }
  cl(){
    this.props.obj[0].name = 'hhhhhh'
    this.props.onChange()
  }
	render(){
    let {name,obj} = this.props
	   return  (<View>
       <View>我是子节点</View>
       <View>传过来的name:{name}</View>
       <View>传过来的obj:{obj[0].name}</View>
       <View onClick={this.cl.bind(this)}>触发change事件</View>
     </View>)
	}
}
Child.defaultProps={ //传过来的值是undefined才会读这里的默认值
  obj: [{name:'',age:0}]
}
export default Child;
