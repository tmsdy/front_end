import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Index from './Index'
import List from './List'
import Home from './Home'

export default () => {
    return (
        <Router>
            <ul>
                <li>
                    <Link to="/">首页</Link>
                </li>
                <li>
                    <Link to="/list/123">列表</Link>
                </li>
            </ul>
            <Route path="/" exact component={Index} />
            {/* 加:id，匹配这块就必须要传id了 */}
            <Route path="/list/:id" component={List} />
            <Route path="/home" exact component={Home} />
        </Router>
    )
}
