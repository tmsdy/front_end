import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image,Input} from '@tarojs/components';
import Item from './item/item'
import Tabs from './tabs/tabs'
import './todo.less'
class  Todo  extends  Component{
	constructor(){
		super(...arguments);
		this.state={
      id: 8 ,
      filter:'all',
      todos:[
        {
          id: 0,
          content:'this is todo',
          completed:false
        }
      ],
    };
  }
  componentDidMount(){
    // console.log(Input)
  }
  addTodo(e){
    this.setState({
      id: this.state.id+1
    },()=>{
      this.setState({
        todos: [{
            id: this.state.id,
            content:e.target.value.trim(),
            completed:false
        },...this.state.todos]
      },()=>{
        e.target.value = ''
      })
    })
  }
  delItem(id){
    this.state.todos.splice(this.state.todos.findIndex(todo => todo.id === id),1)
    this.setState({
      todos: this.state.todos
    })
  }
  toggleCheck(id){
    let todos = this.state.todos
    let index = todos.findIndex(item=>item.id==id)
    todos[index].completed = !todos[index].completed
    this.setState({
      todos
    })
  }
  toggleFilter(state){
    this.setState({
      filter: state
    })
  }
	render(){
    let {todos,filter} = this.state
    let filteredTodos = []
    if(filter==='all'){
        filteredTodos = todos
    }else{
      const completed = filter ==='completed'
      filteredTodos = todos.filter(todo => completed === todo.completed);
    }
    console.log(filteredTodos)
	   return  (<View className='real-app'>
      <Input className='add-input' type='text' focus placeholder='接下来要去做什么？' onConfirm={this.addTodo.bind(this)}></Input>
      {
        filteredTodos.map((todo,index)=>{
          return (
            <Item todo={todo} onDel={this.delItem.bind(this)} onToggleCheck={this.toggleCheck.bind(this)} key={index}></Item>
          )
        })
      }
      <Tabs todos={todos} filter={filter} onToggle={this.toggleFilter.bind(this)}></Tabs>
     </View>)
	}
}
export default Todo;
