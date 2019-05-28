
/*

1.将webpack降级到4.28.4

2.添加dynamic-import-node-babel-7插件适用于最新版本的wedkpack。对于反应，您还可以添加反应负载babel。
在webpack.config.js中添加
plugins: [ 
"@babel/plugin-proposal-class-properties", 
"@babel/syntax-dynamic-import",
 "react-loadable/babel", 
 "dynamic-import-node-babel-7",
],

3.

*/