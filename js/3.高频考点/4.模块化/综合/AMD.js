// AMD 异步模块定义：是一个在浏览器端模块化开发的规范
// JavaScript原生不支持需要RequireJS库函数支持
// requireJS主要解决两个问题
//     1、多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
//     2、js加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长
// 定义模块 math.js
define(function () {
    let add = (x, y) => {
        return x + y;
    }
    return {
        add: add
    };
});
// 如果这个模块还需要依赖其他模块，那么define函数的第一个参数，必须是一个数组，指明该模块的依赖。
define([tools], function () {
    //…………………………
})
// 调用的时候
require([math], function () {
    //……………………
})
//require()异步加载math，浏览器不会失去响应；它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。