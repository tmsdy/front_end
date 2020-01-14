import React from 'react';//引入react才能编译jsx语法
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
// import { Provider } from './react-redux'
import store from './store'
// import TodoList from './page/Todo_redux'
import TodoList from './page/Todo_react-redux'

// 把app组件挂载到dom节点下
ReactDOM.render(
    <Provider store={store}>
        <TodoList />
    </Provider>
    , document.getElementById('root'));

