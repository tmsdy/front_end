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
          test:/\.jsx$/,
          loader:'babel-loader'
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
    // 压缩代码
    minimizer: [
        // js mini
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false // set to true if you want JS source maps
        }),
        // css mini
        new OptimizeCSSPlugin({})
    ]
}

}


module.exports = config