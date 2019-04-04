const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.conf');


module.exports = merge(baseConfig, {
  mode: 'development',
  devtool:'#cheap-module-eval-source-map',
  devServer: {
        contentBase: './dist',
        host: 'test.h5.iqiyi.com',
        port: '3333',
        compress:true,
    },
  plugins:[
  ],


});
