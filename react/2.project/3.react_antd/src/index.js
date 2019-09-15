import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import Admin from './admin';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Admin />, document.getElementById('root'));

serviceWorker.unregister();
