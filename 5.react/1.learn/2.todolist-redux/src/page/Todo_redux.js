import React, { Component } from 'react';
import 'antd/dist/antd.css'
import TodoItem from './TodoItem'
import './TodoList.css'
import { Input, Button, List } from 'antd';
import store from '../store'
import { getInputChangeAction, getAddTodoItemAction, getDeleteTodoItemAction } from '../store/actionCreators'

class TodoList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state = store.getState()
        store.subscribe(this.hanleStoreChange) //只要store改变就会调用一次hanleStoreChange
    }
    hanleStoreChange = () => {
        this.setState(store.getState())
    }
    inputChange = (e) => {
        let inputValue = e.target.value
        store.dispatch(getInputChangeAction(inputValue)) //把action传给store,store自动把state,action转发给reducer
    }
    btnClick = () => {
        let { inputValue, count } = this.state
        store.dispatch(getAddTodoItemAction(inputValue, count))
    }
    deleteItem = (id) => {
        store.dispatch(getDeleteTodoItemAction(id))
    }
    getTodoItem = () => {
        return this.state.list.map((item, i) => {
            return (
                <TodoItem
                    key={item.id} item={item}
                    deleteItem={this.deleteItem}
                ></TodoItem>
            )
        })
    }
    render() {
        let { inputValue, list } = this.state
        return (
            <div style={{ marginTop: 10, marginLeft: 10 }}>
                <label htmlFor="insertArea">输入内容</label>
                <Input //react默认对输入框内容做转义的
                    id="insertArea"
                    style={{ width: 300, marginRight: 10 }}
                    placeholder="做点什么吧"
                    value={inputValue}
                    onChange={this.inputChange}
                />
                <Button type="primary" onClick={this.btnClick}>提交</Button>
                <ul>
                    {this.getTodoItem()}
                </ul>
                <List
                    style={{ marginTop: 10, width: 400 }}
                    bordered
                    dataSource={list}
                    renderItem={item => (<List.Item>{item.content}</List.Item>)}
                />
            </div>
        );
    }
}

export default TodoList;
