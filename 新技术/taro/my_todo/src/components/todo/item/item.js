import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image,Input,Checkbox,Label,Button} from '@tarojs/components';
import './item.less'
class  Item  extends  Component{
	constructor(){
		super(...arguments);
		this.state={
      completed:false
    };
  }
  componentWillReceiveProps(nextProps) { //props变化走这里
    this.setState({
      completed:nextProps.todo.completed
    })
  }
  toggleCheck(){
    this.setState({
      completed: !this.state.completed
    },()=>{
      this.props.onToggleCheck(this.props.todo.id)
    })
  }
  deleteTodo(){
    this.props.onDel(this.props.todo.id)
  }
	render(){
    let {completed} = this.state
    let {todo} = this.props
	   return  (<View className={'todo-item '+[completed?'completed':'']}>
          <Checkbox checked={completed} onChange={this.toggleCheck.bind(this)}></Checkbox>
          <Label >{todo.content}</Label>
          <Button className='destroy' onClick={this.deleteTodo.bind(this)}></Button>
     </View>)
	}
}
Item.defaultProps = {
  todo: {
    id: 0,
    content:'this is todo',
    completed:false
  }
}
export default Item;
