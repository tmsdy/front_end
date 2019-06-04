
/*

1.babel/polyfill会补充浏览器缺少的ES6的变量和函数，因为做了很多的补充打包大小也会变大
如果是最上层import 'babel/polyfill'会变大
实现业务代码的使用多少就补充多少：
  给@babel/preset-env配置"useBuiltIns": "usage"参数

延伸：打包UI组件、库之类的不能用babel/polyfill会污染全局

2.@babel/preset-env可配置target目标浏览器，这样高版本浏览器支持Promise等就不需要补充
  适用于业务代码

3.@babel/plugin-transform-runtime
适用于UI组件、库之类的，可以避免babel/polyfill的一些问题，不会污染全局
记得配置"corejs": 2并安装，corejs 是一个给低版本的浏览器提供API的库，如 Promise, map, set 等

*/