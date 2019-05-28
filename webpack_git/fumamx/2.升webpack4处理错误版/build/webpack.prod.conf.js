'use strict'
const path = require('path')
const {styleLoaders, assetsPath} = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptmizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const env = require('../config/prod.env')
const smp = new SpeedMeasurePlugin() // 监控构建流程

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',   // initial、async和all
      minSize: 30000,   // 形成一个新代码块最小的体积
      maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
      maxInitialRequests: 3,   // 最大初始化请求数
      automaticNameDelimiter: '~',   // 打包分割符
      name: true,
      cacheGroups: {
        vendors: { // 项目基本框架等
          chunks: 'all',
          test: /element-ui/,
          priority: 100,
          name: 'vendors',
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        cache: true,
        // 生产环境devtools如果开启sourceMap，则sourceMap必须为true
        sourceMap: config.build.productionSourceMap,
        uglifyOptions: {
          compress: {
              drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
              collapse_vars: true, // 内嵌定义了但是只用到一次的变量
              reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          },
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          output: {
              beautify: false, // 最紧凑的输出
              comments: false,// 删除所有的注释
          }
        }
      }),
      new OptmizeCssAssetsWebpackPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
           safe: true,
           discardComments: {
             removeAll: true
          }
        }
      })
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash].css'),
      // allChunks: true,
    }),

    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = smp.wrap(webpackConfig)
