let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
let Happypack = require('happypack')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 3000,
    open: true,
    contentBase: './dist'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    noParse: function (content) {//不去解析jquery有没有依赖提高构建性能 9s->7.5s
      return /jquery|lodash/.test(content);
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,// 排除node_modules
        include: path.resolve('src'),//只找src下的，7.5s->3s
        use: 'Happypack/loader?id=js',//实现多线程打包,大项目需要
      }
    ]
  },
  plugins: [
    new Happypack({ //css需要再new一个
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      ]
    }),
    new webpack.DllReferencePlugin({
      //再打包时候先去找manifest.json清单，找不到再去打包，光react就1.32mb->465kb了
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),//把语言包忽略，需要用的时候自己引1.2mb->800+kb
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
  ]
}