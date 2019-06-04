
/*

1. npm i 
@babel/core
@babel/preset-env
  ES6对ES5语法转换
// @babel/plugin-transform-runtime 写UI库之类的要用这个
@babel/polyfill
  补充ES6变量和函数
@babel/plugin-proposal-object-rest-spread
  处理这种let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };

-D

2.npm uninstall 
babel-core
babel-preset-env
babel-preset-stage-2
babel-polyfill
babel-plugin-transform-runtime

3.上了8.x的babel-loader才回去去找@babel/core，否则会去找babel/core

4.


*/