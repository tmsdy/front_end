/*
闭包：内部函数作用域链中包含了外部函数的作用域
用途：
    1.读取函数内部的变量
    2.让这些变量的值始终保持在内存中。
    3.模块化代码
优点：
    1.保护函数内变量的安全，加强了封装性（避免全局变量的污染）
    2.常驻内存，参数和变量不会被垃圾回收机制收回
    3.私有成员的存在

缺点: 常驻内存，会增大内存使用量，使用不当很容易造成内存泄露，在退出函数之前，将不使用的局部变量全部删除(置为null)。ES6的WeakMap

再次调用只会生成新对象和方法，新的临时变量只是对应新的值，和上次那次调用的是各自独立的。

*/
// 1.基本
function aa() { // 内部变量不被回收
    var a = 20;
    function b(i) { // 内部变量被回收
        a += i
        console.log(a)
    }
    return b;
}
let b = aa()
b(2) // 22
b(5) // 27

var c = aa(); //新的闭包
c(5);//25

// 2.模块化
function CoolModule() {
    var sommething = 'cool';
    function doSomething() {
        console.log('something')
    }
    return {
        doSomething: doSomething
    }
}
var foo = CoolModule();
foo.doSomething; //something
