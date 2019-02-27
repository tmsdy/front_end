import React, { Component } from 'react';
// import axios from 'axios'
import 'antd/dist/antd.css'
import TodoItem from './TodoItem'
import Test from './Test'
// import Lifecycle from './learn/Lifecycle'
import './TodoList.css'
import { Input,Button,List } from 'antd';
import store from './store'
import {CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DELETE_TODO_ITEM} from './store/actionTypes'

class TodoList extends Component {

  constructor(props){
    super(props)
    this.state = {}
    this.inputChange = this.inputChange.bind(this)
    this.btnClick = this.btnClick.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.hanleStoreChange = this.hanleStoreChange.bind(this)
    this.state = store.getState()
    store.subscribe(this.hanleStoreChange) //只要store改变就会调用一次hanleStoreChange
  }
  componentDidMount(){ //组件被挂载到页面时执行一次，一般在这里ajax获取数据
    // axios.get('/api/todolist')
  }
  hanleStoreChange(){
    // console.log('store changed')
    this.setState(store.getState())
  }
  inputChange(e){
    let inputValue = e.target.value
    let action = {
      type: CHANGE_INPUT_VALUE,
      value: inputValue
    }
    store.dispatch(action) //把action传给store,store自动把state,action转发给reducer
  }
  btnClick(){
    let {inputValue,count} = this.state
    let action = {
      type: ADD_TODO_ITEM,
      count: ++count ,
      item: {
        id: count,
        content: inputValue
      }
    }
    store.dispatch(action)
  }
  deleteItem(id){
    let action = {
      type: DELETE_TODO_ITEM,
      id
    }
    store.dispatch(action)
  }
  getTodoItem(){
    return this.state.list.map((item,i)=>{
      return (
        <TodoItem 
          key={item.id} item={item}
          deleteItem={this.deleteItem}
        ></TodoItem>
      )
    })
  }
  render() {
    // console.log('todo render')
    let {inputValue,list} = this.state
    return ( //加括号可以多行写，组件的state或者props改变时，render函数就会重新执行
      <div style={{marginTop:10,marginLeft:10}}>
        <label htmlFor="insertArea">输入内容</label>
        <Input //react默认对输入框内容做转义的
          id="insertArea"
          style={{width:300,marginRight:10}}
          placeholder="做点什么吧"
          value={this.state.inputValue}
          onChange={this.inputChange}
          // ref={(input)=>{ this.input = input }}
        />
        <Button type="primary" onClick={this.btnClick}>提交</Button>
        <ul>
          {this.getTodoItem()}
        </ul>
        <List 
          style={{marginTop:10,width:400}}
          bordered
          dataSource={list}
          renderItem={item=>(<List.Item>{item.content}</List.Item>)}
          />
        <Test content={inputValue}></Test>
        {/* <Lifecycle></Lifecycle> */}
      </div>
    );
  }
}

export default TodoList;
