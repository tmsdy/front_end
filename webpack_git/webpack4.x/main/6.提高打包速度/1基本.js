/*

1.升级node/npm/yarn的版本
    1）webpack建立在node运行环境上的，升级node能提升，window必须要去官网下载覆盖
        node@8.9.4: 3.5s 
        node@10.16.0: 3.2s
    2）新版本的npm/yarn可以更快的分析包的依赖和引入
        npm@6.9.0:

2.在尽可能少的模块应用loader
    1）找js，exclude/include用一个，不必要再去解析node_module里的js了

3.plugin精简合理使用，用官方推荐的性能好的，保证每个plugin的可靠性
    1）压缩js/css等插件只在prod环境下用，在dev环境下不用

4.dll_plugin

5.控制包文件的大小
    1）代码用不到的文件用tree-shaking去除
    2）配splitChunks拆分代码

6.thread-loader,parallel-webpack（多页面）,happypack多进程打包

7.合理使用sourceMap: sourceMap越详细打包速度越慢

8.结合stats分析打包结果

9.开发环境
    1）内存编译，webpack-dev-server会把编译的内容放在内存
    2）dev环境js、css的插件就不要去用了

*/