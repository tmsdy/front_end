/*

webpack是有默认配置的的splitChunks的，但一般都需要自己配
optimization: {
  splitChunks: { //对同步异步加载的文件都起作用
    chunks: 'async', //代码分割，async(默认)只对异步代码进行分割，initial同步，all是都分割
    minSize: 30000, //只要大于30kb的模块才做代码分割，一般只会匹配到比较大的库
    maxSize: 0, //可配可不配，超过这个大小的会二次分割，一般不用配
    minChunks: 1, //引了多少次后才会走分割
    maxAsyncRequests: 5, //一个页面一个库分割数量限制，一般不用动
    maxInitialRequests: 3, //首页中库分割数量限制，一般不用动
    automaticNameDelimiter: '~', //文件生成中间的链接符，一般不用动
    automaticNameMaxLength: 30, //文件生成名最长的长度，一般不用动
    name: true, //起不起名字，一般不用动
    cacheGroups: { //缓存组，能把符合规则的打包放在一起
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10, //如果cacheGroups配的几个都匹配，看这个优先级来决定
        filename: 'vender.js', //都打包到vender.js里面
      },
      default: { //上面匹配不到然后默认走这儿
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true, //如果有库之前用到该模块就会复用了
      }
    }
  }
}
1.
import _ from 'lodash' // 同步引入lodash
function getComponent(){ // 异步引入lodash
  import('lodash').then((res)=>{})
}

2.async会自动分割打包异步代码，如果是all，initial中对同步代码分割打包的话是会去走cacheGroups的。
得去配cacheGroups

*/