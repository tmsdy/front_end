const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const clientConfig = require('./webpack/dev.conf')

exports.setupClient = function (publicPath) {
  return webpackDevMiddleware(webpack(clientConfig), {
    publicPath: publicPath,
    stats: {
      colors: true,
      chunks: false
    },
    serverSideRender: true
  })
}
