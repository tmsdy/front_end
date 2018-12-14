const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin') ;
const createVueLoaderOptions = require('./vue-loader.config') ;

const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV || 'production' ,
  target:'web',
  entry: path.join(__dirname,'../client/index.js') ,
  output:{
    path: path.join(__dirname,'../dist')
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  module:{ // 配置加载资源
    rules:[
        { //解析template到render函数是比较费时的，vue-loader可以帮忙处理使效率变高
            test:/\.vue$/,
            loader:'vue-loader',
            options: createVueLoaderOptions(isDev)
        },
        {
          test:/\.jsx$/,
          loader:'babel-loader'
        },
        {
          test:/\.js$/,
          loader:'babel-loader',
          exclude: /node_modules/, //忽略这里面的js
        },
        {
          test:/\.(png|jpg|gif|svg|bmp)/,
          use:{
              loader:'url-loader',//依赖file-loader
              options:{
                  limit: 9*1024 , //小于9k的用url-loader生成base64直接嵌入html中减少http请求
                  outputPath: 'images/',
                  name:'[path][name].[hash:8].[ext]'
              }
          }
      },
      ]
    }
}


module.exports = config
