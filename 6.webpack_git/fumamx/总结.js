/*
* 1.优化打包速度
1）happyPack(开多线程打包)：包一下js、less、eslint(dev加、prod去掉),开启cpu最大支持的线程数
2）打包环境不要开sourceMap
3）include指定在那儿找， exclude排除在哪找
4）设置noParse: 像jquery、lodash独立的第三方库，不需要webpack再去分析它的依赖了
5）编译缓存：使用cache-loader缓存比较耗时的loader(css-loader,eslint-loader)
babel-loader缓存：loader: 'babel-loader?cacheDirectory=true' ✅

* 2.优化打包后大小
1）代码分割：把 多次引用的、>30KB的模块分割打包出来。
2）第三方库：
    dllplugin：把vue、vue-router、element等基本不会变的统一抽出来打包cdn引入。这样以后就不用再打包了
    externals+cdn+http2: 多个cdn外链，利用http2多路复用可以更快：https://www.jianshu.com/p/f6b3f097a56d
3）压缩js(多线程压缩+cache缓存)，压缩css
4）开启gzip
5）import+解构：自动开启tree-shaking

* 3.webpack4的默认特性
1）import+解构：自动开启tree-shaking
2) Scope hoisting：它们可以检查import链，并尽可能的将散乱的模块放到一个函数中，前提是不能造成代码冗余。所以只有被引用了一次的模块才会被合并。使用Scope Hoisting可以让代码体积更小并且可以降低代码在运行时的内存开销，同时它的运行速度更快。前面2.1节介绍了变量从局部作用域到全局作用域的搜索过程越长执行速度越慢，Scope Hoisting可以减少搜索时间。
3）Code-splitting：可以使用import语法实现按需加载。

* 4.静态文件版本号
给css/js文件打上hash戳，这样上新版本的时候html引用的hash戳不一样就会重新下载文件了。

*/