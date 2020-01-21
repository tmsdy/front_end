import React from 'react';
import { useSelector, useDispatch } from "react-redux"
import TodoItem from './TodoItem'
import TodoListUI from './TodoListUI'
import { getInputChangeAction, getAddTodoItemAction, getDeleteTodoItemAction } from '../action/actionCreators'

export default (props) => {
    const todoState = useSelector(state => state.todo)
    const dispatch = useDispatch()
    const { inputValue, count, list } = todoState

    function getTodoItem() {
        return list.map((item, i) => {
            return (
                <TodoItem
                    key={item.id}
                    item={item}
                    deleteItem={(id) => {
                        dispatch(getDeleteTodoItemAction(id))
                    }}
                ></TodoItem>
            )
        })
    }

    return (
        <TodoListUI //父组件把方法传给子组件用，数据还是在父组件变的，一变就又重新渲染了
            inputValue={inputValue}
            inputChange={(e) => {
                dispatch(getInputChangeAction(e.target.value))
            }}
            btnClick={() => {
                dispatch(getAddTodoItemAction(inputValue, count))
            }}
            getTodoItem={getTodoItem}
        />
    )
}

