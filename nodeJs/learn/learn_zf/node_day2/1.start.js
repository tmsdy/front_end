// console.log(process.env.NODE_ENV)

/*
 1.在文件中打印this不是global，命令行打印是的。一个js文件就是一个模块，模块的this不是global而是{}
    模块由闭包实现的
 */
console.log(this===global) //false 
a = 1 ;//一般避免这样写，会把变量挂在全局上
console.log(global.a) 

/*
 2.全局变量：global上的属性可以不用声明直接使用
 console.log,console.time,console.timeEnd
 process 进程，node是跑在一个进程中，其中有个主线程是个单线程的
 Buffer 缓存区
 setImmediate clearImmediate setTimeout...
*/
setImmediate(()=>{console.log('setImmediate')})

console.time('start')
for(let i=0; i<1000 ;i++){}
console.timeEnd('start') //start: 0.173ms