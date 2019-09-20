import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import Admin from './admin';
import HomeRouter from './pages/route_demo/route3/router'
import Router from './router';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));

serviceWorker.unregister();
