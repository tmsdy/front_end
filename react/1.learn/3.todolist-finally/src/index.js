import React from 'react';//引入react才能编译jsx语法
import 'antd/dist/antd.css'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import App from './page'
import './index.css'

// 把app组件挂载到dom节点下
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

