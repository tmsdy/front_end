var path = require('path');
const webpack = require("webpack");

// require('child_process').exec("npm config get prefix", function (err, stdout, stderr) {
//     var nixLib = (process.platform.indexOf("win") === 0) ? "" : "lib"; // win/*nix support

//     // var webpackPath = path.resolve(path.join(stdout.replace("\n", ""), nixLib, 'node_modules', 'webpack-cli', 'bin', 'cli.js'));
//     // path.join(__dirname,'src/index.js')
//     var webpackPath = path.resolve(path.join(__dirname, 'node_modules', 'webpack-cli', 'bin', 'cli.js'));

//     require(webpackPath);
// });
let config = require("./webpack.config.js");
compiler = webpack(config); // 根据参数实例化compiler
compiler.run(); // 开始跑编译