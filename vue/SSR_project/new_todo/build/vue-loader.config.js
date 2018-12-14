// const docsLoader = require.resolve('./doc-loader') ;//webpack加载loader以字符串形式，自己写的loader要加.resolve

module.exports = (isDev)=>{
  return {
    preserveWhitespace: true , //去除不小心打出的空格
    extractCSS: !isDev , //抽离css，优化首屏，只在加载组件时候再加载相应的css
    cssMudules:{
      // localIdentName:'[path]-[name]-[hash:base64:5]',//定义class名称，感觉没啥用
      // camelCase: true ,//-连接的class转为驼峰
    } ,
    loaders: { // 自定义的loader，高级用法了，做组件库啥的可以用
      // 'docs': docsLoader,
      // js: 'coffe-loader',
      // html,style
    },
    // preLoader:{}
  }
}