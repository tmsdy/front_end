const path = require('path');
let htmlWebpackWlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
        filename: 'bundle.js', //打包后的文件名
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "env", "stage-0", "react"
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new htmlWebpackWlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true
        }),
    ],
    devServer: {
        host: 'localhost',
        port: 3333,
        compress: true,//服务器返回给浏览器的时候是否启用gzip压缩
        hot: true,
    }
}