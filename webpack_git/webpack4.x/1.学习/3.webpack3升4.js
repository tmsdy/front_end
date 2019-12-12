/*

* 1.开箱即用：内置了更多的默认配置
  1）不再强制需要webpack.config.js
    默认入口： ./src/ 目录，默认entry ./src/index.js
    默认输出 ./dist 目录，默认输出文件 ./dist/main.js

  2）WebAssembly，webpack4提供了wasm的支持，现在可以引入和导出任何一个 Webassembly 的模块，
  也可以写一个loader来引入C++、C和Rust。（注：WebAssembly 模块只能在异步chunks中使用）

* 2.提供mode属性，不同设置效果不一样。
wwebpack会根据mode值来设置一个全局变量process.env.NODE_ENV
- development：开发体验好，日志更全面，console.log保留。
- production：专注项目编译部署，开启 Scope hoisting 和 Tree-shaking 功能

* 3.全新的插件系统，提供了针对插件和钩子的新API，变化如下：
  所有的 hook 由 hooks 对象统一管理，它将所有的hook作为可扩展的类属性
  添加插件时，你需要提供一个名字
  开发插件时，你可以选择插件的类型（sync/callback/promise之一）
  通过 this.hooks = { myHook: new SyncHook(…) } 来注册hook

* 4.更快的构建速度：大型项目节约90%构建时间
  1) DllPlugin主要就是减小需要打包的js体积
  2) happypack用来对编译阶段进行多线程编译
  3) UglifyJsPlugin的多线程压缩

* 5.通过code spliting来对路由做按需加载

*/