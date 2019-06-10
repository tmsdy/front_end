const path = require('path')
const {assetsPath, dateFtt} = require('./utils')
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
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const env = require('../config/prod.env')
const smp = new SpeedMeasurePlugin() // 测打包速度

const buildDate = dateFtt('yyyyMMddhhmm', new Date())

const webpackConfig = merge(baseWebpackConfig, {
  target:'web',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'Happypack/loader?id=less'
        ]
      }
    ]
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: assetsPath(`js/${buildDate}/[name].[chunkhash:8].js`),
    chunkFilename: assetsPath(`js/${buildDate}/[id].[chunkhash:8].js`)
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 把异步同步加载的第三方库都抽离，默认只抽离异步(async)
      minSize: 30000, // 大于30kb才会对代码分割
      minChunks: 1, //打包生成的文件，当一个模块至少用多少次时才会进行代码分割
      maxAsyncRequests: 5, // 同时加载的模块数最多是5个
      maxInitialRequests: 3, // 入口文件最多3个模块会做代码分割，否则不会
      automaticNameDelimiter: '~', // 打包分割符
      name: true,
      cacheGroups: { //设置缓存的 chunks
        vendors: {
            name: 'vendors', // 要缓存的 分隔出来的 chunk 名称
            test: /[\\/]node_modules[\\/]/, //正则规则验证 符合就提取 chunk
            priority: -10, // 缓存组优先级
            chunks: "all" // 必须三选一： "initial" | "all" | "async"(默认就是异步)
        },
        common: {
          minChunks: 2,
          name:'commons',
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        },
        echarts: {
            name: 'echarts',
            chunks: 'all',
            priority: 20, // 对echarts进行单独优化，优先级较高
            test: function(module){
                var context = module.context;
                return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
            }
        }
    }
    },
    //单独打包webpack的runtimeChunk，不然加个插件loader的话对公共框架类库的长缓存就失效了
    runtimeChunk:{name: "manifest"},
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

    new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
  
    new MiniCssExtractPlugin({
      filename: assetsPath(`css/${buildDate}/[name].[contenthash:8].css`),//直接引用的css文件
			chunkFilename: assetsPath(`css/${buildDate}/[name].chunk.[contenthash:8].css`)//间接引用的css文件
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
    new webpack.DllReferencePlugin({
      //先去找manifest.json清单，找不到再去打包
      manifest: path.resolve(__dirname,'../dll','vender.manifest.json') 
    }),

    new webpack.HashedModuleIdsPlugin(),
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
