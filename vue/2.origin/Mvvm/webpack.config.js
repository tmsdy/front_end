const path = require('path');
let htmlWebpackWlugin = require('html-webpack-plugin')

module.exports = {
    entry: './index.js',//从入口开始
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
        filename: 'bundle.js', //打包后的文件名
    },
    module: {
        rules: [
        ]
    },
    plugins: [
        new htmlWebpackWlugin({
            template: './mvvm/index.html',//模板
            filename: 'index.html',//产出的HTML文件名
            title: '自定义标题', //可以向模板传入一些变量避免缓存
            hash: true, //js加hash戳
            minify: { //压缩静态文件 删除属性的双引号
                removeAttributeQuotes: true,
                collapseWhitespace: true,//折叠空行
            }
        }),
    ],
    devServer: {
        host: 'localhost',
        port: 3333,
        compress: true,//服务器返回给浏览器的时候是否启用gzip压缩
        hot: true,
    }
}