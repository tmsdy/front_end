const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    target: 'web',
    entry: './main.js',//从入口开始
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
        filename: 'bundle.js', //打包后的文件名
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.less$/,
                loader: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    devServer: {
        host: 'localhost',
        port: 3333,
        compress: true,//服务器返回给浏览器的时候是否启用gzip压缩
        hot: true,
    }
}