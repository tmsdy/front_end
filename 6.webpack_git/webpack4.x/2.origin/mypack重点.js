/*

* 1.打包成的bundle统一引入路径变成'./src/xxx'，像require('./a/a1.js')都要把它的ast改成require('./src/xxx/a/a1.js')
node.callee.name = '__webpack_require__' // 替换require
node.arguments = [{ type: 'Literal', value: moduleId }] // 替换引入的路径

*/



