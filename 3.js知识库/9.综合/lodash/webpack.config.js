const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') 
const webpack = require('webpack')

let config = {
  entry: path.join(__dirname,'./main.js') ,
  devtool:'#cheap-module-eval-source-map',//打包的代码映射成正常的方便调试
  module:{
    rules:[
      {
        test: /\.less/,
        use: [
          'css-loader','less-loader'
        ]
      },
      { 
        test:/\.vue$/,
        loader:'vue-loader'
      },
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude: /node_modules/, //忽略这里面的js
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'./index.html')
    }) ,
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 7777 ,
    host: '0.0.0.0',//这样localhost和内网ip都能访问,方便手机访问内网ip来调试
    hot:true,
  },
  resolve: {
    alias: { //默认是runtime版本的vue不支持vue对象中写template的,因为它是打包后的不能再编译了
      'vue': path.join(__dirname, 'node_modules/vue/dist/vue.esm.js')
    }
  },
}
 



module.exports = config
