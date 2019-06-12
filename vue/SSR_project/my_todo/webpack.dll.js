let path =require('path')
let webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry:{
    venders: ['vue'],
  },
  output:{
    filename:'[name].dll.js', //产生的文件名
    path:path.resolve(__dirname,'dll'),
    library: '[name]', //通过变量形式暴露打包生成的文件(venders)到全局
    libraryTarget:'var'
  },
  plugins:[
    new webpack.DllPlugin({ //name要等于library。这个插件去分析库，把库的映射关系放在manifest.json里
      name: '[name]',
      path:path.resolve(__dirname,'dll','[name].manifest.json')
    })
  ]
}