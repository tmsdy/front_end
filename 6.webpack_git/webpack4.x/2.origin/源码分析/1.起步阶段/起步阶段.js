/*

* 1.入口：webpack-cli/bin/cli.js
const webpack = require("webpack");
* options：是拿到的shell脚本里的参数(--config --open --mode这些)和我们写的webpack.config.js的合并
compiler = webpack(options); // 根据参数实例化compiler
compiler.run(compilerCallback); // 开始跑编译



*/