/*

1.babel
1）默认只转换es6语法：let const 箭头函数等
像新API如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在
全局对象上的方法（比如 Object.assign）都不会转译,启用插件 babel-plugin-transform-runtime 后
，Babel 就会使用 babel-runtime 下的工具函数

2.编译顺序为首先plugins从左往右，然后presets从右往左


*/