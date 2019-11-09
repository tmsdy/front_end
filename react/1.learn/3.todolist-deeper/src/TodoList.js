import React, { Component } from 'react';
import 'antd/dist/antd.css'
import store from './store'
import TodoItem from './TodoItem'
import TodoListUI from './TodoListUI'
import { getInputChangeAction, getAddTodoItemAction, getDeleteTodoItemAction } from './store/actionCreators'

class TodoList extends Component { //容器组件负责逻辑

    constructor(props) {
        super(props)
        this.state = {}
        this.todoRef = React.createRef() // {current: null}
        this.inputChange = this.inputChange.bind(this)
        this.btnClick = this.btnClick.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.handleStoreChange = this.handleStoreChange.bind(this)
        this.state = store.getState()
        store.subscribe(this.handleStoreChange) //只要store改变就会调用一次handleStoreChange
    }
    componentDidMount() {
    }
    handleStoreChange() {
        this.setState(store.getState())
    }
    inputChange(e) {
        let inputValue = e.target.value
        store.dispatch(getInputChangeAction(inputValue)) //把action传给store,store自动把state,action转发给reducer
    }
    btnClick() {
        let { inputValue, count } = this.state
        store.dispatch(getAddTodoItemAction(inputValue, count))
    }
    deleteItem(id) {
        store.dispatch(getDeleteTodoItemAction(id))
    }
    getTodoItem() {
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
        // UI组件负责渲染
        let { inputValue } = this.state
        return (
            <TodoListUI //父组件把方法传给子组件用，数据还是在父组件变的，一变就又重新渲染了
                inputValue={inputValue}
                inputChange={this.inputChange}
                btnClick={this.btnClick}
                getTodoItem={this.getTodoItem.bind(this)}
            />
        )
    }
}

export default TodoList;
