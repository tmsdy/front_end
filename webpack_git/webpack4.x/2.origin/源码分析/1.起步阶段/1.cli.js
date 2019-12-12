

(function () {


    const importLocal = require("import-local");
    // Prefer the local installation of webpack-cli
    if (importLocal(__filename)) {
        return;
    }

    require("v8-compile-cache");
    // ...

    const yargs = require("yargs").usage(`webpack-cli ${
        require("../package.json.js").version
        }

	Usage: webpack-cli [options]
				webpack-cli [options] --entry <entry> --output <output>
				webpack-cli [options] <entries...> --output <output>
				webpack-cli <command> [options]

	For more information, see https://webpack.js.org/api/cli/.`);

    require("./config-yargs")(yargs);

    const DISPLAY_GROUP = "Stats options:";
    const BASIC_GROUP = "Basic options:";

    // yargs.options({...});
    // process.argv.slice(2) 是node的全局路径和当前webpack的路径
    yargs.parse(process.argv.slice(2), (err, argv, output) => {
        //...
        let options;
        try {
            options = require("./convert-argv")(argv); //读取命令行参数 webpack --config这些shell参数
        } catch (err) {
            // ...
        }
        // ...
        function processOptions(options) {
            // process Promise
            if (typeof options.then === "function") {
                options.then(processOptions).catch(function (err) {
                    console.error(err.stack || err);
                    process.exit(1); // eslint-disable-line
                });
                return;
            }
            // ...
            const webpack = require("webpack");

            let lastHash = null;
            let compiler;
            try {
                // 对shell里面参数和我们自己写的配置都处理成我们最后的options传入webpack初始化生成Compiler
                compiler = webpack(options);
            } catch (err) {
                // ...
            }

            // ... 
            // 开始跑编译
            compiler.run(compilerCallback);
        }

        processOptions(options);
    });
})();
