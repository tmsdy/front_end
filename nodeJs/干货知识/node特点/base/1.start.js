/*
 *node自带模块化：在文件中打印this不是global，命令行打印是的。一个js文件就是一个模块(在每个文件外面套了个闭包)，模块的this不是global而是{}，

console.log(this === global) //false
var a = 1; //这样是不会挂在global上
a = 1; //一般避免这样写，会把变量挂在全局上
console.log(global.a) //1

*全局变量：global上的属性可以不用声明直接用
console：打印用的
process：进程,包含当前node很多信息。node是跑在一个进程中，其中有个主线程是个单线程的，其他的还有多线程的干活的模块
Buffer：缓存区(文件读写都是写到这里)
setImmediate clearImmediate setTimeout...

* 计算node操作的性能
console.time('start')
for (let i = 0; i < 1000; i++) { }
console.timeEnd('start') //start: 0.173ms

*/

