const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StatsPlugin = require('./src/stats.plugin');
const resolve = require('./src/resolve');
const utils = require('./src/utils');
const config = require('../../config');

const prodMode = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
const pureProdMode = process.env.NODE_ENV === 'production'

module.exports = {
  entry: config.default.entry,
  output: {
    path: config.default.path,
    filename: prodMode ? '[name]-[hash:6].js' : '[name].js',
    chunkFilename: prodMode ? '[name]-[chunkhash:6].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !prodMode,
              ident: 'postcss',
              // plugins: prodMode ? [autoprefixer()] : []
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024, // Images larger than 10 KB won’t be inlined
          emitFile: !pureProdMode, // 是否输出本地图片（目前所有静态资源均采用base64或cdn引用 2018.08.22）
          name(file) {
            return utils.getUrlLoaderName(file, pureProdMode)
          },
        },
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          emitFile: !pureProdMode,
          name(file) {
            return utils.getFontUrlLoaderName(file, pureProdMode)
          },
        },
      },
    ]
  },
  plugins: [
    new StatsPlugin('stats.json'),

    new MiniCssExtractPlugin({
      filename: prodMode ? '[name]-[hash:6].css' : '[name].css',
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          minChunks: 1,
        },
        styles: {
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      }
    },
  },
  resolve,
  performance: {
    hints: false
  },
};
