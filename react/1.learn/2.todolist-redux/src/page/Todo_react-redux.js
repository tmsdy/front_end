import React, { Component } from 'react';
import 'antd/dist/antd.css'
import TodoItem from './TodoItem'
import './TodoList.css'
// import { connect } from 'react-redux'
import { connect } from '../react-redux'
import { Input, Button } from 'antd';
import { getInputChangeAction, getAddTodoItemAction, getDeleteTodoItemAction } from '../store/actionCreators'

class TodoList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    getTodoItem = () => {
        let { list, deleteTodoItem } = this.props
        return list.map((item, i) => {
            return (
                <TodoItem
                    key={item.id} item={item}
                    deleteItem={(id) => { deleteTodoItem(id) }}
                ></TodoItem>
            )
        })
    }
    render() {
        let { inputValue, count, inputChange, addTodoItem } = this.props
        return (
            <div style={{ marginTop: 10, marginLeft: 10 }}>
                <label htmlFor="insertArea">输入内容</label>
                <Input
                    id="insertArea"
                    style={{ width: 300, marginRight: 10 }}
                    placeholder="做点什么吧"
                    value={inputValue}
                    onChange={(e) => {
                        inputChange(e.target.value)
                    }}
                />
                <Button type="primary" onClick={() => {
                    addTodoItem(inputValue, count)
                }}>提交</Button>
                <ul>
                    {this.getTodoItem()}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => { //把store中的数据映射到当前组件props上
    return {
        count: state.count,
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
