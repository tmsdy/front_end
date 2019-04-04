const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.conf');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin') ;
var HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins:[
    new CleanWebpackPlugin({}),
    new HtmlWebpackPlugin({
        template: 'index.html'
    }),
  ],
  module:{
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

});
