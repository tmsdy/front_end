/*

函数调用的时候，如何确定 this 的取值?
1.计算 MemberExpression 的结果赋值给 ref
MemberExpression: 成员表达式

function foo() {
    console.log(this)
}
foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}
foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}
foo.bar(); // MemberExpression 是 foo.bar
所以简单理解 MemberExpression 其实就是()左边的部分。

*/