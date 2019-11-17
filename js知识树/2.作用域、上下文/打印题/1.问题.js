
// 1.a有参数声明了不再挂到window上
function aplus(a) {
    a = a + 10
}
var a = 1;
aplus(a);
console.log(a) // 1

// 2.没有var声明，不会被存放在 AO中
function foo() {
    console.log(a);
    a = 1;
}
foo(); // ???
function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
/*
1: 报错：a is not defined
    "a" 并没有通过 var 关键字声明，所有不会被存放在 AO 中。没有 a 的值，然后就会到全局去找，全局也没有，所以会报错。
2: 打印 1
    全局已经赋值了a
*/