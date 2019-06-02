let path =require('path')
let webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry:{
    vender: ['vue','vue-router','vuex','vue-codemirror','vue-moment','element-ui'],
  },
  output:{
    filename:'[name].dll.js', //产生的文件名
    path:path.resolve(__dirname,'../dll'),
    library: '[name]', //_dll_vender
    libraryTarget:'var'
  },
  plugins:[
    new webpack.DllPlugin({ //name要等于library
      name: '[name]',
      path:path.resolve(__dirname,'../dll','[name].manifest.json')
    })
  ]
}