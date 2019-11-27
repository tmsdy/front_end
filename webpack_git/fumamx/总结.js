/*
* 1.优化打包速度
1）happyPack(开多线程打包)：包一下js、less、eslint(dev加、prod去掉),开启cpu最大支持的线程数
2）打包环境不要开sourceMap
3）include指定在那儿找， exclude排除在哪找
4）设置noParse: 像jquery、lodash独立的第三方库，不需要webpack再去分析它的依赖了
5）编译缓存：使用cache-loader缓存比较耗时的loader(css-loader,eslint-loader)
babel-loader缓存：loader: 'babel-loader?cacheDirectory=true'

* 2.优化打包后大小
1）代码分割：把多次引用的模块分割打包出来。
2）第三方库：
    dllplugin：把vue、vue-router、element等基本不会变的统一抽出来打包cdn引入。这样以后就不用再打包了
    externals+cdn+http2: 多个cdn外链，利用http2多路复用可以更快：https://www.jianshu.com/p/f6b3f097a56d
3）压缩js(多线程压缩+cache缓存)，压缩css
4）开启gzip
5）import+解构：自动开启tree-shaking

* 3.升babel7


*/