const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  /*
  1.先找到每个入口，然后从各个入口分别出发，找到依赖的模块，然后生成一个Chunk，把Chunk写到文件系统中(Asset资源)
  2.一个入口对应一个Chunk，但不一定对应一个asset，因为可能有代码分割、公共模块抽离等
  */
  entry: {
    index: './src/index.js',
    base: './src/base.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
    filename: '[name].[hash:8].js', //打包后的文件名
  },
  module: {
    // noParse: function(content) { //不解析这些库的依赖 --- 不要用这个会导致jq没办法应用全局
    //     return /jquery|lodash/.test(content);
    // },
    rules: [
      {
        test: /\.css$/,
        // css-loader解析处理css文件中的url路径
        // style-loader 可以把css文件变成style变迁插入head中
        //多个loader从右往左写，转换的时候从右往左转换
        loader: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [ // 插件放的位置不分顺序
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new webpack.ProvidePlugin({ // 把$变成全局的
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['vendor', 'index'],//在产出的html中引入哪些代码块
      title: 'index标题',
      hash: true,
      minify: {
        removeAttributeQuotes: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',//模板一样
      filename: 'base.html',
      chunks: ['base'],
      title: 'base标题',
      hash: true,
      minify: {
        removeAttributeQuotes: true
      }
    }),
  ],
  optimization: {
    splitChunks: { //多页面应用代码分割
      cacheGroups: {
        // 其次: 打包业务中公共代码
        common: {
          name: "common",
          chunks: "all",
          minSize: 1,
          priority: 0 //低优先级
        },
        // 首先: 打包node_modules中被重复import的
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10
        }
      }
    }
  },
  // 配置此静态文件服务器，可以用来预览打包后的项目
  devServer: {
    contentBase: './dist',//静态资源根目录
    host: 'localhost',
    port: 8080,
    compress: true,//服务器返回给浏览器的时候是否启用gzip压缩
  }
}