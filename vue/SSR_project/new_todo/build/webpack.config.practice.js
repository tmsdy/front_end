const path = require('path')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

let config
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env':{
        NODE_ENV:'"development"'
    }
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname,'../index.html')
  }) ,
]

config = merge(baseConfig,{
  entry: path.join(__dirname,'../practice/index.js') ,
  devtool:'#cheap-module-eval-source-map',//打包的代码映射成正常的方便调试
  module:{
    rules:[
      {
        test: /\.less/,
        use: [
          'vue-style-loader','css-loader','postcss-loader','less-loader'
        ]
      }
    ]
  },
  plugins:defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]),
  devServer: {
    port: 8888 ,
    host: '0.0.0.0',//这样localhost和内网ip都能访问,方便手机访问内网ip来调试
    overlay:{
      errors:true ,
    },
    hot:true,
  },
  // import Vue from 'vue'
  resolve: {
    alias: { //默认是runtime版本的vue不支持vue对象中写template的,因为它是打包后的不能再编译了
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
}) ;




module.exports = config
