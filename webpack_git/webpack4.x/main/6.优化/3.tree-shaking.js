/*

1.设置：
optimization: {
    usedExports: true, //加了这个就可以根据使用过的导出来复用
  },

2.package.json里加："sideEffects": [''@babel/poly-fill''],
sideEffects: false - 这意思是给所有模块都加tree-shaking
因为像import '@babel/poly-fill'这种只是给window加Promise等没有导出，加了tree-shaking就会被忽略不缺打包导致报错。

3.mode: 'development',加了tree-shaking打包还是没直接去掉无用代码.防止sourcemap行数不对
mode: 'production'，默认加了tree-shaking

*/