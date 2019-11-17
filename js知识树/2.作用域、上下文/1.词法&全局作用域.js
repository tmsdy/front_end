// 1.js采用的是词法作用域: 函数的词法作用域只在函数定义的时候决定
var value = 1;
function foo() {
    console.log(value); //定义处的value是1
}
function bar() {
    var value = 2;
    foo();
}
bar(); //1 如果是动态作用域结果就是2了

/*
2.全局作用域：
全局变量(全局对象): 生命周期将存在于整个程序之内。能被程序中任何函数或者方法访问并且会被修改(所以要注意)。
缺点：1）不能被浏览器回收 2）容易被篡改 3）访问性能不行
    
*/
var value = 1 // 1.var声明的变量会挂在全局的window上

function aaa() { // 2.函数如果不经过封装，也会是全局变量
    a = 123 // 3.a = xxx隐式声明,js默认声明为全局变量挂在window上
}
aaa();

console.log(window.value) //1
console.log(window.a) //aaa()执行了结果是123，如果没执行就是undefined
console.log(window.aaa) //函数aaa