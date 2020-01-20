import React from 'react'
import TodoList from './TodoList'
import Counter from './Counter'

export default (props) => {
    return (
        <div>
            <TodoList></TodoList>
            <br></br>
            <Counter></Counter>
        </div>
    )
}