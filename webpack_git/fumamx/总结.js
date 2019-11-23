/*
* 1.优化打包速度
1）happyPack(开多线程打包)：包一下js、less、eslint(dev加、prod去掉),开启cpu最大支持的线程数
3）resolve指定在那儿找打包， external排除在哪打包
2）设置noParse: 像jquery、lodash独立的第三方库，不需要webpack再去分析它的依赖了


* 2.优化打包后大小
1）代码分割：抽离第三方库，把多次引用的分割打包出来。
2）dllplugin把vue、vue-router、element等基本不会变的统一抽出来打包。这样以后就不用再打包了
3）压缩js(多线程压缩)，压缩css
4）开启gzip

* 3.升babel7

* 4.

*/