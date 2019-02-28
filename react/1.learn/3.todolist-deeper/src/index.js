import React from 'react';//引入react才能编译jsx语法
import ReactDOM from 'react-dom';
import TodoList from './TodoList';

// 把app组件挂载到dom节点下
ReactDOM.render(<TodoList />, document.getElementById('root'));

