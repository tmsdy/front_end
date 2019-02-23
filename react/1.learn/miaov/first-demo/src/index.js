import React from 'react';//核心文件
import ReactDOM from 'react-dom'; //处理DOM相关
import registerServiceWorker from './registerServiceWorker';
import App from './App' ;

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
    <App />, // 要渲染的
    document.getElementById('root'),//渲染到什么地方去
    ()=>{ //渲染成功的回调函数
        console.log('渲染完成！') ;
    }
)

registerServiceWorker();
