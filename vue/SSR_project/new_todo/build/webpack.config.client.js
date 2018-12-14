const path = require('path')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

let config
const defaultPlugins = [
  new webpack.DefinePlugin({ //这样在编译或者页面中都能拿到process.env.NODE_ENV值
    'process.env':{
        NODE_ENV:isDev?'"development"':'"production"'
    }
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname,'../index.html')
  }) ,
]

if(isDev){
    config = merge(baseConfig,{
      // devtool:'#cheap-module-eval-source-map',//打包的代码映射成正常的方便调试
      module:{
        rules:[
          {
            test: /\.less/,
            use: [
              'vue-style-loader','css-loader','postcss-loader','less-loader'
            ]
          }
        ]
      },
      plugins:defaultPlugins.concat([
        new webpack.HotModuleReplacementPlugin()
      ]),
      devServer: {
        port: 8000 ,
        host: '0.0.0.0',//这样localhost和内网ip都能访问,方便手机访问内网ip来调试
        overlay:{
          errors:true ,//编译出错显示到网页
        },
        // historyApiFallback:{
        //   index: '/index.html' ,//根目录下的
        // },
        historyApiFallback: {
          rewrites: [
            { from: /.*/, to: path.posix.join('/', 'index.html') },
          ],
        },

        hot:true,//无刷新热重载
      }
    }) ;
}else{ //生产环境
  let extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {}
  }
  config = merge(baseConfig,{
    entry: path.join(__dirname,'../client/index.js') ,
    output:{
      filename : '[name].[chunkhash:8].js'
    },
    module:{
      rules:[
        {
          test: /\.less/,
          use: [ extractLoader,'css-loader','postcss-loader','less-loader']
        }
      ],
    },
    plugins:defaultPlugins.concat([
        new MiniCssExtractPlugin({
          filename: "css/[name].[chunkhash:8].css"
        })
    ]),
    optimization:{
      splitChunks: {
        chunks: 'async',// 必须三选一： "initial" | "all" | "async"(默认就是异步)
        // 大于30KB才单独分离成chunk
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,// 最大初始化请求数，默认1
        name: true,
        cacheGroups: {//设置缓存的 chunks
            default: {
                priority: -20,
                reuseExistingChunk: true,
            },
            vendors: {
                name: 'vendors',    // 要缓存的 分隔出来的 chunk 名称
                test: /[\\/]node_modules[\\/]/, //正则规则验证 符合就提取 chunk
                priority: -10,      // 缓存组优先级
                chunks: "all"       // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            },
            echarts: {
                name: 'echarts',
                chunks: 'all',
                // 对echarts进行单独优化，优先级较高
                priority: 20,
                test: function(module){
                    var context = module.context;
                    return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
                }
            }
          }
        },
      //单独打包webpack的runtimeChunk，不然加个插件loader的话对公共框架类库的长缓存就失效了
      runtimeChunk:{name: "manifest"},
      minimizer: [// 压缩代码
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false
          }),
          new OptimizeCSSPlugin({})
      ]
    }

  })

}




module.exports = config
