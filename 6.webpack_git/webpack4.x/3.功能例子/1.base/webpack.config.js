let path = require('path')
let webpack = require('webpack')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let htmlWebpackWlugin = require('html-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    todo: './src/index.js'
  },
  devServer: {
    proxy: { //不知道为啥代理没生效(tx)
      '/api': {
        target: 'http://localhost:9999',
        pathRewrite: { '/api': '' }
      }
    }
  },
  output: {
    filename: '[name].bundle.[hash:8].js',//每次打包生成不同文件防止出现缓存
    path: path.resolve(__dirname, 'dist') //必须绝对路径
  },
  resolve: { // 解析 第三方包 commonjs规范从当前的node_modules开始一直向上找
    modules: [path.resolve('node_modules')], //只在当前的找
    extensions: ['.js', '.css', '.vue'],//省略后缀找文件的顺序
    mainFields: ['style', 'main'],//换下bs配置中顺序
    alias: { //别名
      // bootstrap: 'bootstrap/dist/css/bootstrap.css'
      '@': path.resolve(__dirname, 'src'),
      styles: path.resolve(__dirname, 'src/styles'),
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new CopyWebpackPlugin([
      { from: 'doc', to: './' }
    ]),
    new htmlWebpackWlugin({
      template: './src/index.html',//模板
      filename: 'index.html',//产出的HTML文件名
      title: '自定义标题', //可以向模板传入一些变量避免缓存
      hash: true, //js加hash戳
      minify: { //压缩静态文件 删除属性的双引号
        removeAttributeQuotes: true,
        collapseWhitespace: true,//折叠空行
      }
    }),
    new webpack.BannerPlugin('make 2019 by feifei'), //加版权声明到bundle.js中
    new webpack.DefinePlugin({ //定义全局变量的方法
      DEV: JSON.stringify('development'),
      FLAG: 'true'
    })
  ],


}