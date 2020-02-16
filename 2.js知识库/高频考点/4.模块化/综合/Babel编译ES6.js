// ES6
var firstName = 'Michael';
var year = 1958;

export { firstName, lastName, year };

/* 
Babel编译
    1) 把ES6模块语法转为 CommonJS 模块语法，然而浏览器是不支持这种模块语法的，需要使用打包工具将代码打包。
    2) 为什么浏览器中不支持 CommonJS 语法呢？
        浏览器环境中并没有 module、 exports、 require 等环境变量。webpack打包后的文件模拟了这些变量的行为才能在浏览器中能运行


*/
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.year = exports.firstName = void 0; //先赋值undefined用void 0
var firstName = 'Michael';
exports.firstName = firstName;
var year = 1958;
exports.year = year;