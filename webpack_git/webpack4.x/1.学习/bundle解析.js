(function (modules) {
    var installedModules = {}; // 模块的缓存

    function __webpack_require__(moduleId) { // 函数方法模仿require

        if (installedModules[moduleId]) { // * 模块加载过的直接取缓存，提高模块加载速度
            return installedModules[moduleId].exports;
        }

        var module = installedModules[moduleId] = { // 没加载过的就创建新模块并放到缓存
            i: moduleId,
            l: false,//是否加载完成
            exports: {} //导出的东西
        };
        /*
            * 执行模块函数
            这里是先走index.js，然后里面的__webpack_require__(\"./src/a.js\")引a.js，
            a.js原本module.exports为{}变为module.exports = 'hello feifei'
            然后let str = 'hello feifei'
        */
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        module.l = true; // 标记

        return module.exports;
    }
    __webpack_require__.p = '' //对于配置的publicPath 公开路径

    return __webpack_require__(__webpack_require__.s = "./src/index.js"); // 加载入口文件
})({
    "./src/a.js": //key -> 当前模块的路径，每个文件都是一个模块
        (function (module, exports) { // value 匿名执行函数
            eval("\r\nmodule.exports = 'hello feifei'\n\n//# sourceURL=webpack:///./src/a.js?");
        }),
    "./src/index.js":
        (function (module, exports, __webpack_require__) {
            eval("\r\nlet str = __webpack_require__(\"./src/a.js\")\r\n\r\nconsole.log(str)\n\n//# sourceURL=webpack:///./src/index.js?");
        })
});
// 这是development模式的bundle.js对象key-value形式，production的bundle参数是个数组