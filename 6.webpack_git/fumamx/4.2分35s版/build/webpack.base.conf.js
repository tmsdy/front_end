const path = require('path')
const {
  resolve,
  assetsPath,
  genHappyPacks,
  createLintingRule
} = require('./utils')
const { VueLoaderPlugin } = require('vue-loader');
const config = require('../config')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    noParse: function (content) {
      return /jquery|lodash|underscore|echarts/.test(content);
    },
    rules: [
      ...(isProd ? [] : [createLintingRule()]),
      {
        test: /\.vue$/,
        // loader: 'vue-loader'
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: 'happypack/loader?id=css',
                less: 'happypack/loader?id=less',
                js: 'happypack/loader?id=babel'
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=babel',
        // include: [resolve('src'),resolve('node_modules/webpack-dev-server/client')],
        include: resolve('src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    ...genHappyPacks(),
    new VueLoaderPlugin()
  ],
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
