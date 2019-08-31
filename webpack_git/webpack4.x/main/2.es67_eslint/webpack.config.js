let path = require("path");
let CleanWebpackPlugin = require("clean-webpack-plugin");
let htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development", //默认是production自动压缩js。development
    entry: "./src/index.js",
    // devtool:'source-map', //源码映射，会单独生成一个soursemap文件
    // devtool:'eval-source-map',//不产生单独文件，可以显示行和列
    devtool: '#cheap-module-eval-source-map',
    output: {
        filename: "bundle.[hash:8].js", //每次打包生成不同文件防止出现缓存
        path: path.resolve(__dirname, "dist") //必须绝对路径
    },
    module: {
        rules: [
            //loader默认从右向左执行，从下到上执行
            // {
            //   test: /\.js$/,
            //   use: {
            //     loader: "eslint-loader",
            //     options: {
            //       enforce: "pre" //强制从上到下
            //     }
            //   }
            // },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader", //es6 -> es5
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }], //处理装饰器等
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                            "@babel/plugin-transform-runtime", //处理async等
                            "@babel/plugin-proposal-optional-chaining"
                        ]
                    }
                },
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, "dist")]),
        new htmlWebpackPlugin({
            template: "./src/index.html", //模板
            filename: "index.html", //产出的HTML文件名
            title: "index标题", //可以向模板传入一些变量避免缓存
            hash: true, //js加hash戳
            minify: {
                //压缩静态文件 删除属性的双引号
                removeAttributeQuotes: true,
                collapseWhitespace: true //折叠空行
            }
        })
    ],

    devServer: {
        port: 4000,
        contentBase: "./dist",
        compress: true //启用Gzip压缩
    }
};
