const path = require('path')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config
config = merge(baseConfig,{
  target: 'node' ,//打包出来的js是在node端运行的
  entry: path.join(__dirname,'../client/server-entry.js') ,
  devtool:'source-map',
  output: {
    libraryTarget: 'commonjs2', // module.export那种
    filename: 'server-entry.js',
    path: path.join(__dirname,'../server-build')
  },
  //在导出的文件直接require这些就行(在node_modules有)不要去打包vue这些，没必要打包输出到单独的js中
  externals: Object.keys(require('../package.json').dependencies) ,
  module:{
    rules:[
        {
          test: /\.less/,
          use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
        }
      ],
  },
  plugins:[
    new MiniCssExtractPlugin({
        filename: "css/[name].[chunkhash:8].css"
      }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.emv.VUE_ENV': 'server'
    }),
    new VueServerPlugin()
  ]
}) ;




module.exports = config
