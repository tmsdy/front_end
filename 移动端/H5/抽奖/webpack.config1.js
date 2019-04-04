var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const optimizeCss = require('optimize-css-assets-webpack-plugin'); // 压缩css

console.log(process.env)

module.exports = {
    // watch:true,
    entry: './src/js/index.js',
    output: {
        filename:'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
   // devtool: 'source-map',
    plugins:[
        // new UglifyJsPlugin({
        //     sourceMap: true
        // }),
        new optimizeCss({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
              discardComments: {
                removeAll: true
              }
            },
            canPrint: true,
          }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: "bundle.css",
            disable: false,
            allChunks: true
         })
    ],
    devServer: {
        contentBase: './dist',
        host: 'test.h5.iqiyi.com',
        port: '3333'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader",
                publicPath: "/dist"
             })
            },
            {
                test: /\.js?$/i,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|jpg)$/,
                options:{
                    publicPath:'src/img'
                },
                loader: 'url-loader?limit=2048&name=images/[hash:8].[name].[ext]'
            　}
           
        ]
    }
};
