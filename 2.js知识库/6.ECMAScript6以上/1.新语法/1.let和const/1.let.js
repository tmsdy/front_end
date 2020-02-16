/*
* 1.不存在变量提升
console.log(foo); // Uncaught ReferenceError: foo is not defined
let foo = 2;

* 2.不能重复声明
if (true) {
  let aa_;
  var aa_; // Uncaught SyntaxError: Identifier 'aa_' has already been declared
}

* 3.不绑定全局作用域 -- 比如限定次数就不能绑在window上不然会被改
ES5的 var 和 function 声明的全局变量作为全局对象的属性，不利于模块化编程
使用 let, const 命令声明的全局变量不属于全局对象的属性。
let let_test = 'test';
console.log(window.let_test);   // undefined

var var_test = 'test';
console.log(window.var_test);  // test

* 4.暂时性死区(Temporal Dead Zone)，简写为 TDZ
JavaScript 引擎在扫描代码发现变量声明时,遇到
    var 提升到作用域顶部
    let、const 放在 TDZ 中
    访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

* 注：“暂时性死区”也意味着typeof不再是一个百分之百安全的操作，因为会使typeof报错。

*/