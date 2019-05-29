const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin') ;
const CleanWebpackPlugin = require('clean-webpack-plugin') ;
const HtmlWebpackPlugin = require('html-webpack-plugin') ;
const webpack = require('webpack') ;
const MiniCssExtractPlugin = require('mini-css-extract-plugin') ;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin") ;
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') ;

const isDev = process.env.NODE_ENV=='development'

const config = {
  target:'web',
  entry: path.join(__dirname,'src/index.js') ,
  output:{
    filename:'bundle.[hash:8].js',
    path: path.join(__dirname,'dist')
  },
  stats: {
    warnings: false
  },
  plugins: [
    new CleanWebpackPlugin([path.join(__dirname,'dist')]) ,
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({ //这样在编译或者页面中都能拿到process.env.NODE_ENV值
      'process.env':{
          NODE_ENV:isDev?'"development"':'"production"'
      }
    }),
    new HtmlWebpackPlugin() ,
  ],
  module:{ // 配置加载资源
    rules:[ 
        {
            test:/\.vue$/,
            loader:'vue-loader'
        },
        {
          test:/\.(js|jsx)$/,
          loader:'babel-loader',
          include:path.resolve('src'),
        },
        {
          test: /\.css$/,
          use: ['style-loader','css-loader','postcss-loader']
        },
        { 
          test:/\.(png|jpg|gif|svg|bmp)/,
          use:{
              loader:'url-loader',//依赖file-loader
              options:{
                  limit: 9*1024 , //小于9k的用url-loader生成base64直接嵌入html中减少http请求
                  outputPath: 'images/',
                  name:'[name]-bws.[ext]'
              }
          }
      },
      ]
    }
}

if(isDev){ //开发环境
    config.module.rules.push({
        test: /\.less/,
        use: [
            'style-loader',
            'css-loader',
            {loader: 'postcss-loader',options: {}},'less-loader'
        ]
    });
  config.devtool = '#cheap-module-eval-source-map',//打包的代码映射成正常的方便调试
  config.devServer = {
    port: 3000 ,
    host: '0.0.0.0',//这样localhost和内网ip都能访问,方便手机访问内网ip来调试
    overlay:{
      errors:true ,//编译出错显示到网页
    },
    // open:true ,
    hot:true,//无刷新热重载
  }
  config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
  )
}else{ //生产环境
  config.output.filename = '[name].[chunkhash:8].js';//生成的hash是不一样的，hash是一样的
  let extractLoader = {
      loader: MiniCssExtractPlugin.loader,
      options: {}
  }

  config.module.rules.push({
    test: /\.less/,
    use: [
        extractLoader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true
            }
        },
        'less-loader'
    ]
  });
  config.plugins.push(
      new MiniCssExtractPlugin({
          filename: "css/[name].[chunkhash:8].css"
      })
  );
  config.optimization = {
    splitChunks: {
        chunks: 'all',// 必须三选一： "initial" | "all" | "async"(默认就是异步)
        // 大于30KB才单独分离成chunk
        minSize: 30000,
        minChunks: 1,
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
    // 压缩代码
    minimizer: [
        // js mini
        // new UglifyJsPlugin({
        //   cache: true,
        //   parallel: true,
        //   sourceMap: false // set to true if you want JS source maps
        // }),
        // // // css mini
        // new OptimizeCSSPlugin({})
        new UglifyJsPlugin({
        parallel: true,
        cache: true,
        // 生产环境devtools如果开启sourceMap，则sourceMap必须为true
        sourceMap: true,
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
      new OptimizeCSSPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
           safe: true,
           discardComments: {
             removeAll: true
          }
        }
      })
    ]
}

}


module.exports = config