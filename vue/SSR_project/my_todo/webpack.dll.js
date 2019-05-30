let path =require('path')
let webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry:{
    vue: ['vue'],
  },
  output:{
    filename:'[name].dll.js', //产生的文件名
    path:path.resolve(__dirname,'dll'),
    library: '[name]', //_dll_vue
    libraryTarget:'var'
  },
  plugins:[
    new webpack.DllPlugin({ //name要等于library
      name: '[name]',
      path:path.resolve(__dirname,'dll','[name].manifest.json')
    })
  ]
}