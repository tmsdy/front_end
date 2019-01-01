import Taro,{Component} from '@tarojs/taro' ;
import {View,Text,Button} from '@tarojs/components' ;

class Child extends Component{
  // props值只读的
  clickHandle(){
    this.props.onchangeAge()
  }
  render(){
    return (<View>
      <Button onClick={this.clickHandle}>子组件想改age</Button>
      age:{this.props.age}
      </View>)
  }
}
//默认值，给不给都行
Child.defaultProps = {
  age: 18 ,
  // onchangeAge:null
}

export default Child
