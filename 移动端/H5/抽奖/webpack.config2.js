var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin') ;
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') ;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const resolve = require('./build/resolve');

module.exports = {
    // watch:true,
    entry: './src/js/index.js',
    output: {
        filename:'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool:'#cheap-module-eval-source-map',
    resolve,
    plugins:[
        new CleanWebpackPlugin({}),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "index.css"
        })
    ],
    devServer: {
        contentBase: './dist',
        host: 'test.h5.iqiyi.com',
        port: '3333',
        compress:true,
    },
    module: {
        noParse: function(content) { //不解析这些库的依赖
            return /jquery|lodash/.test(content);
        },
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
            {
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { legacy: true }], //处理装饰器等
                        ["@babel/plugin-proposal-class-properties", { loose: true }],
                        "@babel/plugin-transform-runtime", //处理async等
                        "@babel/plugin-syntax-dynamic-import"
                    ]
                },
            },
            { 
                test:/\.(png|jpg|gif|svg|bmp)/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit: 5*1024 , //小于5k的用url-loader生成base64直接嵌入html
                        outputPath: 'img/',
                    }
                }
            },
        ]
    },
    optimization:{
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,     // 生产环境devtools如果开启sourceMap，则UglifyJsPlugin的此项必须为true
                uglifyOptions: {
                  compress: {
                    unused: true,
                    drop_console: true,
                    drop_debugger: true,
                    dead_code: true,
                    collapse_vars: true,
                    reduce_vars: true,
                  },
                  output: {
                    comments: false,
                  },
                  mangle: false,
                  warnings: false,
                },
              }),
            new OptimizeCSSAssetsPlugin({ //8.78 -> 7.35
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                  discardComments: {
                    removeAll: true
                  }
                },
                canPrint: true,
            }),
        ]
    },
};
