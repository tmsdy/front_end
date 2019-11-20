/*

怎么用的
  math.js
  module.exports = { //重要的是 module 这里，module 是 Node 独有的一个变量
    add: function (a,b) {
      return a+b ;
    }
  }
  用的时候
  var math = require('./math') ;
    math.add(2,3) // ->  5

* 1.模块加载以后，它的内部变化不会影响其内部变量，因为它们会被缓存,所以它输出的是值的拷贝。
* 2.require是由原生模块module的runMain()实现的
* 3.加载math文件，并没有明确指出是js文件。根据名称按照‘.js’,‘.node‘,’.json‘的顺讯依次查找
* 4.查找并读取math.js，将使用function进行包装，这样可以避免污染全局环境，该函数的参数包括require、module、exports等等参数，以mathi.js为例：
（function(exports,require,module,__filename,__dirname){
        let add=(x,y)=>{
            return x+y;
        }
        module.exports={
            add:add
        };
 })

CommonJS规范比较适用服务器端，如果是浏览器就需要异步加载模块了，所以就有了AMD，CMD解决方案。不过现在都用ES6的了

*/
