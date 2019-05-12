
  // 有 Babel 的情况下，可以直接使用 ES6 的模块化
	// test.js
  let bar=function(){
    console.log('this is bar funciton');
  };
  // export 不止可以导出函数，还可以导出对象，类，字符串等等
  const test='aaa';
  const obj={
    str:'hello!'
  }
  export { //export在尾部输出变量时，一定要加大括号，
    bar,test,obj
  }

  // 使用 import 和 require 的区别不大(本质上是一回事)，但import的变量不会被缓存，而是成为一个指向被加载模块的引用
    import {bar,test,obj} from './test'
    bar();

  // 上面的是逐一指定要加载的方法,我们还可以使用 ＊ 可以整体加载模块：
	import * as lib from './lib'
    lib.foo();

	// 注;export default 命令适用于指定默认模块的输出,一个模块只能有一个默认输出，所以export default 只能使用一次。
	// lib.js
    let foo=function(){
      console.log('this is foo');
    }
    export default foo;


