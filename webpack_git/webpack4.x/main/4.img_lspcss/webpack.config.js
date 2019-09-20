const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash:8].js',
        // publicPath: 'http://rookiefeifei.top/'//这样在引用所有资源的时候默认加上这个
    },
    watch: true,//代码一变化就实时编译
    watchOptions: {
        poll: 2000, //2s看一次
        aggregateTimeout: 1000, //防抖
        ignored: /node_modules/,//不需要监控的
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',//把写的css当做style标签插到head里面
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            { //file-loader解析图片地址，把图片从源位置拷贝到目标位置并且修改原引用地址
                test: /\.(png|jpg|gif|svg|bmp)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 9 * 1024, //小于9k的用url-loader生成base64直接嵌入html中减少http请求
                        outputPath: 'images/',
                        name: '[name][hash:8].[ext]'
                        // publicPath: 'http://rookiefeifei.top/' 只是引用图片加这个
                    }
                }
            },
            {
                test: /\.(html|htm)/,//保证html里面src引用的图片地址正确
                loader: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true, //会在引入的js里加入查询字符串避免缓存
            minify: { //压缩静态文件 删除属性的双引号
                removeAttributeQuotes: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash:8].css"
        })
    ],
    /*
    都没写默认js压缩：219 7
    写了配css、js压缩：158 7
    */
    // css:219 jpg:51 html:6.68 js:25
    optimization: {
        minimizer: [
            // new UglifyJsPlugin({ //webpack默认用这个，自己配了就要写
            //     cache: true,
            //     parallel: true,//并发打包，一起压缩多个
            //     sourceMap: true 
            // }),
            new OptimizeCSSAssetsPlugin({})//css压缩
        ]
    },
    // 配置此静态文件服务器，可以用来预览打包后的项目
    devServer: {
        contentBase: './dist',//静态资源根目录
        host: 'localhost',
        port: 8080,
        compress: true,//服务器返回给浏览器的时候是否启用gzip压缩
    }
}