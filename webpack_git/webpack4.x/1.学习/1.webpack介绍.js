/*
* 1.webpack的功能
* 1）代码转换：把ts、es6以上代码编译成浏览器可以运行的js，less/scss -> css, vue -> html/js/css
    用到babel-loader,less-loader,vue-loader等、

* 2）文件提取、分割、tree-shaking、压缩：
- 对于生成的html/css/js文件进行合并压缩，图片各种处理。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。(webpack4突出的优点)
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。

* 3）自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。

* 4）代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。

* 5）自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。连上线上服务器

* 1.Webpack源码流程：
* 启动后会从Entry里配置的Module开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module，就会根据配置的Loader去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。
* 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。
* 最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。

2.不同的业务逻辑拆成模块，再去分别的引入模块，保证项目的可维护性和扩展性

3.webpack内部的事件流：tapable，整个webpack工作流就靠这个。

*/