var path = require('path');

require('child_process').exec("npm config get prefix", function(err, stdout, stderr) {
    var nixLib = (process.platform.indexOf("win") === 0) ? "" : "lib"; // win/*nix support

    // var webpackPath = path.resolve(path.join(stdout.replace("\n", ""), nixLib, 'node_modules', 'webpack-cli', 'bin', 'cli.js'));
    // path.join(__dirname,'src/index.js')
    var webpackPath = path.resolve(path.join(__dirname, 'node_modules', 'webpack-cli', 'bin', 'cli.js'));
    console.log(webpackPath);
    require(webpackPath);
});