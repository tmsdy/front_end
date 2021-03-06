
/*
webpack版本 >= 4.29会出现
原因：
npm选择将acorn-dynamic-import依赖项提升到根node_modules目录。
acorn-dynamic-import使用的acorn和webpack使用的acorn不是一个

1.将webpack降级到4.28.4,有时候直接npm i的4.28.4还不行还得卸载重装才行。因为npm i安装的
包的依赖问题（具体可以以后深入研究）

2.用yarn安装

2.添加dynamic-import-node-babel-7插件适用于最新版本的wedkpack。对于反应，您还可以添加反应负载babel。
在webpack.config.js中添加
plugins: [ 
"@babel/plugin-proposal-class-properties", 
"@babel/syntax-dynamic-import"
]

3.@babel/syntax-dynamic-import会出现那个问题,用这个babel-plugin-dynamic-import-webpack插件就好了

*/