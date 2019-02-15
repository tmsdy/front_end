let path = require('path')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let htmlWebpackWlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',//默认是production自动压缩js。development
  entry: './src/index.js',
  output:{
    filename: 'bundle.[hash:8].js',//每次打包生成不同文件防止出现缓存
    path: path.resolve(__dirname,'dist') //必须绝对路径
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        use:{
          loader: 'babel-loader',//es6 -> es5
          options:{
            presets:[
              '@babel/preset-env'
            ],
            plugins:[
              ["@babel/plugin-proposal-decorators", { "legacy": true }],//处理装饰器等
              ["@babel/plugin-proposal-class-properties", { "loose" : true }], 
              "@babel/plugin-transform-runtime",//处理async等
            ]
          }
        },
        include:path.resolve(__dirname,'src'),
        exclude: /node_modules/
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin([path.join(__dirname,'dist')]) ,
    new htmlWebpackWlugin({
      template:'./src/index.html',//模板
      filename:'index.html' ,//产出的HTML文件名
      title:'index标题', //可以向模板传入一些变量避免缓存
      hash:true, //js加hash戳
      minify:{ //压缩静态文件 删除属性的双引号
          removeAttributeQuotes:true,
          collapseWhitespace: true,//折叠空行
      }
    })
  ],

  devServer:{
    port:3000,
    contentBase: './dist',
    compress:true,//启用Gzip压缩
  }
}