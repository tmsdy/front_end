/*

1.测试环境登录，要配相关host，下载测试的app，charles代理下证书

2.有些是需要产品配置的，例如抽奖的code,我的收获跳转的

4.webpack的主要改造
    1）配了less和postcss，引入了公共的less
        单独抽取css，压缩css,js,
    2）支持es6、7及其以上的语法，对象扩展运算符、解构、装饰器、动态import
        babelrc文件加了容易报错
    3）加了alias公共的别名
    4）在package.json里面加了这个就大部分的能加前缀了
    "browserslist": [
        "last 2 versions",
        "> 1% in CH",
        "not ie <= 8"
    ],

5.把积分h5的跳app、登录、一些工具、公共组件等功能搬过来了



*/