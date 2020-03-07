/*

1.webpack打包：跑在node端的不识别jsx和import之类的需要webpack进行转换
不打包node核心模块：webpack-node-externals

2.npm i npm-run-all -g，开发时一个命令行搞打包run build --watch，一个开服务nodemon dist/server.js
"dev": "npm-run-all --parallel dev:**", // 并行执行dev:**匹配到的脚本命令
"dev:start": "nodemon dist/server.js",
"dev:build": "webpack --config ./build/webpack.config.js --watch"

* 3.把react的组件转换成html字符串结构：let html = renderToString(<Home />),然后返回给前端渲染，但是事件是不能在node端绑定的。

* 4.处理事件绑定：服务端引入客户端的js文件来处理事件，服务端渲染主要干的是首屏的DOM结构渲染。ReactDOM.hydrate代替ReactDOM.render，因为不需要客户端再渲染DOM结构了，只需处理事件即可

*


*/