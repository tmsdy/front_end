console.log(arguments) //自带闭包的五个参数 exports require module __filename __dirname
/*

*node自带闭包
(function (exports, require, module, __filename, __dirname) {
    module.exports = exports = this = {}

    自己写的代码...

    exports.xxx = xxx 这样改由于引用module.exports也会等于xxx
    return module.exports
})

*require这个东西里面有个cache缓存，当你多次require同一个文件的时候只会require一次

模块化(闭包实现)好处：
  低耦合 高内聚，方便维护，防止代码冲突

浏览器端的模块化：CMD(seaJs 就近依赖) AMD(requireJs) 依赖前置

node基于规范CommonJs 文件的读写，node天生自带模块化
  创建模块：一个js文件就是一个模块
  使用模块：require 文件
  导出模块：exports 、 module.exports



*/