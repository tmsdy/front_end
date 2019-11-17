/*
this 五种绑定规则

1.默认绑定: this指向全局，严格模式是undefined
var a = 2;
function foo() {
    console.log( this.a ) //2 
}
foo(); 

2.隐式绑定
function foo() {
    console.log( this.a )
}
var obj = {
    a: 2 ,
    foo: foo 
}
obj.foo() ; //2
1) 严格来说foo函数不属于obj对象
2）foo被当做引用属性添加到obj中，foo被调用时会使用obj的上下文来引用函数，隐式绑定规则会把函数调用
中的this绑定到这个上下文对象
3）丢失this绑定：如果单独引用obj的foo函数出来执行，那foo里的this是指向全局对象的

3.显示绑定：call、apply、bind这些(优先级比较高)

4.new foo() this绑定的是新创建出来的对象
function foo(a) {
    this.a = a;
}
var bar = new foo(2); // bar和foo(..)调用中的this进行绑定
console.log( bar.a ); // 2

5.箭头函数绑定：由外层函数的词法作用域决定this

 */
