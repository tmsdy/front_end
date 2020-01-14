import React, { Component } from 'react';
import 'antd/dist/antd.css'
import TodoItem from './TodoItem'
import './TodoList.css'
import { connect } from 'react-redux'
// import { connect } from '../react-redux'
import { Input, Button, List } from 'antd';
import store from '../store'
import { getInputChangeAction, getAddTodoItemAction, getDeleteTodoItemAction } from '../store/actionCreators'

class TodoList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    hanleStoreChange = () => {
        this.setState(store.getState())
    }
    inputChange = (e) => {
        let inputValue = e.target.value
        this.props.inputChange(inputValue)
    }
    btnClick = () => {
        let { inputValue, count } = this.state
        this.props.addTodoItem(inputValue, count)
    }
    deleteItem = (id) => {
        this.props.deleteTodoItem(id)
    }
    getTodoItem = () => {
        return this.props.list.map((item, i) => {
            return (
                <TodoItem
                    key={item.id} item={item}
                    deleteItem={this.deleteItem}
                ></TodoItem>
            )
        })
    }
    render() {
        let { inputValue, list } = this.props
        return (
            <div style={{ marginTop: 10, marginLeft: 10 }}>
                <label htmlFor="insertArea">输入内容</label>
                <Input
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
            </div>
        );
    }
}

const mapStateToProps = (state) => { //把store中的数据映射到当前组件props上
    return {
        inputValue: state.inputValue,
        list: state.list
    }
}
const mapDispatchToProps = (dispatch) => { //让组件有能力用dispatch方法
    return {
        inputChange(inputValue) {
            dispatch(getInputChangeAction(inputValue))
        },
        addTodoItem(inputValue, count) {
            dispatch(getAddTodoItemAction(inputValue, count))
        },
        deleteTodoItem(id) {
            dispatch(getDeleteTodoItemAction(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
